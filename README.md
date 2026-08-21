# DevCamp API 

> A feature-rich RESTful API for managing coding bootcamps, built with **Node.js**, **Express 5**, and **MongoDB**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-blue)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)](https://mongoosejs.com/)

---

##  Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running the Server](#-running-the-server)
- [API Overview](#-api-overview)
- [Security](#-security)
- [License](#-license)

---

##  Features

-  **Bootcamp Management** — Full CRUD with geolocation support and photo upload
-  **Course Management** — Nested under bootcamps with ownership control
-  **Authentication** — JWT-based auth with cookies, register/login/logout
-  **Password Recovery** — Forgot/reset password via email
-  **Reviews & Ratings** — Users can review bootcamps with average rating calculation
-  **Enrollment System** — Users enroll in bootcamps; publishers approve or reject
-  **Wishlist** — Users save bootcamps to their personal wishlist
-  **Role-Based Access Control** — `user`, `publisher`, and `admin` roles
-  **Advanced Filtering** — Filter, sort, select fields, and paginate any list endpoint
-  **Geosearch** — Find bootcamps within a radius using ZIP code
-  **Security Hardened** — Helmet, XSS, HPP, Mongo Sanitization, Rate Limiting

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Validation | Joi |
| File Upload | express-fileupload |
| Email | Nodemailer |
| Geocoding | node-geocoder |
| Security | Helmet, xss-clean, hpp, mongo-sanitize, express-rate-limit |

---

##  Project Structure

```
DevCamp/
├── config/               # DB connection
├── controllers/          # Route handler logic
│   ├── auth.js
│   ├── Bootcamp.js
│   ├── course.js
│   ├── enrollment.js
│   ├── review.js
│   ├── users.js
│   └── wishlist.js
├── middlewares/          # Custom middleware
│   ├── advancedResults.js
│   ├── auth.js
│   ├── authorize.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/               # Mongoose schemas
│   ├── Bootcamp.js
│   ├── Course.js
│   ├── Enrollment.js
│   ├── Review.js
│   ├── User.js
│   └── Wishlist.js
├── routes/               # Express routers
├── utils/                # Helper utilities
├── validations/          # Joi schema validators
├── public/uploads/       # Uploaded bootcamp photos
├── _data/                # Seed data (JSON)
├── api_documentation.md  # Full API docs with tables
├── seeder.js             # DB seeder script
└── index.js              # App entry point
```

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- A Mailtrap / SMTP account for email functionality
- A MapQuest / OpenStreetMap API key for geocoding

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ahmed441abdallah/DevCamp_Api.git

# 2. Navigate into the project
cd DevCamp_Api

# 3. Install dependencies
npm install

# 4. Create your .env file (see below)
cp .env.example .env
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/devcamp

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_email
SMTP_PASSWORD=your_password
FROM_EMAIL=noreply@devcamp.io
FROM_NAME=DevCamp

# Geocoder
GEOCODER_PROVIDER=mapquest
GEOCODER_API_KEY=your_geocoder_api_key
```

---

##  Running the Server

```bash
# Development (with nodemon hot-reload)
npm run dev

# Production
npm start
```

> Server runs on `http://localhost:3000` by default.

### Seed the Database

```bash
# Import sample data
node seeder.js -i

# Delete all data
node seeder.js -d
```

---

##  API Overview

> **Base URL:** `http://localhost:3000/api/v1`

For the full detailed API documentation including all endpoints, request/response bodies, and error codes, see  **[api_documentation.md](./api_documentation.md)**

### Quick Reference

| Resource | Base Path | Access |
|----------|-----------|--------|
| Auth | `/api/v1/auth` | Public / Private |
| Bootcamps | `/api/v1/bootcamps` | Public / Private |
| Courses | `/api/v1/courses` | Public / Private |
| Reviews | `/api/v1/reviews` | Public / Private |
| Enrollments | `/api/v1/enrollments` | Private |
| Users | `/api/v1/users` | Admin only |
| Wishlist | `/api/v1/wishlist` | Private |

### Authentication

Send the JWT token as:
- A cookie named `token` (set automatically), **or**
- A header: `Authorization: Bearer <token>`

### User Roles

| Role | Capabilities |
|------|-------------|
| `user` | Enroll in bootcamps, write reviews, manage wishlist |
| `publisher` | Create & manage one bootcamp and its courses, approve/reject enrollments |
| `admin` | Full access to all resources |

### Advanced Filtering (on list endpoints)

```
GET /api/v1/bootcamps?select=name,cost&sort=-createdAt&page=1&limit=5
GET /api/v1/bootcamps?cost[lte]=5000
GET /api/v1/bootcamps?careers[in]=Web Development
```

---

##  Security

The following security measures are applied globally:

| Middleware | Purpose |
|------------|---------|
| `helmet` | Secure HTTP response headers |
| `xss-clean` | Sanitize inputs against XSS attacks |
| `hpp` | Prevent HTTP Parameter Pollution |
| `mongo-sanitize` | Block MongoDB operator injection in body/params/query |
| `express-rate-limit` | Limit login attempts to 5 per 15 minutes per IP/email |
| `cors` | Cross-Origin Resource Sharing with credentials |

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---
##  Api Doc

https://documenter.getpostman.com/view/28582652/2sBYArVYv6#094ad454-822b-45bc-adf8-b2c5a5c18de1

---

<p align="center">Built with ❤️ by <a href="https://github.com/ahmed441abdallah">Ahmed Abdallah</a></p>
