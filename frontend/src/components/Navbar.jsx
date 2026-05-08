import React from 'react'
import { FiMenu, FiLogOut, FiUser, FiBell } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { toggleSidebar } from '../store/slices/uiSlice'

export default function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 border-l pl-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            title="Logout"
          >
            <FiLogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}
