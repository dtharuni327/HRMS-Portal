# HRMS Database & Stored Procedures Documentation

## Project Overview

HRMS is a centralized employee management platform developed using Microsoft SQL Server. The database is designed to manage employee information, attendance, leave requests, payroll processing, recruitment, reimbursement claims, document management, task tracking, project efforts, invoices, and system configuration.

This repository contains:

* Database Schema
* Table Definitions
* Foreign Key Relationships
* Constraints and Validations
* Stored Procedures
* Business Logic Implementation

---

# Technology Stack

* Database: Microsoft SQL Server 2025
* Language: T-SQL
* Database Type: Relational Database
* Architecture: Stored Procedure Driven

---

# Database Name

HRMS

---

# Core Modules

## Authentication & Security

Manages login and authentication activities.

Tables:

* Authentication

Stored Procedures:

* USP_Login
* USP_Refresh_Token
* USP_Send_OTP
* USP_Email_Verification
* USP_Forgot_Password
* USP_Reset_Password

---

## Employee Management

Maintains employee records and organizational hierarchy.

Tables:

* Employee
* Department
* Role
* Client

Stored Procedures:

* sp_CreateEmployee
* sp_UpdateEmployee
* sp_GetEmployeeById
* sp_GetEmployeesByFilter

---

## Department Management

Maintains department information.

Tables:

* Department

Stored Procedures:

* USP_Department_Create
* USP_Department_GetAll
* USP_Department_Update
* USP_Department_Delete

---

## Role Management

Maintains employee role information.

Tables:

* Role

Stored Procedures:

* USP_Role_Create
* USP_Role_GetAll
* USP_Role_Update
* USP_Role_Delete

---

## Attendance Management

Tracks employee attendance and working hours.

Tables:

* Attendance

Stored Procedures:

* sp_PunchIn
* sp_PunchOut
* GetAttendanceByEmpDate
* sp_UpdateAttendanceRecord
* sp_GetAttendanceHistory
* sp_GetAttendanceSummary
* sp_GetAttendanceDashboard

Features:

* Daily Punch In
* Daily Punch Out
* Attendance History
* Attendance Summary
* Late Arrival Tracking
* Total Working Hours Calculation

---

## Leave Management

Handles employee leave requests and approvals.

Tables:

* Leave_Request
* Leave_Type

Stored Procedures:

* USP_Leave_Request
* USP_Leave_Get
* USP_Leave_Status_Update
* USP_Leave_Notifications

Features:

* Leave Application
* Leave Approval/Rejection
* Leave Tracking
* Notification Management

---

## Work From Home Management

Handles employee WFH requests.

Tables:

* WFH_Request

Stored Procedures:

* sp_CreateWFHRequest
* sp_GetMyWFHRequests
* sp_GetAllWFHRequests
* sp_UpdateWFHStatus

---

## Holiday Management

Maintains organization holiday calendars.

Tables:

* Holiday

Stored Procedures:

* USP_Holiday_Create
* USP_Holiday_Delete
* USP_Holiday_Get
* USP_Holiday_History
* USP_Get_Total_Holidays
* USP_Get_Used_Holidays
* USP_Get_Remaining_Holidays

---

## Announcement Management

Manages company-wide announcements.

Tables:

* Announcement

Stored Procedures:

* USP_Announcement_Create
* USP_Announcement_CheckDuplicate
* USP_Announcement_GetAll
* USP_Announcement_GetById
* USP_Announcement_Delete

---

## Payroll Management

Handles salary processing and payroll records.

Tables:

* Payroll

Stored Procedures:

* sp_CreatePayroll
* sp_UpdatePayroll
* sp_DeletePayroll
* sp_ApprovePayroll
* sp_GetPayrollList
* sp_GetPayrollByEmployee
* sp_GetPayrollOwn
* sp_GetPayrollSummary

Features:

* Salary Generation
* Payroll Approval
* Payroll Summary Reports
* Employee Salary History

---

## Payslip Management

Generates and manages employee payslips.

Tables:

* Payslip

Stored Procedures:

