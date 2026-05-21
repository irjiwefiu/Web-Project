import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store'
import App from './App'
import './index.css'

// Apply saved theme on initial load
const theme = store.getState().theme.mode
document.documentElement.setAttribute('data-theme', theme)

// Keep data-theme in sync with Redux store
store.subscribe(() => {
  const current = store.getState().theme.mode
  document.documentElement.setAttribute('data-theme', current)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
