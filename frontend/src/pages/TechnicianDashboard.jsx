import React, { useState, useEffect } from 'react'
import {
  IconArrowUpRight, IconStar, IconCheck, IconX
} from '@tabler/icons-react'
import { useSelector } from 'react-redux'
import { dashboardAPI, requestAPI, assignmentAPI, statusAPI } from '../services/api'

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

// ── Demo data ──
const DEMO_INCOMING = [
  { id: 1, title: 'AC service', customer: 'Sara M.', time: 'Today 2:00 PM', loc: 'Rawalpindi', price: '$85' },
  { id: 2, title: 'Refrigerator fix', customer: 'Omar R.', time: 'Tomorrow 10:00 AM', loc: 'Islamabad', price: '$110' },
]

const DEMO_SCHEDULE = [
  { time: '9:00 AM', title: 'Electrical check', customer: 'Hina B.', loc: 'Block A, Rawalpindi', status: 'Done', statusType: 'success' },
  { time: '2:00 PM', title: 'AC service', customer: 'Sara M.', loc: 'G-11, Islamabad', status: 'Now', statusType: 'success', active: true },
  { time: '5:00 PM', title: 'Plumbing', customer: 'Ali K.', loc: 'F-8, Islamabad', status: 'Upcoming', statusType: 'info' },
]

const DEMO_REVIEWS = [
  { initials: 'SM', customer: 'Sara M.', rating: 5, text: 'Very professional and fast service.', bg: 'bg-[#1e2d4a]', color: 'text-[#7eb8f7]' },
  { initials: 'OR', customer: 'Omar R.', rating: 4, text: 'Fixed the AC quickly, good work.', bg: 'bg-[#14301f]', color: 'text-[#4ade80]' },
]

const DEMO_SKILLS = [
  { name: 'AC & Cooling', jobs: 38, rating: 4.9, width: '85%', color: 'bg-[#fbbf24]' },
  { name: 'Refrigerator repair', jobs: 12, rating: 4.8, width: '60%', color: 'bg-[#fbbf24]' },
  { name: 'Electrical basics', jobs: 6, rating: 4.6, width: '30%', color: 'bg-[#8b5cf6]' },
]

const EARNINGS_DATA = [
  { month: 'Dec', height: '30%' },
  { month: 'Jan', height: '40%' },
  { month: 'Feb', height: '35%' },
  { month: 'Mar', height: '50%' },
  { month: 'Apr', height: '60%' },
  { month: 'May', height: '80%', current: true },
]

