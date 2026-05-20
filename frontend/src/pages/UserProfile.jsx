import React, { useState, useEffect } from 'react'
import { FiSave, FiUser, FiMapPin, FiFileText, FiLoader } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { userAPI, technicianAPI } from '../services/api'

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'}`}>
      {message}
    </div>
  )
}

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth)
  const isTechnician = user?.role === 'technician'

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    skills: '',
    bio: '',
    service_area: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      if (isTechnician) {
        const [userRes, techRes] = await Promise.all([
          userAPI.getProfile().catch(() => ({ data: {} })),
          technicianAPI.getProfile().catch(() => ({ data: {} })),
        ])
        const userData = userRes.data || {}
        const techData = techRes.data || {}

        setProfile({
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          skills: Array.isArray(techData.skills) ? techData.skills.join(', ') : (techData.skills || ''),
          bio: techData.bio || '',
          service_area: techData.service_area || techData.serviceArea || '',
        })
      } else {
        const response = await userAPI.getProfile()
        const data = response.data || {}
        setProfile({
          name: data.name || user?.name || '',
          email: data.email || user?.email || '',
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userAPI.updateProfile({
        name: profile.name,
        email: profile.email,
      })

      if (isTechnician) {
        const techPayload = {}
        if (profile.skills !== undefined) {
          techPayload.skills = profile.skills
            ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
            : []
        }
        if (profile.bio !== undefined) techPayload.bio = profile.bio
        if (profile.service_area !== undefined) techPayload.service_area = profile.service_area

        await technicianAPI.updateProfile(techPayload)
      }

      showToast('Profile updated successfully!')
    } catch (error) {
      showToast('Failed to update profile: ' + (error.message || 'Unknown error'), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-[#7eb8f7] mx-auto mb-4" />
          <p className="text-content-body">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-content-primary">My Profile</h1>
        <p className="text-content-body mt-2">
          {isTechnician ? 'Manage your personal and professional details' : 'Manage your personal information'}
        </p>
      </div>

      <form onSubmit={handleSave} className="card space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-content-primary mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-[#7eb8f7]" /> Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input"
                value={profile.name}
                onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={profile.email}
                onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        {isTechnician && (
          <>
            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-content-primary mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-[#7eb8f7]" /> Service Location & Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Service Area / Location</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Islamabad, Rawalpindi"
                    value={profile.service_area}
                    onChange={(e) => setProfile((prev) => ({ ...prev, service_area: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label">Skills (comma-separated)</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Plumbing, Electrical, AC Repair"
                    value={profile.skills}
                    onChange={(e) => setProfile((prev) => ({ ...prev, skills: e.target.value }))}
                  />
                  {profile.skills && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                        <span key={i} className="badge badge-info">{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-content-primary mb-4 flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-[#7eb8f7]" /> Bio
              </h3>
              <textarea
                className="input"
                rows="4"
                placeholder="Tell customers about yourself, your experience, and what services you specialize in..."
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </>
        )}

        <div className="border-t border-border pt-6 flex justify-end">
          <button
            type="submit"
            className="btn-accent flex items-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
