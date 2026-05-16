import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiClipboard,
  FiUsers,
  FiSettings,
  FiTrendingUp,
  FiGift,
  FiTag,
  FiTool,
  FiUser,
  FiBarChart2,
} from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function Sidebar({ role }) {
  const location = useLocation()
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen)

  const getMenuItems = () => {
    if (role === 'admin') {
      return [
        { icon: FiHome,     label: 'Dashboard',       path: '/dashboard/admin' },
        { icon: FiClipboard,label: 'All Requests',     path: '/admin/requests' },
        { icon: FiUsers,    label: 'Users',            path: '/admin/users' },
        { icon: FiTool,     label: 'Technicians',      path: '/admin/technicians' },
        { icon: FiTag,      label: 'Categories',       path: '/admin/categories' },
        { icon: FiUser,     label: 'My Profile',       path: '/profile' },
      ]
    }

    if (role === 'customer') {
      return [
        { icon: FiHome,       label: 'Dashboard',         path: '/dashboard/customer' },
        { icon: FiClipboard,  label: 'My Requests',       path: '/customer/requests' },
        { icon: FiGift,       label: 'Find Technicians',  path: '/customer/technicians' },
        { icon: FiUser,       label: 'My Profile',        path: '/profile' },
      ]
    }

    if (role === 'technician') {
      return [
        { icon: FiHome,        label: 'Dashboard',   path: '/dashboard/technician' },
        { icon: FiBarChart2,   label: 'Performance', path: '/dashboard/technician/performance' },
        { icon: FiUser,        label: 'My Profile',  path: '/profile' },
      ]
    }

    return [{ icon: FiHome, label: 'Dashboard', path: '/' }]
  }

  const menuItems = getMenuItems()

  return (
    <aside
      className={`h-full bg-surface border-r border-border transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } overflow-y-auto flex-shrink-0`}
    >
      {/* Brand */}
      {isSidebarOpen && (
        <div className="px-6 py-5 border-b border-border">
          <p className="text-xs font-semibold text-content-muted uppercase tracking-widest">
            {role === 'admin' ? 'Admin Panel' : role === 'customer' ? 'Customer Portal' : 'Technician Portal'}
          </p>
        </div>
      )}

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          // Exact match OR path starts with item path + '/' but NOT when a sibling path also matches
          const exactMatch = location.pathname === item.path
          const prefixMatch = location.pathname.startsWith(item.path + '/')
          // For Dashboard, only highlight on exact match (not when on sub-routes like /performance)
          const isDashboard = item.path.endsWith('/technician') || item.path.endsWith('/customer') || item.path.endsWith('/admin')
          const isActive = isDashboard ? exactMatch : (exactMatch || prefixMatch)

          return (
            <Link
              key={`${item.label}-${item.path}`}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                isActive
                  ? 'bg-[#1e2d4a] text-[#7eb8f7] shadow-sm'
                  : 'text-content-body hover:bg-surface-inner hover:text-content-primary'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#7eb8f7]' : ''}`} />
              {isSidebarOpen && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