export default function TechnicianDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [incomingRequests, setIncomingRequests] = useState([])
  const user = useSelector((state) => state.auth.user)

  useEffect(() => { 
    fetchDashboard()
    fetchIncoming()
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

  const fetchIncoming = async () => {
    try {
      const response = await requestAPI.getAvailable()
      setIncomingRequests(response.data || [])
    } catch (error) {
      console.error('Failed to fetch available requests:', error)
    }
  }

  const handleAccept = async (id) => {
    try {
      await assignmentAPI.apply({ request_id: id })
      setIncomingRequests(prev => prev.filter(r => r.id !== id))
      fetchDashboard() // Refresh schedule
      alert('Application submitted successfully!')
    } catch (error) {
      console.error('Failed to accept request:', error)
      alert(error.message || 'Failed to apply for request')
    }
  }

  const handleDecline = (id) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== id))
  }

  const handleComplete = async (requestId) => {
    try {
      await statusAPI.update(requestId, { status: 'completed', description: 'Marked complete by technician' })
      fetchDashboard()
    } catch (error) {
      console.error('Failed to complete request:', error)
      alert('Failed to complete job')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-[#fbbf24] border-t-transparent rounded-full" />
      </div>
    )
  }

  const summary = data?.summary || {}
  const displayName = user?.name?.split(' ')[0] || 'Usman'
  const newRequestCount = incomingRequests.length

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Greeting */}
      <h2 className="text-[20px] font-semibold text-content-primary flex items-center gap-2">
        Hey {displayName}, you have <span className="text-[#fbbf24]">{newRequestCount} new request{newRequestCount !== 1 ? 's' : ''}</span> today
      </h2>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Jobs this month</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">{summary.total || 18}</p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
            <IconArrowUpRight size={14} /> +4 vs last month
          </div>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Monthly earnings</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">$1,240</p>
          <div className="flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
            <IconArrowUpRight size={14} /> +11%
          </div>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Avg. rating</p>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-content-primary text-[22px] font-semibold leading-tight">{summary.rating || 4.9}</p>
            <IconStar size={18} className="text-[#fbbf24] fill-[#fbbf24]" />
          </div>
          <p className="text-[11px] font-medium text-content-muted">{summary.completed || 42} reviews</p>
        </div>
        <div className="card flex flex-col justify-between min-h-[110px]">
          <p className="text-content-muted text-[13px] mb-2">Completion rate</p>
          <p className="text-content-primary text-[22px] font-semibold leading-tight mb-3">97%</p>
          <p className="text-[11px] font-medium text-[#4ade80]">Top 5%</p>
        </div>
      </div>

      {/* Two Column Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Incoming Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-content-primary font-semibold text-[15px]">Incoming requests</h3>
            <Badge text={`${newRequestCount} new`} type="warning" />
          </div>
          <div className="flex flex-col gap-4">
            {incomingRequests.length > 0 ? incomingRequests.map((req) => (
              <div key={req.id} className="flex flex-col py-3 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-content-primary text-[13px] font-medium">
                      {req.title} <span className="text-content-muted font-normal">— {req.customer?.name || req.customerName || 'Customer'}</span>
                    </span>
                    <span className="text-content-muted text-[11px]">
                      {new Date(req.created_at || Date.now()).toLocaleDateString()} · {req.location}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 py-1.5 border border-[#14301f] text-[#4ade80] hover:bg-[#14301f] text-[12px] font-medium rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                    id={`accept-${req.id}`}
                  >
                    <IconCheck size={14} /> Accept
                  </button>
                  <button
                    onClick={() => handleDecline(req.id)}
                    className="flex-1 py-1.5 border border-[#2d1010] text-[#f87171] hover:bg-[#2d1010] text-[12px] font-medium rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1"
                    id={`decline-${req.id}`}
                  >
                    <IconX size={14} /> Decline
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-content-muted text-[13px] text-center py-4">No incoming requests</p>
            )}
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-1">Earnings — last 6 months</h3>
          <p className="text-content-muted text-[11px] mb-4">USD · monthly total</p>
          <div className="flex items-end justify-between h-[120px] pt-4 border-b border-surface-inner pb-2">
            {EARNINGS_DATA.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full px-2">
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${bar.current ? 'bg-[#BA7517]' : 'bg-[#2d2010]'}`}
                  style={{ height: bar.height }}
                ></div>
                <span className={`text-[11px] ${bar.current ? 'text-[#fbbf24] font-semibold' : 'text-content-muted'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Today's schedule</h3>
          <div className="flex flex-col gap-2">
            {data?.upcomingAssignments && data.upcomingAssignments.length > 0 ? data.upcomingAssignments.map((sch, i) => (
              <div key={i} className={`flex items-start gap-4 py-3 pl-3 pr-4 rounded-sm relative bg-surface`}>
                <div className="w-16 text-[11px] text-content-hint pt-0.5 shrink-0">
                  {new Date(sch.request?.created_at).toLocaleDateString()}
                </div>
                <div className="flex-1 flex flex-col gap-0.5">
                  <span className="text-content-primary text-[13px] font-medium">
                    {sch.request?.title} <span className="text-content-muted font-normal">— {sch.request?.customer?.name || 'Customer'}</span>
                  </span>
                  <span className="text-content-muted text-[11px]">{sch.request?.location}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge text={sch.request?.status === 'in_progress' ? 'In Progress' : 'Pending'} type="info" />
                  <button onClick={() => handleComplete(sch.request.id)} className="text-[10px] bg-[#14301f] text-[#4ade80] px-2 py-0.5 rounded-sm hover:bg-[#1a3f28]">
                    Complete
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-content-muted text-[13px] text-center py-4">No active jobs</p>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Recent reviews</h3>
          <div className="flex flex-col gap-4">
            {DEMO_REVIEWS.map((rev, i) => (
              <div key={i} className="flex flex-col gap-2 pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${rev.bg} ${rev.color}`}>
                      {rev.initials}
                    </div>
                    <span className="text-content-primary text-[13px] font-medium">{rev.customer}</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <IconStar key={star} size={12} className={star <= rev.rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-border fill-border'} />
                    ))}
                  </div>
                </div>
                <p className="text-content-muted text-[12px] pl-11">"{rev.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Width Skills */}
      <div className="card">
        <h3 className="text-content-primary font-semibold text-[15px] mb-4">Skill performance</h3>
        <div className="flex flex-col gap-4">
          {DEMO_SKILLS.map((skill, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-content-primary">{skill.name}</span>
                <span className="text-content-muted flex items-center gap-1">
                  {skill.jobs} jobs · {skill.rating} <IconStar size={10} className="text-[#fbbf24] fill-[#fbbf24]" />
                </span>
              </div>
              <div className="h-1 bg-surface-inner rounded-full overflow-hidden">
                <div className={`h-full ${skill.color} rounded-full transition-all duration-500`} style={{ width: skill.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
