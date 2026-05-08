import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isSidebarOpen: true,
    notification: null,
  },
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    showNotification(state, action) {
      const { message, type = 'success' } = action.payload
      state.notification = { message, type, id: Date.now() }
    },
    clearNotification(state) {
      state.notification = null
    },
  },
})

export const { toggleSidebar, showNotification, clearNotification } = uiSlice.actions
export default uiSlice.reducer
