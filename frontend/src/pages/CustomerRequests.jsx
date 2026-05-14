import React, { useState, useEffect } from 'react'
import { IconPlus, IconSearch, IconX, IconMapPin, IconClock, IconClipboard } from '@tabler/icons-react'
import { requestAPI, categoryAPI } from '../services/api'

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

function RequestForm({ onSubmit, onClose }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '', description: '', categoryId: '', location: '', preferred_time: '',
  })

  useEffect(() => { loadCategories() }, [])

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

  const set = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }))

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-md border border-border shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-content-primary">New Service Request</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <IconX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Title</label>
            <input type="text" className="input w-full" placeholder="Service title" value={formData.title} onChange={set('title')} required />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Description</label>
            <textarea className="input w-full h-20 resize-none" placeholder="Describe your issue..." value={formData.description} onChange={set('description')} required />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Category</label>
            <select className="input w-full" value={formData.categoryId} onChange={set('categoryId')} required>
              <option value="">Select category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Location</label>
            <input type="text" className="input w-full" placeholder="Service location" value={formData.location} onChange={set('location')} required />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Preferred Date</label>
              <input type="date" className="input w-full" value={formData.preferred_time} onChange={set('preferred_time')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn btn-primary flex-1">Create Request</button>
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

  useEffect(() => { loadRequests() }, [])

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

  const STATUS_MAP = {
    pending: { label: 'Pending', type: 'warning' },
    requested: { label: 'Pending', type: 'warning' },
    assigned: { label: 'Assigned', type: 'info' },
    in_progress: { label: 'In progress', type: 'info' },
    completed: { label: 'Completed', type: 'success' },
    cancelled: { label: 'Cancelled', type: 'danger' },
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-content-primary">My Service Requests</h1>
          <p className="text-content-muted text-[13px] mt-1">Track all your service bookings</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary" id="new-request-btn">
          <IconPlus size={16} /> New Request
        </button>
      </div>

      {/* Request List */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" />
        </div>
      ) : requests.length > 0 ? (
        <div className="flex flex-col gap-3">
          {requests.map((request) => {
            const st = STATUS_MAP[request.status] || STATUS_MAP.pending
            return (
              <div key={request.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-content-primary">{request.title}</h3>
                    <p className="text-content-muted text-[13px] mt-1">{request.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-[11px] text-content-muted">
                      <div className="flex items-center gap-1">
                        <IconMapPin size={12} /> {request.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <IconClock size={12} /> {new Date(request.createdAt || request.created_at || Date.now()).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge text={st.label} type={st.type} />
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="btn btn-outline text-[12px] py-1.5">View Details</button>
                  {(request.status === 'pending' || request.status === 'requested') && (
                    <button onClick={() => cancelRequest(request.id)} className="btn btn-danger text-[12px] py-1.5">Cancel</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <IconClipboard size={40} className="text-content-hint mx-auto mb-4" />
          <p className="text-content-muted text-[13px]">No requests yet</p>
          <button onClick={() => setShowForm(true)} className="btn btn-primary mt-4 mx-auto">
            Create Your First Request
          </button>
        </div>
      )}

      {/* Modal */}
      {showForm && <RequestForm onSubmit={handleCreateRequest} onClose={() => setShowForm(false)} />}
    </div>
  )
}
