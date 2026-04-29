**Leave Management System API (Node.js + TypeScript)**

*Description*

This project provides a REST API for managing employee leaves using:

- Node.js
- Express.js
- TypeScript
- MySQL

Users can register, login, apply for leave, and track leave status.
Admin can manage leave approvals and holidays.

 **Features**

- User Registration & Login (JWT Authentication)
- Apply Leave
- Get All Leaves / My Leaves
- Update Leave Status (Approve / Reject)
- Holiday Management
- Password hashing using bcrypt
- MySQL database integration
- MVC Architecture
- Environment variable support using dotenv

**Project Structure**

project-root/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── leaveController.ts
│   │   └── holidayController.ts
│   │
│   ├── middleware/
│   │   └── authMiddleware.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── leaveRoutes.ts
│   │   └── holidayRoutes.ts
│   │
│   ├── app.ts
│
├── .env
├── package.json
├── tsconfig.json


**Database Setup**

Table: users

Columns:
name
email
password
Emp_id

Table: leaves

Column:
id| INT (PK)
user_id| INT
leave_type| VARCHAR
from_date| DATE
to_date| DATE
reason| TEXT
status| VARCHAR

---

Table: holidays

Column| Type
id| INT
title| VARCHAR
date| DATE

---

🔗 API Endpoints

Register
POST /api/register
Sample Request:

{
  "name": "Vaishu",
  "email": "vaishu1810@gmail.com,
  "password": "1234",
  "Emp_id": "EMP001"
  }

---

Login

POST /api/login

Sample Request:

{
 
  "name": "Vaishu",
  "email": "vaishu1810@gmail.com,
  "password": "1234",
  "Emp_id": "EMP001"
  
}

---

Leave APIs

Apply Leave

POST /api/leave

{
  "leave_type": "Sick",
  "from_date": "2026-04-29",
  "to_date": "2026-04-30",
  "reason": "Fever"
}

---

Get My Leaves

GET /api/leave

---

Update Leave Status

PUT /api/leave/:id

---

🎉 Holiday APIs

Get Holidays

GET /api/holidays

---

Add Holiday

POST /api/holidays

**Testing**

APIs tested using Postman and validated successfully.
