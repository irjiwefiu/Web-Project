# Project Setup & Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Web-Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=service_management

JWT_SECRET=your_secret_key
JWT_EXPIRY=7d
```

### 4. Database Setup

#### 4a. Create Database
```bash
createdb service_management
```

Or using psql:
```bash
psql -U postgres
CREATE DATABASE service_management;
```

#### 4b. Run Migrations
```bash
npm run migration:run
```

#### 4c. Seed Database (Optional)
```bash
npm run seed
```

### 5. Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The server will start on `http://localhost:3000`

### 6. Verify Installation

Check server health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-05-07T12:00:00Z"
}
```

---

## Project Structure

```
Web-Project/
├── src/
│   ├── config/
│   │   └── data-source.js          # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── technician.controller.js
│   │   ├── category.controller.js
│   │   ├── serviceRequest.controller.js
│   │   ├── assignment.controller.js
│   │   ├── status.controller.js
│   │   ├── review.controller.js
│   │   └── dashboard.controller.js
│   ├── entities/                   # Database models
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── role.middleware.js
│   │   └── requestLogger.middleware.js
│   ├── repositories/               # Data access layer
│   ├── services/                   # Business logic
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── technician.routes.js
│   │   ├── category.routes.js
│   │   ├── serviceRequest.routes.js
│   │   ├── assignment.routes.js
│   │   ├── status.routes.js
│   │   ├── review.routes.js
│   │   ├── dashboard.routes.js
│   │   └── API_DOCUMENTATION.md
│   └── index.js                    # Main app entry point
├── .env.example                    # Environment template
├── package.json
└── README.md
```

---

## Available Scripts

### Development
```bash
npm run dev          # Start development server with auto-reload
```

### Database
```bash
npm run migration:create    # Create a new migration
npm run migration:generate  # Auto-generate migration from entities
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration
npm run migration:show      # Show migration status
npm run seed                # Run database seeds
```

### Testing
```bash
npm test             # Run tests
```

### Production
```bash
npm start            # Start production server
```

---

## API Endpoints Overview

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users
- `GET /api/v1/users/profile` - Get profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users` - List users (Admin)
- `GET /api/v1/users/role/:role` - Filter by role (Admin)
- `DELETE /api/v1/users/:id` - Delete user (Admin)

### Technicians
- `POST /api/v1/technicians/profile` - Create profile
- `PATCH /api/v1/technicians/profile` - Update profile
- `PATCH /api/v1/technicians/availability` - Update availability
- `GET /api/v1/technicians/available` - List available
- `GET /api/v1/technicians/category/:id` - By category
- `GET /api/v1/technicians/area/:area` - By area
- `GET /api/v1/technicians/:id/rating` - Get rating

### Service Categories
- `POST /api/v1/categories` - Create (Admin)
- `GET /api/v1/categories` - List
- `PATCH /api/v1/categories/:id` - Update (Admin)
- `DELETE /api/v1/categories/:id` - Delete (Admin)

### Service Requests
- `POST /api/v1/requests` - Create (Customer)
- `GET /api/v1/requests` - List (Admin)
- `GET /api/v1/requests/:id` - Get details
- `PATCH /api/v1/requests/:id` - Update (Customer)
- `PATCH /api/v1/requests/:id/cancel` - Cancel (Customer)
- `GET /api/v1/requests/customer/me` - My requests
- `GET /api/v1/requests/filter` - Filter (Admin)
- `GET /api/v1/requests/search` - Search (Admin)

### Assignments
- `POST /api/v1/assignments` - Assign (Admin)
- `PATCH /api/v1/assignments/:id/reassign` - Reassign (Admin)
- `GET /api/v1/assignments/request/:id` - By request
- `GET /api/v1/assignments/technician/:id` - By technician

### Status Management
- `PATCH /api/v1/status/:id` - Update status
- `GET /api/v1/status/:id/current` - Current status
- `GET /api/v1/status/:id/history` - Status history

### Reviews
- `POST /api/v1/reviews` - Create (Customer)
- `GET /api/v1/reviews/request/:id` - By request
- `GET /api/v1/reviews/technician/:id` - Technician reviews
- `GET /api/v1/reviews/customer/me` - My reviews
- `PATCH /api/v1/reviews/:id` - Update (Customer)
- `DELETE /api/v1/reviews/:id` - Delete (Customer)

### Dashboards
- `GET /api/v1/dashboard/admin` - Admin dashboard
- `GET /api/v1/dashboard/customer` - Customer dashboard
- `GET /api/v1/dashboard/technician` - Technician dashboard

---

## Testing the API

### Using cURL

#### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman
1. Import the API collection
2. Set `{{baseUrl}}` to `http://localhost:3000/api/v1`
3. Use tokens from login responses in Authorization header

### Using Insomnia
1. Create new workspace
2. Import collection from `./docs/insomnia.json` (if available)
3. Test endpoints

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start PostgreSQL from Services or pgAdmin
```

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Change PORT in .env or kill process on port 3000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### JWT Secret Not Set
```
Error: JWT_SECRET is not defined
```
**Solution**: Add `JWT_SECRET` to .env file

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Install dependencies
```bash
npm install
```

---

## Database Schema

Key entities:
- **User** - System users (admin, customer, technician)
- **TechnicianProfile** - Extended technician information
- **ServiceCategory** - Service types
- **ServiceRequest** - Customer service bookings
- **Assignment** - Technician assignments
- **StatusHistory** - Request status tracking
- **Review** - Customer reviews and ratings
- **Role** - User roles

---

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **JWT Secret**: Use strong, unique secret in production
3. **HTTPS**: Enable in production
4. **CORS**: Configure appropriately for your frontend
5. **Rate Limiting**: Consider adding rate limiting middleware
6. **Input Validation**: Always validate user input
7. **SQL Injection**: Use ORM (TypeORM) to prevent injection

---

## Performance Tips

1. **Database Indexing**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for frequently accessed data
3. **Pagination**: Use pagination for large datasets
4. **Lazy Loading**: Avoid N+1 query problems
5. **Connection Pooling**: Configure appropriate pool size

---

## Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=8080
JWT_EXPIRY=30d
```

### Build & Run
```bash
npm install --production
npm start
```

### Using PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start src/index.js --name "service-api"
pm2 save
pm2 startup
```

### Docker Deployment
```bash
docker build -t service-api .
docker run -p 8080:3000 service-api
```

---

## Support & Documentation

- **API Documentation**: See [API_DOCUMENTATION.md](src/routes/API_DOCUMENTATION.md)
- **Quick Reference**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Troubleshooting**: Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

**For more information, contact the development team.**
