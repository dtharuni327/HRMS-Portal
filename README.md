<<<<<<< HEAD
<<<<<<< HEAD
# HRMS Backend API

A Node.js + TypeScript REST API for an HR Management System, backed by Microsoft SQL Server and stored procedures.

---

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** Microsoft SQL Server (via `mssql`)
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing
- **Validation:** Zod
- **Email:** Nodemailer (Gmail)

---

# HRMS API Reference

All APIs run on `http://localhost:5000` and require a Bearer token in every request:

```
Authorization: Bearer <accessToken>
```

---

## Table of Contents

1. [Employee](#1-employee)
2. [Profile Management](#2-profile-management)
3. [Team Directory](#3-team-directory)
4. [Organisation Structure](#4-organisation-structure)
5. [Documents Management](#5-documents-management)
6. [Recruitment](#6-recruitment)

---

## 1. Employee

**Base URL:** `http://localhost:5000/api/employees`

---

### Create Employee

`POST /api/employees`

> Super Admin / HR Admin only

**Field rules:**
- `DOB` — YYYY-MM-DD, must be in the past; employee must be at least 18
- `Gender` — `MALE`, `FEMALE`, or `OTHER`
- `joining_date` — YYYY-MM-DD, cannot be a future date
- `employment_type` — `FULL_TIME`, `CONTRACT`, or `INTERN`
- `work_mode` — `WFH`, `WFO`, or `HYBRID`
- `employee_status` — defaults to `ACTIVE`
- `emergency_contact` — must differ from `phone`
- `Emp_id`, `username`, `company_email` — auto-generated (`CFT20260001` format)

**Request:**
```json
{
  "name": "Kavinkumar Sanjay",
  "personal_email": "kavin@gmail.com",
  "phone": "9876543210",
  "DOB": "1996-02-14",
  "Gender": "MALE",
  "RoleID": 402,
  "Department_id": 4,
  "Dashboard_id": 4,
  "designation": "Software Engineer",
  "joining_date": "2026-06-05",
  "employment_type": "FULL_TIME",
  "work_mode": "HYBRID",
  "manager_id": "CFT20260003",
  "client_id": 2,
  "emergency_contact": "9876500000"
}
```

**Response:**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "Emp_id": "CFT20260010",
    "Name": "Kavinkumar Sanjay",
    "username": "kavinkumar_CFT20260010",
    "company_email": "kavinkumar_CFT20260010@hrms.com",
    "designation": "Software Engineer",
    "employment_type": "FULL_TIME",
    "work_mode": "HYBRID",
    "employee_status": "ACTIVE"
  }
}
```

**Errors:**
```json
{ "message": "Email already exists" }
{ "message": "Phone already exists" }
{ "message": "Invalid RoleID" }
{ "message": "Invalid or unauthorized manager_id" }
{ "message": "Employee cannot be their own manager" }
```

---

### Get All Employees

`GET /api/employees`

> Super Admin / HR Admin / Manager only. Managers see only their direct reports.

**Query parameters:**

| Param | Example |
|-------|---------|
| `search` | `kavin`, `CFT20260006` |
| `department` | `Technology` |
| `role` | `Software Engineer` |
| `status` | `ACTIVE`, `INACTIVE`, `RESIGNED`, `TERMINATED`, `ON_NOTICE` |
| `page` / `limit` | `1` / `10` |

**Response:**
```json
{
  "employees": [
    {
      "Emp_id": "CFT20260006",
      "Name": "Kavin",
      "designation": "Software Engineer",
      "DepartmentName": "Technology",
      "manager_name": "Arun",
      "employment_type": "FULL_TIME",
      "work_mode": "HYBRID",
      "employee_status": "ACTIVE"
    }
  ],
  "total": 1
}
```

---

### Get Employee by ID

`GET /api/employees/:empId`

> Super Admin / HR Admin → any employee. Manager → own team only. Employee / Finance → own profile only.

**Errors:**
```json
{ "message": "Employee not found" }
{ "message": "Access denied: not your team member" }
{ "message": "Access denied" }
```

---

### Update Employee

`PUT /api/employees/:empId`

> All fields optional — send only what needs to change.

**Self-editable fields** (any role, own profile): `name`, `phone`, `emergency_contact`, `profile_image`, `work_mode`, `DOB`, `Gender`

**Admin-only fields** (Super Admin / HR Admin): `personal_email`, `designation`, `employment_type`, `manager_id`, `department_id`, `client_id`, `role_id`, `employee_status`

**Employee self update:**
```json
{
  "phone": "9876543299",
  "work_mode": "WFH",
  "Gender": "MALE"
}
```

**Admin update:**
```json
{
  "designation": "Senior Software Engineer",
  "employee_status": "ACTIVE",
  "manager_id": "CFT20260003",
  "department_id": 4,
  "role_id": 403
}
```

**Errors:**
```json
{ "message": "You can only update your own profile" }
{ "message": "Access denied: cannot update restricted fields" }
{ "message": "Employee cannot be their own manager" }
```

---

## 2. Profile Management

**Base URL:** `http://localhost:5000/api/profile`

These APIs act only on the **currently logged-in employee** (derived from the token). There is no `:empId` param — you cannot view or edit another employee's profile through this module.

---

### Get My Profile

`GET /api/profile/me`

**Response:**
```json
{
  "success": true,
  "profile": {
    "Emp_id": "CFT20260006",
    "Name": "Kavin",
    "username": "kavin_CFT20260006",
    "personal_email": "kavin@gmail.com",
    "company_email": "kavin_CFT20260006@hrms.com",
    "Phone": "9876543210",
    "emergency_contact": "9123456785",
    "profile_image": null,
    "DOB": "1996-02-14",
    "Gender": "MALE",
    "designation": "Software Engineer",
    "employment_type": "FULL_TIME",
    "work_mode": "HYBRID",
    "employee_status": "ACTIVE",
    "joining_date": "2025-01-10",
    "DepartmentName": "Technology",
    "role_name": "Software Engineer",
    "manager_id": "CFT20260003",
    "manager_name": "Arun"
  }
}
```

---

### Update My Profile

`PUT /api/profile/me`

All fields optional. Fields like role, designation, department, manager, and employee_status are **not editable here** — use the Employee module.

| Field | Type | Notes |
|-------|------|-------|
| `personal_email` | string | valid email |
| `phone` | string | 10 digits |
| `emergency_contact` | string | 10 digits |
| `profile_image` | string | valid URL |
| `address` | string | 2–255 characters |
| `work_mode` | string | `WFH`, `WFO`, or `HYBRID` |

**Request:**
```json
{
  "phone": "9876543299",
  "work_mode": "WFH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "Emp_id": "CFT20260006",
    "Name": "Kavin",
    "personal_email": "kavin@gmail.com",
    "Phone": "9876543299",
    "emergency_contact": "9123456785",
    "profile_image": null,
    "address": null,
    "designation": "Software Engineer",
    "employment_type": "FULL_TIME",
    "work_mode": "WFH",
    "employee_status": "ACTIVE",
    "joining_date": "2025-01-10",
    "department_name": "Technology",
    "role_name": "Software Engineer",
    "manager_id": "CFT20260003"
  }
}
```

---

### Change My Password

`PUT /api/profile/me/password`

**Password rules:** minimum 8 characters, must include uppercase, lowercase, digit, and a special character.

**Request:**
```json
{
  "currentPassword": "Welcome@123",
  "newPassword": "NewPass@456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Errors:**
```json
{ "message": "Current password is incorrect" }
{ "message": "Profile not found" }
```

---

## 3. Team Directory

**Base URL:** `http://localhost:5000/api/team-directory`

All roles can access — the SP enforces role-based scoping automatically:

| Role | Sees |
|---|---|
| `SUPER_ADMIN` / `HR_ADMIN` | All active employees (dept/search filters apply) |
| `MANAGER` | Own direct reports only |
| `EMPLOYEE` | Colleagues in same department only |

No new tables — reads from existing `Employee`, `roles`, `Department`, `attendance` tables.

---

### Get Team Directory

`GET /api/team-directory`

Returns employees grouped by department. Each group matches one card in the `TeamDirectoryModule` UI.

```
GET /api/team-directory
GET /api/team-directory?dept=Technology
GET /api/team-directory?search=kavin
GET /api/team-directory?search=Software Engineer
```

`dept` — filter by `DepartmentName` (e.g. `Technology`, `Finance`). Ignored for `MANAGER` role (already scoped to their team).  
`search` — searches across `name`, `designation`, `role_name`.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "dept": "Technology",
      "employeeCount": 2,
      "employees": [
        {
          "Emp_id": "CFT20260006",
          "name": "Kavin",
          "email": "kavin_CFT20260006@hrms.com",
          "phone": "9876213316",
          "designation": "Software Engineer",
          "role": "Software Engineer",
          "dept": "Technology",
          "work_mode": "HYBRID",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-01-10",
          "manager_id": "CFT20260003",
          "manager_name": "Arun",
          "experience": 1,
          "seniority": "Junior"
        },
        {
          "Emp_id": "CFT20260007",
          "name": "Nisha",
          "email": "nisha_CFT20260007@hrms.com",
          "phone": "9876213317",
          "designation": "QA Engineer",
          "role": "QA Engineer / Tester",
          "dept": "Technology",
          "work_mode": "WFO",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-02-20",
          "manager_id": "CFT20260004",
          "manager_name": "Priya",
          "experience": 1,
          "seniority": "Junior"
        }
      ]
    },
    {
      "dept": "Finance",
      "employeeCount": 1,
      "employees": [
        {
          "Emp_id": "CFT20260008",
          "name": "Rahul",
          "email": "rahul_CFT20260008@hrms.com",
          "phone": "9876213318",
          "designation": "Finance Executive",
          "role": "Finance Executive",
          "dept": "Finance",
          "work_mode": "WFH",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-03-05",
          "manager_id": "CFT20260005",
          "manager_name": "Vignesh",
          "experience": 1,
          "seniority": "Junior"
        }
      ]
    }
  ]
}
```

---

### Get Team Member Detail

`GET /api/team-directory/:empId`

```
GET /api/team-directory/CFT20260006
```

Returns the employee's full profile plus a 7-day attendance preview (the `P / H / A` strip shown in `TeamDirectoryModule`).

**Access rules:**
- `SUPER_ADMIN` / `HR_ADMIN` → any employee
- `MANAGER` → own direct reports only
- `EMPLOYEE` → self or same department only

**Response:**
```json
{
  "success": true,
  "data": {
    "Emp_id": "CFT20260006",
    "name": "Kavin",
    "email": "kavin_CFT20260006@hrms.com",
    "phone": "9876213316",
    "designation": "Software Engineer",
    "role": "Software Engineer",
    "dept": "Technology",
    "work_mode": "HYBRID",
    "employee_status": "ACTIVE",
    "profile_image": null,
    "joining_date": "2025-01-10",
    "manager_id": "CFT20260003",
    "manager_name": "Arun",
    "manager_email": "arun_CFT20260003@hrms.com",
    "experience": 1,
    "seniority": "Junior",
    "client_name": "Infosys US",
    "Gender": "MALE",
    "DOB": "1996-02-14",
    "recentAttendance": [
      { "date": "2026-06-15", "attendance_status": "P" },
      { "date": "2026-06-14", "attendance_status": "P" },
      { "date": "2026-06-13", "attendance_status": "A" },
      { "date": "2026-06-12", "attendance_status": "P" },
      { "date": "2026-06-11", "attendance_status": "P" },
      { "date": "2026-06-10", "attendance_status": "H" },
      { "date": "2026-06-09", "attendance_status": "P" }
    ]
  }
}
```

`attendance_status` values:
- `P` — Present (total_hours ≥ 8)
- `H` — Half Day (total_hours ≥ 4 and < 8)
- `A` — Absent
- `-` — No record (weekend / no punch-in)

**Errors:**
```json
{ "message": "Employee not found" }
{ "message": "Access denied: not your team member" }
```

---

## 4. Organisation Structure

**Base URL:** `http://localhost:5000/api/organisation`

> **Super Admin / HR Admin only.** The Organisation module in the frontend is an HR view — managers and employees do not have this page.

No new tables — reads from existing `Employee`, `roles`, `Department` tables.

---

### Get Organisation Structure

```
GET /api/organisation
GET /api/organisation?dept=Technology
GET /api/organisation?search=kavin
GET /api/organisation?search=Software Engineer
GET /api/organisation?dept=Technology&search=kavin
```

Returns all active employees grouped by department, sorted alphabetically — matching the card-per-department layout in `OrganisationModule.tsx`.

`dept` — filter by department name (e.g. `Technology`, `Finance`, `Human Resources`). Returns only that department's card.  
`search` — searches across `name`, `designation`, `role_name`.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "dept": "Finance",
      "employeeCount": 2,
      "employees": [
        {
          "Emp_id": "CFT20260008",
          "name": "Rahul",
          "role": "Finance Executive",
          "designation": "Finance Executive",
          "dept": "Finance",
          "work_mode": "WFH",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-03-05",
          "manager_id": "CFT20260005",
          "manager_name": "Vignesh",
          "experience": 1,
          "seniority": "Junior"
        },
        {
          "Emp_id": "CFT20260009",
          "name": "Suresh",
          "role": "Financial Analyst",
          "designation": "Finance Analyst",
          "dept": "Finance",
          "work_mode": "HYBRID",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2024-06-01",
          "manager_id": "CFT20260005",
          "manager_name": "Vignesh",
          "experience": 2,
          "seniority": "Mid-Level"
        }
      ]
    },
    {
      "dept": "Technology",
      "employeeCount": 2,
      "employees": [
        {
          "Emp_id": "CFT20260006",
          "name": "Kavin",
          "role": "Software Engineer",
          "designation": "Software Engineer",
          "dept": "Technology",
          "work_mode": "HYBRID",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-01-10",
          "manager_id": "CFT20260003",
          "manager_name": "Arun",
          "experience": 1,
          "seniority": "Junior"
        },
        {
          "Emp_id": "CFT20260007",
          "name": "Nisha",
          "role": "QA Engineer / Tester",
          "designation": "QA Engineer",
          "dept": "Technology",
          "work_mode": "WFO",
          "employee_status": "ACTIVE",
          "profile_image": null,
          "joining_date": "2025-02-20",
          "manager_id": "CFT20260004",
          "manager_name": "Priya",
          "experience": 1,
          "seniority": "Junior"
        }
      ]
    }
  ]
}
```

`seniority` is computed server-side, mirroring `getSeniority()` in `Organisation.tsx`:
- `Junior` — experience ≤ 1 year
- `Mid-Level` — experience ≤ 4 years
- `Senior` — experience > 4 years

---

## 5. Documents Management

**Base URL:** `http://localhost:5000/api/documents`

