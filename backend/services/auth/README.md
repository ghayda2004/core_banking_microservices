# Auth Microservice

Authentication service for Core Banking Platform.

## Features

- User registration
- User login with JWT
- Token verification for other services
- Role-based authentication (client, admin, banker)

## Technology Stack

- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Environment Variables

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/core_banking_auth
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "client"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client"
  }
}
```

### POST /api/auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client"
  }
}
```

### POST /api/auth/verify
Verify JWT token (for inter-service communication)

**Request:**
```json
{
  "token": "jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "client"
  }
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "service": "auth",
  "timestamp": "2025-02-15T..."
}
```
