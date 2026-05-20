import React, { useState, useEffect, useCallback, useRef } from 'react'
import { FiClipboard, FiClock, FiCheckCircle, FiXCircle, FiCreditCard, FiStar, FiAlertTriangle, FiDollarSign, FiUsers, FiMapPin, FiCheck, FiTrash2, FiTool } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI, requestAPI, statusAPI, reviewAPI, assignmentAPI } from '../services/api'

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'

  return (
    <div className={`fixed top-4 right-4 z-50 ${bg} text-white px-5 py-3 rounded-lg shadow-lg animate-slide-in`}>
      <div className="flex items-center gap-2">
        <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span>{message}</span>
        <button onClick={onClose} className="ml-3 hover:opacity-70">✕</button>
      </div>
    </div>
  )
}

// ─── RequestCard Component ─────────────────────────────────────────────────────
function RequestCard({ request, onCancel, onPayment, onReview, onViewApplications }) {
  const status = request.status || 'requested'
  const appCount = request.applicationCount || 0
  const isPaid = request.is_paid || false

  const getStatusBadge = (s) => {
    const map = {
      requested: 'badge-info',
      assigned: 'badge-info',
      on_the_way: 'badge-warning',
      in_progress: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge',
    }
    return map[s] || 'badge'
  }

  return (
    <div className="card hover:shadow-lg transition-shadow overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-content-primary truncate">{request.title}</h3>
          <p className="text-sm text-content-body mt-1 line-clamp-2 break-words">{request.description}</p>
        </div>
        <span className={`badge ${getStatusBadge(status)} flex-shrink-0 whitespace-nowrap`}>
          {status.replace('_', ' ')}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-content-body pt-3 border-t border-border mb-3">
        <div className="truncate flex items-center gap-1">
          <FiMapPin className="w-3.5 h-3.5 text-content-muted flex-shrink-0" /> {request.location || 'N/A'}
        </div>
        <div className="truncate">⚡ {request.urgency || 'medium'}</div>
        <div className="col-span-2 font-semibold text-emerald-600 truncate">💰 ${parseFloat(request.price || 0).toFixed(2)}</div>
      </div>

      {/* Assigned technician info */}
      {(status === 'assigned' || status === 'on_the_way') && request.assignedTechnician && (
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.assignedTechnician.id || 'tech'}`}
              alt={request.assignedTechnician.name || 'Technician'}
              className="w-10 h-10 rounded-full border-2 border-blue-300 flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                {request.assignedTechnician.name || 'Technician'} assigned
              </p>
              <p className="text-xs text-blue-600">Work will begin soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Application count badge for requested status */}
      {status === 'requested' && appCount > 0 && (
        <div className="mb-3 p-2 bg-status-info-bg rounded-lg flex items-center gap-2">
          <FiUsers className="w-4 h-4 text-status-info-text" />
          <span className="text-sm text-status-info-text font-medium">
            {appCount} technician{appCount !== 1 ? 's' : ''} applied
          </span>
        </div>
      )}

      {/* Paid badge */}
      {isPaid && (
        <div className="mb-3 p-2 bg-status-success-bg rounded-lg flex items-center gap-2">
          <FiCheckCircle className="w-4 h-4 text-status-success-text" />
          <span className="text-sm text-status-success-text font-medium">Paid</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {status === 'requested' && (
          <button
            onClick={() => onViewApplications(request)}
            className="btn-accent text-sm flex items-center gap-1"
          >
            <FiUsers className="w-4 h-4" /> View Applications{appCount > 0 ? ` (${appCount})` : ''}
          </button>
        )}
        {(status === 'requested' || status === 'assigned' || status === 'on_the_way') && (
          <button
            onClick={() => onCancel(request.id)}
            className="btn-danger text-sm flex items-center gap-1"
          >
            <FiXCircle className="w-4 h-4" /> Cancel
          </button>
        )}
        {status === 'completed' && !isPaid && (
          <button
            onClick={() => onPayment(request)}
            className="btn-primary text-sm flex items-center gap-1"
          >
            <FiCreditCard className="w-4 h-4" /> Pay Now
          </button>
        )}
        {status === 'completed' && (
          <button
            onClick={() => onReview(request)}
            className="btn-secondary text-sm flex items-center gap-1 text-[#fbbf24]"
          >
            <FiStar className="w-4 h-4" /> Review
          </button>
        )}
      </div>
    </div>
  )
}

// ─── ApplicationsModal Component ────────────────────────────────────────────────
function ApplicationsModal({ request, onClose, onSuccess, showToast }) {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [actionType, setActionType] = useState(null)
  const [completedAppIds, setCompletedAppIds] = useState(new Set())

  useEffect(() => {
    loadApplications()
  }, [request.id])

  const loadApplications = async () => {
    try {
      const response = await assignmentAPI.getApplications(request.id)
      // Only show "applied" applications (not rejected ones)
      const apps = response.data || []
      setApplications(apps.filter((app) => app.status !== 'rejected'))
    } catch (error) {
      console.error('Failed to load applications:', error)
      if (showToast) showToast('Failed to load applications', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (applicationId) => {
    if (completedAppIds.has(applicationId)) return
    setActionId(applicationId)
    setActionType('accept')
    try {
      const res = await assignmentAPI.acceptApplication(applicationId)
      // Mark all as completed since backend auto-rejects others
      setCompletedAppIds((prev) => {
        const next = new Set(prev)
        applications.forEach((app) => next.add(app.id))
        return next
      })
      if (showToast) showToast(res.message || 'Technician assigned successfully!', 'success')
      onSuccess()
      // Close modal after short delay so user sees the success state
      setTimeout(() => onClose(), 800)
    } catch (error) {
      console.error('Failed to accept application:', error)
      if (showToast) showToast(error.message || 'Failed to accept application', 'error')
    } finally {
      setActionId(null)
      setActionType(null)
    }
  }

  const handleReject = async (applicationId) => {
    if (completedAppIds.has(applicationId)) return
    setActionId(applicationId)
    setActionType('reject')
    try {
      await assignmentAPI.rejectApplication(applicationId)
      setCompletedAppIds((prev) => new Set([...prev, applicationId]))
      // Remove rejected application from the list
      setApplications((prev) => prev.filter((app) => app.id !== applicationId))
      if (showToast) showToast('Application rejected', 'info')
      onSuccess()
    } catch (error) {
      console.error('Failed to reject application:', error)
      if (showToast) showToast(error.message || 'Failed to reject application', 'error')
    } finally {
      setActionId(null)
      setActionType(null)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const numRating = parseFloat(rating) || 0
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`w-4 h-4 ${i <= Math.round(numRating) ? 'text-[#fbbf24] fill-current' : 'text-content-hint'}`}
        />
      )
    }
    return stars
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header sticky top-0 bg-surface-primary z-10 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-content-primary flex items-center gap-2">
              <FiUsers className="w-6 h-6 text-[#7eb8f7]" /> Technician Applications
            </h2>
            <p className="text-sm text-content-body mt-1">
              For: <span className="font-medium text-content-primary">{request.title}</span>
              {applications.length > 0 && (
                <span className="ml-2 badge badge-info">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-content-body">Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            applications.map((app) => {
              const profile = app.technician?.technician_profile
              const techName = app.technician?.name || app.technician?.username || 'Unknown Technician'
              const techId = app.technician?.id || app.id

              return (
                <div key={app.id} className="app-card">
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${techId}`}
                      alt={techName}
                      className="w-14 h-14 rounded-full border-2 border-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-content-primary">{techName}</h3>
                        {profile?.rating && (
                          <div className="flex items-center gap-1">
                            {renderStars(profile.rating)}
                            <span className="text-xs text-content-body ml-1">({parseFloat(profile.rating).toFixed(1)})</span>
                          </div>
                        )}
                      </div>
                      {profile?.bio && (
                        <p className="text-sm text-content-body mt-1 line-clamp-2">{profile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-content-body">
                        {profile?.service_area && (
                          <span className="flex items-center gap-1 bg-surface-inner px-2 py-1 rounded-full">
                            <FiMapPin className="w-3 h-3" /> {profile.service_area}
                          </span>
                        )}
                        {profile?.total_jobs != null && (
                          <span className="flex items-center gap-1 bg-surface-inner px-2 py-1 rounded-full">
                            <FiTool className="w-3 h-3" /> {profile.total_jobs} job{profile.total_jobs !== 1 ? 's' : ''}
                          </span>
                        )}
                        {profile?.skills && (
                          <span className="flex items-center gap-1 bg-surface-inner px-2 py-1 rounded-full">
                            Skills: {profile.skills}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-content-muted mt-2">
                        Applied: {new Date(app.assigned_at).toLocaleDateString()} at {new Date(app.assigned_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAccept(app.id)}
                        disabled={actionId !== null || completedAppIds.has(app.id)}
                        className="btn-success text-sm flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {completedAppIds.has(app.id) ? (
                          <>
                            <FiCheck className="w-4 h-4" /> Accepted ✓
                          </>
                        ) : actionId === app.id && actionType === 'accept' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Accepting...
                          </>
                        ) : (
                          <>
                            <FiCheck className="w-4 h-4" /> Accept & Assign
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        disabled={actionId !== null || completedAppIds.has(app.id)}
                        className="btn-danger text-sm flex items-center gap-1 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {completedAppIds.has(app.id) ? (
                          <>
                            <FiTrash2 className="w-4 h-4" /> Rejected
                          </>
                        ) : actionId === app.id && actionType === 'reject' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Rejecting...
                          </>
                        ) : (
                          <>
                            <FiTrash2 className="w-4 h-4" /> Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiUsers className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">No Applications Yet</h3>
              <p className="text-content-body max-w-md">
                No technicians have applied for this request yet. Applications will appear here once technicians express interest in your service request.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PaymentModal Component ─────────────────────────────────────────────────────
function PaymentModal({ request, onClose, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const price = parseFloat(request.price || 0).toFixed(2)

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const response = await requestAPI.pay(request.id)
      onSuccess(response.message || `Payment of $${price} processed successfully!`)
      onClose()
    } catch (error) {
      console.error('Payment failed:', error)
      onSuccess(`Payment failed: ${error.message || 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold text-content-primary">Confirm Payment</h2>
          <button onClick={onClose} className="btn-icon">
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <div className="bg-surface-inner rounded-md p-4 mb-4">
            <p className="text-sm text-content-body mb-2">{request.title}</p>
            <p className="text-2xl font-bold text-content-primary">${price}</p>
            <p className="text-xs text-content-muted mt-1">Request #{request.id}</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-content-body">
              <FiCreditCard className="w-4 h-4" /> Card ending in ****4242
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1" disabled={processing}>Cancel</button>
            <button onClick={handlePayment} className="btn-primary flex-1" disabled={processing}>
              {processing ? 'Processing...' : `Pay $${price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ReviewModal Component ──────────────────────────────────────────────────────
function ReviewModal({ request, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await reviewAPI.create({
        request_id: request.id,
        rating,
        comment,
        technician_id: request.technician_id || request.assigned_technician_id || 1,
      })
      onSuccess('Review submitted successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to submit review:', error)
      onSuccess('Failed to submit review: ' + (error.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold text-content-primary">Write a Review</h2>
          <button onClick={onClose} className="btn-icon">
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <p className="text-sm text-content-body mb-4">For: {request.title}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <FiStar
                      className={`w-8 h-8 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-content-hint'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Comment</label>
              <textarea
                className="input"
                rows="3"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── CancelConfirmModal Component ───────────────────────────────────────────────
function CancelConfirmModal({ requestId, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await requestAPI.cancel(requestId, { reason: reason || 'Cancelled by customer' })
      onSuccess('Request cancelled successfully')
      onClose()
    } catch (error) {
      console.error('Failed to cancel:', error)
      onSuccess('Failed to cancel: ' + (error.message || 'Unknown error'))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-status-danger-bg rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-status-danger-text" />
            </div>
            <h2 className="text-xl font-bold text-content-primary">Cancel Request</h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <FiXCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          <p className="text-sm text-content-body mb-4">Are you sure you want to cancel request #{requestId}?</p>
          <div className="mb-4">
            <label className="label">Reason (optional)</label>
            <textarea
              className="input"
              rows="2"
              placeholder="Why are you cancelling?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1" disabled={cancelling}>Keep Request</button>
            <button onClick={handleCancel} className="btn-danger flex-1" disabled={cancelling}>
              {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main CustomerDashboard Component ───────────────────────────────────────────
export default function CustomerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [reviewRequest, setReviewRequest] = useState(null)
  const [cancelRequestId, setCancelRequestId] = useState(null)
  const [applicationsRequest, setApplicationsRequest] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  // ── Refs for polling ───────────────────────────────────────────────────────
  const pollingRef = useRef(null)
  const isMountedRef = useRef(true)

  // ── Fetch Dashboard ────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      const response = await dashboardAPI.getCustomerDashboard()
      if (isMountedRef.current) {
        setData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [])

  // ── Initial load + polling ─────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true
    fetchDashboard()

    // Poll every 10 seconds for real-time sync
    pollingRef.current = setInterval(() => {
      fetchDashboard()
    }, 10000)

    return () => {
      isMountedRef.current = false
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [fetchDashboard])

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ message: msg, type, id: Date.now() })
  }, [])

  // ── Success handlers ───────────────────────────────────────────────────────
  const handleCancelSuccess = useCallback((msg) => {
    showToast(msg)
    fetchDashboard()
  }, [showToast, fetchDashboard])

  const handlePaymentSuccess = useCallback((msg) => {
    showToast(msg)
    fetchDashboard()
  }, [showToast, fetchDashboard])

  const handleReviewSuccess = useCallback((msg) => {
    showToast(msg)
    fetchDashboard()
  }, [showToast, fetchDashboard])

  const handleApplicationSuccess = useCallback(() => {
    fetchDashboard()
  }, [fetchDashboard])

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-body">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const summary = data?.summary || {}
  const requests = data?.recentRequests || []

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">My Dashboard</h1>
        <p className="text-content-body mt-2">Welcome, {user?.name || user?.username}. Track your service requests</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card stat-card-blue">
          <div className="stat-card-icon">
            <FiClipboard className="w-6 h-6" />
          </div>
          <p className="stat-card-label">Total Requests</p>
          <p className="stat-card-value">{summary.total || 0}</p>
        </div>
        <div className="stat-card stat-card-yellow">
          <div className="stat-card-icon">
            <FiClock className="w-6 h-6" />
          </div>
          <p className="stat-card-label">Active</p>
          <p className="stat-card-value">{summary.active || 0}</p>
        </div>
        <div className="stat-card stat-card-green">
          <div className="stat-card-icon">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <p className="stat-card-label">Completed</p>
          <p className="stat-card-value">{summary.completed || 0}</p>
        </div>
        <div className="stat-card stat-card-purple">
          <div className="stat-card-icon">
            <FiDollarSign className="w-6 h-6" />
          </div>
          <p className="stat-card-label">Total Spent</p>
          <p className="stat-card-value">${(summary.totalSpent || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-2xl font-bold text-content-primary mb-6">Recent Requests</h2>
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCancel={(id) => setCancelRequestId(id)}
                onPayment={(req) => setPaymentRequest(req)}
                onReview={(req) => setReviewRequest(req)}
                onViewApplications={(req) => setApplicationsRequest(req)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FiClipboard className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-semibold text-content-primary mb-2">No Service Requests Yet</h3>
            <p className="text-content-body mb-4">Create your first request and technicians will apply to help you.</p>
            <button onClick={() => navigate('/customer/requests')} className="btn-accent">
              Create First Request
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <button onClick={() => navigate('/customer/requests')} className="btn-accent px-8 py-3">
          Create New Service Request
        </button>
      </div>

      {/* Modals */}
      {applicationsRequest && (
        <ApplicationsModal
          request={applicationsRequest}
          onClose={() => setApplicationsRequest(null)}
          onSuccess={handleApplicationSuccess}
          showToast={showToast}
        />
      )}
      {paymentRequest && (
        <PaymentModal
          request={paymentRequest}
          onClose={() => setPaymentRequest(null)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          onClose={() => setReviewRequest(null)}
          onSuccess={handleReviewSuccess}
        />
      )}
      {cancelRequestId && (
        <CancelConfirmModal
          requestId={cancelRequestId}
          onClose={() => setCancelRequestId(null)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  )
}
