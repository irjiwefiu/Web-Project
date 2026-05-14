import React, { useState, useEffect } from 'react'
import { IconStar, IconMessageCircle, IconTrash, IconSearch, IconFilter, IconAlertCircle } from '@tabler/icons-react'
import { reviewAPI } from '../services/api'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const res = await reviewAPI.getAll()
      // format data to match UI expectations
      const formatted = (res.data || []).map(r => ({
        id: r.id,
        customer: r.reviewer?.name || r.reviewer?.username || 'Unknown',
        tech: r.technician?.name || r.technician?.username || 'Unknown',
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.created_at).toLocaleDateString(),
        status: 'published' // assuming all are published for now
      }))
      setReviews(formatted)
    } catch (err) {
      console.error('Failed to load reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter(r => {
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase()) || r.tech.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase())
    const matchRating = filterRating ? r.rating === parseInt(filterRating) : true
    const matchStatus = filterStatus ? r.status === filterStatus : true
    return matchSearch && matchRating && matchStatus
  })

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this review?')) {
      try {
        await reviewAPI.delete(id)
        setReviews(reviews.filter(r => r.id !== id))
      } catch (err) {
        console.error('Failed to delete review:', err)
        alert('Failed to delete review')
      }
    }
  }

  const handleResolve = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'published' } : r))
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-[20px] font-bold text-content-primary">Platform Reviews</h1>
        <p className="text-content-muted text-[13px] mt-1">Monitor and manage all customer feedback ({reviews.length} total)</p>
      </div>

      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <IconSearch size={16} className="absolute left-3 top-3 text-content-hint" />
            <input type="text" placeholder="Search by customer, technician, or comment..." 
                   className="input pl-10 w-full" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-full" value={filterRating} onChange={e => setFilterRating(e.target.value)}>
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <select className="input w-full" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="card text-center py-12">
            <IconMessageCircle size={40} className="text-content-hint mx-auto mb-4" />
            <p className="text-content-muted text-[13px]">No reviews found matching your criteria.</p>
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className={`card ${review.status === 'flagged' ? 'border-[#2d1010]' : ''}`}>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex text-[#fbbf24]">
                      {[...Array(5)].map((_, i) => (
                        <IconStar key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-content-hint'} />
                      ))}
                    </div>
                    {review.status === 'flagged' && (
                      <span className="px-2 py-0.5 rounded-sm bg-[#2d1010] text-[#f87171] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <IconAlertCircle size={10} /> Flagged
                      </span>
                    )}
                    <span className="text-content-muted text-[11px]">{review.date}</span>
                  </div>
                  
                  <p className="text-content-primary text-[14px] leading-relaxed mb-3">"{review.comment}"</p>
                  
                  <div className="flex items-center gap-4 text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-content-hint">Customer:</span>
                      <span className="text-content-primary font-medium">{review.customer}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-content-hint">Technician:</span>
                      <span className="text-content-primary font-medium">{review.tech}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex md:flex-col gap-2 justify-end">
                  {review.status === 'flagged' && (
                    <button onClick={() => handleResolve(review.id)} className="btn bg-[#14301f] hover:bg-[#1a3d28] text-[#4ade80] text-[12px] py-1.5">
                      Resolve
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} className="btn btn-outline hover:bg-[#2d1010] hover:border-[#2d1010] hover:text-[#f87171] text-[12px] py-1.5 text-content-muted">
                    <IconTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
