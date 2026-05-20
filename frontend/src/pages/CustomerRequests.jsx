import React, { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiX, FiXCircle, FiMapPin, FiClock, FiEye, FiCreditCard, FiStar, FiAlertTriangle, FiUser, FiUsers, FiCheck, FiTrash2, FiTool } from 'react-icons/fi'
import { requestAPI, categoryAPI, statusAPI, reviewAPI, assignmentAPI } from '../services/api'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`}>
      {message}
    </div>
  )
}

function RequestForm({ onSubmit, onClose }) {
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    preferred_time: '',
    urgency: 'medium',
    price: '',
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await requestAPI.create(formData)
      onSubmit()
    } catch (error) {
      console.error('Failed to create request:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-content-primary flex items-center gap-2">
            <FiTool className="w-6 h-6 text-[#7eb8f7]" /> New Service Request
          </h2>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input type="text" className="input" placeholder="e.g. AC Repair, Plumbing Fix" value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" placeholder="Describe your issue in detail..." rows="3" value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input type="text" className="input" placeholder="Your address or area" value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Estimated Price ($)</label>
            <input type="number" className="input" placeholder="0.00" min="0" step="0.01" value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Preferred Date</label>
              <input type="date" className="input" value={formData.preferred_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferred_time: e.target.value }))} />
            </div>
            <div>
              <label className="label">Urgency</label>
              <select className="input" value={formData.urgency}
                onChange={(e) => setFormData((prev) => ({ ...prev, urgency: e.target.value }))}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-accent flex-1" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DetailModal({ request, onClose, onCancel, onPayment, onReview, onViewApplications }) {
  const [statusHistory, setStatusHistory] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
    loadDetails()
  }, [request.id])

  const loadDetails = async () => {
    try {
      const [historyRes, assignmentRes] = await Promise.all([
        statusAPI.getHistory(request.id).catch(() => ({ data: [] })),
        assignmentAPI.getByRequest(request.id).catch(() => ({ data: [] })),
      ])
      setStatusHistory(historyRes.data || [])
      setAssignments(assignmentRes.data || [])
    } catch (error) {
      console.error('Failed to load details:', error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const status = request.status || 'requested'

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

  const activeAssignment = assignments.find(a => a.status === 'accepted')

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-content-primary">Request Details</h2>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-content-primary">{request.title}</h3>
              <span className={`badge mt-2 inline-block ${getStatusBadge(status)}`}>
                {status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <p className="text-content-body">{request.description}</p>

          <div className="grid grid-cols-2 gap-4 bg-surface-inner rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-content-body">
              <FiMapPin className="w-4 h-4 text-content-muted" /> {request.location || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-content-body">
              <FiClock className="w-4 h-4 text-content-muted" /> {new Date(request.createdAt || request.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-content-body">Urgency: <span className="capitalize font-medium">{request.urgency}</span></div>
            <div className="text-sm text-content-body">Category: <span className="font-medium">{request.category?.name || 'N/A'}</span></div>
            <div className="text-sm text-content-body col-span-2">Price: <span className="font-semibold text-[#4ade80]">${parseFloat(request.price || 0).toFixed(2)}</span></div>
          </div>

          {/* Assigned Technician */}
          {activeAssignment && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                <FiUser className="w-4 h-4" /> Assigned Technician
              </h4>
              <div className="bg-status-info-bg rounded-lg p-3 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAssignment.technician?.id || activeAssignment.id}`}
                  alt="Technician"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-content-primary">{activeAssignment.technician?.full_name || activeAssignment.technician?.username || 'Technician'}</p>
                  <p className="text-xs text-content-body">Assigned: {new Date(activeAssignment.assigned_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status History */}
          {statusHistory.length > 0 && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Status History</h4>
              <div className="space-y-2">
                {statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#7eb8f7]" />
                    <span className="text-content-body">
                      <span className="font-medium capitalize">{h.status?.replace('_', ' ')}</span>
                      {' - '}{new Date(h.created_at || h.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingDetails && <p className="text-sm text-content-muted">Loading details...</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-border">
          {status === 'requested' && (
            <button
              onClick={() => { onClose(); onViewApplications(request); }}
              className="btn-accent text-sm flex items-center gap-1"
            >
              <FiUsers className="w-4 h-4" /> View Applications
            </button>
          )}
          {(status === 'requested' || status === 'assigned' || status === 'on_the_way') && (
            <button onClick={() => { onClose(); onCancel(request.id); }} className="btn-secondary text-sm flex items-center gap-1 text-status-danger-text hover:bg-status-danger-bg">
              <FiXCircle className="w-4 h-4" /> Cancel Request
            </button>
          )}
          {status === 'completed' && (
            <>
              <button onClick={() => { onClose(); onPayment(request); }} className="btn-primary text-sm flex items-center gap-1">
                <FiCreditCard className="w-4 h-4" /> Make Payment
              </button>
              <button onClick={() => { onClose(); onReview(request); }} className="btn-secondary text-sm flex items-center gap-1 text-[#fbbf24] hover:bg-status-warning-bg">
                <FiStar className="w-4 h-4" /> Write Review
              </button>
            </>
          )}
          <button onClick={onClose} className="btn-secondary text-sm ml-auto">Close</button>
        </div>
      </div>
    </div>
  )
}

function ApplicationsModal({ request, onClose, onSuccess }) {
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
      setApplications(response.data || [])
    } catch (error) {
      console.error('Failed to load applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (applicationId) => {
    if (completedAppIds.has(applicationId)) return
    setActionId(applicationId)
    setActionType('accept')
    try {
      await assignmentAPI.acceptApplication(applicationId)
      setCompletedAppIds((prev) => new Set([...prev, applicationId]))
      onSuccess('Technician assigned successfully!')
      onClose()
    } catch (error) {
      console.error('Failed to accept application:', error)
      onSuccess(`Failed to accept: ${error.message || 'Unknown error'}`, 'error')
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
      setApplications((prev) => prev.filter((app) => app.id !== applicationId))
      onSuccess('Application rejected')
    } catch (error) {
      console.error('Failed to reject application:', error)
      onSuccess(`Failed to reject: ${error.message || 'Unknown error'}`, 'error')
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
            <FiX className="w-5 h-5" />
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
              const techName = app.technician?.full_name || app.technician?.username || 'Unknown Technician'
              const techId = app.technician?.id || app.id

              return (
                <div key={app.id} className="app-card">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${techId}`}
                      alt={techName}
                      className="w-14 h-14 rounded-full border-2 border-border flex-shrink-0"
                    />

                    {/* Info */}
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
                            <FiTool className="w-3 h-3" /> {profile.total_jobs} job{profile.total_jobs !== 1 ? 's' : ''} completed
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

                    {/* Action Buttons */}
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
            <FiX className="w-5 h-5" />
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
      <div className="modal-content max-w-md w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-xl font-bold text-content-primary">Write a Review</h2>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>
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
  )
}

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
      <div className="modal-content max-w-sm w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-status-danger-bg rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-status-danger-text" />
            </div>
            <h2 className="text-xl font-bold text-content-primary">Cancel Request</h2>
          </div>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>
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
  )
}

export default function CustomerRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [detailRequest, setDetailRequest] = useState(null)
  const [applicationsRequest, setApplicationsRequest] = useState(null)
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [reviewRequest, setReviewRequest] = useState(null)
  const [cancelRequestId, setCancelRequestId] = useState(null)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await requestAPI.getMyRequests()
      setRequests(response.data || [])
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
  }

  const handleCreateRequest = () => {
    loadRequests()
    setShowForm(false)
    showToast('Request created successfully!')
  }

  const handleCancelSuccess = (msg) => {
    showToast(msg)
    loadRequests()
  }

  const handlePaymentSuccess = (msg) => {
    setPaymentRequest(null)
    showToast(msg)
    loadRequests()
  }

  const handleReviewSuccess = (msg) => {
    showToast(msg)
    loadRequests()
  }

  const handleApplicationSuccess = (msg, type = 'success') => {
    showToast(msg, type)
    loadRequests()
  }

  const getStatusBadge = (status) => {
    const map = {
      requested: 'badge-info',
      assigned: 'badge-info',
      on_the_way: 'badge-warning',
      in_progress: 'badge-warning',
      completed: 'badge-success',
      cancelled: 'badge',
    }
    return map[status] || 'badge'
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-content-primary">My Service Requests</h1>
          <p className="text-content-body mt-2">Track all your service bookings and manage technician applications</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-accent flex items-center gap-2">
          <FiPlus className="w-5 h-5" /> New Request
        </button>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-body">Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-content-primary">{request.title}</h3>
                  <p className="text-content-body mt-2 line-clamp-2">{request.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-content-body">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" /> {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" /> {new Date(request.createdAt || request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${getStatusBadge(request.status)}`}>
                    {(request.status || 'requested').replace('_', ' ')}
                  </span>
                  <p className="text-sm text-content-body mt-2 capitalize">Urgency: {request.urgency}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => setDetailRequest(request)}
                  className="btn-secondary text-sm flex items-center gap-1"
                >
                  <FiEye className="w-4 h-4" /> View Details
                </button>
                {request.status === 'requested' && (
                  <button
                    onClick={() => setApplicationsRequest(request)}
                    className="btn-accent text-sm flex items-center gap-1"
                  >
                    <FiUsers className="w-4 h-4" /> View Applications
                  </button>
                )}
                {(request.status === 'requested' || request.status === 'assigned') && (
                  <button onClick={() => setCancelRequestId(request.id)} className="btn-secondary text-sm flex items-center gap-1 text-status-danger-text hover:bg-status-danger-bg">
                    <FiX className="w-4 h-4" /> Cancel
                  </button>
                )}
                {request.status === 'completed' && (
                  <>
                    <button onClick={() => setPaymentRequest(request)} className="btn-primary text-sm flex items-center gap-1">
                      <FiCreditCard className="w-4 h-4" /> Pay
                    </button>
                    <button onClick={() => setReviewRequest(request)} className="btn-secondary text-sm flex items-center gap-1 text-[#fbbf24] hover:bg-status-warning-bg">
                      <FiStar className="w-4 h-4" /> Review
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FiSearch className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-semibold text-content-primary mb-2">No Requests Yet</h3>
          <p className="text-content-body mb-4">Create your first service request and technicians will apply to help you.</p>
          <button onClick={() => setShowForm(true)} className="btn-accent">
            Create Your First Request
          </button>
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <RequestForm onSubmit={handleCreateRequest} onClose={() => setShowForm(false)} />
      )}
      {detailRequest && (
        <DetailModal
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onCancel={(id) => setCancelRequestId(id)}
          onPayment={(id) => setPaymentRequestId(id)}
          onReview={(req) => setReviewRequest(req)}
          onViewApplications={(req) => setApplicationsRequest(req)}
        />
      )}
      {applicationsRequest && (
        <ApplicationsModal
          request={applicationsRequest}
          onClose={() => setApplicationsRequest(null)}
          onSuccess={handleApplicationSuccess}
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
