**HRMS Backend Application**

The HRMS Backend Application is designed to manage employee operations efficiently within an organization.
This application includes the following modules:

- Authentication Module
- Holiday Module
- Leave Management Module
- Leave Type Management Module
- Team Leave Calendar Module
- Audit Logs Module

The application follows a layered architecture using:

- Controllers
- Services
- Repositories
- Validations
- Middleware
- Constants
- Utilities
- Configuration
- MSSQL Stored Procedures

**Technology Stack**

- Node.js
- TypeScript
- Express.js
- Microsoft SQL Server (MSSQL)
- JWT Authentication
- Express Validator
- Bcrypt
- Nodemailer
- CORS
- Dotenv
- Morgan
- Helmet
- TS-Node-Dev

**Project Structure**

src/
│
├── config/
│   ├── db.ts
│   ├── env.ts
│   ├── jwt.ts
│   └── mail.ts
│
├── controllers/
│   ├── audit/
│   ├── authentication/
│   ├── holiday/
│   └── leave/
│
├── services/
│   ├── audit/
│   ├── authentication/
│   ├── holiday/
│   └── leave/
│
├── repositories/
│   ├── audit/
│   ├── authentication/
│   ├── holiday/
│   └── leave/
│
├── validations/
│   ├── audit/
│   ├── authentication/
│   ├── holiday/
│   └── leave/
│
├── middleware/
│
├── routes/
│
├── constants/
│
├── utils/
│
├── app.ts
│
└── server.ts

**Features**

**Authentication Module**

- User Registration
- User Login
- Forgot Password
- Reset Password
- Refresh Token
- Send Email Verification
- Verify Email
- JWT Authentication
- Role-Based Authorization

**Holiday Module**

- Add Holiday
- Get All Holidays
- Delete Holiday
- Holiday History
- Remaining Holidays
- Used Holidays
- Total Holidays
  
**Leave Management Module**

- Apply Leave
- View All Leaves
- Update Leave Status
- Leave Notifications
- Notification Visibility

**Leave Type Management**

- Add Leave Type
- View Leave Types
- Update Leave Type
- Delete Leave Type
- Dynamic Leave Category Management

**Team Leave Calendar**

- View Team Leave Schedule
- Track Employee Leave Dates
- Team Leave Visibility
- Resource Planning Support
- Avoid Leave Conflicts

**Audit Logs Module**

- User Activity Tracking
- Leave Activity Tracking
- Holiday Activity Tracking
- Authentication Activity Tracking
- System Audit History
- Audit Log Retrieval
- Created By / Updated By Tracking

Authentication APIs

Register

POST /api/auth/register

Login

POST /api/auth/login

Forgot Password

POST /api/auth/forgot-password

Reset Password

POST /api/auth/reset-password

Send Email Verification

POST /api/auth/send-verification

Verify Email

POST /api/auth/verify-email

Refresh Token

POST /api/auth/refresh-token

---

Holiday APIs

Add Holiday

POST /api/holiday/add

Get Holidays

GET /api/holiday/all

Delete Holiday

DELETE /api/holiday/delete/:id

Holiday History

GET /api/holiday/history

Remaining Holidays

GET /api/holiday/remaining

Used Holidays

GET /api/holiday/used

Total Holidays

GET /api/holiday/total

---

Leave APIs

Apply Leave

POST /api/leave/apply

Get All Leaves

GET /api/leave/all

Update Leave Status

PUT /api/leave/status/:Emp_id

Team Leave Calendar

GET /api/leave/team-calendar

Add Leave Type

POST /api/leave/leave-type/add

Get Leave Types

GET /api/leave/leave-type/all

Update Leave Type

PUT /api/leave/leave-type/update/:id

Delete Leave Type

DELETE /api/leave/leave-type/delete/:id

---

Audit APIs

Get Audit Logs

GET /api/audit/all

---

**Installation**

Clone Repository

git clone <repository-url>

Install Dependencies

npm install

---

**Required Packages**

Express

npm install express
npm install --save-dev @types/express

Express Validator

npm install express-validator

JWT

npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken

Bcrypt

npm install bcrypt
npm install --save-dev @types/bcrypt

MSSQL

npm install mssql

Nodemailer

npm install nodemailer
npm install --save-dev @types/nodemailer

CORS

npm install cors
npm install --save-dev @types/cors

Dotenv

npm install dotenv

Morgan

npm install morgan
npm install --save-dev @types/morgan

Helmet

npm install helmet

TS Node Dev

npm install --save-dev ts-node-dev

TypeScript

npm install --save-dev typescript

---

**Run Application**

Development

npm run dev

Build

npm run build

Production

npm start

---

Environment Variables

Create a ".env" file in the root directory.

PORT=5000

DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=HRMS

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password

ALLOWED_ORIGIN=http://localhost:5173

---

Authentication

All APIs are protected using JWT Authentication.

Header

Authorization: Bearer <token>

Authenticated user information is extracted from the JWT token and used throughout the application.

---

Error Handling

The application uses centralized error handling middleware for:

- Validation Errors
- Authentication Errors
- Authorization Errors
- Database Errors
- Internal Server Errors

---

Validation

Request validations are implemented using:

- Express Validator

Validation is handled through reusable validation middleware.

---

Database

Database operations are performed using:

Microsoft SQL Server (MSSQL)

Architecture:

Controller
    ↓
Service
    ↓
Repository
    ↓
Stored Procedure
    ↓
Database

---

Security

- JWT Authentication
- Password Hashing using Bcrypt
- Secure Environment Variables
- Role-Based Authorization
- Request Validation
- CORS Protection
- Helmet Security Headers

---

Developed and maintained the HRMS Backend Application using:

- Node.js
- TypeScript
- Express.js
- Microsoft SQL Server (MSSQL)
- JWT Authentication
- Express Validator
- Bcrypt
- Nodemailer
- Audit Logging
- Layered Architecture
- RESTful APIs

The API's haven't been teste dyet because the stored procudures are still pending.
