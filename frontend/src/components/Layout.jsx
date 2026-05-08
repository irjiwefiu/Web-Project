import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const user = useSelector((state) => state.auth.user)

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
