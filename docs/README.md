# HRMS Client Delivery Plan

This repository contains the execution plan, delivery structure, and technical blueprint for the HRMS project due for client handover on June 17, 2026.

## Reality Check

The scope document describes a 12-16 week product, not a 2-day build.

For the June 17, 2026 handover, the team should deliver:

- A working MVP covering the highest-value HRMS flows
- A clean architecture and implementation plan
- A documented roadmap for Phase 2+ features
- Demo-ready sample data and test scenarios
- Deployment, QA, and handover documentation

## Recommended MVP for June 17, 2026

In scope:

- Authentication and role-based access
- Employee onboarding and profile management
- Attendance punch in and punch out
- WFH/WFO/Hybrid selection
- Leave request and approval
- Holiday calendar
- Basic dashboards for Employee, Manager, HR, Admin
- Payroll preview using daily accrual rules
- Payslip PDF generation
- Document upload metadata flow
- Announcements
- Basic audit logging

Deferred after handover:

- Full chat and group messaging
- AI assistant and predictive analytics
- Resume parser
- Meeting summarizer
- Advanced performance management
- Asset management
- Multi-company support
- Government and banking integrations
- Biometric device integration
- 2FA and advanced security controls

## Documents

- [Delivery Plan](./docs/DELIVERY_PLAN.md)
- [Team Structure](./docs/TEAM_STRUCTURE.md)
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Product Scope Cut](./docs/PRODUCT_SCOPE.md)
- [Handover Checklist](./docs/HANDOVER_CHECKLIST.md)

## Suggested Repository Layout

```text
apps/
  web/                 React frontend
  api/                 Backend services / edge functions
packages/
  ui/                  Shared UI components
  types/               Shared TypeScript types
  rules/               Payroll and attendance rule engine
  docs/                Generated templates if needed
infra/
  supabase/            SQL, policies, seeds
  deployment/          Environment and release notes
docs/                  Delivery and project documentation
```

## Immediate Next Step

Use the documents in `docs/` as the operating plan for June 15-17, 2026. If needed, the next step after alignment is to scaffold the MVP codebase directly in this repository.
