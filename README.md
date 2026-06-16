# HRMS Unified Backend API

## Overview

HRMS Unified Backend API is a RESTful backend application built using:

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express.js |
| Database | Microsoft SQL Server (mssql v12) |
| Auth | JWT (access 15 min · refresh 7 days) |
| Validation | Zod |
| Password hashing | bcrypt |
| Email | Nodemailer (Gmail) |
| Scheduler | node-cron |

---

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
- Apply WFH
- Aprove/Reject WFH
- Update Attendance Details

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

---

## Role Management

- Get Roles
- Create Roles
- Update Roles

---


## Project Structure

```
HRMS/
├── src/
│   ├── app.ts                  # Express app, middleware, routes
│   ├── server.ts               # HTTP server entry point
│   ├── config/
│   │   ├── db.ts               # MSSQL connection pool
│   │   └── roles.ts            # Role enum (reference)
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verify + blacklist check
│   │   └── role.middleware.ts  # authorize(), canAccessEmployeeData(), canViewDashboard()
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── departmentController.ts
│   │   ├── holidayController.ts
│   │   ├── leaveController.ts
│   │   ├── roleController.ts
│   │   ├── attendance/
│   │   │   ├── punch.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── update.controller.ts
│   │   │   └── autopunchout.controller.ts
│   │   ├── employee/
│   │   │   ├── create.employeeController.ts
│   │   │   ├── getAll.employeeController.ts
│   │   │   ├── getById.EmployeeController.ts
│   │   │   └── update.employeecontroller.ts
│   │   └── wfh/
│   │       ├── wfh.request.controller.ts
│   │       ├── wfh.response.controller.ts
│   │       └── get.request.controller.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── employeeRoutes.ts
│   │   ├── attendanceRoutes.ts
│   │   ├── wfhRoutes.ts
│   │   ├── leaveRoutes.ts
│   │   ├── departmentRoutes.ts
│   │   ├── rolesRoutes.ts
│   │   ├── holidaysRoutes.ts
│   │   └── user.routes.ts
│   ├── schemas/
│   │   ├── createemployee.schema.ts
│   │   ├── updateemployee.schema.ts
│   │   └── getallemployee.schema.ts
│   └── types/
│   │   └── express.d.ts
│   └── utils/
│       └── datetime.ts
├── .env
├── package.json
└── tsconfig.json
```

