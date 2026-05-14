import React, { useState, useEffect } from 'react'
import {
  IconArrowUpRight, IconStar, IconBriefcase, IconUsers,
  IconCoin, IconAlertTriangle, IconTool, IconTag, IconUserPlus,
  IconClipboard, IconAlertCircle, IconX
} from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  dashboardAPI, userAPI, requestAPI, assignmentAPI, categoryAPI
} from '../services/api'

// ── Badge ──
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

// ── Stat Card ──
function StatCard({ label, value, change, positive, alert }) {
  return (
    <div className="card flex flex-col justify-between min-h-[110px]">
      <p className="text-content-muted text-[13px] mb-2">{label}</p>
      <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 text-[11px] font-medium ${
          alert ? 'text-[#f87171]' : positive ? 'text-[#4ade80]' : 'text-content-muted'
        }`}>
          <IconArrowUpRight size={14} />
          {change}
        </div>
      )}
    </div>
  )
}

// ── Assign Technician Modal ──
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-md border border-border shadow-2xl w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-content-primary flex items-center gap-2">
            <IconTool size={18} className="text-[#7eb8f7]" /> Assign Technician
          </h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <IconX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loading ? (
            <p className="text-center text-content-muted py-4 text-[13px]">Loading data...</p>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">
                  Service Request (Pending only)
                </label>
                <select id="assign-request-select" className="input w-full" value={selectedRequest}
                  onChange={(e) => setSelectedRequest(e.target.value)} required>
                  <option value="">— Select request —</option>
                  {requests.map((r) => (
                    <option key={r.id} value={r.id}>#{r.id} · {r.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">
                  Technician
                </label>
                <select id="assign-tech-select" className="input w-full" value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)} required>
                  <option value="">— Select technician —</option>
                  {technicians.map((t) => (
                    <option key={t.id} value={t.id}>{t.name || t.username} ({t.email})</option>
                  ))}
                </select>
              </div>
            </>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
              <IconAlertCircle size={16} /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" id="confirm-assign-btn" className="btn btn-primary" disabled={submitting || loading}>
              {submitting ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add Category Modal ──
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-md border border-border shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-content-primary flex items-center gap-2">
            <IconTag size={18} className="text-[#7eb8f7]" /> Add Category
          </h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <IconX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">Category Name</label>
            <input id="quick-category-name" type="text" className="input w-full"
              placeholder="e.g., Solar Installation" value={name}
              onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
              <IconAlertCircle size={16} /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" id="quick-add-category-btn" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Add User Modal ──
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-md border border-border shadow-2xl w-full max-w-md mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-content-primary flex items-center gap-2">
            <IconUserPlus size={18} className="text-[#7eb8f7]" /> Add New User
          </h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary">
            <IconX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1 uppercase tracking-wider">Full Name</label>
              <input type="text" className="input w-full" placeholder="Jane Doe"
                value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1 uppercase tracking-wider">Username</label>
              <input type="text" className="input w-full" placeholder="janedoe"
                value={form.username} onChange={set('username')} required />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1 uppercase tracking-wider">Email</label>
            <input type="email" className="input w-full" placeholder="jane@example.com"
              value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1 uppercase tracking-wider">Password</label>
            <input type="password" className="input w-full" placeholder="••••••••"
              value={form.password} onChange={set('password')} required />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-1 uppercase tracking-wider">Role</label>
            <select className="input w-full" value={form.roleName} onChange={set('roleName')}>
              <option value="customer">Customer</option>
              <option value="technician">Technician</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
              <IconAlertCircle size={16} /> {error}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-outline">Cancel</button>
            <button type="submit" id="quick-add-user-btn" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Demo data for technician performance (used when API returns minimal data) ──
const DEMO_TECH_PERF = [
  { name: 'Usman T.', rating: 4.9, jobs: 42, color: 'bg-[#7eb8f7]', width: '90%' },
  { name: 'Raza A.', rating: 4.7, jobs: 31, color: 'bg-[#4ade80]', width: '75%' },
  { name: 'Zainab K.', rating: 4.5, jobs: 27, color: 'bg-[#fbbf24]', width: '60%' },
]

// ── Main Component ──
export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
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
        <div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" />
      </div>
    )
  }

  const stats = data?.statistics || {}
  const recentJobs = data?.recentRequests || []

  const STATUS_MAP = {
    pending: { label: 'Pending', type: 'warning' },
    requested: { label: 'Pending', type: 'warning' },
    in_progress: { label: 'In progress', type: 'info' },
    completed: { label: 'Completed', type: 'success' },
    cancelled: { label: 'Cancelled', type: 'danger' },
    assigned: { label: 'Assigned', type: 'success' },
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-sm text-[13px] font-semibold animate-slide-down border ${
          toast.type === 'error'
            ? 'bg-[#2d1010] text-[#f87171] border-[#2d1010]'
            : 'bg-[#14301f] text-[#4ade80] border-[#14301f]'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modal === 'assign' && <AssignModal onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'category' && <AddCategoryModal onClose={() => setModal(null)} onSuccess={handleSuccess} />}
      {modal === 'user' && <AddUserModal onClose={() => setModal(null)} onSuccess={handleSuccess} />}

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total users" value={stats.totalUsers || '0'} change="+12% this month" positive />
        <StatCard label="Active jobs" value={stats.activeServiceRequests || '0'} change="+8% this week" positive />
        <StatCard label="Revenue" value={`$${stats.totalAssignments ? stats.totalAssignments * 85 : '92k'}`} change="+5% vs last month" positive />
        <StatCard label="Disputes open" value={stats.pending || '0'} change="+3 new today" alert />
      </div>

      {/* Two Column Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent Job Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-content-primary font-semibold text-[15px]">Recent job requests</h3>
            <button onClick={() => navigate('/admin/requests')} className="text-[13px] text-content-hint hover:text-content-muted transition-colors" id="view-all-requests">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {recentJobs.length > 0 ? recentJobs.slice(0, 4).map((job, i) => {
              const st = STATUS_MAP[job.status] || STATUS_MAP.pending
              return (
                <div key={job.id || i} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                  <span className="text-content-primary text-[13px]">
                    {job.title || 'Service Request'} — <span className="text-content-muted">{job.customer?.name || 'Customer'}</span>
                  </span>
                  <Badge text={st.label} type={st.type} />
                </div>
              )
            }) : (
              <p className="text-content-muted text-[13px] text-center py-4">No recent requests</p>
            )}
          </div>
        </div>

        {/* Technician Performance */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Technician performance</h3>
          <div className="flex flex-col gap-4">
            {DEMO_TECH_PERF.map((tech, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-content-primary">{tech.name}</span>
                  <div className="flex items-center gap-1 text-content-muted">
                    <span className="text-content-primary">{tech.rating}</span>
                    <IconStar size={12} className="text-[#fbbf24] fill-[#fbbf24]" />
                    <span>· {tech.jobs} jobs</span>
                  </div>
                </div>
                <div className="h-1 bg-surface-inner rounded-full overflow-hidden">
                  <div className={`h-full ${tech.color} rounded-full transition-all duration-500`} style={{ width: tech.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="card">
        <h3 className="text-content-primary font-semibold text-[15px] mb-4">Quick actions</h3>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setModal('assign')} id="qa-assign"
            className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-[#1e2d4a] hover:bg-[#1e2d4a]/20 transition-all text-left group">
            <div className="p-2 rounded-sm bg-[#0e2040]"><IconTool size={16} className="text-[#7eb8f7]" /></div>
            <div>
              <p className="text-[13px] font-medium text-content-primary group-hover:text-[#7eb8f7] transition-colors">Assign Technician</p>
              <p className="text-[11px] text-content-hint">Dispatch to pending request</p>
            </div>
          </button>
          <button onClick={() => setModal('user')} id="qa-add-user"
            className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-[#14301f] hover:bg-[#14301f]/20 transition-all text-left group">
            <div className="p-2 rounded-sm bg-[#14301f]"><IconUserPlus size={16} className="text-[#4ade80]" /></div>
            <div>
              <p className="text-[13px] font-medium text-content-primary group-hover:text-[#4ade80] transition-colors">Add New User</p>
              <p className="text-[11px] text-content-hint">Create account</p>
            </div>
          </button>
          <button onClick={() => setModal('category')} id="qa-category"
            className="flex items-center gap-3 p-3 rounded-sm border border-border hover:border-[#2d2010] hover:bg-[#2d2010]/20 transition-all text-left group">
            <div className="p-2 rounded-sm bg-[#2d2010]"><IconTag size={16} className="text-[#fbbf24]" /></div>
            <div>
              <p className="text-[13px] font-medium text-content-primary group-hover:text-[#fbbf24] transition-colors">Add Category</p>
              <p className="text-[11px] text-content-hint">New service type</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
