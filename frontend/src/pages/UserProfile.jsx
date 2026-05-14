import React from 'react'
import { IconBolt, IconUser, IconSettings } from '@tabler/icons-react'
import { useSelector } from 'react-redux'

export default function UserProfile() {
  const user = useSelector((state) => state.auth.user)

  if (!user) return null

  const role = user.role || 'customer'
  const avatarStyles = {
    admin: 'bg-[#1e2d4a] text-[#7eb8f7]',
    customer: 'bg-[#14301f] text-[#4ade80]',
    technician: 'bg-[#2d2010] text-[#fbbf24]',
  }

  const getInitials = () => {
    if (!user.name) return 'U'
    const parts = user.name.split(' ')
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase()
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Profile Header */}
      <div className="card flex items-center gap-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-[22px] font-bold ${avatarStyles[role]}`}>
          {getInitials()}
        </div>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold text-content-primary">{user.name || 'User'}</h1>
          <p className="text-content-muted text-[13px] mt-1">{user.email}</p>
          <p className="text-content-hint text-[11px] mt-1 uppercase tracking-wider">{role}</p>
        </div>
        <button className="btn btn-outline">
          <IconSettings size={16} /> Edit Profile
        </button>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Account Information</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-content-muted text-[13px]">Username</span>
              <span className="text-content-primary text-[13px] font-medium">{user.username || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-content-muted text-[13px]">Email</span>
              <span className="text-content-primary text-[13px] font-medium">{user.email || '—'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-content-muted text-[13px]">Role</span>
              <span className="text-content-primary text-[13px] font-medium capitalize">{role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-content-muted text-[13px]">Member since</span>
              <span className="text-content-primary text-[13px] font-medium">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-content-primary font-semibold text-[15px] mb-4">Security</h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-content-muted text-[13px] mb-2">Password</p>
              <button className="btn btn-outline text-[12px] py-1.5">Change Password</button>
            </div>
            <div>
              <p className="text-content-muted text-[13px] mb-2">Two-factor authentication</p>
              <p className="text-content-hint text-[11px]">Not enabled</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
