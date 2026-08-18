# DevCamp API Documentation

Base URL: `/api/v1`

## Common Formats

**Authentication**
Most routes require authentication via a JWT token. The token can be sent in the `Authorization` header as a Bearer token or as a cookie (`token`).
Some endpoints require specific roles: `user`, `publisher`, or `admin`.

**Standard Error Responses**
- **400 Bad Request**: Validation errors or malformed requests.
  `{ "success": false, "message": "Error message" }` or `{ "success": false, "errors": ["..."] }`
- **401 Unauthorized**: Missing or invalid token.
  `{ "success": false, "message": "Not authorized to access this route" }`
- **403 Forbidden**: Token valid, but user role is not authorized.
  `{ "success": false, "message": "User role is not authorized to access this route" }`
- **404 Not Found**: Resource not found.
  `{ "success": false, "message": "Resource not found" }`
- **500 Internal Server Error**: Server errors.
  `{ "success": false, "message": "Server Error" }`

---

## 1. Bootcamps (`/bootcamps`)

### Get All Bootcamps
- **Method**: `GET`
- **Endpoint**: `/bootcamps`
- **Auth**: Public
- **Query Params**: Supports `select`, `sort`, `page`, `limit` and filtering operators (`gt`, `gte`, `lt`, `lte`, `in`).
- **Response** (200): `{ "success": true, "count": 1, "pagination": {}, "data": [...] }`

### Get Single Bootcamp
- **Method**: `GET`
- **Endpoint**: `/bootcamps/:id`
- **Auth**: Public
- **Response** (200): `{ "success": true, "data": { ... } }`

### Create Bootcamp
- **Method**: `POST`
- **Endpoint**: `/bootcamps`
- **Auth**: Private (Role: `publisher`, `admin`)
- **Body**: Bootcamp details (`name`, `description`, `website`, `phone`, `email`, `address`, `careers`, etc).
- **Response** (201): `{ "success": true, "data": { ... } }`

### Update Bootcamp
- **Method**: `PUT`
- **Endpoint**: `/bootcamps/:id`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner)
- **Body**: Fields to update.
- **Response** (200): `{ "success": true, "data": { ... } }`

### Delete Bootcamp
- **Method**: `DELETE`
- **Endpoint**: `/bootcamps/:id`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner)
- **Response** (200): `{ "success": true, "data": {} }`

### Get Bootcamps In Radius
- **Method**: `GET`
- **Endpoint**: `/bootcamps/radius/:zip/:distance`
- **Auth**: Public
- **Response** (200): `{ "success": true, "count": 1, "data": [...] }`

### Upload Bootcamp Photo
- **Method**: `PUT`
- **Endpoint**: `/bootcamps/:id/photo`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner)
- **Body**: `multipart/form-data` with `photo` field.
- **Response** (200): `{ "success": true, "data": "filename.jpg" }`

---

## 2. Courses (`/courses` & `/bootcamps/:bootcampId/courses`)

### Get Courses
- **Method**: `GET`
- **Endpoint**: `/courses` OR `/bootcamps/:bootcampId/courses`
- **Auth**: Public
- **Response** (200): `{ "success": true, "count": 1, "data": [...] }`

### Get Single Course
- **Method**: `GET`
- **Endpoint**: `/courses/:id`
- **Auth**: Public
- **Response** (200): `{ "success": true, "data": { ... } }`

### Create Course
- **Method**: `POST`
- **Endpoint**: `/bootcamps/:bootcampId/courses` OR `/courses`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner of bootcamp)
- **Body**: Course details.
- **Response** (201): `{ "success": true, "data": { ... } }`

### Update Course
- **Method**: `PUT`
- **Endpoint**: `/courses/:id`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner)
- **Body**: Fields to update.
- **Response** (200): `{ "success": true, "data": { ... } }`

### Delete Course
- **Method**: `DELETE`
- **Endpoint**: `/courses/:id`
- **Auth**: Private (Role: `publisher`, `admin` - Must be owner)
- **Response** (200): `{ "success": true, "data": {} }`

---

## 3. Auth (`/auth`)

### Register User
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Auth**: Public
- **Body**: `name`, `email`, `password`, `role`.
- **Response** (201): `{ "success": true, "token": "..." }`

### Login User
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Auth**: Public (Rate-limited: 5 requests / 15 mins per IP/Email)
- **Body**: `email`, `password`.
- **Response** (200): `{ "success": true, "token": "..." }`

### Get Current User
- **Method**: `GET`
- **Endpoint**: `/auth/me`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": { ... } }`

### Logout
- **Method**: `POST`
- **Endpoint**: `/auth/logout`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": {} }` (Sets token cookie to 'none')

### Forgot Password
- **Method**: `POST`
- **Endpoint**: `/auth/forgot-password`
- **Auth**: Public
- **Body**: `email`.
- **Response** (200): `{ "success": true, "message": "Email sent" }`

