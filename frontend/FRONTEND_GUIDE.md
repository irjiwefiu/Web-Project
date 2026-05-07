# Frontend Setup & Development Guide

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── store/               # State management (Zustand)
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   └── index.css            # Tailwind + custom styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies
```

## Components

### Layout Components
- `Layout` - Main layout wrapper with sidebar and navbar
- `Navbar` - Top navigation bar
- `Sidebar` - Side navigation menu

### Pages
- `Login` - User login page
- `Register` - User registration page
- `AdminDashboard` - Admin overview
- `CustomerDashboard` - Customer overview
- `TechnicianDashboard` - Technician overview
- `CustomerRequests` - Manage service requests
- `FindTechnicians` - Browse technicians

## State Management (Zustand)

### Auth Store
```javascript
useAuthStore()
- user: Current user object
- token: JWT token
- isAuthenticated: Auth status
- login(user, token): Set auth
- logout(): Clear auth
```

### UI Store
```javascript
useUIStore()
- isSidebarOpen: Sidebar state
- notification: Current notification
- toggleSidebar(): Toggle sidebar
- showNotification(msg, type, duration): Show notification
```

## API Service

Centralized in `src/services/api.js`:

```javascript
authAPI        // Login, register
userAPI        // User management
technicianAPI  // Technician operations
requestAPI     // Service requests
reviewAPI      // Reviews & ratings
```

## Authentication

1. **Register**: Create new account
2. **Login**: Get JWT token
3. **Protected Routes**: Token required
4. **Auto Logout**: On 401 error
5. **Persistent Login**: Token in localStorage

## Styling

### Tailwind CSS
- Built-in responsive design
- Dark mode support
- Custom utilities

### Custom Classes
```css
.btn            /* Button base */
.btn-primary    /* Primary button */
.btn-secondary  /* Secondary button */
.card           /* Card container */
.input          /* Input field */
.badge          /* Badge */
```

## Development Workflow

### Create New Page

1. Create component in `src/pages/`
2. Import in `App.jsx`
3. Add route with `<Route>`
4. Add to sidebar menu

### Add API Endpoint

1. Add method in `src/services/api.js`
2. Import in component
3. Use in useEffect or handlers

### Add Component

1. Create in `src/components/`
2. Export default
3. Import where needed

## Environment

Backend API: `http://localhost:3000/api/v1`

Configured in `vite.config.js` proxy:
```javascript
'/api': {
  target: 'http://localhost:3000',
  changeOrigin: true
}
```

## Responsive Design

Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

Example:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Performance Tips

1. Use React.memo for expensive components
2. Lazy load routes with React.lazy()
3. Optimize images
4. Minimize re-renders with Zustand selectors

## Debugging

### React DevTools
Browser extension for component inspection

### Network Tab
Check API calls and responses

### Console
Check for JavaScript errors

### localStorage
View stored token and user data

## Common Issues

### "Cannot find module"
```bash
npm install
```

### Port 5173 already in use
Change in `vite.config.js`:
```javascript
server: { port: 5174 }
```

### API connection failed
- Ensure backend is running
- Check baseURL in `src/services/api.js`
- Check CORS in backend

### Not authenticated
- Clear localStorage
- Login again
- Check token in Network tab

## Best Practices

1. ✅ Use components from `components/`
2. ✅ Use API functions from `services/api.js`
3. ✅ Use Zustand for global state
4. ✅ Use Tailwind for styling
5. ✅ Keep components small and focused
6. ✅ Handle errors gracefully
7. ✅ Test before committing

## Build for Production

```bash
npm run build
```

Creates `dist/` folder with optimized files.

Deploy to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Any static host

## Testing

Add tests with Jest:
```bash
npm install --save-dev @testing-library/react
```

## Support

See main README.md for API documentation.

---

**Status**: Production Ready  
**Last Updated**: May 7, 2026
