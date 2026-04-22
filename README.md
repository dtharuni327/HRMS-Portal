# HRMS Portal - Attendance Management API

## Description

This project provides REST APIs to manage employee attendance using **Punch-In and Punch-Out system.**

As part of **Sprint 1**, the following functionalities are implemented:

  1.  Employee Punch-In
  2.  Employee Punch-Out
  3.  Attendance status calculation (Present, Late, Half Day, Absent)
  4.  Auto Punch-Out using Cron Job (6:00 PM)
  5.  Total working hours calculation
  6.  Prevent multiple punch-in per day
  7.  Block punch-in after 5:50 PM

---

## Tech Stack

- Node.js  
- Express.js  
- TypeScript  
- MySQL  
- node-cron  

---

## Project Structure

```txt id="fix2"
HRMS-PROJECT
├── src
│   ├── config        # Database configuration (db.ts, cron.ts)
│   ├── controllers   # API logic (attendanceController.ts)
│   ├── routes        # API routes (attendanceRoutes.ts)
│   └── server.ts     # Server entry point
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore

---

## Setup Instructions

  1. Clone the repository
  2. Install dependencies:
        npm install
  3. Configure database in:
        src/config/db.ts
  4. Run the application:
        npm run dev
     
---

## Database Details

**Database:** MySQL

**Table:** attendance

**Columns:**

  - id (Primary Key)
  - employee_id
  - employee_name
  - role
  - date
  - punch_in_time
  - punch_out_time
  - punch_out_type
  - status
  - total_hours

---

## API Endpoints

- **Punch In**
     - POST /punch-in
  - **Sample Request:**
      {
        "employeeId": "EMP001",
        "employeeName": "Kavi",
        "Role": "Developer"
      }
- **Punch Out**
     - POST /punch-out
  - **Sample Request:**
      {
        "employeeId": "EMP001"
      }

---

## Auto Punch-Out (Cron Job)
  - Runs daily at 6:00 PM
  - Automatically updates punch-out time for active employees
  - Prevents missing punch-out cases

---
## Attendance Logic

| Condition           |   Status |
|----------           |--------|
| Before 11:00 AM     | Present |
| 11:00 AM – 12:30 PM | Late |
| 12:30 PM – 3:00 PM  | Half Day |
| After 3:00 PM       | Absent |
| After 5:50 PM       | Punch-in Blocked |

---

## Testing

APIs tested using **Postman** and validated successfully.

  



