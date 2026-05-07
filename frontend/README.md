# Service Management Frontend

Modern React-based frontend for the Service Management API. Built with Vite, React Router, Tailwind CSS, and Zustand.

## Features

✅ **Authentication System**
- User registration (Customer/Technician)
- JWT-based login
- Persistent authentication

✅ **Role-Based Dashboards**
- Admin Dashboard: System overview and management
- Customer Dashboard: Service request tracking
- Technician Dashboard: Assignment and work management

✅ **Core Features**
- Service Request Management
- Technician Discovery
- Real-time Status Tracking
- Reviews and Ratings
- User Profiles

✅ **Modern UI**
- Responsive Design
- Tailwind CSS Styling
- Smooth Animations
- Dark Mode Ready

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout wrapper
│   │   ├── Navbar.jsx       # Top navigation
│   │   ├── Sidebar.jsx      # Side navigation
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── TechnicianDashboard.jsx
│   │   ├── CustomerRequests.jsx
│   │   └── FindTechnicians.jsx
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── store/
│   │   └── index.js         # Zustand stores
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Available Routes

### Authentication
- `/login` - Login page
- `/register` - Registration page

### Admin
- `/dashboard/admin` - Admin dashboard

### Customer
- `/dashboard/customer` - Customer dashboard
- `/customer/requests` - My service requests
- `/customer/technicians` - Find technicians

### Technician
- `/dashboard/technician` - Technician dashboard

## State Management

Using Zustand for simple, performant state management:

```javascript
// Authentication store
useAuthStore()

// UI store
useUIStore()
```

## API Integration

All API calls are centralized in `src/services/api.js`:

- Automatic token injection
- Error handling
- 401 redirect on auth failures
- Response interceptors

## Styling

- **Framework**: Tailwind CSS
- **Icons**: React Icons, Lucide React
- **Utilities**: date-fns for date formatting

### Custom CSS Classes

```css
.btn          /* Base button */
.btn-primary  /* Primary button */
.btn-secondary/* Secondary button */
.card         /* Card component */
.input        /* Input field */
.badge        /* Badge component */
```

## Key Technologies

- **React 18** - UI Library
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Icons** - Icon library

## Environment Variables

Frontend uses proxy configuration in `vite.config.js` to connect to backend:

```
Backend API: http://localhost:3000/api/v1
```

## Authentication Flow

1. User registers or logs in
2. Token stored in localStorage
3. Token injected in Authorization header
4. Auto-logout on 401 response
5. Redirect to login on auth failure

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Collapsible sidebar
- Touch-friendly UI

## Development Tips

### Add New Page

```javascript
// 1. Create page component
export default function NewPage() {
  return <div>...</div>
}

// 2. Add route in App.jsx
<Route path="/new-page" element={
  <ProtectedRoute>
    <Layout>
      <NewPage />
    </Layout>
  </ProtectedRoute>
} />
```

### Add New API Endpoint

```javascript
// 1. Add to src/services/api.js
export const newAPI = {
  fetch: () => api.get('/new-endpoint'),
  create: (data) => api.post('/new-endpoint', data),
}

// 2. Use in component
import { newAPI } from '../services/api'
const response = await newAPI.fetch()
```

### Use State Management

```javascript
import { useAuthStore } from '../store'

export default function Component() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  
  return <div>{user.name}</div>
}
```

## Performance Optimizations

- Lazy loading routes
- Image optimization
- CSS minification via Tailwind
- Bundle optimization with Vite

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
```

### API Connection Failed
- Ensure backend is running on port 3000
- Check proxy in vite.config.js
- Clear localStorage

### Authentication Issues
- Check token in localStorage
- Verify JWT_SECRET in backend .env
- Check backend logs

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Create pull request

## License

ISC

---

**Status**: Production Ready  
**Version**: 1.0.0  
**Last Updated**: May 7, 2026