---

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
npm install express mssql dotenv cors bcrypt jsonwebtoken nodemailer
```

## 4. Install Development Dependencies

```bash
npm install -D typescript ts-node-dev @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/cors @types/nodemailer
```
---

## 5. Environment Variables

Create a `.env` file in the root directory.

  PORT=5000
  ALLOWED_ORIGIN=http://localhost:5173

  DB_SERVER=localhost
  DB_USER=sa
  DB_PASSWORD=your_password
  DB_NAME=hrms_portal

  MAIL_USER=yourgmail@gmail.com
  MAIL_PASS=your_generate_app_password
  JWT_SECRET=accesssecret
  JWT_REFRESH_SECRET=refreshsecret

---

## 6. Generate Gmail App Password

1. Open your Google Account
2. Go to **Security**
3. Enable **2-Step Verification**
4. Search **App Passwords**
5. Select:
   - App → Mail
   - Device → Windows Computer
6. Click **Generate**
7. Copy generated password
 
---


# DATABASE (FULL STRUCTURE)

## Create Database

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
    DepartmentName VARCHAR(100) NOT NULL UNIQUE
);

/* =====================================================
   INSERT DEPARTMENTS
===================================================== */
INSERT INTO Department (DepartmentName) VALUES 
('Administration'),    -- Id 1
('Human Resources'),   -- Id 2
('Management'),        -- Id 3
('Technology'),        -- Id 4
('Finance'),           -- Id 5
('Sales & Marketing'), -- Id 6
('Operations');        -- Id 7
GO
/* =====================================================
   ROLES TABLE
===================================================== */
CREATE TABLE roles (
    Id INT PRIMARY KEY, 
    role_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT FK_Roles_Department FOREIGN KEY (department_id) REFERENCES Department(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_Role_Per_Department UNIQUE (role_name, department_id)
);
GO

/* =====================================================
   INSERT ROLES
===================================================== */
INSERT INTO roles (Id, role_name, department_id) VALUES
(101, 'Super Admin', 1), (102, 'Receptionist', 1), (103, 'Office Coordinator', 1),
(104, 'Executive Assistant', 1), (105, 'Front Desk Staff', 1), (106, 'Facilities/Admin Executive', 1),
(107, 'Document & Records Staff', 1);

-- Human Resources (Department Id 2 -> IDs start at 201)
INSERT INTO roles (Id, role_name, department_id) VALUES
(201, 'HR Manager', 2), (202, 'HR Executive', 2), (203, 'Recruiter', 2),
(204, 'Payroll Staff', 2), (205, 'Employee Relations Staff', 2), (206, 'HR Intern', 2);

-- Management (Department Id 3 -> IDs start at 301)
INSERT INTO roles (Id, role_name, department_id) VALUES
(301, 'Director', 3), (302, 'General Manager', 3), (303, 'Delivery Head', 3),
(304, 'Project Manager', 3), (305, 'Operations Manager', 3), (306, 'Business Manager', 3);

-- Technology (Department Id 4 -> IDs start at 401)
INSERT INTO roles (Id, role_name, department_id) VALUES
(401, 'Associate Software Engineer', 4), (402, 'Software Engineer', 4), (403, 'Frontend Developer', 4),
(404, 'Backend Developer', 4), (405, 'Full Stack Developer', 4), (406, 'Mobile App Developer', 4),
(407, 'UI/UX Designer', 4), (408, 'QA Engineer / Tester', 4), (409, 'DevOps Engineer', 4),
(410, 'System Administrator', 4), (411, 'Network Engineer', 4), (412, 'Database Administrator (DBA)', 4),
(413, 'Cybersecurity Analyst', 4), (414, 'Cloud Engineer', 4), (415, 'Technical Lead', 4),
(416, 'Engineering Manager', 4), (417, 'IT Support Executive', 4), (418, 'Help Desk Technician', 4),
(419, 'Data Engineer', 4), (420, 'AI/ML Engineer', 4);

-- Finance (Department Id 5 -> IDs start at 501)
INSERT INTO roles (Id, role_name, department_id) VALUES
(501, 'Accountant', 5), (502, 'Senior Accountant', 5), (503, 'Finance Executive', 5),
(504, 'Finance Manager', 5), (505, 'Accounts Executive', 5), (506, 'Accounts Manager', 5),
(507, 'Payroll Executive', 5), (508, 'Payroll Manager', 5), (509, 'Billing Executive', 5),
(510, 'Tax Consultant', 5), (511, 'Auditor', 5), (512, 'Financial Analyst', 5), (513, 'Budget Analyst', 5);

-- Sales & Marketing (Department Id 6 -> IDs start at 601)
INSERT INTO roles (Id, role_name, department_id) VALUES
(601, 'Sales Executive', 6), (602, 'Senior Sales Executive', 6), (603, 'Business Development Executive (BDE)', 6),
(604, 'Business Development Manager (BDM)', 6), (605, 'Sales Manager', 6), (606, 'Account Manager', 6),
(607, 'Client Relationship Manager', 6), (608, 'IT Sales Executive', 6), (609, 'Digital Marketing Executive', 6),
(610, 'SEO Specialist', 6), (611, 'Social Media Manager', 6), (612, 'Content Writer', 6),
(613, 'Content Marketing Executive', 6), (614, 'Graphic Designer', 6), (615, 'Marketing Analyst', 6);

-- Operations (Department Id 7 -> IDs start at 701)
INSERT INTO roles (Id, role_name, department_id) VALUES
(701, 'Operations Executive', 7), (702, 'Operations Manager', 7), (703, 'Project Coordinator', 7),
(704, 'Project Manager', 7), (705, 'Delivery Manager', 7), (706, 'Business Operations Associate', 7),
(707, 'Process Coordinator', 7), (708, 'Client Success Executive', 7), (709, 'Resource Manager', 7),
(710, 'Vendor Coordinator', 7), (711, 'Service Delivery Executive', 7), (712, 'Workflow Coordinator', 7);
GO


/*============================
 ACCE--SS TABLE
=============================*/

CREATE TABLE Access (
    Id INT PRIMARY KEY, 
    DashboardName VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Access (Id, DashboardName) VALUES 
(1, 'SUPER_ADMIN'),
(2, 'HR_ADMIN'),
(3, 'MANAGER'),
(4, 'EMPLOYEE'),
(5, 'FINANCE'),
(6, 'CLIENT');
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
    Emp_id VARCHAR(10) UNIQUE NULL,
    Name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    personal_email VARCHAR(150) UNIQUE NOT NULL,
    company_email VARCHAR(150) UNIQUE NOT NULL,
    Phone VARCHAR(10) UNIQUE NOT NULL,
    RoleID INT NOT NULL,
    Department_id INT NOT NULL,
    client_id INT NULL,
    Dashboard_id INT NOT NULL,
    designation VARCHAR(100) NOT NULL,
    manager_id VARCHAR(10) NULL,
    joining_date DATE NOT NULL,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('FULL_TIME', 'CONTRACT', 'INTERN')),
    work_mode VARCHAR(20) NOT NULL CHECK (work_mode IN ('WFH', 'WFO', 'HYBRID')),
    profile_image VARCHAR(255) NULL,
    emergency_contact VARCHAR(10) NULL,
    employee_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (employee_status IN ('ACTIVE', 'INACTIVE', 'RESIGNED', 'TERMINATED', 'ON_NOTICE')),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),

    /* =============================
       FOREIGN KEYS
    ============================= */
    CONSTRAINT fk_role FOREIGN KEY (RoleID) REFERENCES roles(id),
    CONSTRAINT fk_department FOREIGN KEY (Department_id) REFERENCES Department(Id),
    CONSTRAINT fk_employee_client FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE SET NULL,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES Employee(Emp_id),
    CONSTRAINT fk_employee_access FOREIGN KEY (Dashboard_id) REFERENCES Access(Id)
);
GO

/* =====================================================
   INDEXES
===================================================== */
CREATE INDEX idx_employee_role ON Employee(RoleID);
CREATE INDEX idx_employee_department ON Employee(Department_id);
CREATE INDEX idx_employee_manager ON Employee(manager_id);
CREATE INDEX idx_employee_status ON Employee(employee_status);
CREATE INDEX idx_employee_client ON Employee(client_id);
CREATE INDEX idx_employee_dashboard ON Employee(Dashboard_id);
GO

INSERT INTO Employee (
    Emp_id,
    Name,
    username,
    personal_email,
    company_email,
    Phone,
    RoleID,
    Department_id,
    client_id,
    Dashboard_id,
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
   SUPER ADMIN (E001)
   RoleID: 101 (Super Admin)
   Dashboard_id: 1 (SUPER_ADMIN)
========================= */
(
    'E001',
    'Kartick',
    'kartick_E001',
    'kartick@gmail.com',
    'kartick_E001@hrms.com',
    '9876213311',
    101,                    -- Super Admin
    1,                      -- Administration
    1,                      -- TCS Chennai
    1,                      -- SUPER_ADMIN
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
   HR ADMIN (E002)
   RoleID: 201 (HR Manager)
   Dashboard_id: 2 (HR_ADMIN)
========================= */
(
    'E002',
    'Deepika',
    'deepika_E002',
    'deepika@gmail.com',
    'deepika_E002@hrms.com',
    '9876213312',
    201,                    -- HR Manager
    2,                      -- Human Resources
    1,                      -- TCS Chennai
    2,                      -- HR_ADMIN
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
   MANAGER 1 - Engineering Manager (E003)
   RoleID: 416 (Engineering Manager) - Department 4
   Dashboard_id: 3 (MANAGER)
========================= */
(
    'E003',
    'Arun',
    'arun_E003',
    'arun@gmail.com',
    'arun_E003@hrms.com',
    '9876213313',
    416,                    -- Engineering Manager (Technology Dept)
    4,                      -- Technology
    2,                      -- Infosys US
    3,                      -- MANAGER
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
   MANAGER 2 - QA Manager (E004)
   RoleID: 305 (Operations Manager) - Department 3
   Dashboard_id: 3 (MANAGER)
========================= */
(
    'E004',
    'Priya',
    'priya_E004',
    'priya@gmail.com',
    'priya_E004@hrms.com',
    '9876213314',
    305,                    -- Operations Manager
    3,                      -- Management
    1,                      -- TCS Chennai
    3,                      -- MANAGER
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
   MANAGER 3 - Finance Manager (E005)
   RoleID: 504 (Finance Manager)
   Dashboard_id: 3 (MANAGER)
========================= */
(
    'E005',
    'Vignesh',
    'vignesh_E005',
    'vignesh@gmail.com',
    'vignesh_E005@hrms.com',
    '9876213315',
    504,                    -- Finance Manager
    5,                      -- Finance
    3,                      -- Dubai Client
    3,                      -- MANAGER
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
   EMPLOYEE 1 - Software Engineer (E006)
   RoleID: 402 (Software Engineer)
   Dashboard_id: 4 (EMPLOYEE)
   Manager: E003
========================= */
(
    'E006',
    'Kavin',
    'kavin_E006',
    'kavin@gmail.com',
    'kavin_E006@hrms.com',
    '9876213316',
    402,                    -- Software Engineer
    4,                      -- Technology
    2,                      -- Infosys US
    4,                      -- EMPLOYEE
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
   EMPLOYEE 2 - QA Engineer (E007)
   RoleID: 408 (QA Engineer / Tester)
   Dashboard_id: 4 (EMPLOYEE)
   Manager: E004
========================= */
(
    'E007',
    'Nisha',
    'nisha_E007',
    'nisha@gmail.com',
    'nisha_E007@hrms.com',
    '9876213317',
    408,                    -- QA Engineer / Tester
    4,                      -- Technology
    1,                      -- TCS Chennai
    4,                      -- EMPLOYEE
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
   EMPLOYEE 3 - Finance Executive (E008)
   RoleID: 503 (Finance Executive)
   Dashboard_id: 4 (EMPLOYEE)
   Manager: E005
========================= */
(
    'E008',
    'Rahul',
    'rahul_E008',
    'rahul@gmail.com',
    'rahul_E008@hrms.com',
    '9876213318',
    503,                    -- Finance Executive
    5,                      -- Finance
    3,                      -- Dubai Client
    4,                      -- EMPLOYEE
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
   FINANCE - Finance Analyst (E009)
   RoleID: 512 (Financial Analyst)
   Dashboard_id: 5 (FINANCE)
   Manager: E005
========================= */
(
    'E009',
    'Suresh',
    'suresh_E009',
    'suresh@gmail.com',
    'suresh_E009@hrms.com',
    '9876213319',
    512,                    -- Financial Analyst
    5,                      -- Finance
    3,                      -- Dubai Client
    5,                      -- FINANCE
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
    username VARCHAR(100) NOT NULL UNIQUE,
    company_email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Emp_id VARCHAR(10) NOT NULL UNIQUE,
    client_id INT NULL,
    phone VARCHAR(20) NULL,
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
/* =========================================
   UNIQUE PHONE ONLY FOR NON-NULL VALUES 
========================================= */
CREATE UNIQUE INDEX UX_auth_phone
 
ON authentication(phone)
 
WHERE phone IS NOT NULL;
 
GO


-- =====================================================
-- ATTENDANCE TABLE
-- =====================================================
CREATE TABLE attendance (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(10) NOT NULL,
    date DATE,
    punch_in_time DATETIME,
    punch_in_status VARCHAR(20) NULL,
    work_mode VARCHAR(10),
    punch_out_time DATETIME,
    punch_out_type VARCHAR(15) 
        CHECK (punch_out_type IN('AUTO','MANUAL')),
    total_hours DECIMAL(10,2),
    status VARCHAR(20),
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
    status VARCHAR(20) DEFAULT 'PENDING',
    approved_by VARCHAR(10) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT chk_wfh_status
    CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    
    CONSTRAINT fk_wfh_emp
    FOREIGN KEY (Emp_id)
    REFERENCES Employee(Emp_id),

    CONSTRAINT fk_wfh_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES Employee(Emp_id)
);
GO
-- ============================================================
-- FIX: ADD INDEXES FOR WFH_REQUEST
-- ============================================================

-- Index 1: Fast overlap queries

CREATE NONCLUSTERED INDEX IX_WFH_Request_EmpStatusDates
ON WFH_Request (Emp_id, status, from_date, to_date)
INCLUDE (reason, approved_by, created_at);

-- Index 2: Prevent overlapping APPROVED requests (unique filtered)
CREATE UNIQUE NONCLUSTERED INDEX UX_WFH_Request_Approved_EmpDate
ON WFH_Request (Emp_id, from_date, to_date)
WHERE status = 'APPROVED';


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
 
CREATE INDEX IX_token_blacklist_created_at
ON token_blacklist(created_at);
GO
 
/* =====================================================
   VIEW TABLE DATA
===================================================== */
SELECT * FROM Department;

SELECT * FROM roles;

select * from access;

SELECT * FROM clients;

SELECT * FROM Employee;

SELECT * FROM attendance;

SELECT * FROM wfh_request;

SELECT * FROM authentication;

SELECT * FROM leaves;

SELECT * FROM holidays;

SELECT * FROM token_blacklist;

```
======================================================

