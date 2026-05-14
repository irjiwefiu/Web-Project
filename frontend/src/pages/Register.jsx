import React, { useState } from 'react'
import { IconBolt, IconMail, IconLock, IconUser, IconArrowRight } from '@tabler/icons-react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authAPI } from '../services/api'
import { loginSuccess } from '../store/slices/authSlice'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roleName: 'customer',
  })
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
      const response = await authAPI.register(formData)
      if (response.data?.token) {
        dispatch(loginSuccess({ user: response.data.user, token: response.data.token }))
        navigate(`/dashboard/${response.data.user.role}`)
      } else {
        navigate('/login')
      }
    } catch (err) {
      setLocalError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-md border border-border p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1e2d4a] rounded-full mb-4">
              <IconBolt className="w-7 h-7 text-[#7eb8f7] fill-[#7eb8f7]" />
            </div>
            <h1 className="text-[22px] font-bold text-content-primary">Create Account</h1>
            <p className="text-content-muted text-[13px] mt-2">Join FixrPro today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <IconUser size={16} className="absolute left-3 top-3 text-content-hint" />
                  <input type="text" name="name" id="register-name" value={formData.name}
                    onChange={handleChange} className="input w-full pl-10" placeholder="Jane Doe" required />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Username</label>
                <input type="text" name="username" id="register-username" value={formData.username}
                  onChange={handleChange} className="input w-full" placeholder="janedoe" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <IconMail size={16} className="absolute left-3 top-3 text-content-hint" />
                <input type="email" name="email" id="register-email" value={formData.email}
                  onChange={handleChange} className="input w-full pl-10" placeholder="you@example.com" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <IconLock size={16} className="absolute left-3 top-3 text-content-hint" />
                <input type="password" name="password" id="register-password" value={formData.password}
                  onChange={handleChange} className="input w-full pl-10" placeholder="••••••••" required />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Role</label>
              <select name="roleName" id="register-role" className="input w-full" value={formData.roleName} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
              </select>
            </div>

            {error && (
              <div className="bg-[#2d1010] border border-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
                {error}
              </div>
            )}

            <button type="submit" id="register-submit" disabled={loading} className="btn btn-primary w-full py-2.5">
              {loading ? 'Creating account...' : 'Create Account'}
              <IconArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-content-hint text-[11px] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <p className="text-center text-content-muted text-[13px]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#7eb8f7] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
