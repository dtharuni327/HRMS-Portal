# Delivery Plan

## Delivery Goal

Deliver a demo-ready HRMS MVP and complete handover pack to the client on June 17, 2026.

## Non-Negotiable Constraint

The original scope is too large for 2 days. The only workable approach is:

- Freeze the MVP scope immediately
- Build only the most defensible business-critical flows
- Mark everything else as post-handover roadmap

## Delivery Strategy

The project should be handled as three parallel tracks:

1. Product Track
   Define what will be shown to the client and what will be deferred.
2. Build Track
   Implement the core flows end-to-end with working demo data.
3. Handover Track
   Prepare documentation, deployment notes, test evidence, and known gaps.

## Priority Order

### P0: Must Work for Client Demo

- Login
- Role-based navigation
- Employee creation
- Attendance punch in and punch out
- Work mode selection
- Leave request and approval
- Holiday list
- Basic dashboards
- Payroll daily accrual logic
- Payslip generation
- Announcement posting

### P1: Should Work if Time Permits

- Document upload
- Regularization request
- Project tagging
- Audit logs
- CSV/PDF export for attendance and payroll

### P2: Defer

- Chat
- AI modules
- GPS spoof detection
- Asset management
- Exit management
- Performance module
- Advanced analytics
- Integrations

## Date-Wise Execution Plan

### June 15, 2026: Scope Freeze + Foundation

Objectives:

- Lock MVP scope
- Finalize architecture
- Create DB schema
- Set up auth, roles, repo structure, base UI shell

Expected output by end of day:

- Approved MVP checklist
- Database schema and seed data
- Auth and role model working
- Base frontend shell for 4 roles
- Attendance and employee modules started

### June 16, 2026: Core Build + QA

Objectives:

- Finish attendance, leave, payroll preview, dashboards
- Add payslip generation
- Run QA on all main flows
- Prepare demo dataset

Expected output by end of day:

- End-to-end MVP usable with seeded users
- Test cases executed
- Bug list reduced to only non-blockers
- Handover docs 70-80% complete

### June 17, 2026: Final Polish + Handover

Objectives:

- Fix blockers only
- Deploy stable build
- Produce walkthrough and documentation
- Package client handover materials

Expected output before handover:

- Stable demo URL or local deployment bundle
- Admin guide
- User guide
- Test evidence
- Known limitations and roadmap document

## Deliverables for Client

- Working HRMS MVP
- Source code
- Deployment guide
- Admin and user documentation
- Seed/demo credentials
- Scope coverage matrix
- Deferred roadmap

## Demo Story

The client demo should follow this order:

1. Admin configures holidays, roles, policies
2. HR creates an employee and assigns manager
3. Employee logs in and punches in with work mode
4. Employee submits leave request
5. Manager approves leave
6. HR reviews attendance and payroll preview
7. Employee downloads payslip
8. Admin reviews audit log and announcements

## Risk Controls

- No new features after June 16 afternoon
- No redesigns after UI shell is accepted
- No deep integrations during MVP build
- Every module must have demo seed data
- QA signs off only on P0 items first
