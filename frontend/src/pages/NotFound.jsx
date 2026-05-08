import React from 'react'
import { Link } from 'react-router-dom'
import { FiAlertTriangle, FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <FiAlertTriangle className="w-20 h-20 text-white mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-white/80 mb-8">Page not found</p>
        <Link to="/login" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 inline-flex items-center gap-2">
          <FiHome className="w-5 h-5" />
          Go to Login
        </Link>
      </div>
    </div>
  )
}
