# Execution Board

## Team Sprint Board for June 15-17, 2026

## Backend 1

Tasks:

- Set up auth model
- Implement role mapping
- Create employee CRUD APIs
- Add audit log hook for critical actions

Definition of done:

- Login works
- Roles are enforced
- HR can create employees

## Backend 2

Tasks:

- Build attendance schema and APIs
- Implement punch in and punch out logic
- Add work mode support
- Implement leave request and approval APIs

Definition of done:

- Employee can punch in and out
- Manager can approve leave
- Attendance data appears in dashboard summaries

## Backend 3

Tasks:

- Build salary structure logic
- Implement daily accrual calculation
- Add LOP handling
- Build payslip data generator

Definition of done:

- Salary preview is correct for sample cases
- Payslip payload is generated for employee

## Backend 4

Tasks:

- Build dashboard summary APIs
- Build announcement APIs
- Add document metadata endpoints
- Add export endpoint if time permits

Definition of done:

- Employee, Manager, HR, and Admin dashboards show real data
- Announcements can be created and displayed

## Frontend 1

Tasks:

- Create app shell and navigation
- Build login flow
- Build employee dashboard
- Build attendance and leave screens

Definition of done:

- Employee can log in, punch in/out, view dashboard, request leave

## Frontend 2

Tasks:

- Build HR dashboard
- Build manager dashboard
- Build admin dashboard
- Build employee onboarding and payslip screens

Definition of done:

- HR, Manager, and Admin can complete their demo flows

## QA 1

Tasks:

- Write P0 test cases
- Validate each completed module same day
- Maintain blocker sheet
- Capture final evidence

Definition of done:

- P0 flows have pass/fail result
- All blockers are visible to team immediately

## DevOps 1

Tasks:

- Prepare environments
- Configure deployment
- Set env variable template
- Create release checklist

Definition of done:

- One reliable deploy target exists
- Team can run build and deploy without confusion

## DevOps 2

Tasks:

- Add logging and basic monitoring
- Prepare backup/export notes
- Package final handover bundle
- Support QA and demo deployment

Definition of done:

- Demo environment is observable enough for handover
- Final package is client-ready

## Database 1

Tasks:

- Design schema
- Create migration scripts
- Prepare seed data
- Add indexes for key lookups

Definition of done:

- Core tables exist
- Seed data supports all demo roles and flows

## Integration Milestones

### Milestone 1: June 15, 2026 3:00 PM

- Schema finalized
- Auth decided
- UI routes defined

### Milestone 2: June 15, 2026 9:00 PM

- Login working
- Employee creation working
- Attendance APIs functional

### Milestone 3: June 16, 2026 2:00 PM

- Leave and payroll logic integrated
- Dashboards connected to live data

### Milestone 4: June 16, 2026 9:00 PM

- Demo flow end-to-end completed
- QA regression complete
- Only blocker fixes remain

### Milestone 5: June 17, 2026 11:00 AM

- Deployment stable
- Handover pack complete
- Demo rehearsal complete

## Stop Doing List

- Do not start chat unless all P0 work is stable
- Do not build AI features in MVP
- Do not build heavy integrations now
- Do not spend time on visual polish before flows work
