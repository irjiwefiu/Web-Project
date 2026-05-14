import React, { useState, useEffect } from 'react'
import {
  IconArrowUpRight, IconStar, IconCheck, IconBolt, IconCoin,
  IconClipboard
} from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI } from '../services/api'

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

// ── Demo data (used to supplement API data for rich UI) ──
const DEMO_ACTIVE_JOBS = [
  { title: 'AC service', tech: 'Usman T.', time: 'Today 2:00 PM', status: 'In progress', statusType: 'info' },
  { title: 'Plumbing leak', sub: 'Awaiting assignment', status: 'Pending', statusType: 'warning' },
  { title: 'Painting - bedroom', tech: 'Hina B.', time: 'Yesterday', status: 'Completed', statusType: 'success' },
]

const DEMO_FAV_TECHS = [
  { name: 'Usman T.', initials: 'UT', spec: 'AC & Refrigeration', rating: 4.9, color: 'text-[#7eb8f7]', bg: 'bg-[#1e2d4a]' },
  { name: 'Raza A.', initials: 'RA', spec: 'Electrician', rating: 4.7, color: 'text-[#4ade80]', bg: 'bg-[#14301f]' },
  { name: 'Hina B.', initials: 'HB', spec: 'Painting', rating: 4.8, color: 'text-[#fbbf24]', bg: 'bg-[#2d2010]' },
]

const DEMO_JOB_CATS = [
  { name: 'AC & Cooling', jobs: 9, color: 'bg-[#378ADD]', width: '80%' },
  { name: 'Plumbing', jobs: 7, color: 'bg-[#4ade80]', width: '60%' },
  { name: 'Electrical', jobs: 5, color: 'bg-[#fbbf24]', width: '40%' },
  { name: 'Painting', jobs: 3, color: 'bg-[#8b5cf6]', width: '25%' },
]

const DEMO_ACTIVITY = [
  { icon: IconCheck, text: 'Painting job completed by Hina B.', time: '2h ago', color: 'text-[#4ade80]' },
  { icon: IconBolt, text: 'Usman T. accepted your AC service request', time: '5h ago', color: 'text-[#7eb8f7]' },
  { icon: IconCoin, text: 'Payment of $120 processed for painting job', time: 'Yesterday', color: 'text-[#fbbf24]' },
  { icon: IconStar, text: 'You rated Raza A. 5 stars for electrical work', time: '2 days ago', color: 'text-[#fbbf24]' },
]

const SPENDING_DATA = [
  { month: 'Dec', height: '40%' },
  { month: 'Jan', height: '30%' },
  { month: 'Feb', height: '60%' },
  { month: 'Mar', height: '45%' },
  { month: 'Apr', height: '80%' },
  { month: 'May', height: '65%', current: true },
]

