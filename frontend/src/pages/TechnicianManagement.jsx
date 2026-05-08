import React, { useState, useEffect } from 'react'
import {
  FiTool, FiSearch, FiStar, FiUser,
  FiChevronLeft, FiChevronRight, FiEye, FiX
} from 'react-icons/fi'
import { userAPI } from '../services/api'

function AvailBadge({ status }) {
  const map = {
    available: 'bg-green-100 text-green-700',
    busy:      'bg-yellow-100 text-yellow-700',
    offline:   'bg-gray-100 text-gray-500',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] || map.offline}`}>
      {status || 'offline'}
    </span>
  )
}

function Stars({ rating }) {
  const r = parseFloat(rating) || 0
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((s) => (
        <FiStar
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(r) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
          style={{ fill: s <= Math.round(r) ? '#facc15' : 'none' }}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{r > 0 ? r.toFixed(1) : 'N/A'}</span>
    </div>
  )
}

export default function TechnicianManagement() {
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [availFilter, setAvailFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selected, setSelected]       = useState(null)
  const itemsPerPage = 8

  useEffect(() => { loadTechnicians() }, [])

  const loadTechnicians = async () => {
    setLoading(true)
    try {
      const res = await userAPI.getUsersByRole('technician')
      setTechnicians(res.data || [])
    } catch (err) {
      console.error('Failed to load technicians:', err)
    } finally {
      setLoading(false)
    }
  }

  // The API returns technician_profile (snake_case) from the backend relation
  const profile = (t) => t.technician_profile || t.technicianProfile || null

  const filtered = technicians.filter((t) => {
    const p = profile(t)
    const name   = (t.name || t.username || '').toLowerCase()
    const email  = (t.email || '').toLowerCase()
    const skills = (p?.skills || []).join(' ').toLowerCase()
    const matchSearch = !search ||
      name.includes(search.toLowerCase()) ||
      email.includes(search.toLowerCase()) ||
      skills.includes(search.toLowerCase())
    const status     = p?.availability_status || 'offline'
    const matchAvail = !availFilter || status === availFilter
    return matchSearch && matchAvail
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated  = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-8">
      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-6 py-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Technician Profile</h2>
              <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selected.id}`}
                  alt={selected.name}
                  className="w-16 h-16 rounded-full border-2 border-primary-100"
                />
                <div>
                  <p className="text-xl font-bold text-gray-900">{selected.name || selected.username}</p>
                  <p className="text-sm text-gray-500">{selected.email}</p>
                  <div className="mt-1">
                    <AvailBadge status={profile(selected)?.availability_status} />
                  </div>
                </div>
              </div>
              {profile(selected) && (
                <>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bio</p>
                    <p className="text-sm text-gray-700">{profile(selected).bio || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(profile(selected).skills || []).map((s) => (
                        <span key={s} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-gray-900">{profile(selected).total_jobs ?? 0}</p>
                      <p className="text-xs text-gray-500 mt-1">Total Jobs</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <div className="flex justify-center mb-1">
                        <Stars rating={profile(selected).rating} />
                      </div>
                      <p className="text-xs text-gray-500">Average Rating</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Technician Management</h1>
        <p className="text-gray-600 mt-2">
          All registered technicians ({technicians.length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              id="tech-search"
              type="text"
              placeholder="Search by name, email, or skill..."
              className="input pl-10 w-full"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            />
          </div>
          <select
            id="tech-avail-filter"
            className="input w-full"
            value={availFilter}
            onChange={(e) => { setAvailFilter(e.target.value); setCurrentPage(1) }}
          >
            <option value="">All Availability</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offline">Offline</option>
          </select>
        </div>
        <p className="mt-3 text-sm text-gray-400">
          Showing {Math.min(paginated.length, filtered.length)} of {filtered.length} results
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading technicians...</p>
        </div>
      ) : paginated.length === 0 ? (
        <div className="card text-center py-20">
          <FiTool className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No technicians found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {paginated.map((tech) => {
              const p = profile(tech)
              return (
                <div
                  key={tech.id}
                  className="card border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.id}`}
                      alt={tech.name}
                      className="w-14 h-14 rounded-full border-2 border-gray-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-gray-900 truncate">{tech.name || tech.username}</p>
                        <AvailBadge status={p?.availability_status} />
                      </div>
                      <p className="text-xs text-gray-400 truncate">{tech.email}</p>
                      {p && <div className="mt-1"><Stars rating={p.rating} /></div>}
                    </div>
                  </div>

                  {p?.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                          {s}
                        </span>
                      ))}
                      {p.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                          +{p.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {p?.bio && (
                    <p className="mt-3 text-xs text-gray-400 line-clamp-2">{p.bio}</p>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold text-gray-900">{p?.total_jobs ?? 0}</p>
                      <p className="text-xs text-gray-400">Jobs Done</p>
                    </div>
                    <button
                      id={`view-tech-${tech.id}`}
                      onClick={() => setSelected(tech)}
                      className="btn-secondary text-sm flex items-center gap-2 flex-1 justify-center"
                    >
                      <FiEye className="w-4 h-4" /> View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                id="tech-prev-page"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                <FiChevronLeft /> Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    p === currentPage ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                id="tech-next-page"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary flex items-center gap-1 disabled:opacity-40"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
