# Technical Architecture

## Recommended Build Approach

Because time is extremely limited, choose a stack that reduces infrastructure overhead.

## Suggested Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Backend: Supabase Auth, Postgres, Storage, Edge Functions
- Database: PostgreSQL
- PDF: React-PDF or jsPDF
- Charts: Recharts
- Deployment: Vercel or static frontend + Supabase backend

## Application Areas

### Core Domains

- Auth and RBAC
- Employees
- Attendance
- Leave
- Payroll
- Documents
- Dashboards
- Announcements
- Audit logs

### Role Model

- Super Admin
- HR Admin
- Manager
- Employee
- Finance

## High-Level Data Model

### Master Tables

- companies
- locations
- departments
- designations
- roles
- shifts
- holidays

### User and Employee Tables

- users
- employee_profiles
- employee_documents
- reporting_lines

### Attendance and Leave Tables

- attendance_logs
- attendance_regularizations
- work_mode_requests
- leave_types
- leave_balances
- leave_requests

### Payroll Tables

- salary_structures
- payroll_cycles
- payroll_entries
- payslips
- reimbursements

### Admin and Activity Tables

- announcements
- notifications
- audit_logs

## Core API / Service Modules

### Auth Service

- Sign in
- Sign out
- Role resolution
- Route protection

### Employee Service

- Create employee
- Update profile
- List employees
- Assign manager

### Attendance Service

- Punch in
- Punch out
- Calculate working hours
- Apply grace rules

### Leave Service

- Create leave request
- Approve or reject leave
- Get leave balances

### Payroll Service

- Generate salary structure
- Compute daily accrual
- Compute LOP
- Generate payslip payload

### Dashboard Service

- Employee summary
- Manager team summary
- HR company summary
- Admin system summary

## Rules Engine to Keep Simple for MVP

- Daily salary = (CTC / 12) / 30
- Half day when hours < 4
- Full day when hours >= configured threshold
- Late mark after grace period
- 3 late marks = 1 LOP only if time remains
- Holiday paid automatically

## Security for MVP

- Role-based route guards
- Row-level access policies where possible
- Encrypted transport only
- Basic audit log entries for create, approve, reject, and payroll generation

## Deployment Model

- One frontend deployment
- One Supabase project
- Seeded non-production demo data
- Environment variables documented in handover notes

## Important Simplifications

- Use browser geolocation capture only if easy to wire
- Save document files and metadata, but skip complex verification automation
- Build announcements first, skip chat
- Build reports as filtered tables before charts if time runs out
