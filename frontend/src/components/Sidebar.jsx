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
import { useUIStore } from '../store'

export default function Sidebar({ role }) {
  const location = useLocation()
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen)

  const getMenuItems = () => {
    const commonItems = [
      { icon: FiHome, label: 'Dashboard', path: `/dashboard/${role}` },
    ]

    if (role === 'admin') {
      return [
        ...commonItems,
        { icon: FiClipboard, label: 'All Requests', path: '/admin/requests' },
        { icon: FiUsers, label: 'Users', path: '/admin/users' },
        { icon: FiGift, label: 'Technicians', path: '/admin/technicians' },
        { icon: FiCheckCircle, label: 'Assignments', path: '/admin/assignments' },
        { icon: FiSettings, label: 'Categories', path: '/admin/categories' },
      ]
    } else if (role === 'customer') {
      return [
        ...commonItems,
        { icon: FiClipboard, label: 'My Requests', path: '/customer/requests' },
        { icon: FiStar, label: 'My Reviews', path: '/customer/reviews' },
        { icon: FiGift, label: 'Find Technicians', path: '/customer/technicians' },
      ]
    } else if (role === 'technician') {
      return [
        ...commonItems,
        { icon: FiCheckCircle, label: 'My Assignments', path: '/technician/assignments' },
        { icon: FiStar, label: 'My Reviews', path: '/technician/reviews' },
        { icon: FiSettings, label: 'My Profile', path: '/technician/profile' },
      ]
    }

    return commonItems
  }

  const menuItems = getMenuItems()

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-gray-200 transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } overflow-y-auto`}
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
