import React, { useState, useEffect, useMemo } from 'react'
import { FiSearch, FiMapPin, FiDollarSign, FiStar, FiChevronLeft, FiChevronRight, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { technicianAPI } from '../services/api'

function TechnicianCard({ technician }) {
  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${technician.id}`}
          alt={technician.name}
          className="w-16 h-16 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{technician.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <FiStar className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-900">{technician.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <FiMapPin className="w-4 h-4" />
            <span>{technician.area || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiDollarSign className="w-4 h-4" />
            <span>${technician.hourlyRate || 0}/hr</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex gap-2">
        <button className="flex-1 btn-secondary text-sm">View Profile</button>
        <button className="flex-1 btn-primary text-sm">Book Now</button>
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
  const itemsPerPage = 6

  useEffect(() => {
    fetchTechnicians()
  }, [])

  const fetchTechnicians = async () => {
    try {
      const response = await technicianAPI.getAvailable()
      setTechnicians(response.data || [])
    } catch (error) {
      console.error('Failed to fetch technicians:', error)
    } finally {
      setLoading(false)
    }
  }

  // Search + Filter
  const filteredTechnicians = useMemo(() => {
    let result = [...technicians]

    if (filters.search) {
      const term = filters.search.toLowerCase()
      result = result.filter((t) =>
        t.name?.toLowerCase().includes(term) || t.area?.toLowerCase().includes(term)
      )
    }
    if (filters.area) {
      result = result.filter((t) => t.area?.toLowerCase().includes(filters.area.toLowerCase()))
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Technicians</h1>
        <p className="text-gray-600 mt-2">Browse available service providers</p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text" id="tech-search" placeholder="Search by name or area..."
              className="input pl-10" value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
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
        <div className="mt-3 text-sm text-gray-500">
          Showing {paginatedTechnicians.length} of {sortedTechnicians.length} technicians
        </div>
      </div>

      {/* Technicians Grid */}
      {loading ? (
        <div className="text-center py-12">Loading technicians...</div>
      ) : paginatedTechnicians.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTechnicians.map((tech) => (
              <TechnicianCard key={tech.id} technician={tech} />
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
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          <p className="text-gray-600">No technicians found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
