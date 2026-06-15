# HRMS Unified Backend API

## Overview

HRMS Unified Backend API is a RESTful backend application built using:

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Authentication

This project provides APIs for:

- Authentication & Authorization
- Employee Management
- Attendance Management
- Leave Management
- Holiday Management
- Department Management
- Role-Based Access Control (RBAC)

===============================================

# Features

## Authentication Module

- User Registration
- User Login
- JWT Authentication
- Protected APIs
- Role-Based Access Control (RBAC)
- Password Hashing using bcrypt

-----------------------------------------------

## Password Management
 
- Forgot Password (OTP)
- Reset Password
 
-----------------------------------------------


## Email verification
 
- Send otp
- Verify Email OTP

-----------------------------------------------

## Employee Module

- Get all employees
- Get employee by Emp_id
- Create employee
- Update employee
- Filter employees
- Search employees

------------------------------------------------

## Attendance Module

- Punch In
- Punch Out
- Attendance History
- Attendance Summary
- Work Mode Tracking (WFH/WFO)

-----------------------------------------------

## Leave Management Module

- Apply Leave
- Get My Leaves
- Get All Leaves
- Approve / Reject Leave Requests
- Leave Status Tracking

----------------------------------------------

## Holiday Management

- Add Holidays
- Get Holidays
- Delete Holidays

----------------------------------------------

## Department Management

- Get Departments
- Create Department
- Update Department

=============================================================

# Tech Stack

- Node.js
- Express.js
- TypeScript
- MySQL
- JWT Authentication
- bcrypt
- dotenv
- cors

=============================================================

# Project Structure

```bash
src/
│
├── config/
│   ├── db.ts
│ 
├── cron/
│   ├── cron.ts
|
├── controllers/
│   ├── authController.ts
│   ├── employeeController.ts
    └── deparmentController.ts
│   ├── attendanceController.ts
│   ├── leaveController.ts
│   └── holidayController.ts 
│   └── roleController.ts 
│
├── middleware/
│   ├── authMiddleware.ts
│   └── roleMiddleware.ts
│
├── routes/
│   ├── authRoutes.ts
│   ├── employeeRoutes.ts
│   ├── attendanceRoutes.ts
│   ├── leaveRoutes.ts
│   ├── holidayRoutes.ts
│   └── departmentRoutes.ts
│   └── rolesRoutes.ts
│
├── services/
│
├── utils/
│
├── types/
│   └── express.ts
│
├── app.ts
└── server.ts
```

=============================================================

# Setup Instructions

## 1. Clone Repository

```bash
git clone <repo-url>
cd <project-folder>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Install Required Packages

```bash
npm install express mysql2 dotenv cors bcrypt jsonwebtoken
```

## 4. Install Development Dependencies

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors
```

## 5. Environment Variables

Create a `.env` file in the root directory.

  PORT=5000
  ALLOWED_ORIGIN=http://localhost:5173

  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=your_password
  DB_NAME=hrms_portal

  MAIL_USER=yourgmail@gmail.com
  MAIL_PASS=your_generate_app_password
  JWT_SECRET=accesssecret
  JWT_REFRESH_SECRET=refreshsecret

  **To generate the Gmail App Password:**
      Open your Google Account
      Go to Security
      Turn ON 2-Step Verification
      Search for App Passwords
      Click App Passwords
      Select:
      App → Mail
      Device → Windows Computer (or Custom Name)
      Click Generate
      Google will give a 16-character password like
      gxmz iblm eyig qtiu
 
## 6. Install nodemailer
```bash
npm install nodemailer
```
 
## 7.Install nodemailer type
```bash
 npm install --save-dev @types/nodemailer
 ```


==============================================================



# DATABASE (FULL STRUCTURE)

