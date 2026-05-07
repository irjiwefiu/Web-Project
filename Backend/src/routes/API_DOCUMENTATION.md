# Service Management API - Complete Endpoints Documentation

**Base URL**: `/api/v1`  
**API Version**: 1.0  
**Last Updated**: May 7, 2026

---

## Table of Contents

1. [Authentication](#1-authentication-routes)
2. [Users](#2-user-routes)
3. [Technicians](#3-technician-routes)
4. [Service Categories](#4-category-routes)
5. [Service Requests](#5-service-request-routes)
6. [Assignments](#6-assignment-routes)
7. [Status Management](#7-status-routes)
8. [Reviews & Ratings](#8-review-routes)
9. [Dashboards](#9-dashboard-routes)

---

## 1. Authentication Routes

**Base Path**: `/api/v1/auth`

### Register User
- **Endpoint**: `POST /auth/register`
- **Description**: Register a new user
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "customer" // or "technician"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Login User
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate user and receive JWT token
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
      },
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

---

## 2. User Routes

**Base Path**: `/api/v1/users`  
**Default Middleware**: `authenticateUser`

### Get User Profile
- **Endpoint**: `GET /users/profile`
- **Description**: Get authenticated user's profile
- **Protected**: Yes (any logged-in user)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "createdAt": "2026-05-01T10:00:00Z"
    }
  }
  ```

### Update User Profile
- **Endpoint**: `PATCH /users/profile`
- **Description**: Update authenticated user's profile
- **Protected**: Yes (any logged-in user)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "phone": "+1234567890"
  }
  ```
- **Response**: `200 OK`

### Get All Users
- **Endpoint**: `GET /users`
- **Description**: Get all users in the system
- **Protected**: Yes (Admin only)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 150,
    "data": [...]
  }
  ```

### Get Users by Role
- **Endpoint**: `GET /users/role/:role`
- **Description**: Get users filtered by role
- **Protected**: Yes (Admin only)
- **Params**: `role` - customer, technician, admin
- **Response**: `200 OK`

### Delete User
- **Endpoint**: `DELETE /users/:id`
- **Description**: Delete a user by ID
- **Protected**: Yes (Admin only)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "User with ID xxx has been deleted."
  }
  ```

---

## 3. Technician Routes

**Base Path**: `/api/v1/technicians`  
**Default Middleware**: `authenticateUser`

### Create Technician Profile
- **Endpoint**: `POST /technicians/profile`
- **Description**: Create a technician profile
- **Protected**: Yes (Technician only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "specializations": ["plumbing", "electrical"],
    "area": "Downtown",
    "hourlyRate": 50,
    "bio": "Professional technician with 10 years experience"
  }
  ```
- **Response**: `201 Created`

### Update Technician Profile
- **Endpoint**: `PATCH /technicians/profile`
- **Description**: Update technician profile
- **Protected**: Yes (Technician only)
- **Middleware**: `validateRequestBody`
- **Response**: `200 OK`

### Update Availability Status
- **Endpoint**: `PATCH /technicians/availability`
- **Description**: Update technician availability
- **Protected**: Yes (Technician only)
- **Body**:
  ```json
  {
    "status": "available" // or "busy", "offline"
  }
  ```
- **Response**: `200 OK`

### Get Available Technicians
- **Endpoint**: `GET /technicians/available`
- **Description**: Get all currently available technicians
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Get Technicians by Category
- **Endpoint**: `GET /technicians/category/:categoryId`
- **Description**: Get technicians providing specific service
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Get Technicians by Area
- **Endpoint**: `GET /technicians/area/:area`
- **Description**: Get technicians in specific service area
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Get Technician Rating
- **Endpoint**: `GET /technicians/:id/rating`
- **Description**: Get technician's rating and review count
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

---

## 4. Category Routes

**Base Path**: `/api/v1/categories`  
**Default Middleware**: `authenticateUser`

### Create Category
- **Endpoint**: `POST /categories`
- **Description**: Create new service category
- **Protected**: Yes (Admin only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "name": "Plumbing",
    "description": "All plumbing services",
    "icon": "plumbing.svg"
  }
  ```
- **Response**: `201 Created`

### Get All Categories
- **Endpoint**: `GET /categories`
- **Description**: Get all service categories
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Update Category
- **Endpoint**: `PATCH /categories/:id`
- **Description**: Update service category
- **Protected**: Yes (Admin only)
- **Middleware**: `validateRequestBody`
- **Response**: `200 OK`

### Delete Category
- **Endpoint**: `DELETE /categories/:id`
- **Description**: Delete service category
- **Protected**: Yes (Admin only)
- **Response**: `200 OK`

---

## 5. Service Request Routes ⭐ CORE BOOKING SYSTEM

**Base Path**: `/api/v1/requests`  
**Default Middleware**: `authenticateUser`

### Create Service Request
- **Endpoint**: `POST /requests`
- **Description**: Create new service request (booking)
- **Protected**: Yes (Customer only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "title": "Fix water leak",
    "description": "There's a water leak under the kitchen sink",
    "categoryId": "category-uuid",
    "location": "123 Main St, Downtown",
    "preferredDate": "2026-05-10",
    "urgency": "high" // low, medium, high
  }
  ```
- **Response**: `201 Created`

### Get All Service Requests
- **Endpoint**: `GET /requests`
- **Description**: Get all service requests (system-wide)
- **Protected**: Yes (Admin only)
- **Response**: `200 OK`

### Get Service Request by ID
- **Endpoint**: `GET /requests/:id`
- **Description**: Get specific service request details
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Update Service Request
- **Endpoint**: `PATCH /requests/:id`
- **Description**: Update service request
- **Protected**: Yes (Customer only - own requests)
- **Middleware**: `validateRequestBody`
- **Response**: `200 OK`

### Cancel Service Request
- **Endpoint**: `PATCH /requests/:id/cancel`
- **Description**: Cancel a service request
- **Protected**: Yes (Customer only)
- **Body**:
  ```json
  {
    "reason": "No longer needed"
  }
  ```
- **Response**: `200 OK`

### Get Customer's Service Requests
- **Endpoint**: `GET /requests/customer/me`
- **Description**: Get all requests created by logged-in customer
- **Protected**: Yes (Customer only)
- **Response**: `200 OK`

### Filter Service Requests
- **Endpoint**: `GET /requests/filter`
- **Description**: Search and filter service requests
- **Protected**: Yes (Admin only)
- **Query Params**: `status`, `categoryId`, `area`, `startDate`, `endDate`
- **Response**: `200 OK`

### Search Service Requests
- **Endpoint**: `GET /requests/search`
- **Description**: Full-text search for service requests
- **Protected**: Yes (Admin only)
- **Query Params**: `q` (search query)
- **Response**: `200 OK`

---

## 6. Assignment Routes ⭐ DISPATCH SYSTEM

**Base Path**: `/api/v1/assignments`  
**Default Middleware**: `authenticateUser`

### Create Assignment
- **Endpoint**: `POST /assignments`
- **Description**: Assign technician to service request
- **Protected**: Yes (Admin only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "request_id": "request-uuid",
    "technician_id": "technician-uuid"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "Technician successfully assigned to the request.",
    "data": {
      "id": "assignment-uuid",
      "requestId": "request-uuid",
      "technicianId": "technician-uuid",
      "status": "assigned",
      "assignedAt": "2026-05-07T10:30:00Z"
    }
  }
  ```

### Reassign Technician
- **Endpoint**: `PATCH /assignments/:id/reassign`
- **Description**: Reassign technician to different request
- **Protected**: Yes (Admin only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "new_technician_id": "new-technician-uuid"
  }
  ```
- **Response**: `200 OK`

### Get Assignments by Request
- **Endpoint**: `GET /assignments/request/:requestId`
- **Description**: Get all assignments for specific request
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Get Technician Assignments
- **Endpoint**: `GET /assignments/technician/:technicianId`
- **Description**: Get all assignments for specific technician
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

---

## 7. Status Routes

**Base Path**: `/api/v1/status`  
**Default Middleware**: `authenticateUser`

### Update Service Status
- **Endpoint**: `PATCH /status/:requestId`
- **Description**: Update status of service request
- **Protected**: Yes (Technician or Admin)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "status": "in_progress", // pending, in_progress, completed, cancelled
    "notes": "Starting work on the leak"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "Status updated to 'in_progress' successfully.",
    "data": {
      "requestId": "request-uuid",
      "currentStatus": "in_progress",
      "updatedAt": "2026-05-07T11:00:00Z"
    }
  }
  ```

### Get Current Status
- **Endpoint**: `GET /status/:requestId/current`
- **Description**: Get current status of service request
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "requestId": "request-uuid",
      "status": "in_progress",
      "updatedAt": "2026-05-07T11:00:00Z"
    }
  }
  ```

### Get Status History
- **Endpoint**: `GET /status/:requestId/history`
- **Description**: Get status change audit trail
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "status": "pending",
        "changedBy": "admin-uuid",
        "notes": "Request created",
        "changedAt": "2026-05-07T10:00:00Z"
      },
      {
        "status": "assigned",
        "changedBy": "admin-uuid",
        "notes": "Assigned to technician",
        "changedAt": "2026-05-07T10:30:00Z"
      }
    ]
  }
  ```

---

## 8. Review Routes

**Base Path**: `/api/v1/reviews`  
**Default Middleware**: `authenticateUser`

### Create Review
- **Endpoint**: `POST /reviews`
- **Description**: Create review for completed service
- **Protected**: Yes (Customer only)
- **Middleware**: `validateRequestBody`
- **Body**:
  ```json
  {
    "request_id": "request-uuid",
    "technician_id": "technician-uuid",
    "rating": 5,
    "comment": "Excellent service! Very professional."
  }
  ```
- **Response**: `201 Created`

### Get Review by Request
- **Endpoint**: `GET /reviews/request/:requestId`
- **Description**: Get review for specific service request
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`

### Get Technician Reviews
- **Endpoint**: `GET /reviews/technician/:technicianId`
- **Description**: Get all reviews for specific technician
- **Protected**: Yes (any logged-in user)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "count": 45,
    "data": [
      {
        "id": "review-uuid",
        "rating": 5,
        "comment": "Great service",
        "customerId": "customer-uuid",
        "createdAt": "2026-04-30T15:00:00Z"
      }
    ]
  }
  ```

### Get Customer's Reviews
- **Endpoint**: `GET /reviews/customer/me`
- **Description**: Get all reviews written by logged-in customer
- **Protected**: Yes (Customer only)
- **Response**: `200 OK`

### Update Review
- **Endpoint**: `PATCH /reviews/:id`
- **Description**: Update review (customer only)
- **Protected**: Yes (Customer only - owner)
- **Middleware**: `validateRequestBody`
- **Response**: `200 OK`

### Delete Review
- **Endpoint**: `DELETE /reviews/:id`
- **Description**: Delete review (customer only)
- **Protected**: Yes (Customer only - owner)
- **Response**: `200 OK`

---

## 9. Dashboard Routes

**Base Path**: `/api/v1/dashboard`  
**Default Middleware**: `authenticateUser`

### Admin Dashboard
- **Endpoint**: `GET /dashboard/admin`
- **Description**: System-wide overview for administrators
- **Protected**: Yes (Admin only)
- **Returns**:
  - All service requests
  - Assignment statistics
  - Technician workload distribution
  - Completed/cancelled jobs count
  - System overview metrics
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "statistics": {
        "totalRequests": 200,
        "pendingRequests": 50,
        "inProgressRequests": 45,
        "completedRequests": 105,
        "totalTechnicians": 30,
        "averageTechnicianRating": 4.5
      },
      "timestamp": "2026-05-07T12:00:00Z"
    }
  }
  ```

### Customer Dashboard
- **Endpoint**: `GET /dashboard/customer`
- **Description**: Personal dashboard for customers
- **Protected**: Yes (Customer only)
- **Returns**:
  - Upcoming service requests
  - Previous service requests
  - Current request statuses
  - Review history
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "total": 15,
        "active": 3,
        "completed": 12
      },
      "upcomingRequests": [
        {
          "id": "request-uuid",
          "title": "Fix leak",
          "status": "in_progress",
          "scheduledDate": "2026-05-08"
        }
      ],
      "recentCompleted": [...]
    }
  }
  ```

### Technician Dashboard
- **Endpoint**: `GET /dashboard/technician`
- **Description**: Work dashboard for technicians
- **Protected**: Yes (Technician only)
- **Returns**:
  - Assigned jobs
  - Active jobs
  - Completed jobs
  - Availability status
  - Personal ratings and reviews
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "totalAssignments": 50,
        "pendingAssignments": 5,
        "completedJobs": 45,
        "rating": 4.8,
        "availabilityStatus": "available"
      },
      "upcomingJobs": [...]
    }
  }
  ```

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get a token**:
1. Call `POST /auth/login` with email and password
2. Receive JWT token in response
3. Include token in all subsequent requests

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["field is required"]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No authentication token provided."
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Access denied. Role 'customer' is not authorized."
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "An internal error occurred"
}
```

