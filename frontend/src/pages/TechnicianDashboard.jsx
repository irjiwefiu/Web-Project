import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiStar, FiTrendingUp, FiClock } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { dashboardAPI } from '../services/api'

export default function TechnicianDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getTechnicianDashboard()
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const summary = data?.summary || {}
  const assignments = data?.upcomingAssignments || []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user?.name}. Manage your work and availability</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total || 0}</p>
            </div>
            <FiCheckCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{summary.pending || 0}</p>
            </div>
            <FiClock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{summary.completed || 0}</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Your Rating</p>
              <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                {summary.rating || 0}
                <FiStar className="w-5 h-5 text-yellow-500" />
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="card mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Availability Status</h2>
        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${
              summary.availabilityStatus === 'available'
                ? 'bg-green-500'
                : summary.availabilityStatus === 'busy'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          ></div>
          <span className="text-lg font-semibold text-gray-900 capitalize">
            {summary.availabilityStatus || 'offline'}
          </span>
          <button className="ml-auto btn-primary">Update Status</button>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Assignments</h2>
        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const request = assignment.request || {}
              const scheduledDate = request.preferred_time ? new Date(request.preferred_time).toLocaleString() : 'Not scheduled'
              const status = request.status || 'pending'
              const statusClass = status === 'in_progress' ? 'badge-warning' : status === 'completed' ? 'badge-success' : 'badge-info'

              return (
                <div key={assignment.id} className="card">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {request.title || `Assignment #${String(assignment.id).slice(0, 8)}`}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.description || 'No description provided.'}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-900">Customer</p>
                          <p>{request.customer?.name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Scheduled</p>
                          <p>{scheduledDate}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Urgency</p>
                          <p className="capitalize">{request.urgency || 'medium'}</p>
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${statusClass} uppercase`}>{status.replace('_', ' ')}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="btn-secondary text-sm">View Details</button>
                    <button className="btn-primary text-sm">Start Work</button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiCheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No upcoming assignments</p>
          </div>
        )}
      </div>
    </div>
  )
}
