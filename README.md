# HRMS Portal

This repository has been reorganized into a single handover-ready structure from the team's split branches.

## Repository Layout

```text
frontend/   React + Vite HRMS UI
backend/    Express + TypeScript HRMS API
docs/       Delivery, architecture, scope, and handover documents
```

## Current Handover Status

This is now a clean integration repository for the June 17, 2026 client handover.

Included:

- Frontend consolidated from the active UI branch
- Backend consolidated from employee, attendance/WFH, and leave/auth branches
- Delivery planning and handover documentation
- Cleaner role handling and environment defaults

Not fully production-complete:

- Some UI modules are still demo/mock driven
- Several advanced screens are not yet connected to live backend APIs
- The backend now runs in self-contained local demo mode using a JSON datastore in `backend/data/hrms-db.json`

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run dev
```

Default URL: `http://localhost:5000`

For the current integrated demo in this repository:

- Frontend dev URL: `http://127.0.0.1:4173`
- Backend API URL: `http://127.0.0.1:5000`
- Local datastore: `backend/data/hrms-db.json`

## Environment Files

- Frontend example: [frontend/.env.example](./frontend/.env.example)
- Backend example: [backend/.env.example](./backend/.env.example)

## Suggested Demo Login Accounts

Primary integrated backend accounts:

- `superadmin` / `Super@123`
- `hradmin` / `Hr@12345`
- `manager` / `Manager@123`
- `employee` / `Employee@123`
- `finance` / `Finance@123`
- `client` / `Client@123`

Fallback frontend mock accounts still exist in [frontend/mock/users.json](./frontend/mock/users.json), but the preferred demo path is the live backend login above.

## Key Documents

- [Delivery Plan](./docs/DELIVERY_PLAN.md)
- [Team Structure](./docs/TEAM_STRUCTURE.md)
- [Product Scope](./docs/PRODUCT_SCOPE.md)
- [Technical Architecture](./docs/TECHNICAL_ARCHITECTURE.md)
- [Execution Board](./docs/EXECUTION_BOARD.md)
- [Handover Checklist](./docs/HANDOVER_CHECKLIST.md)

## Recommended Next Team Step

Use this repository as the new integration branch baseline. From here, your team should focus only on:

- API wiring for the demo-critical screens
- Demo data refinement in `backend/data/hrms-db.json`
- P0 bug fixing
- Deployment rehearsal
