import React, { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiX, FiMapPin, FiClock } from 'react-icons/fi'
import { requestAPI, categoryAPI } from '../services/api'

function RequestForm({ onSubmit, onClose }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    location: '',
    preferred_time: '',
    urgency: 'medium',
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
    try {
      await requestAPI.create(formData)
      onSubmit()
    } catch (error) {
      console.error('Failed to create request:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Request</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
            <input type="text" className="input" placeholder="Service title" value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea className="input" placeholder="Describe your issue..." rows="3" value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <select className="input" value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input type="text" className="input" placeholder="Service location" value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
              <input type="date" className="input" value={formData.preferred_time}
                onChange={(e) => setFormData((prev) => ({ ...prev, preferred_time: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Urgency</label>
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
            <button type="submit" className="btn-primary flex-1">Create Request</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CustomerRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const response = await requestAPI.getMyRequests()
      setRequests(response.data || [])
    } catch (error) {
      console.error('Failed to load requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const cancelRequest = async (requestId) => {
    try {
      await requestAPI.cancel(requestId, { reason: 'Cancelled by customer' })
      await loadRequests()
    } catch (error) {
      console.error('Failed to cancel request:', error)
    }
  }

  const handleCreateRequest = () => {
    loadRequests()
    setShowForm(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Service Requests</h1>
          <p className="text-gray-600 mt-2">Track all your service bookings</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" /> New Request
        </button>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="text-center py-12">Loading requests...</div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                  <p className="text-gray-600 mt-2">{request.description}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" /> {request.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" /> {new Date(request.createdAt || request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    request.status === 'pending' || request.status === 'requested' || request.status === 'assigned' ? 'badge-info'
                      : request.status === 'in_progress' ? 'badge-warning'
                      : request.status === 'completed' ? 'badge-success'
                      : 'badge'
                  }`}>{request.status?.replace('_', ' ')}</span>
                  <p className="text-sm text-gray-600 mt-2 capitalize">Urgency: {request.urgency}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="btn-secondary text-sm">View Details</button>
                {(request.status === 'pending' || request.status === 'requested') && (
                  <button onClick={() => cancelRequest(request.id)} className="btn-secondary text-sm">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No requests yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
            Create Your First Request
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <RequestForm onSubmit={handleCreateRequest} onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}