```sql
CREATE DATABASE hrms_portal;
GO
USE hrms_portal;
GO
/* =====================================================
 
   DEPARTMENT TABLE
 
===================================================== */
CREATE TABLE Department (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName VARCHAR(100)
    UNIQUE NOT NULL
);
 
GO
/* =====================================================
   INSERT DEPARTMENTS
===================================================== */
INSERT INTO Department (DepartmentName)
VALUES
('Engineering'),
('QA'),
('HR'),
('Finance');
GO
/* =====================================================
   ROLES TABLE
===================================================== */
CREATE TABLE roles (
    id INT IDENTITY(1,1) PRIMARY KEY,
    role_name VARCHAR(50)
    UNIQUE NOT NULL
);
GO
/* =====================================================
   INSERT ROLES
===================================================== */
INSERT INTO roles (role_name)
VALUES
('SUPER_ADMIN'),
('HR_ADMIN'),
('MANAGER'),
('EMPLOYEE'),
('FINANCE'),
('CLIENT');
GO
/* =====================================================
CLIENTS TABLE
===================================================== */
 
CREATE TABLE clients (
    client_id INT IDENTITY(1,1) PRIMARY KEY,
    client_name VARCHAR(100)
    NOT NULL,
    region VARCHAR(100)
    NULL,
    created_at DATETIME2
    DEFAULT GETDATE()
);
 
GO
 
/* =====================================================
   INSERT CLIENTS
===================================================== */
 
SET IDENTITY_INSERT clients ON;
GO
 
INSERT INTO clients
(
    client_id,
    client_name,
    region
)
 
VALUES
 
(
    1,
    'TCS Chennai',
    'Tamil Nadu'
),
 
(
    2,
    'Infosys US',
    'United States'
),
 
(
    3,
    'Dubai Client',
    'UAE'
);
GO
SET IDENTITY_INSERT clients OFF;
GO
/* =====================================================
   EMPLOYEE TABLE
===================================================== */
CREATE TABLE Employee (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(10)
    UNIQUE NULL,
    Name VARCHAR(100)
    NOT NULL,
    Email VARCHAR(100)
    UNIQUE NOT NULL,
    Phone VARCHAR(10)
    UNIQUE NOT NULL,
    RoleID INT
    NOT NULL,
    Department_id INT
    NOT NULL,
    client_id INT
    NULL,
    designation VARCHAR(100)
    NOT NULL,
    manager_id VARCHAR(10)
    NULL,
    joining_date DATE
    NOT NULL,
    employment_type VARCHAR(20)
    NOT NULL
    CHECK (
        employment_type IN (
            'FULL_TIME',
            'CONTRACT',
            'INTERN'
        )
    ),
    work_mode VARCHAR(20)
    NOT NULL
    CHECK (
        work_mode IN (
            'WFH',
            'WFO',
            'HYBRID'
        )
    ),
    profile_image VARCHAR(255)
    NULL,
    emergency_contact VARCHAR(10)
    NULL,
    employee_status VARCHAR(20)
    NOT NULL
    DEFAULT 'ACTIVE'
    CHECK (
        employee_status IN (
            'ACTIVE',
            'INACTIVE',
            'RESIGNED',
            'TERMINATED',
            'ON_NOTICE'
        )
    ),
CreatedAt DATETIME2
DEFAULT GETDATE(),
UpdatedAt DATETIME2
DEFAULT GETDATE(),
/* =============================
   FOREIGN KEYS
============================= */
CONSTRAINT fk_role
FOREIGN KEY (RoleID)
REFERENCES roles(id),
CONSTRAINT fk_department
FOREIGN KEY (Department_id)
REFERENCES Department(Id),
CONSTRAINT fk_employee_client
FOREIGN KEY (client_id)
REFERENCES clients(client_id)
ON DELETE SET NULL,
CONSTRAINT fk_manager
FOREIGN KEY (manager_id)
REFERENCES Employee(Emp_id) 
);
 
GO

/* =====================================================
   INDEXES
===================================================== */
CREATE INDEX idx_employee_role
ON Employee(RoleID);
CREATE INDEX idx_employee_department
ON Employee(Department_id);
CREATE INDEX idx_employee_manager
ON Employee(manager_id);
CREATE INDEX idx_employee_status
ON Employee(employee_status);
CREATE INDEX idx_employee_client
ON Employee(client_id);
GO
/* =====================================================
   SAMPLE EMPLOYEE DATA
===================================================== */
INSERT INTO Employee (
    Emp_id,
    Name,
    Email,
    Phone,
    RoleID,
    Department_id,
    client_id,
    designation,
    manager_id,
    joining_date,
    employment_type,
    work_mode,
    profile_image,
    emergency_contact,
    employee_status
)

VALUES

/* =========================
   SUPER ADMIN
========================= */

(
    'E001',
    'Kartick',
    'kartick@gmail.com',
    '9876213311',
    1,
    1,
    1,
    'Super Admin',
    NULL,
    '2024-01-10',
    'FULL_TIME',
    'WFO',
    NULL,
    '9123456780',
    'ACTIVE'
),

/* =========================
   HR ADMIN -> REPORTS TO E003
========================= */

(
    'E002',
    'Deepika',
    'deepika@gmail.com',
    '9876213312',
    2,
    3,
    1,
    'HR Admin',
    'E003',
    '2024-02-15',
    'FULL_TIME',
    'HYBRID',
    NULL,
    '9123456781',
    'ACTIVE'
),

/* =========================
   MANAGER 1
========================= */

(
    'E003',
    'Arun',
    'arun@gmail.com',
    '9876213313',
    3,
    1,
    2,
    'Engineering Manager',
    NULL,
    '2024-03-12',
    'FULL_TIME',
    'WFO',
    NULL,
    '9123456782',
    'ACTIVE'
),

/* =========================
   MANAGER 2
========================= */

(
    'E004',
    'Priya',
    'priya@gmail.com',
    '9876213314',
    3,
    2,
    1,
    'QA Manager',
    NULL,
    '2024-04-01',
    'FULL_TIME',
    'HYBRID',
    NULL,
    '9123456783',
    'ACTIVE'
),

/* =========================
   MANAGER 3
========================= */

(
    'E005',
    'Vignesh',
    'vignesh@gmail.com',
    '9876213315',
    3,
    4,
    3,
    'Finance Manager',
    NULL,
    '2024-04-18',
    'FULL_TIME',
    'WFH',
    NULL,
    '9123456784',
    'ACTIVE'
),

/* =========================
   EMPLOYEE 1 -> E003
========================= */

(
    'E006',
    'Kavin',
    'kavin@gmail.com',
    '9876213316',
    4,
    1,
    2,
    'Software Engineer',
    'E003',
    '2025-01-10',
    'FULL_TIME',
    'HYBRID',
    NULL,
    '9123456785',
    'ACTIVE'
),

/* =========================
   EMPLOYEE 2 -> E004
========================= */

(
    'E007',
    'Nisha',
    'nisha@gmail.com',
    '9876213317',
    4,
    2,
    1,
    'QA Engineer',
    'E004',
    '2025-02-20',
    'FULL_TIME',
    'WFO',
    NULL,
    '9123456786',
    'ACTIVE'
),

/* =========================
   EMPLOYEE 3 -> E005
========================= */

(
    'E008',
    'Rahul',
    'rahul@gmail.com',
    '9876213318',
    4,
    4,
    3,
    'Finance Executive',
    'E005',
    '2025-03-05',
    'FULL_TIME',
    'WFH',
    NULL,
    '9123456787',
    'ACTIVE'
),

/* =========================
   FINANCE -> E005
========================= */

(
    'E009',
    'Suresh',
    'suresh@gmail.com',
    '9876213319',
    5,
    4,
    3,
    'Finance Analyst',
    'E005',
    '2024-06-01',
    'FULL_TIME',
    'HYBRID',
    NULL,
    '9123456788',
    'ACTIVE'
);
GO
/* =====================================================
AUTHENTICATION TABLE
===================================================== */
CREATE TABLE authentication (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Emp_id VARCHAR(10) NOT NULL UNIQUE,
    client_id INT NULL,
    phone VARCHAR(20) UNIQUE NULL,
    active BIT DEFAULT 1,
    email_verified BIT DEFAULT 0,
    verify_email_token VARCHAR(255) NULL,
    reset_otp VARCHAR(10) NULL,
    reset_otp_expires DATETIME2 NULL,
    refresh_token VARCHAR(MAX) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT fk_auth_emp
FOREIGN KEY (Emp_id)
REFERENCES Employee(Emp_id),
CONSTRAINT fk_auth_client
FOREIGN KEY (client_id)
REFERENCES clients(client_id)
);
GO
-- =====================================================
-- ATTENDANCE TABLE
-- =====================================================
CREATE TABLE attendance (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(10) NOT NULL,
    date DATE,
    punch_in_time DATETIME,
    status VARCHAR(20),
    work_mode VARCHAR(10),
    punch_out_time DATETIME,
    punch_out_type VARCHAR(15),
    total_hours DECIMAL(5,2),
    CONSTRAINT chk_workmode
    CHECK (work_mode IN ('WFH','WFO','HYBRID')),
    CONSTRAINT fk_attendance_emp
    FOREIGN KEY (Emp_id)
    REFERENCES Employee(Emp_id)
);
GO
CREATE INDEX IX_Attendance_EmpDate
ON attendance(Emp_id, date);
GO
-- =====================================================
-- WFH REQUEST TABLE
-- =====================================================
CREATE TABLE WFH_Request (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(10) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR(MAX),
    status VARCHAR(20)
    DEFAULT 'Pending',
    approved_by VARCHAR(20),
    created_at DATETIME DEFAULT GETDATE(),
    CONSTRAINT chk_wfh_status
    CHECK (status IN ('Pending','Approved','Rejected')),
    CONSTRAINT fk_wfh_emp
    FOREIGN KEY (Emp_id)
    REFERENCES Employee(Emp_id)
);
GO
/* =====================================================
LEAVES TABLE
===================================================== */
CREATE TABLE leaves (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(10) NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR(MAX) NULL,
    status VARCHAR(20)
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
    DEFAULT 'PENDING',
    approved_by VARCHAR(100) NULL,
    approved_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_leaves_emp
    FOREIGN KEY (Emp_id)
    REFERENCES authentication(Emp_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
 
GO

 
 
/* =====================================================
   HOLIDAYS TABLE
===================================================== */
 
CREATE TABLE holidays (
    id INT IDENTITY(1,1) PRIMARY KEY,
    holiday_name VARCHAR(100) NOT NULL,
    holiday_date DATE NOT NULL,
    client_id INT NULL,
    region VARCHAR(100) NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
 
    /* =============================
       FOREIGN KEY
    ============================= */
 
    CONSTRAINT fk_holiday_client
    FOREIGN KEY (client_id)
    REFERENCES clients(client_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
 
GO
 
/* =====================================================
   SAMPLE HOLIDAY DATA
===================================================== */
 
INSERT INTO holidays
(
    holiday_name,
    holiday_date,
    client_id,
    region
)
 
VALUES
 
(
    'Diwali',
    '2026-11-12',
    1,
    'India'
),
 
(
    'Christmas',
    '2026-12-25',
    2,
    'United States'
),
 
(
    'Pongal',
    '2026-01-14',
    1,
    'Tamil Nadu'
),
 
(
    'Thanksgiving',
    '2026-11-26',
    2,
    'US'
);
 
GO
 
 
/* =====================================================
   TOKEN BLACKLIST TABLE
===================================================== */
 
CREATE TABLE token_blacklist (
    id INT IDENTITY(1,1) PRIMARY KEY,
    token VARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE()
);
 
GO
 
/* =====================================================
   JOIN QUERY
===================================================== */
 
SELECT
    h.holiday_name,
    h.holiday_date,
    c.client_name,
    h.region
FROM holidays h
JOIN clients c
ON h.client_id = c.client_id;
GO
/* =====================================================
   VIEW TABLE DATA
===================================================== */
SELECT * FROM Department;
SELECT * FROM roles;
SELECT * FROM clients;

SELECT * FROM Employee;

SELECT * FROM attendance;
SELECT * FROM WFH_Request;

SELECT * FROM authentication;

SELECT * FROM leaves;
SELECT * FROM holidays;
SELECT * FROM token_blacklist;
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;
GO

```