# Access Control (RBAC)

 - SUPER_ADMIN / HR_ADMIN  → Full Access
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
# Register

## Endpoint

```bash
POST /api/auth/register
```

## Sample Request

```bash
{
  "username": "kavi_E010",
  "password": "Welcome@123"
}
```
**Password rules** — minimum 8 characters, must include uppercase, lowercase, digit, and one of `@#$%^&*!?`.

## Sample Response

```bash
{
  "success": true,
  "message": "Register successful",
  "employee": {
    "Emp_id": "E010",
    "username": "kavi_E010",
    "company_email": "kavi_E010@hrms.com"
  }
}
```

---

# Login

## Endpoint

```bash
POST /api/auth/login
```

## Sample Request

```bash
{
  "username": "kavin_E006",
  "password": "Welcome@123"
}
```

## Sample Response

```bash
{
  "message": "Login successful",
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "user": {
    "name": "Kavin",
    "username": "kavin_E006",
    "email": "kavin_E006@hrms.com",
    "Emp_id": "E006",
    "role": "EMPLOYEE",
    "display_role": "Software Engineer"
  }
}
```

---

# Refresh Token

## Endpoint

```bash
POST /api/auth/refresh-token
```

## Sample Request

```bash
{
  "refreshToken": "your_refresh_token"
}
```

