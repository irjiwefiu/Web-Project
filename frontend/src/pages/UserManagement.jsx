import React, { useState, useEffect, useMemo } from 'react'
import { FiUsers, FiSearch, FiTrash2, FiEye, FiPlus, FiChevronLeft, FiChevronRight, FiX, FiMail, FiCalendar, FiHash, FiShield } from 'react-icons/fi'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { userAPI } from '../services/api'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewUser, setViewUser] = useState(null)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    roleName: 'customer',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await userAPI.getAllUsers()
      setUsers(response.data || [])
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userAPI.deleteUser(id)
        loadUsers()
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    }
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError('')

    try {
      await userAPI.createUser(newUser)
      setShowCreateForm(false)
      setNewUser({ name: '', username: '', email: '', password: '', roleName: 'customer' })
      loadUsers()
    } catch (error) {
      setCreateError(error.message || 'Unable to create user')
    } finally {
      setCreateLoading(false)
    }
  }

  // TanStack Table column definitions
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.id}`}
            alt={row.original.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-content-primary">{row.original.name || row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <span className="text-content-body">{getValue()}</span>,
    },
    {
      id: 'role',
      accessorFn: (row) => row.role?.name || 'N/A',
      header: 'Role',
      cell: ({ getValue }) => {
        const roleColors = {
          admin: 'bg-status-danger-bg text-status-danger-text',
          technician: 'bg-status-info-bg text-status-info-text',
          customer: 'bg-status-success-bg text-status-success-text',
        }
        const r = getValue()
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColors[r] || 'bg-surface-inner text-content-body'}`}>
            {r}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ getValue }) => (
        <span className="text-content-body">
          {getValue() ? new Date(getValue()).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button id={`view-user-${row.original.id}`} onClick={() => setViewUser(row.original)} className="p-2 hover:bg-surface-inner rounded-lg" title="View">
            <FiEye className="w-4 h-4 text-content-body" />
          </button>
          <button
            id={`delete-user-${row.original.id}`}
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 hover:bg-status-danger-bg rounded-lg" title="Delete"
          >
            <FiTrash2 className="w-4 h-4 text-status-danger-text" />
          </button>
        </div>
      ),
    },
  ], [])

  // TanStack Table instance
  const table = useReactTable({
    data: users,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-content-primary">User Management</h1>
          <p className="text-content-body mt-2">Manage all system users ({users.length} total)</p>
        </div>
        <button
          id="add-user-btn"
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowCreateForm((open) => !open)}
        >
          <FiPlus className="w-5 h-5" /> {showCreateForm ? 'Close' : 'Add User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card mb-6 p-6">
          <h2 className="text-xl font-semibold text-content-primary mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                className="input"
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="label">Username</label>
              <input
                type="text"
                name="username"
                value={newUser.username}
                onChange={handleNewUserChange}
                className="input"
                placeholder="janedoe"
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                className="input"
                placeholder="jane@example.com"
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">Role</label>
              <select
                name="roleName"
                value={newUser.roleName}
                onChange={handleNewUserChange}
                className="input"
              >
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {createError && (
              <div className="md:col-span-2 bg-status-danger-bg border border-status-danger-text/30 text-status-danger-text px-4 py-3 rounded-lg text-sm">
                {createError}
              </div>
            )}
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={createLoading}
              >
                {createLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-content-muted" />
          <input
            type="text" id="user-search"
            placeholder="Search by name, email, or role..."
            className="input pl-10 w-full"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* TanStack Table */}
      {loading ? (
        <div className="text-center py-12 text-content-muted">Loading users...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full" id="users-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold text-content-primary cursor-pointer select-none hover:bg-surface-inner"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted()] ?? ''}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-surface-inner transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {table.getRowModel().rows.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="w-12 h-12 text-content-hint mx-auto mb-4" />
              <p className="text-content-body">No users found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-content-muted">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              {' '}({table.getFilteredRowModel().rows.length} results)
            </div>
            <div className="flex items-center gap-2">
              <button
                id="users-prev-page"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-50"
              >
                <FiChevronLeft /> Previous
              </button>
              <button
                id="users-next-page"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="btn-secondary flex items-center gap-1 text-sm disabled:opacity-50"
              >
                Next <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* User Detail Modal */}
      {viewUser && (
        <div className="modal-overlay" onClick={() => setViewUser(null)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-bold text-content-primary flex items-center gap-2">
                <FiEye className="w-5 h-5 text-[#7eb8f7]" /> User Details
              </h2>
              <button onClick={() => setViewUser(null)} className="text-content-muted hover:text-content-primary">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="modal-body">
              <div className="flex flex-col items-center mb-6">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${viewUser.id}`}
                  alt={viewUser.name}
                  className="w-20 h-20 rounded-full mb-3 ring-2 ring-border"
                />
                <h3 className="text-xl font-bold text-content-primary">{viewUser.name || viewUser.username}</h3>
                {viewUser.role && (
                  <span className={`mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    viewUser.role?.name === 'admin' ? 'bg-status-danger-bg text-status-danger-text' :
                    viewUser.role?.name === 'technician' ? 'bg-status-info-bg text-status-info-text' :
                    'bg-status-success-bg text-status-success-text'
                  }`}>
                    {viewUser.role?.name || 'N/A'}
                  </span>
                )}
              </div>
              <div className="space-y-3 bg-surface-inner rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <FiHash className="w-4 h-4 text-content-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-content-muted">User ID</p>
                    <p className="text-sm font-semibold text-content-primary truncate">{viewUser.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiShield className="w-4 h-4 text-content-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-content-muted">Username</p>
                    <p className="text-sm font-semibold text-content-primary truncate">{viewUser.username || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="w-4 h-4 text-content-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-content-muted">Email</p>
                    <p className="text-sm font-semibold text-content-primary truncate">{viewUser.email || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="w-4 h-4 text-content-muted flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-content-muted">Joined</p>
                    <p className="text-sm font-semibold text-content-primary">
                      {viewUser.created_at ? new Date(viewUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setViewUser(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