======================================================

# Access Control (RBAC)

 - ADMIN / HR_ADMMIN  → Full Access
 - MANAGER → Team Data
 - Employee → Own Data Only

=======================================================

# Run Application

## Development Mode

```bash
npm run dev
```
-------------------------------------------------------

## Production Mode

```bash
npm run build
npm start
```

--------------------------------------------------------

# Base URL

```bash
http://localhost:5000/api
```

=========================================================
# AUTHENTICATION APIs
=========================================================
REGISTER:
Post
http://localhost:5000/api/auth/register
 
Sample Request:
 
{
  "email": "karthi@gmail.com",
  "password": "12345",
  "Emp_id": "E001"
}
 
Sample Response:
 
{
    "message": "Register successful"
}
_________________________
 
2. LOGIN:
Post
http://localhost:5000/api/auth/login
 
Sample Request:
 
{
  "email": "karthi@gmail.com",
  "password": "12345"
}
 
Sample Response:
 
{
    "message": "Login successful",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbXBfaWQiOiJFMDAxIiwicm9sZSI6IlNVUEVSX0FETUlOIiwiaWF0IjoxNzc5MzczOTg4LCJleHAiOjE3NzkzNzQ4ODh9.xx0dD6OA3XzVctF_JV6-DO9tDVq8w5MOXcWWDry5VqM",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbXBfaWQiOiJFMDAxIiwiaWF0IjoxNzc5MzczOTg4LCJleHAiOjE3Nzk5Nzg3ODh9.K91NhUCXPpibRh0hYZpsPqPbShyj0hqUv6zv19JfJNM",
    "user": {
        "name": "Kartick",
        "email": "karthi@gmail.com",
        "Emp_id": "E001",
        "role": "SUPER_ADMIN"
    }
}
 
