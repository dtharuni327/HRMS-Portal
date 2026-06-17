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




