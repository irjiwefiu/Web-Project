import React, { useState, useEffect, useMemo } from 'react'
import { FiUsers, FiSearch, FiTrash2, FiEye, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
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
          <span className="font-semibold text-gray-900">{row.original.name || row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <span className="text-gray-600">{getValue()}</span>,
    },
    {
      id: 'role',
      accessorFn: (row) => row.role?.name || 'N/A',
      header: 'Role',
      cell: ({ getValue }) => {
        const roleColors = {
          admin: 'bg-red-100 text-red-700',
          technician: 'bg-blue-100 text-blue-700',
          customer: 'bg-green-100 text-green-700',
        }
        const r = getValue()
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${roleColors[r] || 'bg-gray-100 text-gray-700'}`}>
            {r}
          </span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ getValue }) => (
        <span className="text-gray-600">
          {getValue() ? new Date(getValue()).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button id={`view-user-${row.original.id}`} className="p-2 hover:bg-gray-100 rounded-lg" title="View">
            <FiEye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            id={`delete-user-${row.original.id}`}
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 hover:bg-red-100 rounded-lg" title="Delete"
          >
            <FiTrash2 className="w-4 h-4 text-red-600" />
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all system users ({users.length} total)</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
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
              <div className="md:col-span-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
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
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
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
        <div className="text-center py-12">Loading users...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full" id="users-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer select-none hover:bg-gray-50"
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
                <tr key={row.id} className="border-b hover:bg-gray-50 transition-colors">
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
              <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
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
    </div>
  )
}