## Sample Response

```bash
{
  "accessToken": "new_access_token"
}
```

---

# Forgot Password

## Endpoint

```bash
PUT /api/auth/forgot-password
```

## Sample Request

```bash
{
  "company_email": "kavi_E010@hrms.com"
}
```

## Sample Response

```bash
{
  "message": "OTP sent to email"
}
```

---

# Reset Password

## Endpoint

```bash
PUT /api/auth/reset-password
```

## Sample Request

```bash
{
  "company_email": "kavin_E006@hrms.com",
  "otp": "423379",
  "newPassword": "Hello@123"
}
```

## Sample Response

```bash
{
  "message": "Password reset successful"
}
```

---

# Verify Email - Send OTP

## Endpoint

```bash
POST /api/auth/email/send-otp
```

## Sample Request

```bash
{
  "company_email": "kavi_E010@hrms.com"
}
```

## Sample Response

```bash
{
  "message": "OTP sent successfully"
}
```

---

# Verify Email - Verify OTP

## Endpoint

```bash
PUT /api/auth/email/verify
```

## Sample Request

```bash
{
  "company_email": "kavi_E010@hrms.com",
  "otp": "597916"
}
```

## Sample Response

```bash
{
  "message": "Email verified successfully"
}
```

---

========================================================
# EMPLOYEE APIs
========================================================
## Base URL

