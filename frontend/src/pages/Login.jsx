import React, { useState } from 'react'
import { IconBolt, IconMail, IconLock, IconArrowRight } from '@tabler/icons-react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authAPI } from '../services/api'
import { loginSuccess } from '../store/slices/authSlice'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setLocalError] = useState('')
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
    <div className="min-h-screen bg-page flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-surface rounded-md border border-border p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1e2d4a] rounded-full mb-4">
              <IconBolt className="w-7 h-7 text-[#7eb8f7] fill-[#7eb8f7]" />
            </div>
            <h1 className="text-[22px] font-bold text-content-primary">Welcome to FixrPro</h1>
            <p className="text-content-muted text-[13px] mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <IconMail size={16} className="absolute left-3 top-3 text-content-hint" />
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input w-full pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <IconLock size={16} className="absolute left-3 top-3 text-content-hint" />
                <input
                  type="password"
                  name="password"
                  id="login-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input w-full pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[#2d1010] border border-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn btn-primary w-full py-2.5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              <IconArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-content-hint text-[11px] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Register Link */}
          <p className="text-center text-content-muted text-[13px]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#7eb8f7] font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Demo Link */}
          <p className="text-center text-content-hint text-[11px] mt-4">
            <Link to="/demo" className="hover:text-content-muted transition-colors">
              View Demo →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