Two frontend views are served by these APIs:
- **HR Documents.tsx** — HR selects an employee and uploads/deletes required documents (Aadhaar, PAN, Resume, Offer Letter, Passport Photo)
- **Employee DocumentsPage.tsx** — Employee uploads their own documents, tracks status, searches and filters

---

### Upload Document

`POST /api/documents`

> Any logged-in employee (self upload) or HR / Super Admin (upload on behalf of another employee)

`type` — one of `Identity`, `HR`, `Payroll`, `Tax`, `Education`, `Experience`

**Employee self upload:**
```json
{
  "name": "Aadhar Card",
  "type": "Identity",
  "fileName": "aadhar-card.pdf",
  "fileUrl": "https://storage.example.com/docs/aadhar-card.pdf"
}
```

**HR upload on behalf of employee:**
```json
{
  "empId": "CFT20260006",
  "name": "Offer Letter",
  "type": "HR",
  "fileName": "kavin-offer-letter.pdf",
  "fileUrl": "https://storage.example.com/docs/kavin-offer-letter.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "id": 1,
    "emp_id": "CFT20260006",
    "employee_name": "Kavin",
    "uploaded_by_emp_id": "CFT20260002",
    "uploaded_by_name": "Deepika",
    "name": "Offer Letter",
    "type": "HR",
    "file_name": "kavin-offer-letter.pdf",
    "file_url": "https://storage.example.com/docs/kavin-offer-letter.pdf",
    "status": "Pending",
    "rejection_reason": null,
    "reviewed_by_emp_id": null,
    "reviewed_at": null,
    "uploaded_at": "2026-06-15T10:30:00.000Z"
  }
}
```

