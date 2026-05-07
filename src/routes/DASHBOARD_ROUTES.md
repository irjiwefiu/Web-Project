# Dashboard Routes Documentation

## Overview
This document describes the dashboard routes for three user roles: **Admin**, **Customer**, and **Technician**.

All dashboard routes require:
- **Authentication**: Valid JWT token in `Authorization: Bearer <token>` header
- **Role-based Authorization**: User must have the appropriate role

---

## Admin Dashboard Routes

Base path: `/dashboards/admin`

### 1. Get Admin Dashboard Overview
- **Endpoint**: `GET /dashboards/admin`
- **Authentication**: Required (Admin only)
- **Description**: Returns system-wide statistics
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "statistics": {
        "totalUsers": 150,
        "activeServiceRequests": 45,
        "totalAssignments": 200,
        "averageRating": 4.5
      },
      "timestamp": "2026-05-07T10:30:00.000Z"
    }
  }
  ```

### 2. Get User Management Data
- **Endpoint**: `GET /dashboards/admin/users`
- **Authentication**: Required (Admin only)
- **Description**: Returns all users with detailed information
- **Response**:
  ```json
  {
    "success": true,
    "count": 150,
    "data": [
      {
        "id": "user-1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
      },
      ...
    ]
  }
  ```

### 3. Get All Service Requests
- **Endpoint**: `GET /dashboards/admin/service-requests`
- **Authentication**: Required (Admin only)
- **Description**: Returns all service requests with status breakdown
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "total": 200,
        "pending": 50,
        "inProgress": 45,
        "completed": 105
      },
      "requests": [
        {
          "id": "req-1",
          "title": "Fix leak",
          "status": "in_progress",
          "customerId": "user-1"
        },
        ...
      ]
    }
  }
  ```

---

## Customer Dashboard Routes

Base path: `/dashboards/customer`

### 1. Get Customer Dashboard Overview
- **Endpoint**: `GET /dashboards/customer`
- **Authentication**: Required (Customer only)
- **Description**: Returns customer-specific service request summary
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "total": 15,
        "active": 3,
        "completed": 12
      },
      "recentRequests": [
        {
          "id": "req-1",
          "title": "Plumbing repair",
          "status": "in_progress",
          "createdAt": "2026-05-01"
        },
        ...
      ]
    }
  }
  ```

### 2. Get Customer Service Requests
- **Endpoint**: `GET /dashboards/customer/service-requests`
- **Authentication**: Required (Customer only)
- **Description**: Returns all service requests for the logged-in customer
- **Response**:
  ```json
  {
    "success": true,
    "count": 15,
    "data": [
      {
        "id": "req-1",
        "title": "Fix leak",
        "status": "in_progress",
        "assignedTechnician": "tech-1"
      },
      ...
    ]
  }
  ```

### 3. Get Customer Reviews
- **Endpoint**: `GET /dashboards/customer/reviews`
- **Authentication**: Required (Customer only)
- **Description**: Returns reviews written by the customer
- **Response**:
  ```json
  {
    "success": true,
    "count": 5,
    "data": [
      {
        "id": "review-1",
        "rating": 5,
        "comment": "Great service!",
        "technicianId": "tech-1",
        "createdAt": "2026-04-30"
      },
      ...
    ]
  }
  ```

---

## Technician Dashboard Routes

Base path: `/dashboards/technician`

### 1. Get Technician Dashboard Overview
- **Endpoint**: `GET /dashboards/technician`
- **Authentication**: Required (Technician only)
- **Description**: Returns technician-specific work summary
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "summary": {
        "total": 50,
        "pending": 5,
        "completed": 45,
        "rating": 4.8
      },
      "upcomingAssignments": [
        {
          "id": "assign-1",
          "serviceRequestId": "req-1",
          "status": "pending",
          "scheduledDate": "2026-05-08"
        },
        ...
      ]
    }
  }
  ```

### 2. Get Technician Assignments
- **Endpoint**: `GET /dashboards/technician/assignments`
- **Authentication**: Required (Technician only)
- **Description**: Returns all assignments for the technician
- **Response**:
  ```json
  {
    "success": true,
    "count": 50,
    "data": [
      {
        "id": "assign-1",
        "serviceRequestId": "req-1",
        "status": "pending",
        "customerId": "user-1",
        "description": "Fix water leak"
      },
      ...
    ]
  }
  ```

### 3. Get Technician Reviews
- **Endpoint**: `GET /dashboards/technician/reviews`
- **Authentication**: Required (Technician only)
- **Description**: Returns reviews received by the technician
- **Response**:
  ```json
  {
    "success": true,
    "count": 45,
    "averageRating": 4.8,
    "data": [
      {
        "id": "review-1",
        "rating": 5,
        "comment": "Professional work!",
        "customerId": "user-1",
        "createdAt": "2026-04-30"
      },
      ...
    ]
  }
  ```

### 4. Get Technician Profile
- **Endpoint**: `GET /dashboards/technician/profile`
- **Authentication**: Required (Technician only)
- **Description**: Returns technician profile information
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "tech-1",
      "userId": "user-1",
      "specializations": ["plumbing", "electrical"],
      "rating": 4.8,
      "totalJobs": 45,
      "completionRate": 98
    }
  }
  ```

---

## Error Responses

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No authentication token provided."
}
```

### 403 - Forbidden (Insufficient Role)
```json
{
  "success": false,
  "message": "Access denied. Role 'customer' is not authorized."
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "An internal error occurred."
}
```

---

## Usage Example

### Request with cURL
```bash
# Admin dashboard
curl -X GET http://localhost:3000/dashboards/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Customer dashboard
curl -X GET http://localhost:3000/dashboards/customer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Technician assignments
curl -X GET http://localhost:3000/dashboards/technician/assignments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Integration Steps

To integrate these routes into your Express app:

1. Import the main dashboard router in your `app.js` or `index.js`:
   ```javascript
   const dashboardRoutes = require("./routes/dashboard.routes");
   
   // Mount dashboard routes
   app.use("/dashboards", dashboardRoutes);
   ```

2. Ensure your `app.js` includes the authentication and error handling middlewares:
   ```javascript
   const { authenticateUser } = require("./middlewares/auth.middleware");
   const { errorMiddleware } = require("./middlewares/error.middleware");
   ```

3. All dashboard routes are now available at the `/dashboards` endpoint with role-based access control.

---

## Notes

- All routes require a valid JWT token
- Tokens must be passed as `Authorization: Bearer <token>`
- Users can only access dashboards matching their role
- The `req.user` object is populated by the `authenticateUser` middleware
- All errors are handled by the error middleware and forwarded to error handlers
