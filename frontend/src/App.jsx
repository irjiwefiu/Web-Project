import React, { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Customer Routes */}
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/requests"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerRequests />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/technicians"
          element={
            <ProtectedRoute>
              <Layout>
                <FindTechnicians />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Technician Routes */}
        <Route
          path="/dashboard/technician"
          element={
            <ProtectedRoute>
              <Layout>
                <TechnicianDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