**Errors:**
```json
{ "message": "Employee not found" }
{ "message": "A document with this name already exists for this employee. Please delete it first." }
```

---

### Get Documents

`GET /api/documents`

> Employee → own documents only. HR / Admin / Manager → can filter by `?empId=`

**Query parameters:**

| Param | Values |
|-------|--------|
| `empId` | e.g. `CFT20260006` |
| `status` | `Pending`, `Approved`, `Rejected` |
| `type` | `Identity`, `HR`, `Payroll`, `Tax`, `Education`, `Experience` |
| `search` | keyword, e.g. `aadhar` |

```
GET /api/documents
GET /api/documents?empId=CFT20260006
GET /api/documents?status=Pending
GET /api/documents?type=Identity
GET /api/documents?search=aadhar
GET /api/documents?empId=CFT20260006&status=Approved
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "emp_id": "CFT20260006",
      "employee_name": "Kavin",
      "uploaded_by_emp_id": "CFT20260006",
      "uploaded_by_name": "Kavin",
      "name": "Aadhar Card",
      "type": "Identity",
      "file_name": "aadhar-card.pdf",
      "file_url": "https://storage.example.com/docs/aadhar-card.pdf",
      "status": "Approved",
      "rejection_reason": null,
      "reviewed_by_emp_id": "CFT20260002",
      "reviewed_by_name": "Deepika",
      "reviewed_at": "2026-06-15T11:00:00.000Z",
      "uploaded_at": "2026-06-15T10:30:00.000Z"
    }
  ]
}
```

