import React, { useState, useEffect, useMemo } from 'react'
import { FiSearch, FiMapPin, FiDollarSign, FiStar, FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown, FiX, FiCalendar } from 'react-icons/fi'
import { technicianAPI, requestAPI, categoryAPI } from '../services/api'

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

function BookModal({ technician, onClose, onSuccess }) {
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
      onSuccess(`Service request created! ${technician.name || 'Technician'} will be notified.`)
      onClose()
    } catch (error) {
      console.error('Failed to create request:', error)
      onSuccess('Failed to create request: ' + (error.message || 'Unknown error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="modal-header">
          <div>
            <h2 className="text-2xl font-bold text-content-primary">Book Service</h2>
            <p className="text-sm text-content-body mt-1">Request service from {technician.name}</p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Service Title</label>
            <input type="text" className="input" placeholder="e.g., AC Repair" value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" placeholder="Describe what you need..." rows="3" value={formData.description}
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
            <input type="text" className="input" placeholder="Your address" value={formData.location}
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

function TechnicianCard({ technician, onBook, onViewProfile }) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.id}`}
          alt={technician.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-content-primary">{technician.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <FiStar className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-content-primary">{technician.rating || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-content-body mt-2">
            <FiMapPin className="w-4 h-4" />
            <span>{technician.area || technician.service_area || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-content-body">
            <FiDollarSign className="w-4 h-4" />
            <span>${technician.hourlyRate || technician.hourly_rate || 0}/hr</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border flex gap-2">
        <button onClick={() => onViewProfile(technician)} className="flex-1 btn-secondary text-sm">View Profile</button>
        <button onClick={() => onBook(technician)} className="flex-1 btn-accent text-sm">Book Now</button>
      </div>
    </div>
  )
}

function TechnicianProfileModal({ technician, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-2xl font-bold text-content-primary">Technician Profile</h2>
          <button onClick={onClose} className="btn-icon">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.id}`}
              alt={technician.name}
              className="w-20 h-20 rounded-full ring-2 ring-border"
            />
            <div>
              <h3 className="text-xl font-bold text-content-primary">{technician.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FiStar className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold text-content-primary">{technician.rating || 'N/A'}</span>
                <span className="text-xs text-content-muted">({technician.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-inner rounded-lg p-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-content-muted">Location</p>
              <p className="font-semibold text-content-primary flex items-center gap-1">
                <FiMapPin className="w-4 h-4" /> {technician.area || technician.service_area || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-content-muted">Hourly Rate</p>
              <p className="font-semibold text-content-primary flex items-center gap-1">
                <FiDollarSign className="w-4 h-4" /> ${technician.hourlyRate || technician.hourly_rate || 0}/hr
              </p>
            </div>
            <div>
              <p className="text-content-muted">Experience</p>
              <p className="font-semibold text-content-primary">{technician.yearsExperience || technician.years_experience || 'N/A'} years</p>
            </div>
            <div>
              <p className="text-content-muted">Completed Jobs</p>
              <p className="font-semibold text-content-primary">{technician.completedJobs || technician.completed_jobs || 0}</p>
            </div>
          </div>

          {technician.bio && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Bio</h4>
              <p className="text-content-body text-sm leading-relaxed">{technician.bio}</p>
            </div>
          )}

          {technician.skills && (Array.isArray(technician.skills) ? technician.skills.length > 0 : typeof technician.skills === 'string' && technician.skills.length > 0) && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(technician.skills) ? technician.skills : typeof technician.skills === 'string' ? JSON.parse(technician.skills) : []).map((skill, i) => (
                  <span key={i} className="badge badge-info">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {technician.certifications && (Array.isArray(technician.certifications) ? technician.certifications.length > 0 : false) && (
            <div>
              <h4 className="font-semibold text-content-primary mb-2">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(technician.certifications) ? technician.certifications : []).map((cert, i) => (
                  <span key={i} className="badge badge-success">{cert}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  )
}

export default function FindTechnicians() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', area: '', rating: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [bookTechnician, setBookTechnician] = useState(null)
  const [viewProfile, setViewProfile] = useState(null)
  const [toast, setToast] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    fetchTechnicians()
  }, [])

  const fetchTechnicians = async () => {
    try {
      const response = await technicianAPI.getAvailable()
      // API returns TechnicianProfile objects with nested user; flatten for UI
      const raw = response.data || []
      const mapped = raw.map((profile) => ({
        id: profile.id,
        name: profile.user?.name || profile.user?.username || 'Unknown',
        email: profile.user?.email || '',
        rating: profile.rating || 0,
        area: profile.service_area || 'N/A',
        hourlyRate: profile.hourly_rate || 0,
        bio: profile.bio || '',
        skills: profile.skills || [],
        availability_status: profile.availability_status || 'offline',
        total_jobs: profile.total_jobs || 0,
      }))
      setTechnicians(mapped)
    } catch (error) {
      console.error('Failed to fetch technicians:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
  }

  // Search + Filter
  const filteredTechnicians = useMemo(() => {
    let result = [...technicians]

    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter((t) =>
        (t.name || '').toLowerCase().includes(term) ||
        (t.area || t.service_area || '').toLowerCase().includes(term)
      )
    }
    if (filters.area) {
      result = result.filter((t) =>
        (t.area || t.service_area || '').toLowerCase().includes(filters.area.toLowerCase())
      )
    }
    if (filters.rating) {
      result = result.filter((t) => (t.rating || 0) >= Number(filters.rating))
    }

    return result
  }, [technicians, filters])

  // Sorting
  const sortedTechnicians = useMemo(() => {
    const sorted = [...filteredTechnicians]
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
  }, [filteredTechnicians, sortConfig])

  // Pagination
  const totalPages = Math.ceil(sortedTechnicians.length / itemsPerPage)
  const paginatedTechnicians = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return sortedTechnicians.slice(start, start + itemsPerPage)
  }, [sortedTechnicians, currentPage])

  // Reset page on filter/sort change
  useEffect(() => { setCurrentPage(1) }, [filters, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const SortIcon = ({ field }) => {
    if (sortConfig.key !== field) return null
    return sortConfig.direction === 'asc'
      ? <FiArrowUp className="w-4 h-4 inline ml-1" />
      : <FiArrowDown className="w-4 h-4 inline ml-1" />
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">Find Technicians</h1>
        <p className="text-content-body mt-2">Browse available service providers and book instantly</p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-content-muted" />
            <input
              type="text" id="tech-search" placeholder="Search by name or area..."
              className="input pl-10" value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-content-muted" />
            <input
              type="text" id="tech-area-filter" placeholder="Filter by area..."
              className="input pl-10" value={filters.area}
              onChange={(e) => setFilters((prev) => ({ ...prev, area: e.target.value }))}
            />
          </div>
          <div>
            <select id="tech-rating-filter" className="input"
              value={filters.rating}
              onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}>
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
          <div>
            <select id="tech-sort" className="input"
              value={`${sortConfig.key}-${sortConfig.direction}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split('-')
                setSortConfig({ key, direction: dir })
              }}>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="rating-desc">Rating (High-Low)</option>
              <option value="rating-asc">Rating (Low-High)</option>
              <option value="hourlyRate-asc">Price (Low-High)</option>
              <option value="hourlyRate-desc">Price (High-Low)</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-content-muted">
          Showing {paginatedTechnicians.length} of {sortedTechnicians.length} technicians
        </div>
      </div>

      {/* Technicians Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-content-body">Loading technicians...</p>
        </div>
      ) : paginatedTechnicians.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} onBook={setBookTechnician} onViewProfile={setViewProfile} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                id="tech-prev-page"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary flex items-center gap-1 disabled:opacity-50"
              >
                <FiChevronLeft /> Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors cursor-pointer ${
                      currentPage === page
                        ? 'bg-[#1e2d4a] text-[#7eb8f7]'
                        : 'bg-surface-inner text-content-body hover:bg-[#2a2d3d]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                id="tech-next-page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary flex items-center gap-1 disabled:opacity-50"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-content-body">No technicians found matching your criteria</p>
        </div>
      )}

      {/* Technician Profile Modal */}
      {viewProfile && (
        <TechnicianProfileModal
          technician={viewProfile}
          onClose={() => setViewProfile(null)}
        />
      )}

      {/* Book Modal */}
      {bookTechnician && (
        <BookModal
          technician={bookTechnician}
          onClose={() => setBookTechnician(null)}
          onSuccess={(msg) => showToast(msg)}
        />
      )}
    </div>
  )
}
