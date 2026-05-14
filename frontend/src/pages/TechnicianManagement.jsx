import React, { useState, useEffect } from 'react'
import { IconTool, IconSearch, IconStar, IconEye, IconX, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { userAPI } from '../services/api'

function AvailBadge({ status }) {
  const map = { available: 'bg-[#14301f] text-[#4ade80]', busy: 'bg-[#2d2010] text-[#fbbf24]', offline: 'bg-surface-inner text-content-muted' }
  return <span className={`px-2.5 py-1 rounded-sm text-[11px] uppercase tracking-wider font-semibold ${map[status] || map.offline}`}>{status || 'offline'}</span>
}

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [availFilter, setAvailFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const itemsPerPage = 8

  useEffect(() => { loadTechnicians() }, [])

  const loadTechnicians = async () => {
    setLoading(true)
    try { const res = await userAPI.getUsersByRole('technician'); setTechnicians(res.data || []) }
    catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const profile = (t) => t.technician_profile || t.technicianProfile || null

  const filtered = technicians.filter(t => {
    const p = profile(t)
    const name = (t.name || t.username || '').toLowerCase()
    const email = (t.email || '').toLowerCase()
    const skills = (p?.skills || []).join(' ').toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || skills.includes(search.toLowerCase())
    const matchAvail = !availFilter || (p?.availability_status || 'offline') === availFilter
    return matchSearch && matchAvail
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getInitials = (name) => { const p = (name || 'U').split(' '); return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : p[0].slice(0, 2).toUpperCase() }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-surface rounded-md border border-border shadow-2xl w-full max-w-lg mx-4 animate-slide-up">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-content-primary">Technician Profile</h2>
              <button onClick={() => setSelected(null)} className="text-content-muted hover:text-content-primary"><IconX size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#2d2010] text-[#fbbf24] flex items-center justify-center text-[18px] font-bold">{getInitials(selected.name)}</div>
                <div>
                  <p className="text-[15px] font-bold text-content-primary">{selected.name || selected.username}</p>
                  <p className="text-[13px] text-content-muted">{selected.email}</p>
                  <div className="mt-1"><AvailBadge status={profile(selected)?.availability_status} /></div>
                </div>
              </div>
              {profile(selected) && (<>
                <div><p className="text-[11px] font-bold text-content-hint uppercase tracking-widest mb-1">Bio</p><p className="text-[13px] text-content-body">{profile(selected).bio || '—'}</p></div>
                <div><p className="text-[11px] font-bold text-content-hint uppercase tracking-widest mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">{(profile(selected).skills || []).map(s => <span key={s} className="px-3 py-1 bg-[#0e2040] text-[#7eb8f7] rounded-sm text-[11px] font-semibold">{s}</span>)}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-inner rounded-sm p-4 text-center"><p className="text-[22px] font-bold text-content-primary">{profile(selected).total_jobs ?? 0}</p><p className="text-[11px] text-content-muted mt-1">Total Jobs</p></div>
                  <div className="bg-surface-inner rounded-sm p-4 text-center">
                    <div className="flex justify-center items-center gap-1"><span className="text-[22px] font-bold text-content-primary">{profile(selected).rating || 0}</span><IconStar size={16} className="text-[#fbbf24] fill-[#fbbf24]" /></div>
                    <p className="text-[11px] text-content-muted mt-1">Rating</p>
                  </div>
                </div>
              </>)}
            </div>
          </div>
        </div>
      )}

      <div><h1 className="text-[20px] font-bold text-content-primary">Technician Management</h1><p className="text-content-muted text-[13px] mt-1">{technicians.length} technicians</p></div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2"><IconSearch size={16} className="absolute left-3 top-3 text-content-hint" /><input id="tech-search" type="text" placeholder="Search by name, email, or skill..." className="input pl-10 w-full" value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1) }} /></div>
          <select id="tech-avail-filter" className="input w-full" value={availFilter} onChange={e => { setAvailFilter(e.target.value); setCurrentPage(1) }}>
            <option value="">All Availability</option><option value="available">Available</option><option value="busy">Busy</option><option value="offline">Offline</option>
          </select>
        </div>
        <p className="mt-3 text-[11px] text-content-hint">Showing {paginated.length} of {filtered.length}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="animate-spin w-8 h-8 border-2 border-[#fbbf24] border-t-transparent rounded-full" /></div>
      ) : paginated.length === 0 ? (
        <div className="card text-center py-12"><IconTool size={40} className="text-content-hint mx-auto mb-4" /><p className="text-content-muted text-[13px]">No technicians found</p></div>
      ) : (<>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map(tech => {
            const p = profile(tech)
            return (
              <div key={tech.id} className="card hover:border-[#2d2010] transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d2010] text-[#fbbf24] flex items-center justify-center text-[12px] font-bold shrink-0">{getInitials(tech.name)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2"><p className="font-medium text-content-primary text-[13px] truncate">{tech.name || tech.username}</p><AvailBadge status={p?.availability_status} /></div>
                    <p className="text-[11px] text-content-hint truncate">{tech.email}</p>
                    {p && <div className="flex items-center gap-1 mt-1"><IconStar size={12} className="text-[#fbbf24] fill-[#fbbf24]" /><span className="text-[11px] text-content-muted">{p.rating || 'N/A'}</span></div>}
                  </div>
                </div>
                {p?.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">{p.skills.slice(0, 3).map(s => <span key={s} className="px-2 py-0.5 bg-[#0e2040] text-[#7eb8f7] rounded-sm text-[10px] font-medium">{s}</span>)}{p.skills.length > 3 && <span className="px-2 py-0.5 bg-surface-inner text-content-hint rounded-sm text-[10px]">+{p.skills.length - 3}</span>}</div>
                )}
                <div className="mt-4 pt-3 border-t border-border flex gap-2">
                  <div className="flex-1 text-center"><p className="text-[15px] font-bold text-content-primary">{p?.total_jobs ?? 0}</p><p className="text-[10px] text-content-hint">Jobs</p></div>
                  <button id={`view-tech-${tech.id}`} onClick={() => setSelected(tech)} className="btn btn-outline text-[12px] py-1.5 flex-1"><IconEye size={14} /> View</button>
                </div>
              </div>
            )
          })}
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button id="tech-prev-page" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30"><IconChevronLeft size={14} /> Prev</button>
            <span className="text-content-muted text-[11px]">Page {currentPage} of {totalPages}</span>
            <button id="tech-next-page" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">Next <IconChevronRight size={14} /></button>
          </div>
        )}
      </>)}
    </div>
  )
}
