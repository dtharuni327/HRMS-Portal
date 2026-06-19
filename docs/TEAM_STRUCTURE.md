# Team Structure

## Team Allocation

You have 10 members:

- 4 Backend
- 2 Frontend
- 1 QA
- 2 DevOps
- 1 Database

## Ownership Model

### Backend

Backend 1:

- Auth
- RBAC
- User and employee APIs
- Session and audit hooks

Backend 2:

- Attendance
- Leave workflow
- Holiday rules
- Regularization flow

Backend 3:

- Payroll rules
- Salary accrual engine
- Payslip data prep
- Reports endpoints

Backend 4:

- Dashboard aggregations
- Announcements
- Document metadata APIs
- Export endpoints

### Frontend

Frontend 1:

- App shell
- Login
- Employee dashboard
- Attendance pages
- Leave pages

Frontend 2:

- HR dashboard
- Manager dashboard
- Admin dashboard
- Employee onboarding
- Payslip and announcement screens

### QA

QA 1:

- Create P0 and P1 test cases
- Execute regression on every build
- Maintain blocker list
- Capture screenshots for handover proof

### DevOps

DevOps 1:

- Environment setup
- CI basics
- Deployment
- Secrets and config handling

DevOps 2:

- Logging
- Monitoring basics
- Backup/export scripts
- Release packaging and handover bundle

### Database

DB 1:

- Schema design
- Migrations
- Seed data
- Indexes
- Access policy coordination with backend

## Daily Sync Cadence

- 9:00 AM: 15-minute planning sync
- 1:00 PM: blocker review
- 6:00 PM: integration checkpoint
- 10:00 PM: release readiness check on June 15 and June 16

## Work Rules

- One shared source of truth for scope
- No one builds outside assigned module without sync
- Merge only when QA validates the affected P0 flow
- Bugs in P0 are fixed before any P1 work
- Every owner must provide demo steps for their module