(OR)
 
**If you get result us password wrong then you can reset password**
_____________________________________
3. ACCESS TOKEN change:
POST
http://localhost:5000/api/auth/refresh-token
Sample Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbXBfaWQiOiJFMDAzIiwiaWF0IjoxNzc5NjkwNjQ3LCJleHAiOjE3ODAyOTU0NDd9.Naj1L2aNaniJLzEqpGq7nwvLJNJooe4REwjsodmID-8"
}
Sample Response:
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFbXBfaWQiOiJFMDAzIiwiaWF0IjoxNzc5NjkyNjg2LCJleHAiOjE3Nzk2OTM1ODZ9.uHmJDWJLO8raIQqlHa2vXA3gh8dUP4YT1D5cBBruMGU"
}
 
**A refresh token is used to generate a new access token when the current access token expires.
It helps users stay logged in without logging in again**
____________________________________________
4. FORGET-PASSWORD:
PUT
http://localhost:5000/api/auth/forgot-password
 
Sample Request:
 
{
  "email": "karthi@gmail.com"
}
 
Sample Response:
 
{
    "message": "OTP sent to email"
}
 
**The OTP is shared to the mail**
 
_____________________________________
 
5. RESET-PASSWORD:
PUT
http://localhost:5000/api/auth/reset-password
 
