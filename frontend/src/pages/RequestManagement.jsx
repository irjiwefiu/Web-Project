import React, { useState, useEffect, useMemo } from 'react'
import { IconSearch, IconClipboard, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { requestAPI } from '../services/api'

const Badge = ({ text, type }) => {
  const styles = {
    success: 'bg-[#14301f] text-[#4ade80]',
    warning: 'bg-[#2d2010] text-[#fbbf24]',
    info: 'bg-[#0e2040] text-[#7eb8f7]',
    danger: 'bg-[#2d1010] text-[#f87171]',
  }
  return (
    <span className={`px-2.5 py-1 rounded-sm text-[11px] uppercase tracking-wider font-semibold ${styles[type] || styles.info}`}>
      {text}
    </span>
  )
}

const STATUS_MAP = {
  pending: { label: 'Pending', type: 'warning' },
  requested: { label: 'Requested', type: 'warning' },
  assigned: { label: 'Assigned', type: 'info' },
  in_progress: { label: 'In progress', type: 'info' },
  completed: { label: 'Completed', type: 'success' },
  cancelled: { label: 'Cancelled', type: 'danger' },
}

export default function RequestManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', search: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => { loadRequests() }, [])

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

  const filteredRequests = useMemo(() => {
    let result = [...requests]
    if (filters.status) result = result.filter(r => r.status === filters.status)
    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter(r =>
        r.title?.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term) ||
        r.customerName?.toLowerCase().includes(term) ||
        r.location?.toLowerCase().includes(term)
      )
    }
    return result
  }, [requests, filters])

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

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage)
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedRequests.slice(start, start + itemsPerPage)
  }, [sortedRequests, currentPage])

  useEffect(() => { setCurrentPage(1) }, [filters, sortConfig])

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-[20px] font-bold text-content-primary">Service Requests</h1>
        <p className="text-content-muted text-[13px] mt-1">Manage all service requests ({requests.length} total)</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-3 text-content-hint" />
            <input type="text" id="request-search" placeholder="Search requests..."
              className="input pl-10 w-full" value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} />
          </div>
          <select id="request-status-filter" className="input w-full" value={filters.status}
            onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
            <option value="">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="flex gap-2">
            <select id="request-sort" className="input flex-1"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={e => { const [key, dir] = e.target.value.split('-'); setSortConfig({ key, direction: dir }) }}>
              <option value="id-desc">Newest First</option>
              <option value="id-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
            <button id="request-clear-filters" onClick={() => setFilters({ status: '', search: '' })}
              className="btn btn-outline whitespace-nowrap text-[12px]">Clear</button>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-content-hint">
          Showing {paginatedRequests.length} of {sortedRequests.length} requests
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" />
        </div>
      ) : paginatedRequests.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {paginatedRequests.map(request => {
              const st = STATUS_MAP[request.status] || STATUS_MAP.pending
              return (
                <div key={request.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-content-primary">{request.title}</h3>
                      <p className="text-content-muted text-[13px] mt-1">{request.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-[11px]">
                        <div>
                          <p className="text-content-hint">Customer</p>
                          <p className="text-content-primary font-medium">{request.customerName || request.customer?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-content-hint">Category</p>
                          <p className="text-content-primary font-medium">{request.categoryName || request.category?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-content-hint">Location</p>
                          <p className="text-content-primary font-medium">{request.location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4"><Badge text={st.label} type={st.type} /></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn btn-outline text-[12px] py-1.5">View Details</button>
                    {(request.status === 'pending' || request.status === 'requested') && (
                      <button className="btn btn-primary text-[12px] py-1.5">Assign Technician</button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button id="requests-prev-page" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">
                <IconChevronLeft size={14} /> Prev
              </button>
              <span className="text-content-muted text-[11px]">Page {currentPage} of {totalPages}</span>
              <button id="requests-next-page" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">
                Next <IconChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <IconClipboard size={40} className="text-content-hint mx-auto mb-4" />
          <p className="text-content-muted text-[13px]">No requests found</p>
        </div>
      )}
    </div>
  )
}