```bash
http://localhost:5000/api/employees
```
---

# Create Employee

## Endpoint

```bash
POST /api/employees
```

## Sample Request

```bash
{
  "name": "Kavinkumar Sanjay",
  "personal_email": "kavin1@gmail.com",
  "phone": "9876543212",
  "RoleID": 402,
  "Department_id": 4,
  "Dashboard_id": 4,
  "designation": "Software Engineer",
  "joining_date": "2026-06-05",
  "employment_type": "FULL_TIME",
  "work_mode": "HYBRID"
}
```

---

# Get All Employees

## Endpoint

```bash
GET /api/employees
```

---

# Get all employees with search, filter, and pagination.
```bash
GET /api/employees
GET /api/employees?search=kavi
GET /api/employees?search=E006
GET /api/employees?department=Technology
GET /api/employees?role=Software Engineer
GET /api/employees?status=ACTIVE
GET /api/employees?status=ACTIVE&department=Technology&page=1&limit=10
GET /api/employees?search=kavi&status=ACTIVE

---

# Get Employee By ID

## Endpoint

```bash
GET /api/employees/E010
```

---

# Update Employee

## Endpoint

```bash
PUT /api/employees/E010
```

## Sample Request

```bash
{
  "designation": "Senior Software Engineer",
  "work_mode": "HYBRID",
  "employee_status": "ACTIVE"
}
```

=========================================================
# Attendance APIs
=========================================================

## Punch In
```bash
POST /attendance/punch-in
```
## Business Rule

**1. Permanent WFH Employees**

    - Direct punch-in allowed
    - No body

**2. WFO Employees**

    - Location is MANDATORY
    - Must send latitude & longitude
    - If location missing → Punch-in rejected

**3. WFH / WFO (Approval Based)**
    - Employee may request WFH while normally WFO
    - Must be APPROVED by HR_Admin
    - Only after approval → WFH allowed

## Request

## WFO Request

```bash
{
  "latitude": "9.9252",
  "longitude": "78.1198"
}
```
**or**

```bash
{
  "work_mode": "WFH"
}
```

---

## Punch Out
```bash
POST /attendance/punch-out
```
** No body

---

## Dashboard
```bash
GET /attendance/dashboard
```
** No body

---

## Attendance History
```bash
GET /attendance/:empId
```

---

## Attendance Summary Monthly
``` bash
GET /attendance/monthly/:empId?month=MM&year=YYYY
```

---

## Update Attendance

```bash
PUT /attendance/update/:empId/:date
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
=========================================================
# WFH APIs
=========================================================

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
---

