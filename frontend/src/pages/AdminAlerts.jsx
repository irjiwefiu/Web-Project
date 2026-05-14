import React, { useState } from 'react'
import { IconAlertTriangle, IconCheck, IconTrash, IconInfoCircle } from '@tabler/icons-react'

const INITIAL_ALERTS = [
  { id: 1, type: 'critical', title: 'Database connection spike', message: 'Database connections exceeded 80% capacity for 5 minutes.', time: '10 minutes ago', resolved: false },
  { id: 2, type: 'warning', title: 'High technician unavailability', message: 'Less than 10% of HVAC technicians are currently available in Area Code 90210.', time: '1 hour ago', resolved: false },
  { id: 3, type: 'info', title: 'New app version deployed', message: 'Frontend v1.2.4 successfully deployed to production.', time: '3 hours ago', resolved: true },
  { id: 4, type: 'warning', title: 'Payment gateway latency', message: 'Stripe API is taking >2000ms to respond for capture requests.', time: '5 hours ago', resolved: false },
]

const TYPE_STYLES = {
  critical: { icon: IconAlertTriangle, color: 'text-[#f87171]', bg: 'bg-[#2d1010]', border: 'border-[#4a1c1c]' },
  warning: { icon: IconAlertTriangle, color: 'text-[#fbbf24]', bg: 'bg-[#2d2010]', border: 'border-[#4a351c]' },
  info: { icon: IconInfoCircle, color: 'text-[#7eb8f7]', bg: 'bg-[#0e2040]', border: 'border-[#1c355d]' },
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)

  const handleResolve = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, resolved: true } : a))
  }

  const handleDelete = (id) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const unreadCount = alerts.filter(a => !a.resolved).length

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-content-primary">System Alerts</h1>
          <p className="text-content-muted text-[13px] mt-1">Monitor platform health and automated warnings</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1.5 rounded-sm bg-[#2d1010] text-[#f87171] text-[12px] font-bold uppercase tracking-wider">
            {unreadCount} Unresolved
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {alerts.length === 0 ? (
          <div className="card text-center py-12">
            <IconCheck size={40} className="text-[#4ade80] mx-auto mb-4" />
            <p className="text-content-primary font-medium">All clear!</p>
            <p className="text-content-muted text-[13px] mt-1">There are no active system alerts.</p>
          </div>
        ) : (
          alerts.map(alert => {
            const style = TYPE_STYLES[alert.type] || TYPE_STYLES.info
            const Icon = style.icon
            
            return (
              <div key={alert.id} className={`card border-l-4 ${alert.resolved ? 'opacity-60 border-l-surface-inner' : style.border}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${alert.resolved ? 'bg-surface-inner text-content-muted' : `${style.bg} ${style.color}`}`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
                      <h3 className={`text-[14px] font-bold ${alert.resolved ? 'text-content-muted' : 'text-content-primary'}`}>
                        {alert.title}
                      </h3>
                      <span className="text-content-hint text-[11px] whitespace-nowrap">{alert.time}</span>
                    </div>
                    <p className="text-content-muted text-[13px]">{alert.message}</p>
                  </div>
                  
                  <div className="flex gap-2 shrink-0 ml-4">
                    {!alert.resolved && (
                      <button onClick={() => handleResolve(alert.id)} className="p-2 rounded-sm bg-surface-inner hover:bg-[#14301f] text-content-muted hover:text-[#4ade80] transition-colors" title="Mark as resolved">
                        <IconCheck size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(alert.id)} className="p-2 rounded-sm bg-surface-inner hover:bg-[#2d1010] text-content-muted hover:text-[#f87171] transition-colors" title="Delete alert">
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
