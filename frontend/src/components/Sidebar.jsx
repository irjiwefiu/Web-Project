import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  IconLayoutDashboard, IconUsers, IconBriefcase, IconStar, IconCoin,
  IconFileAnalytics, IconSettings, IconAlertTriangle, IconPlus,
  IconMessageCircle, IconMapPin, IconHeart, IconCalendar,
  IconFileInvoice, IconUser, IconCompass
} from '@tabler/icons-react'

const NAV_CONFIG = {
  admin: [
    {
      label: 'Overview',
      items: [
        { icon: IconLayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
        { icon: IconUsers, label: 'Users', path: '/admin/users' },
        { icon: IconBriefcase, label: 'Jobs', path: '/admin/requests' },
        { icon: IconStar, label: 'Reviews', path: '/admin/reviews' },
      ],
    },
    {
      label: 'System',
      items: [
        { icon: IconAlertTriangle, label: 'Alerts', path: '/admin/alerts' },
      ],
    },
  ],
  customer: [
    {
      label: 'Menu',
      items: [
        { icon: IconLayoutDashboard, label: 'Dashboard', path: '/dashboard/customer' },
        { icon: IconPlus, label: 'Post a job', path: '/customer/requests' },
        { icon: IconBriefcase, label: 'My jobs', path: '/customer/jobs' },
        { icon: IconMessageCircle, label: 'Messages', path: '/customer/messages' },
        { icon: IconMapPin, label: 'Track technician', path: '/customer/track' },
      ],
    },
    {
      label: 'Account',
      items: [
        { icon: IconCoin, label: 'Payments', path: '/customer/payments' },
        { icon: IconStar, label: 'Reviews', path: '/customer/reviews' },
        { icon: IconHeart, label: 'Saved techs', path: '/customer/technicians' },
        { icon: IconSettings, label: 'Settings', path: '/customer/settings' },
      ],
    },
  ],
  technician: [
    {
      label: 'Work',
      items: [
        { icon: IconLayoutDashboard, label: 'Dashboard', path: '/dashboard/technician' },
      ],
    },
    {
      label: 'Profile',
      items: [
        { icon: IconUser, label: 'My profile', path: '/profile' },
      ],
    },
  ],
}

// Active nav accent per role
const ACTIVE_STYLES = {
  admin: 'bg-[#1e2d4a] text-[#7eb8f7]',
  customer: 'bg-[#1e2d4a] text-[#7eb8f7]',
  technician: 'bg-[#2d2010] text-[#fbbf24]',
}

export default function Sidebar({ role }) {
  const location = useLocation()
  const groups = NAV_CONFIG[role] || []
  const activeStyle = ACTIVE_STYLES[role] || ACTIVE_STYLES.admin

  return (
    <aside className="w-[170px] bg-page border-r border-border flex flex-col py-6 px-3 shrink-0 overflow-y-auto hidden md:flex">
      {groups.map((group, gi) => (
        <div key={gi} className={gi < groups.length - 1 ? 'mb-6' : ''}>
          <p className="section-label">{group.label}</p>
          {group.items.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-sm cursor-pointer mb-0.5 transition-colors ${
                  isActive
                    ? activeStyle
                    : 'text-content-muted hover:text-content-primary hover:bg-surface'
                }`}
                id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <Icon size={18} stroke={isActive ? 2 : 1.5} />
                <span className="text-[13px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </aside>
  )
}