### Reset Password
- **Method**: `PUT`
- **Endpoint**: `/auth/reset-password/:resettoken`
- **Auth**: Public
- **Body**: `password`.
- **Response** (200): `{ "success": true, "token": "..." }`

### Update Password
- **Method**: `PUT`
- **Endpoint**: `/auth/update-password`
- **Auth**: Private
- **Body**: `currentPassword`, `newPassword`.
- **Response** (200): `{ "success": true, "token": "..." }`

---

## 4. Users (`/users`)

### Get All Users
- **Method**: `GET`
- **Endpoint**: `/users`
- **Auth**: Private (Role: `admin`)
- **Query Params**: Advanced results supported.
- **Response** (200): `{ "success": true, "count": 1, "pagination": {}, "data": [...] }`

### Get Single User
- **Method**: `GET`
- **Endpoint**: `/users/:id`
- **Auth**: Private (Role: `admin`)
- **Response** (200): `{ "success": true, "data": { ... } }`

### Create User
- **Method**: `POST`
- **Endpoint**: `/users`
- **Auth**: Private (Role: `admin`)
- **Body**: User details.
- **Response** (201): `{ "success": true, "data": { ... } }`

### Update User
- **Method**: `PUT`
- **Endpoint**: `/users/:id`
- **Auth**: Private (Role: `admin`)
- **Body**: Fields to update.
- **Response** (200): `{ "success": true, "data": { ... } }`

### Delete User
- **Method**: `DELETE`
- **Endpoint**: `/users/:id`
- **Auth**: Private (Role: `admin`)
- **Response** (200): `{ "success": true, "data": {} }`

---

## 5. Reviews (`/reviews` & `/bootcamps/:bootcampId/reviews`)

### Get Reviews
- **Method**: `GET`
- **Endpoint**: `/reviews` OR `/bootcamps/:bootcampId/reviews`
- **Auth**: Public
- **Response** (200): `{ "success": true, "count": 1, "data": [...] }`

### Get Single Review
- **Method**: `GET`
- **Endpoint**: `/reviews/:id`
- **Auth**: Public
- **Response** (200): `{ "success": true, "data": { ... } }`

### Create Review
- **Method**: `POST`
- **Endpoint**: `/reviews/:bootcampId` OR `/bootcamps/:bootcampId/reviews`
- **Auth**: Private (Role: `user`, `admin`)
- **Body**: Review details (`title`, `text`, `rating`).
- **Response** (201): `{ "success": true, "data": { ... } }`

### Update Review
- **Method**: `PUT`
- **Endpoint**: `/reviews/:id`
- **Auth**: Private (Must be owner or `admin`)
- **Body**: Fields to update.
- **Response** (200): `{ "success": true, "data": { ... } }`

### Delete Review
- **Method**: `DELETE`
- **Endpoint**: `/reviews/:id`
- **Auth**: Private (Must be owner or `admin`)
- **Response** (200): `{ "success": true, "data": {} }`

---

## 6. Enrollments (`/enrollments` & `/bootcamps/:bootcampId/enrollments`)

### Get Enrollments
- **Method**: `GET`
- **Endpoint**: `/enrollments` OR `/bootcamps/:bootcampId/enrollments`
- **Auth**: Private (Role: `publisher`, `admin`)
- **Response** (200): `{ "success": true, "count": 1, "data": [...] }`

### Create Enrollment
- **Method**: `POST`
- **Endpoint**: `/enrollments` OR `/bootcamps/:bootcampId/enrollments`
- **Auth**: Private (Role: `user`, `admin`)
- **Response** (201): `{ "success": true, "data": { ... } }`

### Get Current User Enrollments
- **Method**: `GET`
- **Endpoint**: `/enrollments/me`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": [...] }`

### Get Single Enrollment
- **Method**: `GET`
- **Endpoint**: `/enrollments/:id`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": { ... } }`

### Approve Enrollment
- **Method**: `PUT`
- **Endpoint**: `/enrollments/:id/approve`
- **Auth**: Private (Role: `publisher`, `admin`)
- **Response** (200): `{ "success": true, "data": { "status": "approved" } }`

### Reject Enrollment
- **Method**: `PUT`
- **Endpoint**: `/enrollments/:id/reject`
- **Auth**: Private (Role: `publisher`, `admin`)
- **Response** (200): `{ "success": true, "data": { "status": "rejected" } }`

---

## 7. Wishlist (`/wishlist`)

### Get Wishlist
- **Method**: `GET`
- **Endpoint**: `/wishlist`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": [...] }`

### Add to Wishlist
- **Method**: `POST`
- **Endpoint**: `/wishlist/:bootcampId`
- **Auth**: Private
- **Response** (201): `{ "success": true, "data": { ... } }`

### Remove from Wishlist
- **Method**: `DELETE`
- **Endpoint**: `/wishlist/:bootcampId`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": {} }`

### Clear Wishlist
- **Method**: `DELETE`
- **Endpoint**: `/wishlist`
- **Auth**: Private
- **Response** (200): `{ "success": true, "data": {} }`