Sample Request:
 
{
  "email": "karthi@gmail.com",
  "otp": "423379",
  "newPassword": "1234"
}
 
Sample Response:
 
{
    "message": "Password reset successful"
}
 
**Once you reset the password you need to login using your new password again**
_______________________________________________
6. VERIFY EMAIL(SEND OTP):
POST
http://localhost:5000/api/auth/email/send-otp
 
Sample Request:
{
  "email": "karthi@gmail.com"
}
Sample Response:
{
    "message": "OTP sent successfully"
}
**The OTP is shared to the mail**
_______________________________________________
7. VERIFY EMAIL WITH OTP:
PUT
http://localhost:5000/api/auth/email/verify
Sample Request:
{
  "email": "karthi@gmail.com",
  "otp": "597916"
}
Sample Response:
{
    "message": "Email verified successfully"
}

========================================================
# EMPLOYEE APIs
========================================================
## Base URL
 
```text
http://localhost:5000/api/employees
```
 

## Authorization Header
 
```text
Authorization: Bearer YOUR_JWT_TOKEN
```
 
---
 
# 1. Create Employee
 
## Method
POST
 
## Endpoint
 
```http
http://localhost:5000/api/employees
```
 
## Sample Request Body
 
```json
{
  "name": "Vignesh",
  "email": "vignesh@gmail.com",
  "phone": "9876543211",
  "RoleID": 4,
  "Department_id": 1,
  "designation": "Software Engineer",
  "manager_id": "E005",
  "joining_date": "2026-05-15",
  "employment_type": "FULL_TIME",
  "work_mode": "WFH",
  "profile_image": null,
  "emergency_contact": "9876543210"
}
```
-------------------------------------------------------------------------------
 
