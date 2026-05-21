import React, { useState } from 'react'
import { FiMail, FiLock, FiUser, FiUserCheck, FiTool, FiArrowRight, FiMapPin, FiFileText, FiX, FiPlus, FiSun, FiMoon } from 'react-icons/fi'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authAPI } from '../services/api'
import { toggleTheme } from '../store/slices/themeSlice'

const SKILL_OPTIONS = [
  'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting',
  'Roofing', 'Landscaping', 'Appliance Repair', 'Pest Control', 'Cleaning',
  'Wiring', 'Lighting', 'Panel Upgrades', 'Drain Repair', 'Fixture Installation',
  'Water Heaters', 'Air Conditioning', 'Heating Systems', 'Ventilation',
  'Furniture Assembly', 'Flooring', 'Cabinets', 'Wallpaper', 'Drywall',
  'Finishing', 'Gutter Installation', 'Leak Repair', 'Inspections',
]

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roleName: 'customer',
    bio: '',
    skills: [],
    service_area: '',
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = (skill) => {
    const trimmed = skill.trim()
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }))
    }
    setSkillInput('')
  }

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(skillInput)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authAPI.register(formData)
      navigate('/login')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const isTechnician = formData.roleName === 'technician'

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="absolute top-4 right-4 p-2.5 rounded-lg shadow-lg transition-all flex items-center gap-2
          bg-[#1e2d4a] text-[#7eb8f7] hover:bg-[#283b61] border border-[#7eb8f7]/30"
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface rounded-md border border-border shadow-2xl p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-colors duration-300 ${
              isTechnician ? 'bg-[#2d2010]' : 'bg-[#1e2d4a]'
            }`}>
              {isTechnician ? (
                <FiTool className="w-8 h-8 text-[#fbbf24]" />
              ) : (
                <FiUserCheck className="w-8 h-8 text-[#7eb8f7]" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-content-primary">Create Account</h1>
            <p className="text-content-body mt-2">
              {isTechnician ? 'Join as a service professional' : 'Join our service platform'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="label">I want to register as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, roleName: 'customer' }))}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold border transition-all duration-200 ${
                    formData.roleName === 'customer'
                      ? 'bg-[#1e2d4a] text-[#7eb8f7] border-[#7eb8f7]/50 shadow-lg shadow-[#7eb8f7]/10'
                      : 'bg-surface-inner text-content-muted border-border hover:border-[#7eb8f7]/30 hover:text-content-body'
                  }`}
                >
                  <FiUser className="w-4 h-4" />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, roleName: 'technician' }))}
                  className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-sm font-semibold border transition-all duration-200 ${
                    formData.roleName === 'technician'
                      ? 'bg-[#2d2010] text-[#fbbf24] border-[#fbbf24]/50 shadow-lg shadow-[#fbbf24]/10'
                      : 'bg-surface-inner text-content-muted border-border hover:border-[#fbbf24]/30 hover:text-content-body'
                  }`}
                >
                  <FiTool className="w-4 h-4" />
                  Technician
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="label">
                Full Name
              </label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  id="register-name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label">
                Email Address
              </label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  id="register-email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">
                Password
              </label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  id="register-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="label">
                Username
              </label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="username"
                  id="register-username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            {/* Technician-specific fields */}
            {isTechnician && (
              <div className="space-y-4 pt-2 border-t border-border animate-fade-in">
                <p className="text-xs text-[#fbbf24]/80 font-semibold uppercase tracking-wider">
                  Professional Details
                </p>

                {/* Bio */}
                <div>
                  <label className="label">
                    <FiFileText className="inline mr-1.5 w-3.5 h-3.5" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    id="register-bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input min-h-[80px] resize-y"
                    placeholder="Tell customers about your experience and expertise..."
                    rows={3}
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="label">
                    <FiTool className="inline mr-1.5 w-3.5 h-3.5" />
                    Skills
                  </label>
                  {/* Selected skills chips */}
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-xs font-medium bg-[#2d2010] text-[#fbbf24] border border-[#fbbf24]/30"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:text-[#f87171] transition-colors"
                          >
                            <FiX className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Skill input + suggestions */}
                  <div className="input-wrapper">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className="input pr-10"
                      placeholder="Type a skill and press Enter..."
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(skillInput)}
                      disabled={!skillInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-content-muted hover:text-[#fbbf24] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Quick-add suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {SKILL_OPTIONS.filter(
                      (s) => !formData.skills.includes(s)
                    ).slice(0, 8).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="px-2 py-0.5 rounded-sm text-[11px] bg-surface-inner text-content-muted border border-border hover:border-[#fbbf24]/40 hover:text-[#fbbf24] transition-all duration-150"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Area */}
                <div>
                  <label className="label">
                    <FiMapPin className="inline mr-1.5 w-3.5 h-3.5" />
                    Service Area
                  </label>
                  <div className="input-wrapper">
                    <FiMapPin className="input-icon" />
                    <input
                      type="text"
                      name="service_area"
                      id="register-service-area"
                      value={formData.service_area}
                      onChange={handleChange}
                      className="input pl-10"
                      placeholder="e.g. Downtown, North Side, Citywide"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-status-danger-bg border border-border text-status-danger-text px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" id="register-submit" disabled={loading} className="btn-submit mt-6">
              {loading ? 'Creating account...' : 'Create Account'}
              <FiArrowRight className="btn-submit-icon" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-content-body mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7eb8f7] font-semibold hover:text-[#a0cffa]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
