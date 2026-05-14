import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const user = useSelector((state) => state.auth.user)

  if (!user) return null

  return (
    <div className="flex flex-col h-screen bg-page font-sans text-content-primary">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role={user.role} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
