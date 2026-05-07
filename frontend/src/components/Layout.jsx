import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useAuthStore } from '../store'

export default function Layout({ children }) {
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
