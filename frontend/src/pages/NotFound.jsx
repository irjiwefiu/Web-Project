import React from 'react'
import { FiHome, FiSettings, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store'

export default function NotFound() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-900 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white opacity-20">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
            Page Not Found
          </h2>
        </div>

        {/* Description */}
        <p className="text-lg text-primary-100 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FiHome className="w-5 h-5" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FiSettings className="w-5 h-5" />
            Dashboard
          </button>
        </div>

        {/* Logout Option */}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className="text-primary-100 hover:text-white flex items-center justify-center gap-2 mt-8 mx-auto"
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
