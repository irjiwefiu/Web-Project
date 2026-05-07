# Quick API Reference

## 🚀 Quick Start

### 1. Register
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

### 2. Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response**: You'll receive a JWT token like this:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 📌 Set Token for Subsequent Requests

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 👤 User Routes

### Get Profile
```bash
curl -X GET http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Update Profile
```bash
curl -X PATCH http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+1234567890"
  }'
```

### Get All Users (Admin)
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## 🧰 Technician Routes

### Create Technician Profile
```bash
curl -X POST http://localhost:3000/api/v1/technicians/profile \
  -H "Authorization: Bearer $TECHNICIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specializations": ["plumbing", "electrical"],
    "area": "Downtown",
    "hourlyRate": 50,
    "bio": "Professional technician"
  }'
```

### Update Availability
```bash
curl -X PATCH http://localhost:3000/api/v1/technicians/availability \
  -H "Authorization: Bearer $TECHNICIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "available"
  }'
```

### Get Available Technicians
```bash
curl -X GET http://localhost:3000/api/v1/technicians/available \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 Service Request Routes (Core)

### Create Service Request (Customer)
```bash
curl -X POST http://localhost:3000/api/v1/requests \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix water leak",
    "description": "Water leak under kitchen sink",
    "categoryId": "cat-123",
    "location": "123 Main St",
    "preferredDate": "2026-05-10",
    "urgency": "high"
  }'
```

### Get My Service Requests (Customer)
```bash
curl -X GET http://localhost:3000/api/v1/requests/customer/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### Get All Requests (Admin)
```bash
curl -X GET http://localhost:3000/api/v1/requests \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Filter Requests (Admin)
```bash
curl -X GET "http://localhost:3000/api/v1/requests/filter?status=pending&categoryId=cat-123" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Cancel Request (Customer)
```bash
curl -X PATCH http://localhost:3000/api/v1/requests/req-123/cancel \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "No longer needed"
  }'
```

---

## 🎯 Assignment Routes (Dispatch)

### Assign Technician (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/assignments \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "req-123",
    "technician_id": "tech-456"
  }'
```

### Reassign Technician (Admin)
```bash
curl -X PATCH http://localhost:3000/api/v1/assignments/req-123/reassign \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "new_technician_id": "tech-789"
  }'
```

---

## 📊 Status Management

### Update Status
```bash
curl -X PATCH http://localhost:3000/api/v1/status/req-123 \
  -H "Authorization: Bearer $TECHNICIAN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "Starting work on the leak"
  }'
```

### Get Current Status
```bash
curl -X GET http://localhost:3000/api/v1/status/req-123/current \
  -H "Authorization: Bearer $TOKEN"
```

### Get Status History
```bash
curl -X GET http://localhost:3000/api/v1/status/req-123/history \
  -H "Authorization: Bearer $TOKEN"
```

---

## ⭐ Review Routes

### Create Review (Customer)
```bash
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "req-123",
    "technician_id": "tech-456",
    "rating": 5,
    "comment": "Excellent service!"
  }'
```

### Get Technician Reviews
```bash
curl -X GET http://localhost:3000/api/v1/reviews/technician/tech-456 \
  -H "Authorization: Bearer $TOKEN"
```

### Get My Reviews (Customer)
```bash
curl -X GET http://localhost:3000/api/v1/reviews/customer/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

---

## 📈 Dashboard Routes

### Admin Dashboard
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/admin \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Customer Dashboard
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/customer \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"
```

### Technician Dashboard
```bash
curl -X GET http://localhost:3000/api/v1/dashboard/technician \
  -H "Authorization: Bearer $TECHNICIAN_TOKEN"
```

---

## 🏪 Category Routes

### Create Category (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plumbing",
    "description": "All plumbing services",
    "icon": "plumbing.svg"
  }'
```

### Get All Categories
```bash
curl -X GET http://localhost:3000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔑 Authentication Header Format

For all protected endpoints, include:
```
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/v1/users/profile
```

---

## ✅ Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing/invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Server Error` - Internal error

---

## 📚 Role-Based Access

| Role | Can Access |
|------|-----------|
| **Customer** | Own profile, create requests, submit reviews, customer dashboard |
| **Technician** | Own profile, manage availability, view assignments, submit status updates, technician dashboard |
| **Admin** | All endpoints, user management, assignment dispatch, admin dashboard |

---

## 🧪 Test the API

1. Start the server: `npm run dev`
2. Check health: `curl http://localhost:3000/health`
3. Register: Use the registration curl above
4. Login: Use the login curl to get token
5. Test endpoints: Use the token in subsequent requests