// ── Booking Modal ──
function BookingModal({ tech, onClose }) {
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-md border border-border shadow-2xl w-full max-w-sm mx-4 animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-[15px] font-bold text-content-primary">Book {tech.name}</h2>
          <button onClick={onClose} className="text-content-muted hover:text-content-primary text-[18px]">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">Preferred Date</label>
            <input type="date" className="input w-full" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">Description</label>
            <textarea className="input w-full h-20 resize-none" placeholder="Describe the job..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="btn btn-outline">Cancel</button>
            <button className="btn btn-primary" onClick={onClose}>Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CustomerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingTech, setBookingTech] = useState(null)
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => { fetchDashboard() }, [])

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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" />
      </div>
    )
  }

  const summary = data?.summary || {}
  const apiJobs = data?.recentRequests || []

  // Map API jobs to display format, fall back to demo data
  const STATUS_MAP = {
    pending: { label: 'Pending', type: 'warning' },
    requested: { label: 'Pending', type: 'warning' },
    in_progress: { label: 'In progress', type: 'info' },
    completed: { label: 'Completed', type: 'success' },
    cancelled: { label: 'Cancelled', type: 'danger' },
  }

  const activeJobs = apiJobs.length > 0
    ? apiJobs.slice(0, 3).map(j => ({
        title: j.title || 'Service Request',
        tech: j.customer?.name,
        time: j.preferred_time ? new Date(j.preferred_time).toLocaleDateString() : '',
        sub: !j.customer?.name ? 'Awaiting assignment' : undefined,
        status: STATUS_MAP[j.status]?.label || 'Pending',
        statusType: STATUS_MAP[j.status]?.type || 'warning',
      }))
    : DEMO_ACTIVE_JOBS

  const displayName = user?.name?.split(' ')[0] || 'Sara'

  // Get time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Booking Modal */}
      {bookingTech && <BookingModal tech={bookingTech} onClose={() => setBookingTech(null)} />}

      {/* Greeting */}
      <h2 className="text-[20px] font-semibold text-content-primary flex items-center gap-2">
        {greeting}, {displayName} <span className="text-[24px]">👋</span>
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Total jobs posted</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">{summary.total || 24}</p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
            <IconArrowUpRight size={14} /> +3 this month
          </div>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Active jobs</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">{summary.active || 2}</p>
          <p className="text-[11px] font-medium text-[#7eb8f7]">In progress</p>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Total spent</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">$1,840</p>
          <p className="text-[11px] font-medium text-content-muted">Lifetime</p>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Avg. rating given</p>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-content-primary text-[22px] font-semibold leading-tight">4.6</p>
            <IconStar size={18} className="text-[#fbbf24] fill-[#fbbf24]" />
          </div>
          <p className="text-[11px] font-medium text-content-muted">Across {summary.completed || 20} jobs</p>
        </div>
      </div>

      {/* Two Column Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-content-primary font-semibold text-[15px]">Active jobs</h3>
            <button onClick={() => navigate('/customer/requests')} className="text-[13px] text-content-hint hover:text-content-muted transition-colors" id="view-all-jobs">
              View all
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {activeJobs.map((job, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                <div className="flex flex-col gap-1">
                  <span className="text-content-primary text-[13px] font-medium">{job.title}</span>
                  <span className="text-content-muted text-[11px]">
                    {job.tech ? `${job.tech} · ${job.time}` : job.sub}
                  </span>
                </div>
                <Badge text={job.status} type={job.statusType} />
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Spending Chart */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-1">Monthly spending</h3>
          <p className="text-content-muted text-[11px] mb-4">Last 6 months (USD)</p>
          <div className="flex items-end justify-between h-[120px] pt-4 border-b border-surface-inner pb-2">
            {SPENDING_DATA.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div
                  className={`w-8 rounded-t-sm transition-all duration-300 ${bar.current ? 'bg-[#378ADD]' : 'bg-[#1e2d4a]'}`}
                  style={{ height: bar.height }}
                ></div>
                <span className={`text-[11px] ${bar.current ? 'text-[#378ADD] font-semibold' : 'text-content-muted'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Favourite Technicians */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Favourite technicians</h3>
          <div className="flex flex-col gap-3">
            {DEMO_FAV_TECHS.map((tech, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${tech.bg} ${tech.color}`}>
                    {tech.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-content-primary text-[13px] font-medium">{tech.name}</span>
                    <span className="text-content-muted text-[11px] flex items-center gap-1">
                      {tech.spec} · <IconStar size={10} className="text-[#fbbf24] fill-[#fbbf24]" /> {tech.rating}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setBookingTech(tech)}
                  className="text-[13px] text-content-hint hover:text-[#7eb8f7] font-medium transition-colors cursor-pointer"
                  id={`book-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Job Categories Used */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Job categories used</h3>
          <div className="flex flex-col gap-4">
            {DEMO_JOB_CATS.map((cat, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-content-primary">{cat.name}</span>
                  <span className="text-content-muted">{cat.jobs} jobs</span>
                </div>
                <div className="h-1 bg-surface-inner rounded-full overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full transition-all duration-500`} style={{ width: cat.width }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Activity */}
      <div className="card">
        <h3 className="text-content-primary font-semibold text-[15px] mb-4">Recent activity</h3>
        <div className="flex flex-col gap-4">
          {DEMO_ACTIVITY.map((act, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <act.icon size={16} className={act.color} />
                <span className="text-content-primary text-[13px]">{act.text}</span>
              </div>
              <span className="text-content-hint text-[11px] shrink-0 ml-4">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