---

### Get Document by ID

`GET /api/documents/:id`

> Employees can only view their own documents. HR / Admin / Manager can view any.

```
GET /api/documents/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "emp_id": "CFT20260006",
    "employee_name": "Kavin",
    "name": "Aadhar Card",
    "type": "Identity",
    "file_name": "aadhar-card.pdf",
    "file_url": "https://storage.example.com/docs/aadhar-card.pdf",
    "status": "Pending",
    "rejection_reason": null,
    "reviewed_by_emp_id": null,
    "reviewed_at": null,
    "uploaded_at": "2026-06-15T10:30:00.000Z"
  }
}
```

---

### Update Document Status

`PUT /api/documents/:id/status`

> HR Admin / Super Admin / Manager only

`status` — `Pending`, `Approved`, `Rejected`. `rejectionReason` is **required** when rejecting.

**Approve:**
```json
{ "status": "Approved" }
```

**Reject:**
```json
{
  "status": "Rejected",
  "rejectionReason": "Document is not clearly visible. Please re-upload."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document status updated successfully",
  "data": {
    "id": 1,
    "emp_id": "CFT20260006",
    "employee_name": "Kavin",
    "name": "Aadhar Card",
    "status": "Approved",
    "reviewed_by_emp_id": "CFT20260002",
    "reviewed_by_name": "Deepika",
    "reviewed_at": "2026-06-15T11:00:00.000Z"
  }
}
```

---

### Delete Document

`DELETE /api/documents/:id`

> Employee can delete their own. HR / Super Admin can delete any.

**Response:**
```json
{ "success": true, "message": "Document deleted successfully" }
```

**Error:**
```json
{ "message": "Access denied: you can only delete your own documents" }
```

---

## 6. Recruitment

**Base URL:** `http://localhost:5000/api/recruitment`

---

### Get All Jobs

`GET /api/recruitment/jobs`

> Accessible by all logged-in roles.

**Query parameters:**

| Param | Values |
|-------|--------|
| `search` | e.g. `frontend` |
| `dept` | e.g. `Engineering` |
| `status` | `Open`, `Urgent`, `Closing Soon`, `Closed` |
| `page` / `limit` | pagination |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Frontend Developer",
      "dept": "Engineering",
      "status": "Open",
      "location": "Hyderabad",
      "type": "Full Time",
      "experience": "1 - 3 Years",
      "openings": 3,
      "skills": ["React", "TypeScript", "Tailwind CSS"],
      "applicants": 4,
      "posted_by_name": "Deepika",
      "posted_date": "2026-04-22T00:00:00.000Z",
      "closing_date": "2026-04-30"
    }
  ],
  "total": 1
}
```

---

### Get Job by ID

`GET /api/recruitment/jobs/:id`

> Accessible by all logged-in roles.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Frontend Developer",
    "dept": "Engineering",
    "status": "Open",
    "location": "Hyderabad",
    "type": "Full Time",
    "experience": "1 - 3 Years",
    "openings": 3,
    "description": "Build responsive HRMS interfaces.",
    "skills": ["React", "TypeScript", "Tailwind CSS"],
    "applicants": 4,
    "posted_by": "CFT20260002",
    "posted_by_name": "Deepika",
    "posted_date": "2026-04-22T00:00:00.000Z",
    "closing_date": "2026-04-30"
  }
}
```

**Error:**
```json
{ "message": "Job not found" }
```

---

### Create Job Posting

`POST /api/recruitment/jobs`

> HR Admin / Super Admin only

`status` — `Open` (default), `Urgent`, `Closing Soon`, `Closed`  
`type` — `Full Time` (default), `Part Time`, `Contract`, `Internal Transfer`, `Internship`

**Request:**
```json
{
  "title": "Frontend Developer",
  "dept": "Engineering",
  "status": "Open",
  "location": "Hyderabad",
  "type": "Full Time",
  "experience": "1 - 3 Years",
  "openings": 3,
  "description": "Build responsive HRMS interfaces.",
  "skills": ["React", "TypeScript", "Tailwind CSS"],
  "closingDate": "2026-04-30"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job posting created successfully",
  "data": {
    "id": 4,
    "title": "Frontend Developer",
    "dept": "Engineering",
    "status": "Open",
    "location": "Hyderabad",
    "type": "Full Time",
    "experience": "1 - 3 Years",
    "openings": 3,
    "description": "Build responsive HRMS interfaces.",
    "skills": ["React", "TypeScript", "Tailwind CSS"],
    "posted_by": "CFT20260002",
    "posted_by_name": "Deepika",
    "posted_date": "2026-06-16T10:30:00.000Z",
    "closing_date": "2026-04-30"
  }
}
```

---

### Update Job Posting

`PUT /api/recruitment/jobs/:id`

> HR Admin / Super Admin only. All fields optional.

