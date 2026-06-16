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