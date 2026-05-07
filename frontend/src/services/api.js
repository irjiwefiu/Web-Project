import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error.message)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  getUsersByRole: (role) => api.get(`/users/role/${role}`),
  deleteUser: (id) => api.delete(`/users/${id}`),
}

// Technician API
export const technicianAPI = {
  createProfile: (data) => api.post('/technicians/profile', data),
  updateProfile: (data) => api.patch('/technicians/profile', data),
  updateAvailability: (data) => api.patch('/technicians/availability', data),
  getAvailable: () => api.get('/technicians/available'),
  getByCategory: (categoryId) => api.get(`/technicians/category/${categoryId}`),
  getByArea: (area) => api.get(`/technicians/area/${area}`),
  getRating: (id) => api.get(`/technicians/${id}/rating`),
}

// Service Request API
export const requestAPI = {
  create: (data) => api.post('/requests', data),
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  update: (id, data) => api.patch(`/requests/${id}`, data),
  cancel: (id, data) => api.patch(`/requests/${id}/cancel`, data),
  getMyRequests: () => api.get('/requests/customer/me'),
  filter: (params) => api.get('/requests/filter', { params }),
  search: (q) => api.get('/requests/search', { params: { q } }),
}

// Assignment API
export const assignmentAPI = {
  create: (data) => api.post('/assignments', data),
  reassign: (id, data) => api.patch(`/assignments/${id}/reassign`, data),
  getByRequest: (requestId) => api.get(`/assignments/request/${requestId}`),
  getByTechnician: (technicianId) => api.get(`/assignments/technician/${technicianId}`),
}

// Status API
export const statusAPI = {
  update: (requestId, data) => api.patch(`/status/${requestId}`, data),
  getCurrent: (requestId) => api.get(`/status/${requestId}/current`),
  getHistory: (requestId) => api.get(`/status/${requestId}/history`),
}

// Review API
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByRequest: (requestId) => api.get(`/reviews/request/${requestId}`),
  getByTechnician: (technicianId) => api.get(`/reviews/technician/${technicianId}`),
  getMyReviews: () => api.get('/reviews/customer/me'),
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
}

// Category API
export const categoryAPI = {
  create: (data) => api.post('/categories', data),
  getAll: () => api.get('/categories'),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Dashboard API
export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getCustomerDashboard: () => api.get('/dashboard/customer'),
  getTechnicianDashboard: () => api.get('/dashboard/technician'),
}

export default api