**Request:**
```json
{
  "status": "Closing Soon",
  "openings": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": {
    "id": 4,
    "title": "Frontend Developer",
    "dept": "Engineering",
    "status": "Closing Soon",
    "location": "Hyderabad",
    "type": "Full Time",
    "openings": 2,
    "skills": ["React", "TypeScript", "Tailwind CSS"],
    "posted_by": "CFT20260002",
    "closing_date": "2026-04-30"
  }
}
```

---

### Delete Job Posting

`DELETE /api/recruitment/jobs/:id`

> HR Admin / Super Admin only. Cascades to delete all applications for the job.

**Response:**
```json
{ "success": true, "message": "Job deleted successfully" }
```

---

### Apply to Job

`POST /api/recruitment/jobs/:id/apply`

> Any logged-in employee

**Self apply:**
```json
{
  "applicationType": "Self",
  "candidateName": "Kavin",
  "candidateEmail": "kavin_CFT20260006@hrms.com",
  "resumeFileName": "kavin_resume.pdf"
}
```

**Referral:**
```json
{
  "applicationType": "Referral",
  "candidateName": "Priya Verma",
  "candidateEmail": "priya.verma@gmail.com",
  "resumeFileName": "priya_resume.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 12,
    "job_id": 1,
    "applied_by_empid": "CFT20260006",
    "applied_by_name": "Kavin",
    "application_type": "Self",
    "candidate_name": "Kavin",
    "candidate_email": "kavin_CFT20260006@hrms.com",
    "resume_file_name": "kavin_resume.pdf",
    "resume_url": null,
    "status": "Pending",
    "rejection_reason": null,
    "applied_at": "2026-06-16T10:45:00.000Z"
  }
}
```

**Errors:**
```json
{ "message": "This job posting is closed" }
{ "message": "You have already applied for this job" }
```

---

### Get Applications

`GET /api/recruitment/applications`

> HR Admin / Super Admin / Manager only

**Query parameters:**

| Param | Values |
|-------|--------|
| `jobId` | e.g. `1` |
| `status` | `Pending`, `Screening`, `Interview`, `Offer`, `Hired`, `Rejected` |
| `empId` | e.g. `CFT20260006` |

---

### Update Application Status

`PUT /api/recruitment/applications/:id/status`

> HR Admin / Super Admin only

`status` — `Pending`, `Screening`, `Interview`, `Offer`, `Hired`, `Rejected`. `rejectionReason` is **required** when rejecting.

**Approve / Move stage:**
```json
{ "status": "Interview" }
```

**Reject:**
```json
{
  "status": "Rejected",
  "rejectionReason": "Does not meet minimum experience requirement"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": {
    "id": 12,
    "job_id": 1,
    "applied_by_empid": "CFT20260006",
    "application_type": "Self",
    "candidate_name": "Kavin",
    "candidate_email": "kavin_CFT20260006@hrms.com",
    "resume_file_name": "kavin_resume.pdf",
    "resume_url": null,
    "status": "Interview",
    "rejection_reason": null,
    "applied_at": "2026-06-16T10:45:00.000Z"
  }
}
```
=======
# HRMS Backend Application

The HRMS Backend Application is designed to manage employee operations efficiently within an organization.

This application includes the following modules:

* Department Management Module
* Role Management Module
* User Role Management Module
* Employee Department Mapping Module
* Employee Role Mapping Module
* Announcements Module
* Tasks Management Module
* Internal Jobs Module
* System Configuration Module
* System Health Module
* Reimbursement Module
* Invoice Module
* Tax Reports Module
* Salary Management Module
* Reimbursement Module
* Invoice Module
* Tax Reports Module
* Salary Management Module

**The application follows a layered architecture using:**

* Controllers
* Services
* Repositories
* Validations
* Middleware
* Constants
* Utilities
* MSSQL Stored Procedures

---

## Technology Stack

* Node.js
* TypeScript
* Express.js
* Microsoft SQL Server (MSSQL)
* JWT Authentication
* Express Validator
* Bcrypt
* Nodemailer
* CORS
* Dotenv

---

## Project Structure

```text


src/
│
├── config/
│   ├── db.ts
│   ├── env.ts
│   ├── jwt.ts
│
├── controllers/
│   ├── department/
│   ├── role/
│   ├── userRole/
│   ├── employeeDepartmentMapping/
│   ├── employeeRoleMapping/
│   ├── announcement/
│   ├── task/
│   ├── internalJob/
│   ├── systemConfiguration/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│
├── services/
│   ├── department/
│   ├── role/
│   ├── userRole/
│   ├── employeeDepartmentMapping/
│   ├── employeeRoleMapping/
│   ├── announcement/
│   ├── task/
│   ├── internalJob/
│   ├── systemConfiguration/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│
├── repositories/
│   ├── department/
│   ├── role/
│   ├── userRole/
│   ├── employeeDepartmentMapping/
│   ├── employeeRoleMapping/
│   ├── announcement/
│   ├── task/
│   ├── internalJob/
│   ├── systemConfiguration/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│
├── validations/
│   ├── department/
│   ├── role/
│   ├── userRole/
│   ├── employeeDepartmentMapping/
│   ├── employeeRoleMapping/
│   ├── announcement/
│   ├── task/
│   ├── internalJob/
│   ├── systemConfiguration/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│   ├── systemHealth/
│   ├── reimbursement/
│   ├── invoice/
│   ├── tax-reports/
│   └── salary/
│
├── middleware/
│
├── routes/
│   ├── department.routes.ts
│   ├── role.routes.ts
│   ├── userRole.routes.ts
│   ├── employeeDepartmentMapping.routes.ts
│   ├── employeeRoleMapping.routes.ts
│   ├── announcement.routes.ts
│   ├── task.routes.ts
│   ├── internalJob.routes.ts
│   ├── systemConfiguration.routes.ts
│   ├── systemHealth.routes.ts
│   ├── reimbursement.routes.ts
│   ├── invoice.routes.ts
│   ├── tax-reports.routes.ts
│   └── salary.routes.ts
│   ├── systemHealth.routes.ts
│   ├── reimbursement.routes.ts
│   ├── invoice.routes.ts
│   ├── tax-reports.routes.ts
│   └── salary.routes.ts
│
├── constants/
│   ├── department.constants.ts
│   ├── role.constants.ts
│   ├── userRole.constants.ts
│   ├── employeeDepartment.constants.ts
│   ├── employeeRole.constants.ts
│   ├── announcement.constants.ts
│   ├── task.constants.ts
│   ├── internalJob.constants.ts
│   ├── systemConfig.constants.ts
│   ├── systemHealth.constants.ts
│   ├── reimbursement.constants.ts
│   ├── invoice.constants.ts
│   ├── tax-reports.constants.ts
│   └── salary.constants.ts
│
├── middleware/
│   ├── department.constants.ts
│   ├── role.constants.ts
│   ├── userRole.constants.ts
│   ├── employeeDepartment.constants.ts
│   ├── employeeRole.constants.ts
│   ├── announcement.constants.ts
│   ├── task.constants.ts
│   ├── internalJob.constants.ts
│   ├── systemConfig.constants.ts
│   ├── systemHealth.constants.ts
│   ├── reimbursement.constants.ts
│   ├── invoice.constants.ts
│   ├── tax-reports.constants.ts
│   └── salary.constants.ts
│
├── middleware/
│
├── utils/
│
├── app.ts
│
└── server.ts
```

