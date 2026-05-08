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
        { icon: FiClipboard,   label: 'My Jobs',     path: '/profile' },
        { icon: FiTrendingUp,  label: 'Performance', path: '/profile' },
        { icon: FiUser,        label: 'My Profile',  path: '/profile' },
      ]
    }

    return [{ icon: FiHome, label: 'Dashboard', path: '/' }]
  }

  const menuItems = getMenuItems()

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } overflow-y-auto flex-shrink-0`}
    >
      {/* Brand */}
      {isSidebarOpen && (
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {role === 'admin' ? 'Admin Panel' : role === 'customer' ? 'Customer Portal' : 'Technician Portal'}
          </p>
        </div>
      )}

      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={`${item.label}-${item.path}`}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : ''}`} />
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
