import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import TechnicianDashboard from './pages/TechnicianDashboard'
import CustomerRequests from './pages/CustomerRequests'
import FindTechnicians from './pages/FindTechnicians'
import UserManagement from './pages/UserManagement'
import RequestManagement from './pages/RequestManagement'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes - role-based */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><RequestManagement /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout><UserManagement /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Customer Routes - role-based */}
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><CustomerDashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/requests"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><CustomerRequests /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/technicians"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <Layout><FindTechnicians /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Technician Routes - role-based */}
        <Route
          path="/dashboard/technician"
          element={
            <ProtectedRoute allowedRoles={['technician']}>
              <Layout><TechnicianDashboard /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Profile - accessible by all authenticated */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['admin', 'customer', 'technician']}>
              <Layout><UserProfile /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