## Features

### Department Management Module

* Add Department
* Get All Departments
* Update Department Details
* Delete Department

**Access:**

* HR Admin
* Super Admin

---

### Role Management Module

* Add Role
* Get All Roles
* Update Role Details
* Delete Role

**Access:**

* HR Admin
* Super Admin

---

### User Role Management Module

* Create User
* View Users
* Assign Role
* Assign Department
* Update User Details

**Access:**

* HR Admin
* Super Admin

---

### Employee Department Mapping Module

* Create Employee Department Mapping
* View Employee Department Mapping
* Update Employee Department Mapping
* Delete Employee Department Mapping

**Access:**

* HR Admin
* Super Admin

---

### Employee Role Mapping Module

* Create Employee Role Mapping
* View Employee Role Mapping
* Update Employee Role Mapping
* Delete Employee Role Mapping

**Access:**

* HR Admin
* Super Admin

---

### Announcements Module

* Create Announcement
* View Announcements
* Delete Announcement

**Access:**

* HR Admin
* Super Admin
* Manager

---

### Tasks Management Module

* Create Task
* View Tasks
* Delete Task
* Assign Task To Employee

**Access:**

* HR Admin
* Manager

---

### Internal Jobs Module

* Create Internal Job
* View Internal Jobs
* Update Internal Jobs

**Access:**

* HR Admin

---

### System Configuration Module

* Create System Configuration
* View System Configuration
* Update System Configuration

**Configuration Settings**

* Grace Period
* Shift Start Time
* Shift End Time
* Auto Punch-Out Time
* Week-Off Days
* Overtime Rate

**Access:**

* Super Admin

---

### System Health Module

* View System Health
* Monitor Backend API Status
* Monitor Database Status
* Monitor Active Sessions
* Monitor Error Rate
* Monitor Backup Status

**Access:**

* Super Admin

### Reimbursement Module

* Submit Reimbursement Claim
* Get My Reimbursement Claims
* Get All Reimbursement Claims
* Get Reimbursement Claim Details
* Review Reimbursement Claim
* Process Reimbursement Payment
* Settle Reimbursement Payment
  
**Access**

* Employee
* Manager
* HR Admin
* Finance
* Super Admin

### Invoice Module

* Create Invoice
* Get All Invoices
* Get My Invoices
* Get Invoice Details
* Update Invoice
* Update Invoice Status

**Access**

* Finance
* Super Admin
* Client
  
### Tax Reports Module

* Generate Tax Reports
* Get Tax Reports
* Get Compliance Deadlines
* Get Tax Report Details
* Export Tax Reports
* Update Filing Status

**Access**

* Finance
* Super Admin
* HR Admin
  
### Salary Management Module
* Create Salary Structure
* Get Salary Structures
* Get Employee Salary Details
* Update Salary Structure
* Process Payroll
* Generate Payslips
* Get Payslips
* Get Salary Reports
* Manage Bonuses
* Manage Incentives

**Access**

* Finance
* Super Admin
* HR Admin
* Employee

### Reimbursement Module

* Submit Reimbursement Claim
* Get My Reimbursement Claims
* Get All Reimbursement Claims
* Get Reimbursement Claim Details
* Review Reimbursement Claim
* Process Reimbursement Payment
* Settle Reimbursement Payment
  
**Access**

* Employee
* Manager
* HR Admin
* Finance
* Super Admin

### Invoice Module

* Create Invoice
* Get All Invoices
* Get My Invoices
* Get Invoice Details
* Update Invoice
* Update Invoice Status

**Access**

* Finance
* Super Admin
* Client
  
### Tax Reports Module

* Generate Tax Reports
* Get Tax Reports
* Get Compliance Deadlines
* Get Tax Report Details
* Export Tax Reports
* Update Filing Status

**Access**

* Finance
* Super Admin
* HR Admin
  
### Salary Management Module
* Create Salary Structure
* Get Salary Structures
* Get Employee Salary Details
* Update Salary Structure
* Process Payroll
* Generate Payslips
* Get Payslips
* Get Salary Reports
* Manage Bonuses
* Manage Incentives

