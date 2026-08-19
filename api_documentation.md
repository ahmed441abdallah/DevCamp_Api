# DevCamp API Documentation

> **Base URL:** `http://localhost:3000/api/v1`

---

## Table of Contents

| # | Resource | Base Path |
|---|----------|-----------|
| 1 | [Authentication](#1-authentication) | `/auth` |
| 2 | [Bootcamps](#2-bootcamps) | `/bootcamps` |
| 3 | [Courses](#3-courses) | `/courses` |
| 4 | [Reviews](#4-reviews) | `/reviews` |
| 5 | [Enrollments](#5-enrollments) | `/enrollments` |
| 6 | [Users](#6-users-admin-only) | `/users` |
| 7 | [Wishlist](#7-wishlist) | `/wishlist` |

---

## Authentication Overview

Authentication is handled via **JWT tokens** sent as:
- An `HttpOnly` cookie named `token` (set automatically on login/register), OR
- An `Authorization: Bearer <token>` header.

### Roles

| Role | Description |
|------|-------------|
| `user` | Regular student. Can enroll, review, and manage their wishlist. |
| `publisher` | Can create and manage bootcamps and courses. Can approve/reject enrollments. |
| `admin` | Full access to all resources. |

---

## Standard Error Responses

All error responses follow this format:

```json
{ "success": false, "message": "Descriptive error message" }
```

| HTTP Status | Meaning | Common Cause |
|-------------|---------|--------------|
| `400` | Bad Request | Validation error or malformed body |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid token but insufficient role |
| `404` | Not Found | Resource does not exist |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server-side error |

---

## Query String Features (Advanced Results)

Endpoints marked with ⚙️ support the following query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `select` | Fields to return (comma-separated) | `?select=name,email` |
| `sort` | Sort by field (prefix `-` for desc) | `?sort=-createdAt` |
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Results per page (default: 10) | `?limit=5` |
| `field[operator]` | Filter with `gt`, `gte`, `lt`, `lte`, `in` | `?cost[lte]=5000` |

---

## 1. Authentication

**Base Path:** `/api/v1/auth`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public 🔒 Rate-limited | Login and receive token |
| `GET` | `/auth/me` | 🔐 Private | Get logged-in user profile |
| `POST` | `/auth/logout` | 🔐 Private | Logout (clears cookie) |
| `POST` | `/auth/forgot-password` | Public | Send password reset email |
| `PUT` | `/auth/reset-password/:resettoken` | Public | Reset password using token |
| `PUT` | `/auth/update-password` | 🔐 Private | Update current password |

---

### `POST /auth/register`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | Full name |
| `email` | String | ✅ | Valid email address |
| `password` | String | ✅ | Min 6 characters |
| `role` | String | ✅ | `user` or `publisher` |

**Successful Response (201):**
```json
{ "success": true, "token": "<jwt_token>" }
```

---

### `POST /auth/login`

> ⚠️ Rate-limited to **5 attempts per 15 minutes** per IP/Email combination.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | String | ✅ |
| `password` | String | ✅ |

**Successful Response (200):**
```json
{ "success": true, "token": "<jwt_token>" }
```

**Error Responses:**

| Status | Message |
|--------|---------|
| `400` | Validation error |
| `401` | Invalid credentials |
| `429` | Too many login attempts. Please try again after 15 minutes. |

---

### `GET /auth/me`

**Auth:** 🔐 Private  
**Successful Response (200):**
```json
{ "success": true, "data": { "_id": "...", "name": "...", "email": "...", "role": "..." } }
```

---

### `POST /auth/forgot-password`

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | String | ✅ |

**Successful Response (200):**
```json
{ "success": true, "message": "Email sent" }
```

---

### `PUT /auth/reset-password/:resettoken`

**URL Params:** `resettoken` — Token received in email.

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `password` | String | ✅ |

**Successful Response (200):**
```json
{ "success": true, "token": "<jwt_token>" }
```

---

### `PUT /auth/update-password`

**Auth:** 🔐 Private

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `currentPassword` | String | ✅ |
| `newPassword` | String | ✅ |

**Successful Response (200):**
```json
{ "success": true, "token": "<jwt_token>" }
```

---

## 2. Bootcamps

**Base Path:** `/api/v1/bootcamps`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/bootcamps` ⚙️ | Public | Get all bootcamps (paginated) |
| `GET` | `/bootcamps/:id` | Public | Get single bootcamp |
| `POST` | `/bootcamps` | 🔐 publisher, admin | Create new bootcamp |
| `PUT` | `/bootcamps/:id` | 🔐 publisher (owner), admin | Update a bootcamp |
| `DELETE` | `/bootcamps/:id` | 🔐 publisher (owner), admin | Delete a bootcamp |
| `GET` | `/bootcamps/radius/:zip/:distance` | Public | Get bootcamps within radius |
| `PUT` | `/bootcamps/:id/photo` | 🔐 publisher (owner), admin | Upload bootcamp photo |

---

### `GET /bootcamps` ⚙️

**Auth:** Public  
**Successful Response (200):**
```json
{
  "success": true,
  "count": 10,
  "pagination": { "page": 1, "limit": 10, "total": 25, "next": { "page": 2, "limit": 10 } },
  "data": [...]
}
```

---

### `POST /bootcamps`

**Auth:** 🔐 `publisher`, `admin`  
> A `publisher` can only create **one** bootcamp.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | Bootcamp name |
| `description` | String | ✅ | Short description |
| `website` | String | ❌ | URL |
| `phone` | String | ❌ | Phone number |
| `email` | String | ❌ | Contact email |
| `address` | String | ✅ | Physical address |
| `careers` | Array | ✅ | e.g. `["Web Development"]` |
| `housing` | Boolean | ❌ | Offers housing? |
| `jobAssistance` | Boolean | ❌ | Offers job help? |
| `jobGuarantee` | Boolean | ❌ | Job guarantee? |
| `acceptGi` | Boolean | ❌ | Accepts GI Bill? |

**Successful Response (201):**
```json
{ "success": true, "data": { ... } }
```

---

### `GET /bootcamps/radius/:zip/:distance`

**URL Params:**

| Param | Description |
|-------|-------------|
| `zip` | ZIP code to search from |
| `distance` | Radius in miles |

**Successful Response (200):**
```json
{ "success": true, "count": 3, "data": [...] }
```

---

### `PUT /bootcamps/:id/photo`

**Auth:** 🔐 `publisher` (owner), `admin`  
**Body:** `multipart/form-data`

| Field | Type | Required | Constraint |
|-------|------|----------|------------|
| `photo` | File | ✅ | Image only, max 5MB |

**Successful Response (200):**
```json
{ "success": true, "data": "photo-filename.jpg" }
```

---

## 3. Courses

**Base Path:** `/api/v1/courses` and `/api/v1/bootcamps/:bootcampId/courses`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/courses` | Public | Get all courses |
| `GET` | `/bootcamps/:bootcampId/courses` | Public | Get courses for a specific bootcamp |
| `GET` | `/courses/:id` | Public | Get single course |
| `POST` | `/courses` or `/bootcamps/:bootcampId/courses` | 🔐 publisher, admin | Create a course |
| `PUT` | `/courses/:id` | 🔐 publisher (owner), admin | Update a course |
| `DELETE` | `/courses/:id` | 🔐 publisher (owner), admin | Delete a course |

**Successful Response (200):**
```json
{ "success": true, "count": 5, "data": [...] }
```

---

## 4. Reviews

**Base Path:** `/api/v1/reviews` and `/api/v1/bootcamps/:bootcampId/reviews`

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/reviews` ⚙️ | Public | Get all reviews |
| `GET` | `/bootcamps/:bootcampId/reviews` | Public | Get reviews for a bootcamp |
| `GET` | `/reviews/:id` | Public | Get single review |
| `POST` | `/reviews/:bootcampId` | 🔐 user, admin | Create a review |
| `PUT` | `/reviews/:id` | 🔐 user (owner), admin | Update a review |
| `DELETE` | `/reviews/:id` | 🔐 user (owner), admin | Delete a review |

---

### `POST /reviews/:bootcampId`

**Auth:** 🔐 `user`, `admin`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Short review title |
| `text` | String | ✅ | Review content |
| `rating` | Number | ✅ | Rating from 1 to 10 |

**Successful Response (201):**
```json
{ "success": true, "data": { ... } }
```

---

## 5. Enrollments

**Base Path:** `/api/v1/enrollments` and `/api/v1/bootcamps/:bootcampId/enrollments`

> A user can only enroll in the same bootcamp **once**.  
> Enrollment status: `pending` → `approved` or `rejected`.

### Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/enrollments` | 🔐 publisher, admin | Get all enrollments |
| `GET` | `/bootcamps/:bootcampId/enrollments` | 🔐 publisher, admin | Get enrollments for a bootcamp |
| `GET` | `/enrollments/me` | 🔐 Any logged-in | Get current user's enrollments |
| `GET` | `/enrollments/:id` | 🔐 Any logged-in | Get single enrollment |
| `POST` | `/enrollments` or `/bootcamps/:bootcampId/enrollments` | 🔐 user, admin | Enroll in a bootcamp |
| `PUT` | `/enrollments/:id/approve` | 🔐 publisher, admin | Approve an enrollment |
| `PUT` | `/enrollments/:id/reject` | 🔐 publisher, admin | Reject an enrollment |

---

### Enrollment Object

| Field | Type | Values |
|-------|------|--------|
| `_id` | String | Unique ID |
| `user` | ObjectId | Reference to User |
| `bootcamp` | ObjectId | Reference to Bootcamp |
| `status` | String | `pending`, `approved`, `rejected` |
| `createdAt` | Date | Timestamp |

**Approve/Reject Response (200):**
```json
{ "success": true, "data": { "_id": "...", "status": "approved" } }
```

---

## 6. Users (Admin Only)

**Base Path:** `/api/v1/users`

> 🔐 All endpoints require `admin` role.

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` ⚙️ | Get all users (paginated) |
| `GET` | `/users/:id` | Get single user |
| `POST` | `/users` | Create a user |
| `PUT` | `/users/:id` | Update a user |
| `DELETE` | `/users/:id` | Delete a user |

**Successful Response (200):**
```json
{ "success": true, "count": 5, "pagination": { ... }, "data": [...] }
```

---

## 7. Wishlist

**Base Path:** `/api/v1/wishlist`

> 🔐 All endpoints require authentication (any role).

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/wishlist` | Get current user's wishlist |
| `POST` | `/wishlist/:bootcampId` | Add a bootcamp to wishlist |
| `DELETE` | `/wishlist/:bootcampId` | Remove a bootcamp from wishlist |
| `DELETE` | `/wishlist` | Clear entire wishlist |

**Successful Response (200):**
```json
{ "success": true, "data": [...] }
```

---

## Security Middleware

The following security layers are applied globally to all requests:

| Middleware | Purpose |
|------------|---------|
| `helmet` | Sets secure HTTP headers |
| `xss-clean` | Sanitizes request body against XSS attacks |
| `hpp` | Prevents HTTP Parameter Pollution |
| `mongo-sanitize` | Sanitizes `body`, `params`, and `query` against MongoDB injection |
| `express-rate-limit` | Rate limiting on the login endpoint (5 req / 15 min) |
| `cors` | Cross-Origin Resource Sharing enabled with credentials |
