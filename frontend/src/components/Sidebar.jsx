import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiClipboard,
  FiUsers,
  FiStar,
  FiSettings,
  FiTrendingUp,
  FiGift,
  FiCheckCircle,
} from 'react-icons/fi'
import { useSelector } from 'react-redux'

export default function Sidebar({ role }) {
  const location = useLocation()
  const isSidebarOpen = useSelector((state) => state.ui.isSidebarOpen)

  const getMenuItems = () => {
    const commonItems = [
      { icon: FiHome, label: 'Dashboard', path: `/dashboard/${role}` },
    ]

    if (role === 'admin') {
      return [
        ...commonItems,
        { icon: FiClipboard, label: 'All Requests', path: '/admin/requests' },
        { icon: FiUsers, label: 'Users', path: '/admin/users' },
      ]
    } else if (role === 'customer') {
      return [
        ...commonItems,
        { icon: FiClipboard, label: 'My Requests', path: '/customer/requests' },
        { icon: FiGift, label: 'Find Technicians', path: '/customer/technicians' },
      ]
    } else if (role === 'technician') {
      return [
        ...commonItems,
        { icon: FiSettings, label: 'My Profile', path: '/profile' },
      ]
    }

    return commonItems
  }

  const menuItems = getMenuItems()

  return (
    <aside
      className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } overflow-y-auto flex-shrink-0`}
    >
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
