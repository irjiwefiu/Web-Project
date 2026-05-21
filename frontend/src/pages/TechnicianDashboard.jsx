import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { FiClipboard, FiCheckCircle, FiClock, FiTool, FiStar, FiDollarSign, FiTrendingUp, FiAward, FiBarChart2 } from 'react-icons/fi'
import { dashboardAPI, technicianAPI, assignmentAPI, requestAPI, statusAPI } from '../services/api'

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

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TechnicianDashboard() {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  // Detect if we're on the performance route
  const isPerformanceRoute = location.pathname === '/dashboard/technician/performance'

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('available')
  const [dashboard, setDashboard] = useState(null)
  const [availableRequests, setAvailableRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [applyingIds, setApplyingIds] = useState(new Set())
  const [updatingStatusIds, setUpdatingStatusIds] = useState(new Set())
  const [togglingAvailability, setTogglingAvailability] = useState(false)

  // ── Refs for polling ───────────────────────────────────────────────────────
  const pollingRef = useRef(null)
  const isMountedRef = useRef(true)

  // ── Toast helper ───────────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, id: Date.now() })
  }, [])

  // ── Fetch Dashboard ────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await dashboardAPI.getTechnicianDashboard()
      if (isMountedRef.current) {
        setDashboard(res.data)
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    }
  }, [])

  // ── Fetch Available Requests ───────────────────────────────────────────────
  const fetchAvailableRequests = useCallback(async () => {
    try {
      const res = await requestAPI.getAvailable()
      if (isMountedRef.current) {
        setAvailableRequests(res.data || res || [])
      }
    } catch (err) {
      console.error('Failed to fetch available requests:', err)
    }
  }, [])

  // ── Combined fetch ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchDashboard(), fetchAvailableRequests()])
    if (isMountedRef.current) {
      setLoading(false)
    }
  }, [fetchDashboard, fetchAvailableRequests])

  // ── Initial load + polling ─────────────────────────────────────────────────
  useEffect(() => {
    isMountedRef.current = true
    fetchAll()

    // Poll every 10 seconds for real-time sync
    pollingRef.current = setInterval(() => {
      fetchAll()
    }, 10000)

    return () => {
      isMountedRef.current = false
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [fetchAll])

  // ── Toggle Availability ────────────────────────────────────────────────────
  const toggleAvailability = async () => {
    if (togglingAvailability) return
    setTogglingAvailability(true)
    try {
      const currentStatus = dashboard?.isAvailable ? 'busy' : 'available'
      const res = await technicianAPI.updateAvailability({ status: currentStatus })
      showToast(res.message || `Availability set to ${currentStatus}`)
      await fetchDashboard()
    } catch (err) {
      showToast(err.message || 'Failed to toggle availability', 'error')
    } finally {
      if (isMountedRef.current) {
        setTogglingAvailability(false)
      }
    }
  }

  // ── Apply for Request ──────────────────────────────────────────────────────
  const applyForRequest = async (requestId) => {
    if (applyingIds.has(requestId)) return

    setApplyingIds((prev) => new Set(prev).add(requestId))
    try {
      const res = await assignmentAPI.apply(requestId)
      showToast(res.message || 'Application submitted successfully!')
      await fetchAll()
    } catch (err) {
      showToast(err.message || 'Failed to apply for request', 'error')
    } finally {
      if (isMountedRef.current) {
        setApplyingIds((prev) => {
          const next = new Set(prev)
          next.delete(requestId)
          return next
        })
      }
    }
  }

  // ── Update Request Status (for active jobs) ────────────────────────────────
  const updateRequestStatus = async (requestId, newStatus) => {
    if (updatingStatusIds.has(requestId)) return

    setUpdatingStatusIds((prev) => new Set(prev).add(requestId))
    try {
      const res = await statusAPI.update(requestId, { status: newStatus })
      showToast(res.message || `Status updated to ${newStatus}`)
      await fetchAll()
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error')
    } finally {
      if (isMountedRef.current) {
        setUpdatingStatusIds((prev) => {
          const next = new Set(prev)
          next.delete(requestId)
          return next
        })
      }
    }
  }

  // ── Check if technician has already applied to a request ───────────────────
  const hasAppliedToRequest = useCallback(
    (requestId) => {
      if (!dashboard) return false
      const allAssignments = [
        ...(dashboard.appliedAssignments || []),
        ...(dashboard.activeAssignments || []),
        ...(dashboard.rejectedAssignments || []),
      ]
      return allAssignments.some((a) => a.request?.id === requestId)
    },
    [dashboard]
  )

  // ── Get assignment status for a request ────────────────────────────────────
  const getAssignmentStatusForRequest = useCallback(
    (requestId) => {
      if (!dashboard) return null
      const allAssignments = [
        ...(dashboard.appliedAssignments || []),
        ...(dashboard.activeAssignments || []),
        ...(dashboard.rejectedAssignments || []),
      ]
      const assignment = allAssignments.find((a) => a.request?.id === requestId)
      return assignment ? assignment.status : null
    },
    [dashboard]
  )

  // ── Status Badge ───────────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const map = {
      requested: 'bg-status-warning-bg text-status-warning-text border border-border',
      pending: 'bg-status-warning-bg text-status-warning-text border border-border',
      assigned: 'bg-status-info-bg text-status-info-text border border-border',
      on_the_way: 'badge-onway',
      in_progress: 'badge-progress',
      completed: 'bg-status-success-bg text-status-success-text border border-border',
      cancelled: 'bg-status-danger-bg text-status-danger-text border border-border',
      paid: 'bg-status-success-bg text-status-success-text border border-border',
    }
    const labels = {
      requested: 'Open',
      pending: 'Pending',
      assigned: 'Assigned',
      on_the_way: 'On the Way',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      paid: 'Paid',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-surface-inner text-content-muted border border-border'}`}>
        {labels[status] || status}
      </span>
    )
  }

  // ── Assignment Status Badge ────────────────────────────────────────────────
  const getAssignmentStatusBadge = (status) => {
    const map = {
      applied: 'badge-applied',
      accepted: 'bg-status-success-bg text-status-success-text border border-border',
      rejected: 'bg-status-danger-bg text-status-danger-text border border-border',
    }
    const labels = {
      applied: 'Applied',
      accepted: 'Accepted',
      rejected: 'Rejected',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-surface-inner text-content-muted border border-border'}`}>
        {labels[status] || status}
      </span>
    )
  }

  // ── Next Status Flow ───────────────────────────────────────────────────────
  const getNextStatus = (currentStatus) => {
    const flow = {
      assigned: { label: 'On the Way', status: 'on_the_way' },
      on_the_way: { label: 'Start Work', status: 'in_progress' },
      in_progress: { label: 'Mark Completed', status: 'completed' },
    }
    return flow[currentStatus] || null
  }

  // ── Urgency Color ──────────────────────────────────────────────────────────
  const getUrgencyColor = (urgency) => {
    const map = {
      low: 'bg-surface-inner text-content-muted',
      medium: 'bg-[#2d2010] text-[#fbbf24]',
      high: 'bg-[#2d1510] text-[#fb923c]',
      urgent: 'bg-status-danger-bg text-status-danger-text',
    }
    return map[urgency] || 'bg-surface-inner text-content-muted'
  }

  // ── Format Date ────────────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // ── Render Assignment Card ─────────────────────────────────────────────────
  const renderAssignmentCard = (assignment, showAssignmentStatus = true) => {
    const request = assignment.request
    if (!request) return null

    const nextStatus = getNextStatus(request.status)
    const isUpdating = updatingStatusIds.has(request.id)

    return (
      <div key={assignment.id} className="card hover:border-[#7eb8f7]/30 hover:shadow-md hover:shadow-[#7eb8f7]/5 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-content-primary text-lg">{request.title}</h3>
              {getStatusBadge(request.status)}
              {showAssignmentStatus && assignment.status && getAssignmentStatusBadge(assignment.status)}
            </div>
            <p className="text-sm text-content-body">
              {request.category?.name || 'General'} • {request.preferred_time || 'Flexible'}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
            {request.urgency || 'medium'}
          </span>
        </div>

        {/* Description */}
        <p className="text-content-body text-sm mb-3 line-clamp-2">{request.description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="text-content-muted">Budget:</span>
            <span className="ml-1 font-medium text-content-primary">
              ${request.budget_min || 0} - ${request.budget_max || 0}
            </span>
          </div>
          <div>
            <span className="text-content-muted">Location:</span>
            <span className="ml-1 font-medium text-content-primary">{request.location || 'N/A'}</span>
          </div>
          <div>
            <span className="text-content-muted">Customer:</span>
            <span className="ml-1 font-medium text-content-primary">
              {request.customer?.name || request.customer?.username || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-content-muted">Created:</span>
            <span className="ml-1 font-medium text-content-primary">{formatDate(request.created_at)}</span>
          </div>
        </div>

        {/* Action Button for Active Jobs */}
        {nextStatus && (
          <button
            onClick={() => updateRequestStatus(request.id, nextStatus.status)}
            disabled={isUpdating}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              isUpdating
                ? 'bg-surface-inner text-content-muted cursor-not-allowed'
                : 'bg-[#1e2d4a] text-[#7eb8f7] hover:bg-[#283b61] border border-[#7eb8f7]/20'
            }`}
          >
            {isUpdating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating...
              </span>
            ) : (
              nextStatus.label
            )}
          </button>
        )}

        {/* Show accepted info for completed/paid jobs */}
        {(request.status === 'completed' || request.status === 'paid') && (
          <div className="mt-2 text-center text-sm text-status-success-text font-medium">
            ✓ Job {request.status === 'paid' ? 'completed & paid' : 'completed'}
          </div>
        )}
      </div>
    )
  }

  // ── Render Available Request Card ──────────────────────────────────────────
  const renderAvailableRequestCard = (request) => {
    const assignmentStatus = getAssignmentStatusForRequest(request.id)
    const isApplied = assignmentStatus === 'applied'
    const isRejected = assignmentStatus === 'rejected'
    const isApplying = applyingIds.has(request.id)

    return (
      <div key={request.id} className="card hover:border-[#7eb8f7]/30 hover:shadow-md hover:shadow-[#7eb8f7]/5 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-content-primary text-lg">{request.title}</h3>
              {getStatusBadge(request.status)}
              {isApplied && getAssignmentStatusBadge('applied')}
              {isRejected && getAssignmentStatusBadge('rejected')}
            </div>
            <p className="text-sm text-content-body">
              {request.category?.name || 'General'} • {request.preferred_time || 'Flexible'}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
            {request.urgency || 'medium'}
          </span>
        </div>

        {/* Description */}
        <p className="text-content-body text-sm mb-3 line-clamp-2">{request.description}</p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="text-content-muted">Budget:</span>
            <span className="ml-1 font-medium text-content-primary">
              ${request.budget_min || 0} - ${request.budget_max || 0}
            </span>
          </div>
          <div>
            <span className="text-content-muted">Location:</span>
            <span className="ml-1 font-medium text-content-primary">{request.location || 'N/A'}</span>
          </div>
          <div>
            <span className="text-content-muted">Customer:</span>
            <span className="ml-1 font-medium text-content-primary">
              {request.customer?.name || request.customer?.username || 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-content-muted">Posted:</span>
            <span className="ml-1 font-medium text-content-primary">{formatDate(request.created_at)}</span>
          </div>
        </div>

        {/* Action Button */}
        {isApplied ? (
          <div className="w-full py-2 px-4 rounded-md font-medium text-sm text-center btn-applied">
            ✓ Application Submitted — Awaiting Customer Response
          </div>
        ) : isRejected ? (
          <div className="w-full py-2 px-4 rounded-md font-medium text-sm text-center btn-rejected">
            ✕ Application Not Accepted
          </div>
        ) : (
          <button
            onClick={() => applyForRequest(request.id)}
            disabled={isApplying || !dashboard?.isAvailable}
            className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-200 ${
              isApplying || !dashboard?.isAvailable
                ? 'bg-surface-inner text-content-muted cursor-not-allowed'
                : 'btn-success-hover'
            }`}
          >
            {isApplying ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Applying...
              </span>
            ) : !dashboard?.isAvailable ? (
              'Set Yourself Available to Apply'
            ) : (
              'Apply Now'
            )}
          </button>
        )}
      </div>
    )
  }

  // ── Tab Definitions ────────────────────────────────────────────────────────
  const tabs = [
    {
      key: 'available',
      label: 'Available Jobs',
      count: availableRequests?.length || 0,
      icon: FiClipboard,
    },
    {
      key: 'applied',
      label: 'Applied Jobs',
      count: dashboard?.appliedAssignments?.length || 0,
      icon: FiClock,
    },
    {
      key: 'active',
      label: 'Active Jobs',
      count: dashboard?.activeAssignments?.length || 0,
      icon: FiTool,
    },
    {
      key: 'completed',
      label: 'Completed',
      count: dashboard?.completedAssignments?.length || 0,
      icon: FiCheckCircle,
    },
  ]

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading && !dashboard) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-body">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // ── Performance View ───────────────────────────────────────────────────────
  if (isPerformanceRoute) {
    const summary = dashboard?.summary || {}
    const completedCount = dashboard?.completedAssignments?.length || 0
    const activeCount = dashboard?.activeAssignments?.length || 0
    const appliedCount = dashboard?.appliedAssignments?.length || 0
    const totalJobs = completedCount + activeCount + appliedCount

    // Calculate earnings from completed jobs
    const completedJobs = dashboard?.completedAssignments || []
    const totalEarnings = completedJobs.reduce((sum, a) => {
      return sum + (parseFloat(a.request?.budget_max) || parseFloat(a.request?.budget_min) || 0)
    }, 0)

    // Calculate average rating if available
    const avgRating = dashboard?.technicianRating || 4.5

    return (
      <div className="p-8">
        {/* Toast */}
        {toast && (
          <Toast
            key={toast.id}
            message={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-content-primary flex items-center gap-3">
            <FiTrendingUp className="w-8 h-8 text-[#7eb8f7]" />
            Performance
          </h1>
          <p className="text-content-body mt-2">Track your metrics, earnings, and job history</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card stat-card-accent-blue">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#1e2d4a] flex items-center justify-center">
                <FiTool className="w-5 h-5 text-[#7eb8f7]" />
              </div>
            </div>
            <p className="text-content-muted text-sm mb-1">Total Jobs</p>
            <p className="text-2xl font-bold text-content-primary">{totalJobs}</p>
          </div>
          <div className="stat-card stat-card-accent-green">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-status-success-bg flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-status-success-text" />
              </div>
            </div>
            <p className="text-content-muted text-sm mb-1">Completed</p>
            <p className="text-2xl font-bold text-content-primary">{completedCount}</p>
          </div>
          <div className="stat-card stat-card-accent-yellow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#2d2010] flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-[#fbbf24]" />
              </div>
            </div>
            <p className="text-content-muted text-sm mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-content-primary">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="stat-card stat-card-accent-purple">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-surface-inner flex items-center justify-center">
                <FiStar className="w-5 h-5 text-[#c084fc]" />
              </div>
            </div>
            <p className="text-content-muted text-sm mb-1">Avg Rating</p>
            <p className="text-2xl font-bold text-content-primary">
              {avgRating} <span className="text-sm text-content-muted">/ 5</span>
            </p>
          </div>
        </div>

        {/* Completion Rate & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Completion Rate Card */}
          <div className="card">
            <h3 className="text-lg font-semibold text-content-primary mb-4 flex items-center gap-2">
              <FiBarChart2 className="w-5 h-5 text-[#7eb8f7]" />
              Job Overview
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-content-body">Completion Rate</span>
                  <span className="text-content-primary font-medium">
                    {totalJobs > 0 ? Math.round((completedCount / totalJobs) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-surface-inner rounded-full h-2">
                  <div
                    className="bg-status-success-text h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalJobs > 0 ? Math.round((completedCount / totalJobs) * 100) : 0}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-3 bg-surface-inner rounded-md">
                  <p className="text-lg font-bold text-[#c084fc]">{appliedCount}</p>
                  <p className="text-xs text-content-muted">Applied</p>
                </div>
                <div className="text-center p-3 bg-surface-inner rounded-md">
                  <p className="text-lg font-bold text-[#7eb8f7]">{activeCount}</p>
                  <p className="text-xs text-content-muted">Active</p>
                </div>
                <div className="text-center p-3 bg-surface-inner rounded-md">
                  <p className="text-lg font-bold text-status-success-text">{completedCount}</p>
                  <p className="text-xs text-content-muted">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Completions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-content-primary mb-4 flex items-center gap-2">
              <FiAward className="w-5 h-5 text-[#fbbf24]" />
              Recent Completions
            </h3>
            {completedJobs.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {completedJobs.slice(0, 5).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-3 bg-surface-inner rounded-md">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-content-primary truncate">
                        {assignment.request?.title || 'Service Request'}
                      </p>
                      <p className="text-xs text-content-muted">
                        {assignment.request?.category?.name || 'General'} • {formatDate(assignment.request?.created_at)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-status-success-text ml-3 flex-shrink-0">
                      ${parseFloat(assignment.request?.budget_max || assignment.request?.budget_min || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiCheckCircle className="w-10 h-10 text-content-hint mx-auto mb-3" />
                <p className="text-content-body">No completed jobs yet</p>
                <p className="text-content-muted text-sm mt-1">Complete jobs to see them here</p>
              </div>
            )}
          </div>
        </div>

        {/* Availability Status */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-content-primary">Availability Status</h3>
              <p className="text-content-body text-sm mt-1">
                {dashboard?.isAvailable
                  ? 'You are currently available to receive new job requests'
                  : 'You are currently unavailable for new jobs'}
              </p>
            </div>
            <button
              onClick={toggleAvailability}
              disabled={togglingAvailability}
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
                togglingAvailability
                  ? 'bg-surface-inner text-content-muted cursor-not-allowed'
                  : dashboard?.isAvailable
                  ? 'btn-danger-hover'
                  : 'btn-success-hover'
              }`}
            >
              {togglingAvailability ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Updating...
                </span>
              ) : dashboard?.isAvailable ? (
                'Set Unavailable'
              ) : (
                'Set Available'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Dashboard View ────────────────────────────────────────────────────
  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">
          Welcome, {user?.name || user?.username || 'Technician'}
        </h1>
        <p className="text-content-body mt-2">
          {dashboard?.isAvailable
            ? 'You are available for new jobs'
            : 'You are currently unavailable'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stat-card stat-card-accent-blue">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#1e2d4a] flex items-center justify-center">
              <FiClipboard className="w-5 h-5 text-[#7eb8f7]" />
            </div>
          </div>
          <p className="text-content-muted text-sm mb-1">Available</p>
          <p className="text-2xl font-bold text-content-primary">{availableRequests?.length || 0}</p>
        </div>
        <div className="stat-card stat-card-accent-purple">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-surface-inner flex items-center justify-center">
              <FiClock className="w-5 h-5 text-[#c084fc]" />
            </div>
          </div>
          <p className="text-content-muted text-sm mb-1">Applied</p>
          <p className="text-2xl font-bold text-content-primary">{dashboard?.summary?.appliedJobs || 0}</p>
        </div>
        <div className="stat-card stat-card-accent-yellow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#2d2010] flex items-center justify-center">
              <FiTool className="w-5 h-5 text-[#fbbf24]" />
            </div>
          </div>
          <p className="text-content-muted text-sm mb-1">Active</p>
          <p className="text-2xl font-bold text-content-primary">{dashboard?.summary?.activeJobs || 0}</p>
        </div>
        <div className="stat-card stat-card-accent-green">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-status-success-bg flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-status-success-text" />
            </div>
          </div>
          <p className="text-content-muted text-sm mb-1">Completed</p>
          <p className="text-2xl font-bold text-content-primary">{dashboard?.summary?.completedJobs || 0}</p>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-content-primary">Availability Status</h3>
            <p className="text-content-body text-sm mt-1">
              {dashboard?.isAvailable
                ? 'You are currently available to receive new job requests'
                : 'You are currently unavailable for new jobs'}
            </p>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={togglingAvailability}
            className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-200 ${
              togglingAvailability
                ? 'bg-surface-inner text-content-muted cursor-not-allowed'
                : dashboard?.isAvailable
                ? 'btn-danger-hover'
                : 'btn-success-hover'
            }`}
          >
            {togglingAvailability ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Updating...
              </span>
            ) : dashboard?.isAvailable ? (
              'Set Unavailable'
            ) : (
              'Set Available'
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#1e2d4a] text-[#7eb8f7] border border-[#7eb8f7]/30'
                  : 'bg-surface text-content-body hover:bg-surface-inner border border-border'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? 'bg-[#7eb8f7]/20 text-[#7eb8f7]'
                    : 'bg-surface-inner text-content-muted'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {/* Available Jobs */}
      {activeTab === 'available' && (
        <div>
          {availableRequests.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiClipboard className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">No Available Jobs</h3>
              <p className="text-content-body">Check back later for new service requests in your area.</p>
            </div>
          ) : (
            <div className="card p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell text-left font-semibold">Title</th>
                    <th className="table-cell text-left font-semibold">Category</th>
                    <th className="table-cell text-left font-semibold">Urgency</th>
                    <th className="table-cell text-left font-semibold">Budget</th>
                    <th className="table-cell text-left font-semibold">Location</th>
                    <th className="table-cell text-left font-semibold">Posted</th>
                    <th className="table-cell text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableRequests.map((request) => {
                    const assignmentStatus = getAssignmentStatusForRequest(request.id)
                    const isApplied = assignmentStatus === 'applied'
                    const isRejected = assignmentStatus === 'rejected'
                    const isApplying = applyingIds.has(request.id)

                    return (
                      <tr key={request.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium text-content-primary">{request.title}</span>
                            <span className="text-xs text-content-muted mt-0.5 line-clamp-1">{request.description}</span>
                          </div>
                        </td>
                        <td className="table-cell text-content-body">{request.category?.name || 'General'}</td>
                        <td className="table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency || 'medium'}
                          </span>
                        </td>
                        <td className="table-cell text-content-primary font-medium">
                          ${request.budget_min || 0} - ${request.budget_max || 0}
                        </td>
                        <td className="table-cell text-content-body">{request.location || 'N/A'}</td>
                        <td className="table-cell text-content-muted text-xs">{formatDate(request.created_at)}</td>
                        <td className="table-cell text-center">
                          {isApplied ? (
                            <span className="badge-applied px-3 py-1 rounded-md text-xs whitespace-nowrap">
                              ✓ Applied
                            </span>
                          ) : isRejected ? (
                            <span className="btn-rejected px-3 py-1 rounded-md text-xs whitespace-nowrap">
                              ✕ Rejected
                            </span>
                          ) : (
                            <button
                              onClick={() => applyForRequest(request.id)}
                              disabled={isApplying || !dashboard?.isAvailable}
                              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                isApplying || !dashboard?.isAvailable
                                  ? 'bg-surface-inner text-content-muted cursor-not-allowed'
                                  : 'btn-success-hover'
                              }`}
                            >
                              {isApplying ? (
                                <span className="flex items-center gap-1">
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  ...
                                </span>
                              ) : !dashboard?.isAvailable ? (
                                'Unavailable'
                              ) : (
                                'Apply'
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Applied Jobs */}
      {activeTab === 'applied' && (
        <div>
          {(!dashboard?.appliedAssignments || dashboard.appliedAssignments.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiClock className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">No Applied Jobs</h3>
              <p className="text-content-body">Browse available jobs and submit your applications.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.appliedAssignments.map((assignment) => renderAssignmentCard(assignment, true))}
            </div>
          )}
        </div>
      )}

      {/* Active Jobs */}
      {activeTab === 'active' && (
        <div>
          {(!dashboard?.activeAssignments || dashboard.activeAssignments.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiTool className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">No Active Jobs</h3>
              <p className="text-content-body">Your accepted jobs will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.activeAssignments.map((assignment) => renderAssignmentCard(assignment, false))}
            </div>
          )}
        </div>
      )}

      {/* Completed Jobs */}
      {activeTab === 'completed' && (
        <div>
          {(!dashboard?.completedAssignments || dashboard.completedAssignments.length === 0) ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiCheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-semibold text-content-primary mb-2">No Completed Jobs</h3>
              <p className="text-content-body">Completed jobs will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboard.completedAssignments.map((assignment) => renderAssignmentCard(assignment, false))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