## My WFH Requests
```bash
GET /wfh/my-requests
```
---

## Get All WFH Requests
```bash
GET /wfh/all
```

---

## WFH Update Status

  **Only SUPER_ADMIN and HR_ADMIN can Approve**

```bash
PUT /wfh/update-status/E002
```

## Request 
```bash
{
  "status": "APPROVED"
}
```

=========================================================
# Leave APIs
=========================================================
# Apply Leave

## Endpoint

```bash
POST /api/leave
```

## Sample Request

```bash
{
  "leave_type": "Sick Leave",
  "from_date": "2026-05-15",
  "to_date": "2026-05-16",
  "reason": "Fever"
}
```

---

# Approve Leave

## Endpoint

```bash
PUT /api/leave/leave/E005
```

## Sample Request

```bash
{
  "status": "APPROVED"
}
```

---

# Holiday APIs

# Add Holiday

```bash
POST /api/holidays
```

## Sample Request

```bash
{
  "holiday_name": "Diwali",
  "holiday_date": "2026-11-12",
  "client_id": 2,
  "region": "India"
}
```

---

# Get Holidays

## Endpoint

```bash
GET /api/holidays
```

---

# Delete Holiday

## Endpoint

```bash
DELETE /api/holidays/client/2
```


==========================================================
# Department APIs
==========================================================

1. Get All Departments

Endpoint:

GET /api/departments

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

GET http://localhost:5000/api/departments

Sample Response

[
  {
    "Id": 1,
    "DepartmentName": "Administration"
  },
  {
    "Id": 2,
    "DepartmentName": "Human Resources"
  },
  {
    "Id": 3,
    "DepartmentName": "Management"
  }
]

Success Response
200 OK


2. Create Department

Endpoint

POST /api/departments

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

POST http://localhost:5000/api/departments

Request Body

{
  "departmentName": "CA"
}

Sample Response

{
  "id": 8,
  "departmentName": "CA"
}

Success Response
201 Created


3. Update Department

Endpoint

PUT /api/departments/:id

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

PUT http://localhost:5000/api/departments/1

Request Body

{
  "departmentName": "Administration Testing"
}

Sample Response

{
  "id": 1,
  "departmentName": "Administration Testing"
}

Success Response
200 OK

---

Role APIs

4. Get All Roles

Endpoint

GET /api/roles

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

GET http://localhost:5000/api/roles

Sample Response

[
  {
    "RoleId": 101,
    "RoleName": "Super Admin",
    "DepartmentId": 1,
    "DepartmentName": "Administration"
  },
  {
    "RoleId": 102,
    "RoleName": "Receptionist",
    "DepartmentId": 1,
    "DepartmentName": "Administration"
  }
]

Success Response
200 OK

5. Create Role

Endpoint

POST /api/roles

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

POST http://localhost:5000/api/roles

Request Body

{
  "roleName": "TL",
  "departmentId": 1
}

Sample Response

{
  "id": 108,
  "roleName": "TL",
  "departmentId": 1
}

Success Response
201 Created

6. Update Role

Endpoint

PUT /api/roles/:id

Authorization
SUPER_ADMIN
HR_ADMIN

Sample Request

PUT http://localhost:5000/api/roles/101

Request Body

{
  "roleName": "Super Adminn",
  "departmentId": 1
}

Sample Response

{
  "id": 1,
  "roleName": "Super Adminn",
  "departmentId": 1
}

Success Response
200 OK

==========================================================


# Testing

- APIs tested using Postman
- JWT Authorization validated
- RBAC validated
- Attendance Flow validated
- Leave Flow validated

==========================================================

# Error Handling

- Proper HTTP status codes implemented
- Validation handled in controllers
- JWT validation implemented
- Access control validation implemented

==========================================================

# Server

```bash
Server running on port 5000
```

==========================================================

# Author

HRMS Unified Backend API Project
