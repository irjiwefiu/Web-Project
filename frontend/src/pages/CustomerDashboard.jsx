import React, { useState, useEffect } from 'react'
import { FiClipboard, FiClock, FiCheckCircle, FiX } from 'react-icons/fi'
import { dashboardAPI } from '../services/api'

function RequestCard({ request }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{request.description}</p>
        </div>
        <span
          className={`badge ${
            request.status === 'in_progress'
              ? 'badge-warning'
              : request.status === 'completed'
              ? 'badge-success'
              : 'badge-info'
          }`}
        >
          {request.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 pt-3 border-t">
        <div>Location: {request.location}</div>
        <div>Urgency: {request.urgency}</div>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getCustomerDashboard()
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
  const requests = data?.recentRequests || []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your service requests</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <FiClipboard className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900">{summary.total || 0}</p>
        </div>
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
            <FiClock className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-gray-900">{summary.active || 0}</p>
        </div>
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <FiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-3xl font-bold text-gray-900">{summary.completed || 0}</p>
        </div>
      </div>

      {/* Recent Requests */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Requests</h2>
        {requests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FiClipboard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No service requests yet</p>
            <button className="btn-primary mt-4">Create First Request</button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-8 text-center">
        <button className="btn-primary px-8 py-3">
          Create New Service Request
        </button>
      </div>
    </div>
  )
}
