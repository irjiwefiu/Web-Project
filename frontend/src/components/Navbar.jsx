import React, { useState } from 'react'
import { IconBolt, IconBell, IconLogout } from '@tabler/icons-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { technicianAPI } from '../services/api'

export default function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [online, setOnline] = useState(true)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleToggleOnline = async () => {
    const newStatus = !online
    setOnline(newStatus)
    try {
      await technicianAPI.updateAvailability({
        availability_status: newStatus ? 'available' : 'offline'
      })
    } catch (err) {
      console.error('Failed to update availability:', err)
    }
  }

  const role = user?.role || 'customer'
  const isTechnician = role === 'technician'

  // Role-specific avatar colors
  const avatarStyles = {
    admin: 'bg-[#1e2d4a] text-[#7eb8f7]',
    customer: 'bg-[#14301f] text-[#4ade80]',
    technician: 'bg-[#2d2010] text-[#fbbf24]',
  }

  // Avatar initials
  const getInitials = () => {
    if (role === 'admin') return 'AD'
    if (!user?.name) return 'U'
    const parts = user.name.split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }

  // Display name
  const displayName = role === 'admin' ? 'Admin' : user?.name || 'User'
  const subtitle = isTechnician ? 'AC & Cooling' : role

  return (
    <header className="h-[60px] bg-page border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
      {/* Left — Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/dashboard/${role}`)}>
        <IconBolt
          className={`w-6 h-6 ${isTechnician ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-[#7eb8f7] fill-[#7eb8f7]'}`}
        />
        <span className="font-bold text-[18px] tracking-wide text-content-primary">FixrPro</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Online/Offline Toggle (Technician only) */}
        {isTechnician && (
          <div className="flex items-center gap-2 border border-border rounded-full p-1 pl-3 bg-surface">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${online ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
              {online ? 'Online' : 'Offline'}
            </span>
            <div
              className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${online ? 'bg-[#14301f]' : 'bg-[#2d1010]'}`}
              onClick={handleToggleOnline}
              id="online-toggle"
            >
              <div className={`w-4 h-4 rounded-full transition-all duration-200 ${online ? 'translate-x-5 bg-[#4ade80]' : 'translate-x-0 bg-[#f87171]'}`}></div>
            </div>
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative cursor-pointer" id="notification-bell">
          <IconBell size={20} className="text-content-muted hover:text-content-primary transition-colors" />
          {(role === 'customer' || role === 'admin') && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#f87171] rounded-full border-2 border-page"></div>
          )}
        </div>

        {/* User Info + Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[13px] font-medium leading-none text-content-primary">
              {displayName}
            </span>
            <span className="text-[11px] text-content-muted mt-1 leading-none capitalize">
              {subtitle}
            </span>
          </div>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${avatarStyles[role]}`}>
            {getInitials()}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-content-muted hover:text-[#f87171] rounded-sm transition-colors"
          title="Logout"
          id="logout-btn"
        >
          <IconLogout size={18} />
        </button>
      </div>
    </header>
  )
}
