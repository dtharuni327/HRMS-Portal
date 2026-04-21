# HRMS Portal - Employee CRUD API

## Description

This project provides REST APIs to perform CRUD (Create, Read, Update) operations on Employee data.

As part of **Sprint 1**, the following functionalities are implemented:

Get all employees
Get employee by ID
Add new employee
Update employee details

---

## Tech Stack

Node.js
Express.js
TypeScript
MySQL

---

## Project Structure

HRMS-PORTAL
├── src
│   ├── config        # Database configuration (db.ts)
│   ├── controllers   # API logic (employeeController.ts)
│   ├── models        # Present (not used in current sprint)
│   ├── routes        # API routes (employeeRoutes.ts)
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore

---

## Setup Instructions

1. Clone the repository

2. Install dependencies:
   npm install

3. Configure database in:
   src/config/db.ts

4. Run the application:
   npm run dev

---

## Database Details

**Database:** MySQL

**Table:** Employee

**Columns:**

Id (Primary Key)
Emp_id (Unique)
Name
Email
Phone
Role

---

## API Endpoints (Sprint 1)

### GET

`http://localhost:3000/api/employees` - Fetch all employees

`http://localhost:3000/api/employee/id` - Fetch employee by ID

---

## Sample Request 
`http://localhost:3000/api/employee/4`

---

### POST

`/employees` → Create a new employee

### PUT

`/employees/:id` → Update employee details

---

## Sample Request

POST /employees

{
"Emp_id": "E101",
"Name": "John",
"Email": "[john@gmail.com](mailto:john@gmail.com)",
"Phone": "98710",
"Role": "Developer"
}

---

## Testing
APIs tested using Postman and validated.