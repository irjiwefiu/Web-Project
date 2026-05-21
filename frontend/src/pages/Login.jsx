import React, { useState } from 'react'
import { FiMail, FiLock, FiUser, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authAPI } from '../services/api'
import { loginSuccess, setError } from '../store/slices/authSlice'
import { toggleTheme } from '../store/slices/themeSlice'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setLocalError] = useState('')
  const theme = useSelector((state) => state.theme.mode)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLocalError('')

    try {
      const response = await authAPI.login(formData)
      dispatch(loginSuccess({ user: response.data.user, token: response.data.token }))
      navigate(`/dashboard/${response.data.user.role}`)
    } catch (err) {
      setLocalError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className="absolute top-4 right-4 p-2.5 bg-surface border border-border rounded-lg text-content-body hover:text-content-primary shadow-lg transition-colors"
        title="Toggle theme"
      >
        {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
      </button>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface rounded-md border border-border shadow-2xl p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e2d4a] rounded-full mb-4">
              <FiUser className="w-8 h-8 text-[#7eb8f7]" />
            </div>
            <h1 className="text-3xl font-bold text-content-primary">Welcome Back</h1>
            <p className="text-content-body mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  id="login-email"
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
                  id="login-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-status-danger-bg border border-border text-status-danger-text px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" id="login-submit" disabled={loading} className="btn-submit">
              {loading ? 'Signing in...' : 'Sign In'}
              <FiArrowRight className="btn-submit-icon" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-content-muted text-sm">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-content-body">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#7eb8f7] font-semibold hover:text-[#a0cffa]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
