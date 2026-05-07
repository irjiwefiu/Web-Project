import React, { useState, useEffect } from 'react'
import { FiSearch, FiFilter, FiEye, FiCheckCircle, FiClock, FiX } from 'react-icons/fi'
import { requestAPI } from '../services/api'

export default function RequestManagement() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  })

  useEffect(() => {
    loadRequests()
  }, [filters])

  const loadRequests = async () => {
    try {
      const response = await requestAPI.getAll()
      let data = response.data || []

      if (filters.status) {
        data = data.filter((r) => r.status === filters.status)
      }

      if (filters.search) {
        data = data.filter(
          (r) =>
            r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            r.customerName?.toLowerCase().includes(filters.search.toLowerCase())
        )
      }

      setRequests(data)
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-info'
      case 'in_progress':
        return 'badge-warning'
      case 'completed':
        return 'badge-success'
      default:
        return 'badge'
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
        <p className="text-gray-600 mt-2">Manage all service requests</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              className="input pl-10 w-full"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <div>
            <select
              className="input w-full"
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button
            onClick={() =>
              setFilters({
                status: '',
                search: '',
              })
            }
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Requests */}
      {loading ? (
        <div className="text-center py-12">Loading requests...</div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {request.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{request.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">
                        {request.customerName || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Category</p>
                      <p className="font-semibold text-gray-900">
                        {request.categoryName || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{request.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Urgency</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {request.urgency}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className={`badge ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn-secondary text-sm">View Details</button>
                {request.status === 'pending' && (
                  <button className="btn-primary text-sm">Assign Technician</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No requests found</p>
        </div>
      )}
    </div>
  )
}
