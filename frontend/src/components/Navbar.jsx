import React, { useState, useRef, useEffect } from 'react'
import { FiMenu, FiLogOut, FiUser, FiBell, FiCheck, FiClock, FiAlertCircle, FiInfo, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'
import { toggleSidebar } from '../store/slices/uiSlice'
import { toggleTheme } from '../store/slices/themeSlice'
import { requestAPI, dashboardAPI } from '../services/api'

export default function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const theme = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifs, setLoadingNotifs] = useState(false)
  const [selectedNotif, setSelectedNotif] = useState(null)
  const notifRef = useRef(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const fetchNotifications = async () => {
    setLoadingNotifs(true)
    try {
      if (user?.role === 'customer') {
        const res = await requestAPI.getMyRequests()
        const requests = (res.data || []).slice(0, 5)
        const items = requests.map((r) => ({
          id: r.id,
          icon: r.status === 'completed' ? FiCheck : r.status === 'cancelled' ? FiAlertCircle : FiClock,
          color: r.status === 'completed' ? 'text-green-400' : r.status === 'cancelled' ? 'text-red-400' : 'text-[#7eb8f7]',
          message: `Request "${r.title}" is now ${(r.status || '').replace(/_/g, ' ')}`,
          time: new Date(r.updated_at || r.createdAt || Date.now()).toLocaleString(),
          request: r || null,
        }))
        setNotifications(items.length ? items : [{ id: 'empty', icon: FiInfo, color: 'text-content-muted', message: 'No notifications yet', time: '' }])
      } else if (user?.role === 'technician') {
        const res = await dashboardAPI.getTechnicianDashboard()
        const allAssignments = [
          ...(res.data?.activeAssignments || []),
          ...(res.data?.completedAssignments || []),
          ...(res.data?.appliedAssignments || []),
        ].slice(0, 5)
        const items = allAssignments.map((a) => ({
          id: a.id,
          icon: FiClock,
          color: 'text-[#7eb8f7]',
          message: `Assignment for "${a.request?.title || 'request'}" - ${(a.status || '').replace(/_/g, ' ')}`,
          time: new Date(a.assigned_at || Date.now()).toLocaleString(),
          request: a.request || null,
        }))
        setNotifications(items.length ? items : [{ id: 'empty', icon: FiInfo, color: 'text-content-muted', message: 'No notifications yet', time: '' }])
      } else {
        const res = await requestAPI.getAll()
        const requests = (res.data || []).slice(0, 5)
        const items = requests.map((r) => ({
          id: r.id,
          icon: FiInfo,
          color: 'text-content-muted',
          message: `Request "${r.title}" - ${(r.status || '').replace(/_/g, ' ')}`,
          time: new Date(r.updated_at || r.createdAt || Date.now()).toLocaleString(),
          request: r || null,
        }))
        setNotifications(items.length ? items : [{ id: 'empty', icon: FiInfo, color: 'text-content-muted', message: 'No notifications yet', time: '' }])
      }
    } catch (err) {
      console.error('Failed to load notifications:', err)
      setNotifications([{ id: 'error', icon: FiAlertCircle, color: 'text-red-400', message: 'Failed to load notifications', time: '' }])
    } finally {
      setLoadingNotifs(false)
    }
  }

  const toggleNotifications = () => {
    if (!showNotifications) {
      fetchNotifications()
    }
    setShowNotifications((prev) => !prev)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasNotifications = notifications.length > 0 && notifications[0].id !== 'empty'

  return (
    <>
      <nav className="bg-surface border-b border-border sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-surface-inner rounded-lg transition-colors"
            >
              <FiMenu className="w-6 h-6 text-content-body" />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-content-body hover:bg-surface-inner rounded-lg transition-colors"
              >
                <FiBell className="w-6 h-6" />
                {hasNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-lg shadow-2xl z-50 animate-slide-up overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <h3 className="font-semibold text-content-primary text-sm">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="btn-icon">
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {loadingNotifs ? (
                      <div className="px-4 py-8 text-center">
                        <div className="w-5 h-5 border-2 border-[#7eb8f7] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs text-content-muted">Loading...</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const Icon = n.icon
                        return (
                        <div
                          key={n.id}
                          onClick={() => {
                            setSelectedNotif(n)
                            setShowNotifications(false)
                          }}
                          className="px-4 py-3 border-b border-border last:border-0 transition-colors cursor-pointer hover:bg-surface-inner"
                        >
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${n.color}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-content-primary leading-snug">{n.message}</p>
                              {n.time && <p className="text-xs text-content-muted mt-1">{n.time}</p>}
                            </div>
                          </div>
                        </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg transition-colors flex items-center gap-2
                text-[#7eb8f7] hover:bg-[#1e2d4a] border border-[#7eb8f7]/30"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-3 border-l border-border pl-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-content-primary">{user?.name}</p>
                <p className="text-xs text-content-muted capitalize">{user?.role}</p>
              </div>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                alt={user?.name}
                className="w-10 h-10 rounded-full ring-2 ring-border"
              />
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-content-body hover:bg-status-danger-bg hover:text-status-danger-text rounded-lg transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {selectedNotif && (
        <div className="modal-overlay" onClick={() => setSelectedNotif(null)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-lg font-bold text-content-primary">Job Details</h3>
              <button onClick={() => setSelectedNotif(null)} className="btn-icon">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body space-y-3">
              <p className="text-sm text-content-body">{selectedNotif.message}</p>
              {selectedNotif.time && (
                <p className="text-xs text-content-muted">{selectedNotif.time}</p>
              )}
              {selectedNotif.request && (
                <>
                  <hr className="border-border" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-content-primary">
                      {selectedNotif.request.title || 'Service Request'}
                    </p>
                    {selectedNotif.request.description && (
                      <p className="text-sm text-content-body">{selectedNotif.request.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {selectedNotif.request.category?.name && (
                        <div><span className="text-content-muted">Category:</span> <span className="text-content-primary">{selectedNotif.request.category.name}</span></div>
                      )}
                      {selectedNotif.request.location && (
                        <div><span className="text-content-muted">Location:</span> <span className="text-content-primary">{selectedNotif.request.location}</span></div>
                      )}
                      {(selectedNotif.request.budget_min || selectedNotif.request.budget_max) && (
                        <div><span className="text-content-muted">Budget:</span> <span className="text-content-primary">${selectedNotif.request.budget_min || 0} - ${selectedNotif.request.budget_max || 0}</span></div>
                      )}
                      {selectedNotif.request.urgency && (
                        <div><span className="text-content-muted">Urgency:</span> <span className="text-content-primary">{selectedNotif.request.urgency}</span></div>
                      )}
                      {selectedNotif.request.customer?.name && (
                        <div><span className="text-content-muted">Customer:</span> <span className="text-content-primary">{selectedNotif.request.customer.name}</span></div>
                      )}
                      {selectedNotif.request.status && (
                        <div><span className="text-content-muted">Status:</span> <span className="text-content-primary">{selectedNotif.request.status.replace(/_/g, ' ')}</span></div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setSelectedNotif(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
