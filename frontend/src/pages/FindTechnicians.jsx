import React, { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiFilter, FiMapPin, FiDollarSign, FiStar } from 'react-icons/fi'
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
            <span className="text-sm font-semibold text-gray-900">
              {technician.rating || 4.5}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <FiMapPin className="w-4 h-4" />
            <span>{technician.area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiDollarSign className="w-4 h-4" />
            <span>${technician.hourlyRate}/hr</span>
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
  const [filters, setFilters] = useState({
    search: '',
    area: '',
    rating: 0,
  })

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Technicians</h1>
        <p className="text-gray-600 mt-2">Browse available service providers</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div className="relative">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by area..."
              className="input pl-10"
              value={filters.area}
              onChange={(e) => setFilters((prev) => ({ ...prev, area: e.target.value }))}
            />
          </div>
          <div>
            <select className="input" onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}>
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technicians Grid */}
      {loading ? (
        <div className="text-center py-12">Loading technicians...</div>
      ) : technicians.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <TechnicianCard key={tech.id} technician={tech} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No technicians available</p>
        </div>
      )}
    </div>
  )
}
