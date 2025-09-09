# Padel Booking System - API Documentation

## 🚀 Base URL
```
http://localhost:5001/api
```

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Court Management](#court-management)
4. [Booking System](#booking-system)
5. [Tournament System](#tournament-system)
6. [Admin Panel](#admin-panel)
7. [Notifications](#notifications)
8. [File Upload](#file-upload)
9. [Error Handling](#error-handling)

---

## 🔐 Authentication

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "player" // player, owner, organizer, admin
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "player",
    "isActive": true
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "player",
    "isActive": true
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "player",
    "address": {
      "street": "123 Main St",
      "city": "Karachi",
      "state": "Sindh",
      "zipCode": "75000",
      "country": "Pakistan"
    },
    "preferences": {
      "notifications": {
        "email": true,
        "sms": false
      }
    }
  }
}
```

---

## 👤 User Management

### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "address": {
    "street": "456 New St",
    "city": "Lahore",
    "state": "Punjab",
    "zipCode": "54000"
  }
}
```

### Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 🏟️ Court Management

### Get All Courts (Public)
```http
GET /api/courts?search=indoor&location=karachi&type=Indoor&surface=Synthetic&minPrice=1000&maxPrice=5000&isFeatured=true&page=1&limit=10
```

**Query Parameters:**
- `search` - Search in name, location, city
- `location` - Filter by location
- `type` - Indoor/Outdoor
- `surface` - Synthetic/Clay/Grass/Concrete
- `minPrice` - Minimum price per hour
- `maxPrice` - Maximum price per hour
- `isFeatured` - true/false
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "court_id",
      "name": "Premium Court 1",
      "location": "Main Sports Complex",
      "address": {
        "street": "123 Sports Ave",
        "city": "Karachi",
        "state": "Sindh",
        "zipCode": "75000"
      },
      "pricePerHour": 2500,
      "type": "Indoor",
      "surface": "Synthetic",
      "status": "Available",
      "images": ["/uploads/courts/image1.jpg"],
      "isFeatured": true,
      "amenities": [
        {"name": "Parking", "available": true},
        {"name": "Changing Room", "available": true}
      ],
      "rating": {
        "average": 4.5,
        "count": 25
      },
      "owner": {
        "id": "owner_id",
        "name": "Court Owner",
        "email": "owner@example.com"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "limit": 10
  }
}
```

### Get Featured Courts
```http
GET /api/courts/featured
```

### Get Court by ID
```http
GET /api/courts/:id
```

### Check Court Availability
```http
GET /api/courts/:id/availability?date=2024-01-15&time=14:00&duration=2
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "court": {
    "id": "court_id",
    "name": "Premium Court 1",
    "pricePerHour": 2500
  }
}
```

### Create Court (Owner Only)
```http
POST /api/courts
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "name": "New Court",
  "location": "Sports Complex",
  "address": {
    "street": "123 Main St",
    "city": "Karachi",
    "state": "Sindh",
    "zipCode": "75000"
  },
  "pricePerHour": 2000,
  "type": "Indoor",
  "surface": "Synthetic",
  "description": "High-quality synthetic court",
  "amenities": [
    {"name": "Parking", "available": true},
    {"name": "Changing Room", "available": true}
  ],
  "operatingHours": {
    "monday": {"open": "06:00", "close": "22:00", "closed": false},
    "tuesday": {"open": "06:00", "close": "22:00", "closed": false}
  },
  "rules": ["No smoking", "Proper sports attire required"],
  "maxPlayers": 4,
  "images": ["file1.jpg", "file2.jpg"] // Files uploaded via form-data
}
```

### Update Court (Owner Only)
```http
PUT /api/courts/:id
Authorization: Bearer <token>
```

### Delete Court (Owner Only)
```http
DELETE /api/courts/:id
Authorization: Bearer <token>
```

### Get Owner's Courts
```http
GET /api/courts/owner/my-courts
Authorization: Bearer <token>
```

---

## 📅 Booking System

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "courtId": "court_id",
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 2,
  "players": 4,
  "notes": "Birthday party booking",
  "paymentMethod": "bank_transfer",
  "bankDetails": {
    "accountName": "Padel Court Booking",
    "accountNumber": "1234567890",
    "bankName": "ABC Bank",
    "branchCode": "001"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully. You have 10 minutes to complete payment.",
  "data": {
    "id": "booking_id",
    "court": {
      "id": "court_id",
      "name": "Premium Court 1",
      "location": "Main Sports Complex"
    },
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "date": "2024-01-15",
    "time": "14:00",
    "duration": 2,
    "totalAmount": 5000,
    "status": "hold",
    "holdExpiresAt": "2024-01-15T14:10:00.000Z"
  }
}
```

### Upload Payment Proof
```http
PUT /api/bookings/:bookingId/payment-proof
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "paymentProofUrl": "payment_screenshot.jpg" // File upload
}
```

### Get User's Bookings
```http
GET /api/bookings/my-bookings?status=confirmed&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` - hold, pending_verification, confirmed, expired, cancelled
- `page` - Page number
- `limit` - Items per page

### Cancel Booking
```http
PUT /api/bookings/:bookingId/cancel
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Change of plans"
}
```

### Get Booking by ID
```http
GET /api/bookings/:bookingId
Authorization: Bearer <token>
```

---

## 🏆 Tournament System

### Get All Tournaments
```http
GET /api/tournaments?search=championship&location=karachi&skillLevel=Intermediate&status=registration_open&page=1&limit=10
```

**Query Parameters:**
- `search` - Search in title, location, description
- `location` - Filter by location
- `skillLevel` - Beginner/Intermediate/Advanced/Mixed
- `status` - upcoming, registration_open, registration_closed, ongoing, completed
- `isApproved` - true/false (default: true for public)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tournament_id",
      "title": "Spring Championship 2024",
      "description": "Annual padel tournament",
      "startDate": "2024-03-15T09:00:00.000Z",
      "endDate": "2024-03-17T18:00:00.000Z",
      "registrationDeadline": "2024-03-10T23:59:59.000Z",
      "location": "Sports Complex",
      "maxParticipants": 32,
      "entryFee": 5000,
      "prizePool": {
        "winner": 50000,
        "runnerUp": 25000,
        "thirdPlace": 10000
      },
      "skillLevel": "Intermediate",
      "format": "Doubles",
      "status": "registration_open",
      "participantCount": 15,
      "isRegistrationOpen": true,
      "organizer": {
        "id": "organizer_id",
        "name": "Tournament Organizer",
        "email": "organizer@example.com"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 3,
    "total": 25,
    "limit": 10
  }
}
```

### Get Tournament by ID
```http
GET /api/tournaments/:id
```

### Create Tournament (Organizer Only)
```http
POST /api/tournaments
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
```json
{
  "title": "Summer Championship 2024",
  "description": "Annual summer padel tournament",
  "startDate": "2024-06-15T09:00:00.000Z",
  "endDate": "2024-06-17T18:00:00.000Z",
  "registrationDeadline": "2024-06-10T23:59:59.000Z",
  "location": "Sports Complex",
  "address": {
    "street": "123 Sports Ave",
    "city": "Karachi",
    "state": "Sindh",
    "zipCode": "75000"
  },
  "maxParticipants": 32,
  "entryFee": 5000,
  "prizePool": {
    "winner": 50000,
    "runnerUp": 25000,
    "thirdPlace": 10000
  },
  "skillLevel": "Intermediate",
  "format": "Doubles",
  "rules": ["No smoking", "Proper attire required"],
  "requirements": ["Valid ID", "Medical certificate"],
  "images": ["tournament1.jpg", "tournament2.jpg"]
}
```

### Register for Tournament
```http
POST /api/tournaments/:tournamentId/register
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "teamName": "Team Alpha",
  "skillLevel": "Intermediate",
  "partnerName": "Jane Smith",
  "partnerEmail": "jane@example.com",
  "partnerPhone": "+1234567891",
  "emergencyContact": {
    "name": "Emergency Contact",
    "phone": "+1234567892",
    "relationship": "Spouse"
  },
  "registrationNotes": "Looking forward to the tournament"
}
```

### Get Tournament Registrations (Organizer Only)
```http
GET /api/tournaments/:id/registrations
Authorization: Bearer <token>
```

### Get Organizer's Tournaments
```http
GET /api/tournaments/organizer/my-tournaments?status=upcoming&page=1&limit=10
Authorization: Bearer <token>
```

---

## 👨‍💼 Admin Panel

### Get Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalCourts": 25,
    "totalTournaments": 10,
    "totalBookings": 500,
    "pendingBookings": 5,
    "pendingTournaments": 2
  }
}
```

### Get All Users
```http
GET /api/admin/users?role=player&isActive=true&search=john&page=1&limit=10
Authorization: Bearer <token>
```

### Update User Status
```http
PUT /api/admin/users/:userId/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "isActive": false,
  "role": "admin"
}
```

### Toggle Court Featured Status
```http
PUT /api/admin/courts/:courtId/toggle-featured
Authorization: Bearer <token>
```

### Approve Tournament
```http
PUT /api/admin/tournaments/:tournamentId/approve
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "approve" // or "reject"
}
```

### Verify Booking Payment
```http
PUT /api/admin/bookings/:bookingId/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "approve" // or "reject"
}
```

---

## 🔔 Notifications

### Get User Notifications
```http
GET /api/notifications?read=false&type=booking&page=1&limit=20
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "notification_id",
      "type": "booking",
      "title": "Booking Confirmed",
      "message": "Your booking for Premium Court 1 has been confirmed!",
      "read": false,
      "priority": "medium",
      "actionUrl": "/bookings/booking_id",
      "createdAt": "2024-01-15T14:00:00.000Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "current": 1,
    "pages": 2,
    "total": 20,
    "limit": 20
  }
}
```

### Mark Notification as Read
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer <token>
```

