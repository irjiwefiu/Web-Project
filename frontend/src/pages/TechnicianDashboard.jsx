import React, { useState, useEffect } from 'react'
import { FiCheckCircle, FiStar, FiTrendingUp, FiClock } from 'react-icons/fi'
import { dashboardAPI } from '../services/api'

export default function TechnicianDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
        <p className="text-gray-600 mt-2">Manage your work and availability</p>
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
            {assignments.map((assignment) => (
              <div key={assignment.id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Assignment #{assignment.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {assignment.status}
                    </p>
                    <p className="text-sm text-gray-600">
                      Scheduled: {assignment.scheduledDate}
                    </p>
                  </div>
                  <span className="badge badge-info">{assignment.status}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn-secondary text-sm">View Details</button>
                  <button className="btn-primary text-sm">Start Work</button>
                </div>
              </div>
            ))}
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