# 2. Get All Employees
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees
```
-------------------------------------------------------------------------------
 
# 3. Search Employee
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees?search=vignesh
```
 
----------------------------------------------------------------------------------
 
# 3. Filter By Department
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees?Department_id=1
```
 
----------------------------------------------------------------------------------
 
# 4. Filter By Role
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees?RoleID=4
```
 
----------------------------------------------------------------------------------
 
# 5. Filter By Employee Status
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees?employee_status=ACTIVE
```
 
----------------------------------------------------------------------------------
 
# 6. Get Employee By ID
 
## Method
GET
 
## Endpoint
 
```http
http://localhost:5000/api/employees/E005
```
 
----------------------------------------------------------------------------------
 
# 7. Update Employee
 
## Method
PUT
 
## Endpoint
 
```http
http://localhost:5000/api/employees/E005
```
 
## Sample Request Body
 
```json
{
  "designation": "Senior Software Engineer",
  "work_mode": "HYBRID",
  "employee_status": "ACTIVE"
}
```
================================================================
# Attendance APIs
================================================================

## Punch In
```bash
POST /attendance/punch-in
```
## Business Rule

**1. Permanent WFH Employees**

    - No location required
    - No validation needed
    - Direct punch-in allowed
    - No body restriction for location

**2. WFO Employees**

    - Location is MANDATORY
    - Must send latitude & longitude
    - If location missing → Punch-in rejected

**3. WFH / WFO (Approval Based)**
    - Employee may request WFH while normally WFO
    - Must be APPROVED by Admin/HR
    - Only after approval → WFH allowed
    - Without approval → treated as WFO only

## Request


```bash
{
  "workMode": "WFO",
  "latitude": "9.9252",
  "longitude": "78.1198"
}
```

```bash
{
  "work_mode": "WFH"
}
```


----------------------------------------------------------------------------

## Punch Out
```bash
POST /attendance/punch-out
```
** No body
-----------------------------------------------------------------------------

## Attendance History
```bash
GET /attendance/:empId
```

-------------------------------------------------------------------------------

## Attendance Summary
``` bash
GET /attendance/summary/:empId?month=MM&year=YYYY
```

----------------------------------------------------------------

## Update Attendance

```bash
PUT /attendance/update/:empId
```
## Request
```bash
{
  "status": "Present",
  "work_mode": "WFO",
  "punch_in_time": "2026-05-15 09:09:00",
  "punch_out_time": "2026-05-15 18:20:00"
}
```
============================================================

# 4. WFH APIs

## Apply WFH Request
```bash
POST /wfh/apply
```
## Request
```bash
{
  "from_date": "2026-05-15",
  "to_date": "2026-05-15",
  "reason": "Personal work"
}
```

-----------------------------------------------------------------

## Update WFH Status
```bash
PUT /wfh/update-status/E002
```
## Request 
```bash
{
  "status": "Approved"
}
```

=======================================================================
VERIFY EMAIL WITH OTP:
PUT
http://localhost:5000/api/auth/email/verify
Sample Request:
{
  "email": "karthi@gmail.com",
  "otp": "597916"
}
Sample Response:
{
    "message": "Email verified successfully"
}
_____________________________________________
APPLY LEAVE:
POST
http://localhost:5000/api/leave
Sample Request:
{
  "leave_type": "Sick Leave",
  "from_date": "2026-05-15",
  "to_date": "2026-05-16",
  "reason": "Fever"
}
 
**HEADERS- AUTHORIZATION: Enter the Access Token that you get after login**
 
Sample Response:
{
    "message": "Leave applied successfully"
}
______________________________________________
APPROVE LEAVE:
PUT
http://localhost:5000/api/leave/leave/EOO5
**In URL the E005 is the person who applies for leave, you need to check the leave table and onlY Super_Admin, HR_Admin and Manager only approve the leave**
 
Sample Request:
{
  "status": "APPROVED"
}
**HEADERS- AUTHORIZATION: Enter the Access Token that you get after login, only Super Admin, HR Admin and Manager token only valid**
 
Sample Response:
{
    "message": "Leave approved successfully"
}
_________________________________________________
POST HOLIDAYS:
POST
http://localhost:5000/api/holidays
**Only Super_Admin, HR_Admin and Manager post the holidays
Sample Request:
{
  "holiday_name": "Diwali",
  "holiday_date": "2026-11-12",
  "client_id": 2,
  "region": "India"
}
**HEADERS- AUTHORIZATION: Enter the Access Token that you get after login, only Super Admin, HR Admin token only valid**
Sample Response:
{
    "message": "Holiday added successfully"
}
__________________________________________________
GET HOLIDAYS:
GET
http://localhost:5000/api/holidays
Sample Request:
**HEADERS- AUTHORIZATION: Enter the Access Token that you get after login**
Sample Response:
{
        "id": 3,
        "holiday_name": "Pongal",
        "holiday_date": "2026-01-14T00:00:00.000Z",
        "client_id": 1,
        "region": "Tamil Nadu",
        "created_at": "2026-05-21T19:58:26.726Z",
        "updated_at": "2026-05-21T19:58:26.726Z"
    }
_________________________________________________
DELETE HOLIDAYS:
DELETE
http://localhost:5000/api/holidays/client/2
Sample Request:
**HEADERS- AUTHORIZATION: Enter the Access Token that you get after login, only Super Admin, HR Admin and Manager token only valid**
Sample Response:
{
    "message": "Holiday deleted successfully"
}

==============================================================================
# Department APIs
 
Add Token
 
[Authorization → Bearer Token]
 
1. Get All Departments
 
Endpoint:
 
GET /api/departments
 
Access
SUPER_ADMIN
HR_ADMIN
 
Response
 
[
  {
    "Id": 1,
    "DepartmentName": "IT"
  },
  {
    "Id": 2,
    "DepartmentName": "HR"
  }
]
 
2. Create Department
 
Endpoint
 
POST /api/departments
 
Access
SUPER_ADMIN
HR_ADMIN
 
Request Body
 
{
  "departmentName": "Finance"
}
 
Success Response
 
{
  "id": 3,
  "departmentName": "Finance"
}
 
Validation Errors
 
{
  "message": "Department name required"
}
 
{
  "message": "Department already exists"
}
 
3. Update Department
 
Endpoint
 
PUT /api/departments/:id
 
Access
SUPER_ADMIN
HR_ADMIN
 
Request Body
 
{
  "departmentName": "Accounts"
}
 
Success Response
 
{
  "id": 1,
  "departmentName": "Accounts"
}
 
Error Response
 
{
  "message": "Department not found"
}
___________________________________________________
Role APIs
 
1. Get All Roles
 
Endpoint
 
GET /api/roles
 
Access
SUPER_ADMIN
HR_ADMIN
 
Response
 
[
  {
    "Id": 1,
    "role_name": "SUPER_ADMIN"
  },
  {
    "Id": 2,
    "role_name": "HR_ADMIN"
  }
]
 
2. Create Role
 
Endpoint
 
POST /api/roles
 
Access
SUPER_ADMIN
HR_ADMIN
 
Request Body
 
{
  "roleName": "EMPLOYEE"
}
 
Success Response
 
{
  "id": 3,
  "roleName": "EMPLOYEE"
}
 
Validation Errors
 
{
  "message": "Role name required"
}
 
{
  "message": "Role already exists"
}
 
3. Update Role
 
Endpoint
 
PUT /api/roles/:id
 
Access
SUPER_ADMIN
HR_ADMIN
 
Request Body
 
{
  "roleName": "TEAM_LEAD"
}
 
Success Response
 
{
  "id": 1,
  "roleName": "TEAM_LEAD"
}
 
Error Response
 
{
  "message": "Role not found"
}

================================================================


# Testing

- APIs tested using Postman
- JWT Authorization validated
- RBAC validated
- Attendance Flow validated
- Leave Flow validated

=============================================================================

# Error Handling

- Proper HTTP status codes implemented
- Validation handled in controllers
- JWT validation implemented
- Access control validation implemented

===========================================================================

# Server

```bash
Server running on port 5000
```

================================================================================

# Author

HRMS Unified Backend API Project
