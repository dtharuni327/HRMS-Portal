**HRMS Backend Application**
The HRMS Backend Application is designed to manage employee operations efficiently within an organization.
This application includes the following modules:

- Authentication Module
- Holiday Module
- Leave Management Module
- Department Module
- Role Module

**The application follows a layered architecture using:**

- Controllers
- Services
- Repositories
- Validations
- Middleware
- Constants
- Utilities
- MSSQL Stored Procedures

---

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
│   ├── authentication/
│   ├── holiday/
│   ├── leave/
│   ├── department/
│   └── role/
│
├── services/
│   ├── authentication/
│   ├── holiday/
│   ├── leave/
│   ├── department/
│   └── role/
│
├── repositories/
│   ├── authentication/
│   ├── holiday/
│   ├── leave/
│   ├── department/
│   └── role/
│
├── validations/
│   ├── authentication/
│   ├── holiday/
│   ├── leave/
│   ├── department/
│   └── role/
│
├── middleware/
│
├── routes/
│   ├── authentication.routes.ts
│   ├── holiday.routes.ts
│   ├── leave.routes.ts
│   ├── department.routes.ts
│   └── role.routes.ts
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

**Holiday Module**

- Add Holiday
- Get All Holidays
- Delete Holiday
- Holiday History
- Remaining Holidays
- Used Holidays
- Total Holidays

**Leave Module**

- Apply Leave
- View All Leaves
- Update Leave Status
- Leave Notifications
- Notification Visibility

**Department Module**

- Add Department
- Get All Departments
- Update Department Details

**Role Module**

- Add Role
- Get All Roles (With Department)
- Update Role Details


**Authentication APIs**

Register

POST /auth/register

Login

POST /auth/login

Forgot Password

POST /auth/forgot-password

Reset Password

POST /auth/reset-password

Send Email Verification

POST /auth/send-verification

Verify Email

POST /auth/verify-email

Refresh Token

POST /auth/refresh-token

**Holiday APIs**

Add Holiday

POST /holiday/add

Get Holidays

GET /holiday/all

Delete Holiday

DELETE /holiday/delete/:client_id

Holiday History

GET /holiday/history

Remaining Holidays

GET /holiday/remaining

Used Holidays

GET /holiday/used

Total Holidays

GET /holiday/total

**Leave APIs**

Apply Leave

POST /leave/apply

Get All Leaves

GET /leave/all

Update Leave Status

PUT /leave/status

Get Leave Notifications

GET /leave/notifications

Update Notification Visibility

PUT /leave/visibility

**Department APIs**

Add Department

POST /department/add

Get Departments

GET /department/all

Update Department

PUT /department/update/:department_id

**Role APIs**

Add Role

POST /role/add

Get Roles (With Department Filter)

GET /role/all

Update Role

PUT /role/update/:role_id

**Installation**

Clone Repository

git clone <repository-url>

Install Dependencies

npm install

Required Packages

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

Development Dependencies

npm install --save-dev typescript ts-node nodemon

**Run Application**

Development

npm run dev

Build

npm run build

Production

npm start


**Environment Variables**

Create a ".env" file in the root directory.

PORT=5000

DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=HRMS

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_email_password

**Authentication**

All APIs are protected using JWT Authentication.

Header

Authorization: Bearer <token>

Authenticated user information is extracted from the JWT token and used throughout the application.

**Error Handling**

The application uses centralized error handling middleware for:

- Validation Errors
- Authentication Errors
- Database Errors
- Internal Server Errors

**Validation**

Request validations are implemented using:

Express Validator

Validation is handled through reusable validation middleware.

**Database**

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

Developed and maintained the HRMS Backend Application using:

- Node.js
- TypeScript
- Express.js
- Microsoft SQL Server (MSSQL)
- JWT Authentication
- Express Validator