---

## API Summary Table

| Method | Endpoint | Role | Purpose |
|--------|----------|------|---------|
| POST | /auth/register | Public | Register new user |
| POST | /auth/login | Public | Login user |
| GET | /users/profile | Any | Get profile |
| PATCH | /users/profile | Any | Update profile |
| GET | /users | Admin | List all users |
| GET | /users/role/:role | Admin | Filter users by role |
| DELETE | /users/:id | Admin | Delete user |
| POST | /technicians/profile | Technician | Create profile |
| PATCH | /technicians/profile | Technician | Update profile |
| PATCH | /technicians/availability | Technician | Update availability |
| GET | /technicians/available | Any | List available technicians |
| GET | /technicians/category/:id | Any | Technicians by category |
| GET | /technicians/area/:area | Any | Technicians by area |
| GET | /technicians/:id/rating | Any | Get technician rating |
| POST | /categories | Admin | Create category |
| GET | /categories | Any | List categories |
| PATCH | /categories/:id | Admin | Update category |
| DELETE | /categories/:id | Admin | Delete category |
| POST | /requests | Customer | Create request |
| GET | /requests | Admin | List all requests |
| GET | /requests/:id | Any | Get request details |
| PATCH | /requests/:id | Customer | Update request |
| PATCH | /requests/:id/cancel | Customer | Cancel request |
| GET | /requests/customer/me | Customer | My requests |
| GET | /requests/filter | Admin | Filter requests |
| GET | /requests/search | Admin | Search requests |
| POST | /assignments | Admin | Assign technician |
| PATCH | /assignments/:id/reassign | Admin | Reassign technician |
| GET | /assignments/request/:id | Any | Get assignments |
| GET | /assignments/technician/:id | Any | Technician assignments |
| PATCH | /status/:id | Technician/Admin | Update status |
| GET | /status/:id/current | Any | Get current status |
| GET | /status/:id/history | Any | Get status history |
| POST | /reviews | Customer | Create review |
| GET | /reviews/request/:id | Any | Get review by request |
| GET | /reviews/technician/:id | Any | Get technician reviews |
| GET | /reviews/customer/me | Customer | My reviews |
| PATCH | /reviews/:id | Customer | Update review |
| DELETE | /reviews/:id | Customer | Delete review |
| GET | /dashboard/admin | Admin | Admin dashboard |
| GET | /dashboard/customer | Customer | Customer dashboard |
| GET | /dashboard/technician | Technician | Technician dashboard |

---

## Getting Started

1. **Register**: `POST /auth/register`
2. **Login**: `POST /auth/login` to get JWT token
3. **Use token**: Add to Authorization header for all requests
4. **Access APIs**: Make requests to relevant endpoints based on your role

---

**Need Help?** Check the individual endpoint documentation above for detailed request/response examples.
