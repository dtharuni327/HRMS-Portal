# HRMS Backend (RBAC)

## Project Overview

This is a Role-Based Access Control (RBAC) backend system for HRMS.
It includes authentication and role-based authorization for different users.

---

## Features

* User Registration & Login
* JWT Authentication
* Role-based Access Control
* Protected APIs for different roles

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MySQL
* JWT

---

## Setup Instructions

1. Clone the repository

2. Install dependencies
   npm install

3. Create .env File

Create a .env file in the root directory:

PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Root1234
DB_NAME=rbac

JWT_SECRET=supersecretkey

4. Run the Server
npm run dev

Server will start at:

http://localhost:5000


API Testing (Postman)


1. Register User

POST /api/auth/register

Request Body
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "SUPER_ADMIN"
}

Valid Roles
SUPER_ADMIN, HR_ADMIN, MANAGER, EMPLOYEE, FINANCE, CLIENT

Response
{
  "message": "User Registered Successfully"
}

2. Login User

POST /api/auth/login

Request Body
{
  "email": "admin@test.com",
  "password": "123456"
}

Response
{
  "message": "Login Success",
  "token": "JWT_TOKEN"
}

Authorization Header

Add this in Postman:

Authorization: Bearer YOUR_TOKEN


3. Role-Based APIs

Role	             Endpoint
SUPER_ADMIN	         GET /api/admin
HR_ADMIN	         GET /api/hr
MANAGER	             GET /api/manager
EMPLOYEE	         GET /api/employee
FINANCE	             GET /api/finance
CLIENT	             GET /api/client

Test Scenarios

  1. Valid Access
  HR user → /api/hr → Success
  ❌ Unauthorized Access

  2. Employee → /api/admin → Access Denied
  ❌ Invalid Token

  3. No token → 401 Unauthorized
  ❌ Duplicate Email

  4. Same email → "Email already exists"
  ❌ Invalid Role

  5. Wrong role → "Invalid role"

## Security Features

* Password hashing using bcrypt
* JWT authentication
* Role-based authorization
* Environment variables for sensitive data


## Notes

* JWT token required for protected APIs
* Use Authorization header:
  Authorization: Bearer <token>

## Testing from tester side 

APIs tested using **Postman** and validated successfully.
