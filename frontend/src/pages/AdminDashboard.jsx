import React, { useState, useEffect } from 'react'
import {
  FiTrendingUp, FiUsers, FiCheckCircle, FiClock, FiClipboard,
  FiX, FiTool, FiTag, FiUserPlus, FiZap, FiAlertCircle
} from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  dashboardAPI, userAPI, requestAPI, assignmentAPI, categoryAPI
} from '../services/api'

function StatCard({ icon: Icon, label, value, color, onClick }) {
  return (
    <div
      className={`card flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

// ─── Assign Technician Modal ────────────────────────────────────────────────
function AssignModal({ onClose, onSuccess }) {
  const [requests, setRequests] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [selectedRequest, setSelectedRequest] = useState('')
  const [selectedTech, setSelectedTech] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      requestAPI.getAll(),
      userAPI.getUsersByRole('technician'),
    ]).then(([reqRes, techRes]) => {
      const pending = (reqRes.data || []).filter(
        (r) => r.status === 'pending' || r.status === 'requested'
      )
      setRequests(pending)
      setTechnicians(techRes.data || [])
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRequest || !selectedTech) return
    setSubmitting(true)
    setError('')
    try {
      await assignmentAPI.adminAssign({
        request_id: selectedRequest,
        technician_id: selectedTech,
      })
      onSuccess('Technician assigned successfully!')
      onClose()
    } catch (err) {
      setError(err.message || 'Assignment failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiTool className="w-5 h-5 text-primary-600" /> Assign Technician
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <p className="text-center text-gray-500 py-4">Loading data...</p>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Request (Pending only)
                </label>
                <select
                  id="assign-request-select"
                  className="input w-full"
                  value={selectedRequest}
                  onChange={(e) => setSelectedRequest(e.target.value)}
                  required
                >
                  <option value="">— Select request —</option>
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>
                      #{r.id} · {r.title}
                    </option>
                  ))}
                </select>
                {requests.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No pending requests found</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Technician
                </label>
                <select
                  id="assign-tech-select"
                  className="input w-full"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  required
                >
                  <option value="">— Select technician —</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name || t.username} ({t.email})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-assign-btn"
              className="btn-primary"
              disabled={submitting || loading}
            >
              {submitting ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Add Category Modal ─────────────────────────────────────────────────────
function AddCategoryModal({ onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await categoryAPI.create({ name: name.trim() })
      onSuccess(`Category "${name.trim()}" created!`)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create category')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiTag className="w-5 h-5 text-primary-600" /> Add Category
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              id="quick-category-name"
              type="text"
              className="input w-full"
              placeholder="e.g., Solar Installation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button
              type="submit"
              id="quick-add-category-btn"
              className="btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Add User Modal ──────────────────────────────────────────────────────────
function AddUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', roleName: 'customer' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await userAPI.createUser(form)
      onSuccess(`User "${form.name}" created successfully!`)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FiUserPlus className="w-5 h-5 text-primary-600" /> Add New User
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <input type="text" className="input w-full" placeholder="Jane Doe"
                value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Username</label>
              <input type="text" className="input w-full" placeholder="janedoe"
                value={form.username} onChange={set('username')} required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input type="email" className="input w-full" placeholder="jane@example.com"
              value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input type="password" className="input w-full" placeholder="••••••••"
              value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Role</label>
            <select className="input w-full" value={form.roleName} onChange={set('roleName')}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" id="quick-add-user-btn" className="btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // 'assign' | 'category' | 'user'
  const [toast, setToast] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => { fetchDashboard() }, [])

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getAdminDashboard()
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSuccess = (msg) => {
    showToast(msg)
    fetchDashboard()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  const stats = data?.statistics || {}

  const quickActions = [
    {
      id: 'qa-assign',
      icon: FiTool,
      label: 'Assign Technician',
      desc: 'Dispatch a technician to a pending request',
      color: 'bg-blue-500',
      action: () => setModal('assign'),
    },
    {
      id: 'qa-add-user',
      icon: FiUserPlus,
      label: 'Add New User',
      desc: 'Create a customer, technician or admin',
      color: 'bg-green-500',
      action: () => setModal('user'),
    },
    {
      id: 'qa-category',
      icon: FiTag,
      label: 'Add Category',
      desc: 'Create a new service category',
      color: 'bg-purple-500',
      action: () => setModal('category'),
    },
    {
      id: 'qa-requests',
      icon: FiClipboard,
      label: 'View All Requests',
      desc: 'Browse and manage service requests',
      color: 'bg-yellow-500',
      action: () => navigate('/admin/requests'),
    },
    {
      id: 'qa-users',
      icon: FiUsers,
      label: 'Manage Users',
      desc: 'View, edit or delete user accounts',
      color: 'bg-orange-500',
      action: () => navigate('/admin/users'),
    },
    {
      id: 'qa-technicians',
      icon: FiZap,
      label: 'Manage Technicians',
      desc: 'View technician profiles and skills',
      color: 'bg-pink-500',
      action: () => navigate('/admin/technicians'),
    },
  ]

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-white font-semibold transition-all ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modal === 'assign' && (
        <AssignModal onClose={() => setModal(null)} onSuccess={handleSuccess} />
      )}
      {modal === 'category' && (
        <AddCategoryModal onClose={() => setModal(null)} onSuccess={handleSuccess} />
      )}
      {modal === 'user' && (
        <AddUserModal onClose={() => setModal(null)} onSuccess={handleSuccess} />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, <span className="font-semibold text-primary-600">{user?.name}</span>.
          Here's the system overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-8">
        <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers || 0} color="bg-blue-500"
          onClick={() => navigate('/admin/users')} />
        <StatCard icon={FiClipboard} label="In Progress" value={stats.activeServiceRequests || 0} color="bg-yellow-500"
          onClick={() => navigate('/admin/requests')} />
        <StatCard icon={FiCheckCircle} label="Assignments" value={stats.totalAssignments || 0} color="bg-green-500"
          onClick={() => navigate('/admin/requests')} />
        <StatCard icon={FiTrendingUp} label="Avg Rating" value={stats.averageRating > 0 ? `${Number(stats.averageRating).toFixed(1)}★` : '—'} color="bg-purple-500" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending || 0} color="bg-red-500"
          onClick={() => navigate('/admin/requests')} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
            <button
              onClick={() => navigate('/admin/requests')}
              className="text-sm text-primary-600 hover:underline font-semibold"
            >
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {data?.recentRequests?.length > 0 ? (
              data.recentRequests.map((req) => {
                const statusColor = {
                  pending: 'badge-info',
                  in_progress: 'badge-warning',
                  completed: 'badge-success',
                  cancelled: 'badge-error',
                }[req.status] || 'badge'
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{req.title || 'Service Request'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {req.customer?.name || req.customerName || 'Unknown customer'} ·{' '}
                        {new Date(req.created_at || req.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge ${statusColor} ml-3 flex-shrink-0`}>
                      {req.status?.replace('_', ' ') || 'Pending'}
                    </span>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FiClipboard className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No recent requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((qa) => {
              const Icon = qa.icon
              return (
                <button
                  key={qa.id}
                  id={qa.id}
                  onClick={qa.action}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all text-left group"
                >
                  <div className={`p-2.5 rounded-lg ${qa.color} flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                      {qa.label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{qa.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