**Access**

* Finance
* Super Admin
* HR Admin
* Employee

---

## Department APIs

Add Department

POST /department/add

Get Departments

GET /department/all

Update Department

PUT /department/update/:department_id

Delete Department

DELETE /department/delete/:department_id

---

## Role APIs

Add Role

POST /role/add

Get Roles

GET /role/all

Update Role

PUT /role/update/:role_id

Delete Role

DELETE /role/delete/:role_id

---

## User Role Management APIs

Create User

POST /user/add

Get All Users

GET /user/all

Get User By Id

GET /user/:user_id

Update User

PUT /user/update/:user_id

Assign Role

PUT /user/assign-role/:user_id

Assign Department

PUT /user/assign-department/:user_id

---

## Employee Department Mapping APIs

Create Mapping

POST /employee-department-mapping/add

Get Mappings

GET /employee-department-mapping/all

Update Mapping

PUT /employee-department-mapping/update/:mapping_id

Delete Mapping

DELETE /employee-department-mapping/delete/:mapping_id

---

## Employee Role Mapping APIs

Create Mapping

POST /employee-role-mapping/add

Get Mappings

GET /employee-role-mapping/all

Update Mapping

PUT /employee-role-mapping/update/:mapping_id

Delete Mapping

DELETE /employee-role-mapping/delete/:mapping_id

---

## Announcement APIs

Create Announcement

POST /announcement/add

Get Announcements

GET /announcement/all

Delete Announcement

DELETE /announcement/delete/:announcement_id

---

## Task APIs

Create Task

POST /task/add

Get Tasks

GET /task/all

Delete Task

DELETE /task/delete/:task_id

---

## Internal Job APIs

Create Internal Job

POST /internal-job/add

Get Internal Jobs

GET /internal-job/all

Update Internal Job

PUT /internal-job/update/:job_id

---

## System Configuration APIs

Create Configuration

POST /system-config/add

Get Configuration

GET /system-config

Update Configuration

PUT /system-config/update/:config_id

---

## System Health APIs

Get System Health

GET /system-health

Get API Status

GET /system-health/api-status

Get Database Status

GET /system-health/database-status

Get Active Sessions

GET /system-health/active-sessions

Get Error Rate

GET /system-health/error-rate

Get Backup Status

GET /system-health/backup-status

## Reimbursement APIs

Submit Reimbursement Claim

POST /reimbursement/submit

Get My Reimbursement Claims

GET /reimbursement/my

Get All Reimbursement Claims

GET /reimbursement/all

Get Reimbursement Claim By ID

GET /reimbursement/:claimId

Review Reimbursement Claim

PUT /reimbursement/review/:claimId

Process Reimbursement Payment

PUT /reimbursement/process/:claimId

Settle Reimbursement Payment

PUT /reimbursement/settle/:claimId

---

## Invoice APIs

Create Invoice

POST /invoice/create

Get All Invoices

GET /invoice/all

Get My Invoices

GET /invoice/my

Get Invoice By ID

GET /invoice/:invoiceId

Update Invoice

PUT /invoice/update/:invoiceId

Update Invoice Status

PUT /invoice/status/:invoiceId

---

## Tax Reports APIs

Generate Tax Report

POST /tax-reports/generate

Get Tax Reports

GET /tax-reports

Get Compliance Deadlines

GET /tax-reports/deadlines

Get Tax Report By ID

GET /tax-reports/:reportId

Export Tax Report

GET /tax-reports/:reportId/export

Update Filing Status

PUT /tax-reports/:reportId/filing-status

---

## Salary Management APIs

Create Salary Structure

POST /salary/structure/create

Get All Salary Structures

GET /salary/structure/all

Get Employee Salary

GET /salary/structure/employee/:employeeId

Get Salary Structure By ID

GET /salary/structure/:salaryId

Update Salary Structure

PUT /salary/structure/:salaryId/update

Process Payroll

POST /salary/payroll/process

Generate Payslip

POST /salary/:salaryId/payslip/generate

Get All Payslips

GET /salary/payslip/all

Get Payslip By ID

GET /salary/payslip/:payslipId

Add Bonus

POST /salary/:employeeId/bonus/add

Get Bonuses

GET /salary/bonus/all

Add Incentive

POST /salary/:employeeId/incentive/add

Get Salary Reports

GET /salary/reports/analytics





## Reimbursement APIs

Submit Reimbursement Claim

POST /reimbursement/submit

Get My Reimbursement Claims

GET /reimbursement/my

Get All Reimbursement Claims

GET /reimbursement/all

Get Reimbursement Claim By ID

GET /reimbursement/:claimId

Review Reimbursement Claim

PUT /reimbursement/review/:claimId

Process Reimbursement Payment

PUT /reimbursement/process/:claimId

Settle Reimbursement Payment

PUT /reimbursement/settle/:claimId

---

## Invoice APIs

Create Invoice

POST /invoice/create

Get All Invoices

GET /invoice/all

Get My Invoices

GET /invoice/my

Get Invoice By ID

GET /invoice/:invoiceId

Update Invoice

PUT /invoice/update/:invoiceId

Update Invoice Status

PUT /invoice/status/:invoiceId

---

## Tax Reports APIs

Generate Tax Report

POST /tax-reports/generate

Get Tax Reports

GET /tax-reports

Get Compliance Deadlines

GET /tax-reports/deadlines

Get Tax Report By ID

GET /tax-reports/:reportId

Export Tax Report

GET /tax-reports/:reportId/export

Update Filing Status

PUT /tax-reports/:reportId/filing-status

---

## Salary Management APIs

Create Salary Structure

POST /salary/structure/create

Get All Salary Structures

GET /salary/structure/all

Get Employee Salary

GET /salary/structure/employee/:employeeId

