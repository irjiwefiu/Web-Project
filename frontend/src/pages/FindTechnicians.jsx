import React, { useState, useEffect, useMemo } from 'react'
import { IconSearch, IconMapPin, IconStar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { technicianAPI } from '../services/api'

function TechCard({ tech }) {
  const initials = (tech.name || 'U').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="card hover:border-[#1e2d4a] transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#1e2d4a] text-[#7eb8f7] flex items-center justify-center text-[12px] font-bold shrink-0">{initials}</div>
        <div className="flex-1">
          <h3 className="font-medium text-content-primary text-[13px]">{tech.name}</h3>
          <div className="flex items-center gap-1 mt-1"><IconStar size={12} className="text-[#fbbf24] fill-[#fbbf24]" /><span className="text-[11px] text-content-muted">{tech.rating || 4.5}</span></div>
          <div className="flex items-center gap-1 text-[11px] text-content-muted mt-1"><IconMapPin size={12} />{tech.area || 'N/A'}</div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border flex gap-2">
        <button className="flex-1 btn btn-outline text-[12px] py-1.5">View Profile</button>
        <button className="flex-1 btn btn-primary text-[12px] py-1.5">Book Now</button>
      </div>
    </div>
  )
}

export default function FindTechnicians() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', area: '', rating: '' })
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => { fetchTechnicians() }, [])

  const fetchTechnicians = async () => {
    try { const r = await technicianAPI.getAvailable(); setTechnicians(r.data || []) }
    catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const filtered = useMemo(() => {
    let r = [...technicians]
    if (filters.search) { const t = filters.search.toLowerCase(); r = r.filter(x => x.name?.toLowerCase().includes(t) || x.area?.toLowerCase().includes(t)) }
    if (filters.area) r = r.filter(x => x.area?.toLowerCase().includes(filters.area.toLowerCase()))
    if (filters.rating) r = r.filter(x => (x.rating || 0) >= Number(filters.rating))
    return r
  }, [technicians, filters])

  const sorted = useMemo(() => {
    const s = [...filtered]
    s.sort((a, b) => { let av = a[sortConfig.key] || '', bv = b[sortConfig.key] || ''; if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }; return av < bv ? (sortConfig.direction === 'asc' ? -1 : 1) : av > bv ? (sortConfig.direction === 'asc' ? 1 : -1) : 0 })
    return s
  }, [filtered, sortConfig])

  const totalPages = Math.ceil(sorted.length / itemsPerPage)
  const paginated = useMemo(() => sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [sorted, currentPage])
  useEffect(() => { setCurrentPage(1) }, [filters, sortConfig])

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div><h1 className="text-[20px] font-bold text-content-primary">Find Technicians</h1><p className="text-content-muted text-[13px] mt-1">Browse available service providers</p></div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative"><IconSearch size={16} className="absolute left-3 top-3 text-content-hint" /><input type="text" id="tech-search" placeholder="Search..." className="input pl-10 w-full" value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} /></div>
          <div className="relative"><IconMapPin size={16} className="absolute left-3 top-3 text-content-hint" /><input type="text" id="tech-area-filter" placeholder="Area..." className="input pl-10 w-full" value={filters.area} onChange={e => setFilters(p => ({ ...p, area: e.target.value }))} /></div>
          <select id="tech-rating-filter" className="input w-full" value={filters.rating} onChange={e => setFilters(p => ({ ...p, rating: e.target.value }))}><option value="">All Ratings</option><option value="4">4+ Stars</option><option value="3">3+ Stars</option></select>
          <select id="tech-sort" className="input w-full" value={`${sortConfig.key}-${sortConfig.direction}`} onChange={e => { const [k, d] = e.target.value.split('-'); setSortConfig({ key: k, direction: d }) }}><option value="name-asc">Name A-Z</option><option value="name-desc">Name Z-A</option><option value="rating-desc">Rating High</option></select>
        </div>
        <p className="mt-3 text-[11px] text-content-hint">Showing {paginated.length} of {sorted.length}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32"><div className="animate-spin w-8 h-8 border-2 border-[#7eb8f7] border-t-transparent rounded-full" /></div>
      ) : paginated.length > 0 ? (<>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{paginated.map(t => <TechCard key={t.id} tech={t} />)}</div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30"><IconChevronLeft size={14} /> Prev</button>
            <span className="text-content-muted text-[11px]">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn btn-outline text-[12px] py-1.5 disabled:opacity-30">Next <IconChevronRight size={14} /></button>
          </div>
        )}
      </>) : (
        <div className="card text-center py-12"><p className="text-content-muted text-[13px]">No technicians found</p></div>
      )}
    </div>
  )
}
