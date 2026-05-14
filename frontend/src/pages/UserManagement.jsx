import React, { useState, useEffect, useMemo } from 'react'
import { IconUsers, IconSearch, IconTrash, IconEye, IconPlus, IconChevronLeft, IconChevronRight, IconAlertCircle } from '@tabler/icons-react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { userAPI } from '../services/api'

const Badge = ({ text, type }) => {
  const styles = {
    admin: 'bg-[#2d1010] text-[#f87171]',
    technician: 'bg-[#0e2040] text-[#7eb8f7]',
    customer: 'bg-[#14301f] text-[#4ade80]',
  }
  return (
    <span className={`px-2.5 py-1 rounded-sm text-[11px] uppercase tracking-wider font-semibold ${styles[type] || 'bg-surface-inner text-content-muted'}`}>
      {text}
    </span>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')
  const [newUser, setNewUser] = useState({
    name: '', username: '', email: '', password: '', roleName: 'customer',
  })

  useEffect(() => { loadUsers() }, [])

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

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const name = row.original.name || row.original.username || 'User'
        const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1e2d4a] text-[#7eb8f7] flex items-center justify-center text-[11px] font-bold shrink-0">
              {initials}
            </div>
            <span className="font-medium text-content-primary text-[13px]">{name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ getValue }) => <span className="text-content-muted text-[13px]">{getValue()}</span>,
    },
    {
      id: 'role',
      accessorFn: (row) => row.role?.name || 'N/A',
      header: 'Role',
      cell: ({ getValue }) => {
        const r = getValue()
        return <Badge text={r} type={r} />
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Joined',
      cell: ({ getValue }) => (
        <span className="text-content-muted text-[13px]">
          {getValue() ? new Date(getValue()).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button id={`view-user-${row.original.id}`} className="p-2 hover:bg-surface-inner rounded-sm transition-colors" title="View">
            <IconEye size={16} className="text-content-muted" />
          </button>
          <button
            id={`delete-user-${row.original.id}`}
            onClick={() => handleDeleteUser(row.original.id)}
            className="p-2 hover:bg-[#2d1010] rounded-sm transition-colors" title="Delete"
          >
            <IconTrash size={16} className="text-[#f87171]" />
          </button>
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-content-primary">User Management</h1>
          <p className="text-content-muted text-[13px] mt-1">Manage all system users ({users.length} total)</p>
        </div>
        <button id="add-user-btn" className="btn btn-primary" onClick={() => setShowCreateForm(o => !o)}>
          <IconPlus size={16} /> {showCreateForm ? 'Close' : 'Add User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="card">
          <h2 className="text-[15px] font-semibold text-content-primary mb-4">Create New User</h2>
          <form onSubmit={handleCreateUser} className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Full Name</label>
              <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} className="input w-full" placeholder="Jane Doe" required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Username</label>
              <input type="text" name="username" value={newUser.username} onChange={handleNewUserChange} className="input w-full" placeholder="janedoe" required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="input w-full" placeholder="jane@example.com" required />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} className="input w-full" placeholder="••••••••" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Role</label>
              <select name="roleName" value={newUser.roleName} onChange={handleNewUserChange} className="input w-full">
                <option value="customer">Customer</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {createError && (
              <div className="md:col-span-2 flex items-center gap-2 bg-[#2d1010] text-[#f87171] px-4 py-3 rounded-sm text-[13px]">
                <IconAlertCircle size={16} /> {createError}
              </div>
            )}
            <div className="md:col-span-2 flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card">
        <div className="relative">
          <IconSearch size={16} className="absolute left-3 top-3 text-content-hint" />
          <input
            type="text" id="user-search"
            placeholder="Search by name, email, or role..."
            className="input pl-10 w-full"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full" id="users-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider cursor-pointer select-none hover:bg-surface-inner transition-colors"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted()] ?? ''}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-surface-inner/50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {table.getRowModel().rows.length === 0 && (
            <div className="text-center py-12">
              <IconUsers size={40} className="text-content-hint mx-auto mb-4" />
              <p className="text-content-muted text-[13px]">No users found</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <div className="text-[11px] text-content-muted">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              {' '}({table.getFilteredRowModel().rows.length} results)
            </div>
            <div className="flex items-center gap-2">
              <button id="users-prev-page" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
                className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">
                <IconChevronLeft size={14} /> Prev
              </button>
              <button id="users-next-page" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
                className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">
                Next <IconChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
