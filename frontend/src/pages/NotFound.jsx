import React from 'react'
import { IconBolt, IconArrowLeft } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-page flex flex-col items-center justify-center p-4 font-sans">
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e2d4a] rounded-full mb-6">
          <IconBolt className="w-8 h-8 text-[#7eb8f7] fill-[#7eb8f7]" />
        </div>
        <h1 className="text-[48px] font-bold text-content-primary mb-2">404</h1>
        <p className="text-content-muted text-[15px] mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary inline-flex">
          <IconArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
