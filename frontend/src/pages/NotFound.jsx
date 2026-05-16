import React from 'react'
import { Link } from 'react-router-dom'
import { FiAlertTriangle, FiHome } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-status-danger-bg rounded-full mb-6">
          <FiAlertTriangle className="w-12 h-12 text-status-danger-text" />
        </div>
        <h1 className="text-6xl font-bold text-content-primary mb-4">404</h1>
        <p className="text-xl text-content-body mb-8">Page not found</p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
          <FiHome className="w-5 h-5" />
          Go to Login
        </Link>
      </div>
    </div>
  )
}
