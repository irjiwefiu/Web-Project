import React, { useState, useEffect } from 'react'
import { FiUser, FiMail, FiMapPin, FiSave } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { userAPI } from '../services/api'

export default function UserProfile() {
  const user = useSelector((state) => state.auth.user)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await userAPI.getProfile()
      setProfile(response.data)
    } catch (error) {
      console.error('Failed to load profile:', error)
      setProfile(user)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await userAPI.updateProfile(profile)
      setMessage('Profile updated successfully!')
    } catch (error) {
      setMessage('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          <div className="flex items-center gap-6 mb-8">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
              alt={user?.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text" id="profile-name" className="input pl-10"
                  value={profile?.name || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email" id="profile-email" className="input pl-10"
                  value={profile?.email || ''} disabled
                />
              </div>
            </div>

            {message && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}

            <button type="submit" id="profile-save" disabled={saving}
              className="btn-primary flex items-center gap-2">
              <FiSave className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
