import React, { useState, useEffect } from 'react'
import { FiTag, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { categoryAPI } from '../services/api'

export default function CategoryManagement() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editLoading, setEditLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadCategories = async () => {
    try {
      const res = await categoryAPI.getAll()
      setCategories(res.data || [])
    } catch (err) {
      console.error('Failed to load categories:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    setCreateError('')
    try {
      await categoryAPI.create({ name: newName.trim() })
      setNewName('')
      setShowForm(false)
      await loadCategories()
      showToast('Category created successfully!')
    } catch (err) {
      setCreateError(err.message || 'Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) return
    setEditLoading(true)
    try {
      await categoryAPI.update(id, { name: editName.trim() })
      setEditingId(null)
      await loadCategories()
      showToast('Category updated successfully!')
    } catch (err) {
      showToast(err.message || 'Failed to update', 'error')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try {
      await categoryAPI.delete(id)
      await loadCategories()
      showToast('Category deleted.')
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error')
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-content-primary">Category Management</h1>
          <p className="text-content-body mt-2">
            Manage service categories ({categories.length} total)
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={() => { setShowForm((p) => !p); setCreateError('') }}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-6 p-6">
          <h2 className="text-lg font-bold text-content-primary mb-4">New Service Category</h2>
          <form onSubmit={handleCreate} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="label">
                Category Name
              </label>
              <input
                id="new-category-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="input w-full"
                placeholder="e.g., Solar Installation"
                required
              />
            </div>
            <button
              type="submit"
              id="create-category-submit"
              className="btn-primary"
              disabled={creating}
            >
              {creating ? 'Creating...' : 'Create'}
            </button>
          </form>
          {createError && (
            <p className="mt-3 text-sm text-status-danger-text bg-status-danger-bg px-4 py-2 rounded-lg">
              {createError}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-[#7eb8f7] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-content-muted">Loading categories...</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full" id="categories-table">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-content-primary">#</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-content-primary">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-content-primary">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-content-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-content-muted">
                    <FiTag className="w-10 h-10 mx-auto mb-3 text-content-hint" />
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className="table-row"
                  >
                    <td className="px-6 py-4 text-content-muted text-sm">{idx + 1}</td>
                    <td className="px-6 py-4">
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="input w-full max-w-xs"
                          id={`edit-category-${cat.id}`}
                          autoFocus
                        />
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#1e2d4a] flex items-center justify-center">
                            <FiTag className="w-4 h-4 text-[#7eb8f7]" />
                          </div>
                          <span className="font-semibold text-content-primary">{cat.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-content-muted">
                      {cat.created_at
                        ? new Date(cat.created_at).toLocaleDateString()
                        : cat.createdAt
                        ? new Date(cat.createdAt).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === cat.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(cat.id)}
                              disabled={editLoading}
                              className="p-2 rounded-lg bg-status-success-bg hover:bg-[#1a4a2a] text-status-success-text"
                              title="Save"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 rounded-lg bg-surface-inner hover:bg-[#2a2d3d] text-content-body"
                              title="Cancel"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              id={`edit-cat-${cat.id}`}
                              onClick={() => startEdit(cat)}
                              className="p-2 rounded-lg hover:bg-status-info-bg text-status-info-text"
                              title="Edit"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              id={`delete-cat-${cat.id}`}
                              onClick={() => handleDelete(cat.id)}
                              disabled={deleteId === cat.id}
                              className="p-2 rounded-lg hover:bg-status-danger-bg text-status-danger-text disabled:opacity-50"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
