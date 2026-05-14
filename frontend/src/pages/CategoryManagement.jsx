import React, { useState, useEffect } from 'react'
import { IconTag, IconPlus, IconEdit, IconTrash, IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react'
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

  useEffect(() => { loadCategories() }, [])

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000) }

  const loadCategories = async () => {
    try { const res = await categoryAPI.getAll(); setCategories(res.data || []) }
    catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault(); if (!newName.trim()) return; setCreating(true); setCreateError('')
    try { await categoryAPI.create({ name: newName.trim() }); setNewName(''); setShowForm(false); await loadCategories(); showToast('Created!') }
    catch (err) { setCreateError(err.message) } finally { setCreating(false) }
  }

  const handleUpdate = async (id) => {
    if (!editName.trim()) return; setEditLoading(true)
    try { await categoryAPI.update(id, { name: editName.trim() }); setEditingId(null); await loadCategories(); showToast('Updated!') }
    catch (err) { showToast(err.message, 'error') } finally { setEditLoading(false) }
  }

  const handleDelete = async (id) => {
    setDeleteId(id)
    try { await categoryAPI.delete(id); await loadCategories(); showToast('Deleted.') }
    catch (err) { showToast(err.message, 'error') } finally { setDeleteId(null) }
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-sm text-[13px] font-semibold border ${toast.type === 'error' ? 'bg-[#2d1010] text-[#f87171] border-[#2d1010]' : 'bg-[#14301f] text-[#4ade80] border-[#14301f]'}`}>{toast.msg}</div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-content-primary">Category Management</h1>
          <p className="text-content-muted text-[13px] mt-1">{categories.length} categories</p>
        </div>
        <button id="add-category-btn" onClick={() => { setShowForm(p => !p); setCreateError('') }} className="btn btn-primary">
          <IconPlus size={16} /> {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleCreate} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-[11px] font-semibold text-content-muted mb-1.5 uppercase tracking-wider">Name</label>
              <input id="new-category-name" type="text" value={newName} onChange={e => setNewName(e.target.value)} className="input w-full" placeholder="e.g., Solar Installation" required />
            </div>
            <button type="submit" id="create-category-submit" className="btn btn-primary" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
          </form>
          {createError && <div className="mt-3 flex items-center gap-2 bg-[#2d1010] text-[#f87171] px-4 py-2 rounded-sm text-[13px]"><IconAlertCircle size={16} /> {createError}</div>}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" /></div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full" id="categories-table">
            <thead><tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider">#</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-left text-[11px] font-semibold text-content-muted uppercase tracking-wider">Created</th>
              <th className="px-5 py-3 text-right text-[11px] font-semibold text-content-muted uppercase tracking-wider">Actions</th>
            </tr></thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-content-muted text-[13px]"><IconTag size={32} className="mx-auto mb-3 text-content-hint" />No categories</td></tr>
              ) : categories.map((cat, idx) => (
                <tr key={cat.id} className="border-b border-border hover:bg-surface-inner/50 transition-colors">
                  <td className="px-5 py-3 text-content-hint text-[13px]">{idx + 1}</td>
                  <td className="px-5 py-3">
                    {editingId === cat.id
                      ? <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="input w-full max-w-xs" autoFocus />
                      : <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-sm bg-[#0e2040] flex items-center justify-center"><IconTag size={14} className="text-[#7eb8f7]" /></div><span className="font-medium text-content-primary text-[13px]">{cat.name}</span></div>
                    }
                  </td>
                  <td className="px-5 py-3 text-[13px] text-content-muted">{cat.created_at ? new Date(cat.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editingId === cat.id ? (<>
                        <button onClick={() => handleUpdate(cat.id)} disabled={editLoading} className="p-2 rounded-sm bg-[#14301f] text-[#4ade80]" title="Save"><IconCheck size={14} /></button>
                        <button onClick={() => { setEditingId(null); setEditName('') }} className="p-2 rounded-sm bg-surface-inner text-content-muted" title="Cancel"><IconX size={14} /></button>
                      </>) : (<>
                        <button id={`edit-cat-${cat.id}`} onClick={() => { setEditingId(cat.id); setEditName(cat.name) }} className="p-2 rounded-sm hover:bg-[#0e2040] text-[#7eb8f7]" title="Edit"><IconEdit size={14} /></button>
                        <button id={`delete-cat-${cat.id}`} onClick={() => handleDelete(cat.id)} disabled={deleteId === cat.id} className="p-2 rounded-sm hover:bg-[#2d1010] text-[#f87171] disabled:opacity-30" title="Delete"><IconTrash size={14} /></button>
                      </>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