Get Salary Structure By ID

GET /salary/structure/:salaryId

Update Salary Structure

PUT /salary/structure/:salaryId/update

Process Payroll

POST /salary/payroll/process

Generate Payslip

POST /salary/:salaryId/payslip/generate

Get All Payslips

GET /salary/payslip/all

Get Payslip By ID

GET /salary/payslip/:payslipId

Add Bonus

POST /salary/:employeeId/bonus/add

Get Bonuses

GET /salary/bonus/all

Add Incentive

POST /salary/:employeeId/incentive/add

Get Salary Reports

GET /salary/reports/analytics
>>>>>>> origin/feature/department-roles
=======
# HRMS Backend - Attendance & Work From Home Module

## Overview

This module manages employee attendance and Work From Home (WFH) operations in the HRMS application.

---

# Features

## Attendance Module

- Employee Punch In
- Employee Punch Out
- Attendance Dashboard
- Attendance History
- Attendance Summary
- Attendance Update
- Auto Punch-Out Scheduler

## Work From Home (WFH) Module

- Create WFH Request
- View My Requests
- View All Requests
- Approve WFH Request
- Reject WFH Request

---

# Business Rules

## Attendance

- Employee can punch in only once per day.
- Punch out is allowed only after a successful punch in.
- Attendance status is calculated automatically.
- Working hours are calculated during punch out.
- Work mode is identified as:
  - **WFO (Work From Office)**
  - **WFH (Work From Home)**
- Auto punch-out is executed through scheduled cron jobs.

## Work From Home

- Employees can create WFH requests.
- WFH requests require approval from authorized roles.
- Employees can view their own requests.
- HR/Admin can view all requests.
- Request status can be approved or rejected.

---

# Project Structure

```text
src/
│
├── controllers/
│   ├── attendance/
│   └── wfh/
│
├── services/
│   ├── attendance/
│   └── wfh/
│
├── repositories/
│   ├── attendance/
│   └── wfh/
│
├── validations/
│   ├── attendance/
│   └── wfh/
│
├── routes/
│   ├── attendanceRoutes.ts
│   └── wfhRoutes.ts
│
├── middleware/
├── cron/
├── config/
├── utils/
├── types/
├── app.ts
└── server.ts
```

---

# Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **Microsoft SQL Server (MSSQL)**
- **JWT Authentication**
- **Zod Validation**
- **Node Cron**

---

# Installation

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

---

# Authentication

All APIs are protected using **JWT Authentication**.

### Header

```http
Authorization: Bearer <token>
```

Employee information is extracted from the authenticated token.

---

# Attendance APIs

## 1. Punch In

### Endpoint

```http
POST /api/attendance/punch-in
```

### Request Body

```json
{
  "latitude": 11.6643,
  "longitude": 78.1460
}
```

### Success Response

```json
{
  "success": true,
  "message": "Punch-in successful",
  "work_mode": "WFO",
  "punch_in_status": "ON_TIME",
  "punch_time": "2026-06-13T09:00:00.000Z"
}
```

---

## 2. Punch Out

### Endpoint

```http
POST /api/attendance/punch-out
```

### Success Response

```json
{
  "success": true,
  "message": "Punch-out successful",
  "work_mode": "WFO",
  "attendance_status": "PRESENT",
  "total_hours": 9
}
```

---

## 3. Attendance Dashboard

### Endpoint

```http
GET /api/attendance/dashboard
```

### Access Roles

- SUPER_ADMIN
- HR_ADMIN
- MANAGER

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## 4. Attendance History

### Endpoint

```http
GET /api/attendance/history/:empId
```

### Example

```http
GET /api/attendance/history/E001
```

### Access Roles

- SUPER_ADMIN
- HR_ADMIN
- MANAGER
- EMPLOYEE

---

## 5. Attendance Summary

### Endpoint

```http
GET /api/attendance/summary/:empId
```

### Example

```http
GET /api/attendance/summary/E001
```

### Access Roles

- SUPER_ADMIN
- HR_ADMIN
- MANAGER
- EMPLOYEE

---

## 6. Update Attendance

### Endpoint

```http
PUT /api/attendance/update/:empId/:date
```

### Example

```http
PUT /api/attendance/update/E001/2026-06-13
```

### Access Roles

- SUPER_ADMIN
- HR_ADMIN
- MANAGER

---

# Work From Home (WFH) APIs

## 1. Create WFH Request

### Endpoint

```http
POST /api/wfh/create
```

### Request Body

```json
{
  "from_date": "2026-06-15",
  "to_date": "2026-06-15",
  "reason": "Personal Work"
}
```

### Success Response

```json
{
  "success": true,
  "message": "WFH request created successfully",
  "data": {}
}
```

---

## 2. Get My WFH Requests

### Endpoint

```http
GET /api/wfh/my-requests
```

### Success Response

```json
{
  "success": true,
  "message": "WFH requests fetched successfully",
  "data": []
}
```

---

## 3. Get All WFH Requests

### Endpoint

```http
GET /api/wfh/all-requests
```

### Access Roles

- SUPER_ADMIN
- HR_ADMIN
- MANAGER

### Success Response

```json
{
  "success": true,
  "message": "All WFH requests fetched successfully",
  "data": []
}
```

---

## 4. Update WFH Status

### Endpoint

```http
PUT /api/wfh/update-status/:Emp_id
```

### Request Body

```json
{
  "status": "APPROVED"
}
```

### Possible Status Values

- APPROVED
- REJECTED

### Success Response

```json
{
  "success": true,
  "message": "WFH request status updated successfully"
}
```

---

# Author

**Gayathri A**

Developed and maintained the **Attendance** and **Work From Home (WFH)** modules for the HRMS Backend Application.
>>>>>>> origin/feature/attendance-wfh
