import React, { useState, useEffect } from 'react'
import { FiTrendingUp, FiUsers, FiCheckCircle, FiClock, FiStar, FiClipboard } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { dashboardAPI } from '../services/api'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-4 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getAdminDashboard()
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const stats = data?.statistics || {}

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name}. System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard icon={FiUsers} label="Total Users" value={stats.totalUsers || 0} color="bg-blue-500" />
        <StatCard icon={FiClipboard} label="Service Requests" value={stats.activeServiceRequests || 0} color="bg-yellow-500" />
        <StatCard icon={FiCheckCircle} label="Assignments" value={stats.totalAssignments || 0} color="bg-green-500" />
        <StatCard icon={FiTrendingUp} label="Avg Rating" value={`${stats.averageRating || 0}★`} color="bg-purple-500" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending || 0} color="bg-red-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
          {data?.recentRequests?.length > 0 ? (
            data.recentRequests.map((request) => (
              <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{request.title || 'New service request'}</p>
                  <p className="text-xs text-gray-600">{new Date(request.created_at || request.createdAt || Date.now()).toLocaleString()}</p>
                </div>
                <div className={`badge ${request.status === 'pending' ? 'badge-info' : request.status === 'in_progress' ? 'badge-warning' : 'badge-success'}`}>
                  {request.status?.replace('_', ' ') || 'Pending'}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-gray-600">No recent activity yet</div>
          )}
          </div>
        </div>
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/requests')} className="btn-primary w-full text-left">View All Requests</button>
            <button onClick={() => navigate('/admin/users')} className="btn-secondary w-full text-left">Manage Users</button>
            <button onClick={() => navigate('/admin/requests')} className="btn-secondary w-full text-left">Assign Technicians</button>
            <button onClick={() => navigate('/admin/requests')} className="btn-secondary w-full text-left">Manage Categories</button>
          </div>
        </div>
      </div>
    </div>
  )
}
