import React, { useState, useEffect, useMemo } from 'react'
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiEye, FiMapPin, FiClock, FiUser, FiDollarSign } from 'react-icons/fi'
import { requestAPI, statusAPI, assignmentAPI } from '../services/api'

function DetailModal({ request, onClose }) {
  const [statusHistory, setStatusHistory] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(true)

  useEffect(() => {
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
    loadDetails()
  }, [request.id])

  const activeAssignment = assignments.find(a => a.status === 'accepted')

  const getStatusBadge = (s) => {
    const map = {
      requested: 'badge-info', assigned: 'badge-info', on_the_way: 'badge-warning',
      in_progress: 'badge-warning', completed: 'badge-success', cancelled: 'badge',
    }
    return map[s] || 'badge'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-content-primary">Request Details</h2>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-content-primary">{request.title}</h3>
            <span className={`badge mt-2 inline-block ${getStatusBadge(request.status)}`}>
              {(request.status || '').replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-content-body">{request.description}</p>
          <div className="grid grid-cols-2 gap-4 bg-surface-inner rounded-lg p-4">
            <div className="flex items-center gap-2 text-sm text-content-body">
              <FiMapPin className="w-4 h-4 text-content-muted" /> {request.location || 'N/A'}
            </div>
            <div className="flex items-center gap-2 text-sm text-content-body">
              <FiClock className="w-4 h-4 text-content-muted" /> {new Date(request.createdAt || request.created_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-content-body">Customer: <span className="font-medium">{request.customerName || request.customer?.name || 'Unknown'}</span></div>
            <div className="text-sm text-content-body">Category: <span className="font-medium">{request.categoryName || request.category?.name || 'N/A'}</span></div>
            <div className="text-sm text-content-body">Urgency: <span className="capitalize font-medium">{request.urgency}</span></div>
            <div className="text-sm text-content-body">Price: <span className="font-semibold text-[#4ade80]">${parseFloat(request.price || 0).toFixed(2)}</span></div>
          </div>

          {activeAssignment && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2 flex items-center gap-2">
                <FiUser className="w-4 h-4" /> Assigned Technician
              </h4>
              <div className="bg-status-info-bg rounded-lg p-3 flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeAssignment.technician?.id || activeAssignment.id}`}
                  alt="Technician" className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-content-primary">{activeAssignment.technician?.name || activeAssignment.technician?.username || 'Technician'}</p>
                  <p className="text-xs text-content-body">Assigned: {new Date(activeAssignment.assigned_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {statusHistory.length > 0 && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Status History</h4>
              <div className="space-y-2">
                {statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#7eb8f7]" />
                    <span className="text-content-body">
                      <span className="font-medium capitalize">{(h.status || '').replace(/_/g, ' ')}</span>
                      {' - '}{new Date(h.created_at || h.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loadingDetails && <p className="text-sm text-content-muted">Loading details...</p>}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function RequestManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', search: '', urgency: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [detailRequest, setDetailRequest] = useState(null)
  const itemsPerPage = 8

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await requestAPI.getAll()
      setRequests(response.data || [])
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setLoading(false)
    }
  }

  // Search + Filter
  const filteredRequests = useMemo(() => {
    let result = [...requests]

    if (filters.status) {
      result = result.filter((r) => r.status === filters.status)
    }
    if (filters.urgency) {
      result = result.filter((r) => r.urgency === filters.urgency)
    }
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter((r) =>
        r.title?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.customerName?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term)
      )
    }

    return result
  }, [requests, filters])

  // Sorting
  const sortedRequests = useMemo(() => {
    const sorted = [...filteredRequests]
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key] || ''
      let bVal = b[sortConfig.key] || ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredRequests, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage)
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedRequests.slice(start, start + itemsPerPage)
  }, [sortedRequests, currentPage])

  useEffect(() => { setCurrentPage(1) }, [filters, sortConfig])

  const getStatusColor = (status) => {
    switch (status) {
      case 'requested':
      case 'assigned':
      case 'on_the_way':
        return 'badge-info'
      case 'in_progress':
        return 'badge-warning'
      case 'completed':
        return 'badge-success'
      case 'cancelled':
        return 'badge-error'
      default:
        return 'badge'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">Service Requests</h1>
        <p className="text-content-body mt-2">Manage all service requests ({requests.length} total)</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-content-muted" />
            <input
              type="text" id="request-search" placeholder="Search requests..."
              className="input pl-10 w-full" value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div>
            <select id="request-status-filter" className="input w-full" value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
              <option value="">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="assigned">Assigned</option>
              <option value="on_the_way">On The Way</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <select id="request-urgency-filter" className="input w-full" value={filters.urgency}
              onChange={(e) => setFilters((prev) => ({ ...prev, urgency: e.target.value }))}>
              <option value="">All Urgency</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <select id="request-sort" className="input flex-1"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split('-')
                setSortConfig({ key, direction: dir })
              }}>
              <option value="id-desc">Newest First</option>
              <option value="id-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="urgency-desc">Urgency (High-Low)</option>
            </select>
            <button id="request-clear-filters"
              onClick={() => setFilters({ status: '', search: '', urgency: '' })}
              className="btn-secondary whitespace-nowrap">
              Clear
            </button>
          </div>
        </div>
        <div className="mt-3 text-sm text-content-muted">
          Showing {paginatedRequests.length} of {sortedRequests.length} requests
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12 text-content-muted">Loading requests...</div>
      ) : paginatedRequests.length > 0 ? (
        <>
          <div className="space-y-4">
            {paginatedRequests.map((request) => (
              <div key={request.id} className="card hover:shadow-lg transition-shadow overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-content-primary text-lg truncate">{request.title}</h3>
                    <p className="text-content-body mt-1 line-clamp-2 break-words">{request.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
                      <div className="min-w-0">
                        <p className="text-content-muted truncate">Customer</p>
                        <p className="font-semibold text-content-primary truncate">{request.customerName || request.customer?.name || 'Unknown'}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-content-muted truncate">Category</p>
                        <p className="font-semibold text-content-primary truncate">{request.categoryName || request.category?.name || 'N/A'}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-content-muted truncate">Location</p>
                        <p className="font-semibold text-content-primary truncate">{request.location || 'N/A'}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-content-muted truncate">Urgency</p>
                        <p className="font-semibold text-content-primary capitalize truncate">{request.urgency || 'medium'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right flex flex-col items-end gap-2">
                    <span className={`badge whitespace-nowrap ${getStatusColor(request.status)}`}>{request.status?.replace('_', ' ')}</span>
                    <button
                      onClick={() => setDetailRequest(request)}
                      className="btn-secondary text-sm flex items-center gap-1"
                      title="View Details"
                    >
                      <FiEye className="w-4 h-4" /> Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button id="requests-prev-page"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary flex items-center gap-1 disabled:opacity-50">
                <FiChevronLeft /> Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-[#1e2d4a] text-[#7eb8f7]'
                        : 'bg-surface-inner text-content-body hover:bg-[#2a2d3d]'
                    }`}>{page}</button>
                ))}
              </div>
              <button id="requests-next-page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary flex items-center gap-1 disabled:opacity-50">
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <FiX className="w-12 h-12 text-content-hint mx-auto mb-4" />
          <p className="text-content-body">No requests found</p>
        </div>
      )}

      {/* Detail Modal */}
      {detailRequest && (
        <DetailModal
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
        />
      )}
    </div>
  )
}
