import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', token)
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    setLoading(state, action) {
      state.isLoading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { loginSuccess, logout, setLoading, setError, clearError } = authSlice.actions
export default authSlice.reducer
