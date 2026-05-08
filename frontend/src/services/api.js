const API_BASE_URL = '/api/v1'

/**
 * Core fetch wrapper with auth token handling
 * Replaces axios - uses native fetch API
 */
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  // Handle 401 - redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Session expired. Please login again.')
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`)
  }

  return data
}

// Auth API
export const authAPI = {
  register: (body) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
}

// User API
export const userAPI = {
  getProfile: () => fetchAPI('/users/profile'),
  updateProfile: (body) => fetchAPI('/users/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  getAllUsers: () => fetchAPI('/users'),
  createUser: (body) => fetchAPI('/users', { method: 'POST', body: JSON.stringify(body) }),
  getUsersByRole: (role) => fetchAPI(`/users/role/${role}`),
  deleteUser: (id) => fetchAPI(`/users/${id}`, { method: 'DELETE' }),
}

// Technician API
export const technicianAPI = {
  createProfile: (body) => fetchAPI('/technicians/profile', { method: 'POST', body: JSON.stringify(body) }),
  updateProfile: (body) => fetchAPI('/technicians/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  updateAvailability: (body) => fetchAPI('/technicians/availability', { method: 'PATCH', body: JSON.stringify(body) }),
  getAvailable: () => fetchAPI('/technicians/available'),
  getByCategory: (categoryId) => fetchAPI(`/technicians/category/${categoryId}`),
  getByArea: (area) => fetchAPI(`/technicians/area/${area}`),
  getRating: (id) => fetchAPI(`/technicians/${id}/rating`),
}

// Service Request API
export const requestAPI = {
  create: (body) => fetchAPI('/requests', { method: 'POST', body: JSON.stringify(body) }),
  getAll: (params) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''
    return fetchAPI(`/requests${query}`)
  },
  getById: (id) => fetchAPI(`/requests/${id}`),
  update: (id, body) => fetchAPI(`/requests/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  cancel: (id, body) => fetchAPI(`/requests/${id}/cancel`, { method: 'PATCH', body: JSON.stringify(body) }),
  getMyRequests: () => fetchAPI('/requests/customer/me'),
  filter: (params) => {
    const query = new URLSearchParams(params).toString()
    return fetchAPI(`/requests/filter?${query}`)
  },
  search: (q) => fetchAPI(`/requests/search?q=${encodeURIComponent(q)}`),
}

// Assignment API
export const assignmentAPI = {
  create: (body) => fetchAPI('/assignments', { method: 'POST', body: JSON.stringify(body) }),
  reassign: (id, body) => fetchAPI(`/assignments/${id}/reassign`, { method: 'PATCH', body: JSON.stringify(body) }),
  getByRequest: (requestId) => fetchAPI(`/assignments/request/${requestId}`),
  getByTechnician: (techId) => fetchAPI(`/assignments/technician/${techId}`),
}

// Status API
export const statusAPI = {
  update: (requestId, body) => fetchAPI(`/status/${requestId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getCurrent: (requestId) => fetchAPI(`/status/${requestId}/current`),
  getHistory: (requestId) => fetchAPI(`/status/${requestId}/history`),
}

// Review API
export const reviewAPI = {
  create: (body) => fetchAPI('/reviews', { method: 'POST', body: JSON.stringify(body) }),
  getByRequest: (requestId) => fetchAPI(`/reviews/request/${requestId}`),
  getByTechnician: (techId) => fetchAPI(`/reviews/technician/${techId}`),
  getMyReviews: () => fetchAPI('/reviews/customer/me'),
  update: (id, body) => fetchAPI(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => fetchAPI(`/reviews/${id}`, { method: 'DELETE' }),
}

// Category API
export const categoryAPI = {
  create: (body) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(body) }),
  getAll: () => fetchAPI('/categories'),
  update: (id, body) => fetchAPI(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (id) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),
}

// Dashboard API
export const dashboardAPI = {
  getAdminDashboard: () => fetchAPI('/dashboard/admin'),
  getCustomerDashboard: () => fetchAPI('/dashboard/customer'),
  getTechnicianDashboard: () => fetchAPI('/dashboard/technician'),
}

export default fetchAPI