### Mark All Notifications as Read
```http
PUT /api/notifications/mark-all-read
Authorization: Bearer <token>
```

### Delete Notification
```http
DELETE /api/notifications/:notificationId
Authorization: Bearer <token>
```

---

## 📁 File Upload

### Supported File Types
- Images: JPEG, JPG, PNG, GIF, WebP
- Maximum file size: 10MB
- Maximum files per request: 10

### Upload Endpoints
- Court images: `POST /api/courts` (form-data field: `images`)
- Payment proof: `PUT /api/bookings/:id/payment-proof` (form-data field: `paymentProofUrl`)
- Tournament images: `POST /api/tournaments` (form-data field: `images`)
- Profile image: `PUT /api/auth/profile` (form-data field: `profileImage`)

### File Upload Response
Files are automatically uploaded and URLs are returned in the response:
```json
{
  "success": true,
  "data": {
    "images": ["/uploads/courts/image1_1234567890.jpg", "/uploads/courts/image2_1234567891.jpg"]
  }
}
```

---

## ❌ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Messages
```json
// Authentication errors
{
  "success": false,
  "message": "Access denied. No token provided."
}

// Validation errors
{
  "success": false,
  "message": "Name, email, and password are required"
}

// Not found errors
{
  "success": false,
  "message": "Court not found"
}

// Permission errors
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

---

## 🔧 Authentication Headers

For protected routes, include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## 📝 Notes for Frontend Developer

1. **Pagination**: All list endpoints support pagination with `page` and `limit` parameters
2. **Search**: Most endpoints support search functionality with the `search` parameter
3. **Filtering**: Use query parameters to filter results
4. **File Uploads**: Use `multipart/form-data` for file uploads
5. **Error Handling**: Always check the `success` field in responses
6. **Token Management**: Store JWT token securely and refresh when needed
7. **Real-time Updates**: Consider implementing WebSocket for real-time notifications
8. **Image URLs**: All image URLs are relative to the base URL

## 🚀 Getting Started

1. Start the backend server: `npm run dev`
2. Server runs on: `http://localhost:5001`
3. API base URL: `http://localhost:5001/api`
4. Test the API with tools like Postman or curl

---

**Contact**: For any questions or clarifications, please contact the backend development team.