* sp_CreatePayslip
* sp_DeletePayslip
* sp_GetAllPayslips
* sp_GetPayslipByEmployee
* sp_GetPayslipOwn
* sp_UpdatePayslipStatus

---

## Task Management

Tracks employee tasks and assignments.

Tables:

* Task

Stored Procedures:

* USP_Task_CreateAndAssign
* USP_Task_CheckDuplicate
* USP_Task_GetByEmployee
* USP_Task_GetAll
* USP_Task_GetById
* USP_Task_Delete

---

## Document Management

Stores employee document metadata.

Tables:

* Documents

Stored Procedures:

* sp_UploadEmployeeDocumentMetadata
* sp_GetEmployeeDocuments
* sp_GetDocumentById
* sp_UpdateDocumentStatus
* sp_DeleteDocument

---

## Team Directory

Provides employee hierarchy and organization structure.

Stored Procedures:

* sp_GetTeamDirectory
* sp_GetTeamMemberDetail
* sp_GetOrganisationStructure

---

## Project Effort Tracking

Tracks employee project effort submissions.

Tables:

* ProjectEffort

Stored Procedures:

* sp_CreateProjectEffort
* sp_GetProjectEfforts
* sp_GetProjectEffortById
* sp_GetProjectEffortByEmployee
* sp_UpdateProjectEffort
* sp_DeleteProjectEffort

---

## Recruitment Management

Handles job postings and applications.

Tables:

* Jobs
* Job_Applications

Stored Procedures:

* sp_GetAllJobs
* sp_GetJobById
* sp_CreateJob
* sp_UpdateJob
* sp_DeleteJob
* sp_ApplyToJob
* sp_GetApplications
* sp_UpdateApplicationStatus

---

## Reimbursement Management

Handles employee reimbursement claims.

Tables:

* Reimbursement

Stored Procedures:

* USP_Reimbursement_SubmitClaim
* USP_Reimbursement_GetByEmployee
* USP_Reimbursement_GetAll
* USP_Reimbursement_GetById
* USP_Reimbursement_ReviewClaim
* USP_Reimbursement_ProcessPayment
* USP_Reimbursement_SettlePayment

---

## Invoice Management

Maintains client invoice records.

Tables:

* Invoice

Stored Procedures:

* USP_Invoice_Create
* USP_Invoice_GetAll
* USP_Invoice_GetById
* USP_Invoice_Update
* USP_Invoice_UpdateStatus

---

## Internal Job Portal

Manages internal job opportunities.

Tables:

* InternalJob

Stored Procedures:

* USP_InternalJob_Create
* USP_InternalJob_Update
* USP_InternalJob_CheckDuplicate
* USP_InternalJob_Delete
* USP_InternalJob_GetAll
* USP_InternalJob_GetActive
* USP_InternalJob_GetById

---

## System Configuration

Stores HRMS application settings.

Tables:

* SystemConfig

Stored Procedures:

* USP_SystemConfig_Create
* USP_SystemConfig_Update
* USP_SystemConfig_GetActive
* USP_SystemConfig_Delete
* USP_SystemConfig_GetAll
* USP_SystemConfig_GetByKey

---

# Key Database Relationships

Employee
├── Department
├── Role
├── Client
├── Attendance
├── Leave_Request
├── Payroll
├── Payslip
├── Documents
├── Task
├── ProjectEffort
├── Reimbursement

Payroll
└── Payslip

Jobs
└── Job_Applications

Client
└── Invoice

---

# Database Features

* Primary Keys
* Foreign Key Relationships
* Unique Constraints
* Default Constraints
* Audit Columns
* Status Tracking
* Business Rule Enforcement
* Stored Procedure Driven Operations
* Employee Hierarchy Management
* Payroll Processing
* Recruitment Management

---

# Deployment Steps

1. Create HRMS database.
2. Execute all CREATE TABLE scripts.
3. Create primary keys and foreign keys.
4. Insert master data.
5. Execute all stored procedure scripts.
6. Validate procedures using:

SELECT name
FROM sys.procedures
ORDER BY name;

7. Execute application integration testing.

---

# Version Information

Project: HRMS

Database Platform: Microsoft SQL Server 2025


