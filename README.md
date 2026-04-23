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

3. Create `.env` file

PORT=5000
JWT_SECRET=supersecretkey
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Root1234
DB_NAME=rbac

4. Run project
   npm run dev

---

## API Testing

### Register

POST /api/auth/register

{
"name": "Admin",
"email": "[admin@test.com](mailto:admin@test.com)",
"password": "123456",
"role": "SUPER_ADMIN"
}

### Login

POST /api/auth/login

{
"email": "[admin@test.com](mailto:admin@test.com)",
"password": "123451"
}

---

## Roles

* SUPER_ADMIN
* HR_ADMIN
* MANAGER
* EMPLOYEE
* FINANCE
* CLIENT

---

## Protected Routes

* /api/admin
* /api/hr
* /api/manager
* /api/employee
* /api/finance
* /api/client

---

## Notes

* JWT token required for protected APIs
* Use Authorization header:
  Authorization: Bearer <token>

---

