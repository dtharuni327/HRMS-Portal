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
