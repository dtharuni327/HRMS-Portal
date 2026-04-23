HRMS Database Schema

Overview
HRMS database schema prepared for backend integration and testing. Includes schema creation scripts, relationships, and sample data.

Modules Covered
Employee
Department
Attendance
Leave
Payroll
Documents
Performance
Client & Project Management
Environment

Database: Microsoft SQL Server
Schema: dbo
Tables: 15

Installation / Execution

Step 1 Run:
CREATE DATABASE HRMS;
USE HRMS;

Step 2
Execute HRMS.sql

Step 3
Validate: SELECT * FROM INFORMATION_SCHEMA.TABLES;

Expected Output: 15 BASE TABLES

Included Deliverables
Table creation scripts
PK / FK constraints
Sample insert data
Validation queries
Smoke Test Queries

Check employee data:
SELECT * FROM Employee;

Check joins:
SELECT e.Name,d.DepartmentName
FROM Employee e
JOIN Department d ON e.Department_id=d.Id;

Check attendance:
SELECT * FROM Attendance;

Validation Checklist
[✓] Tables created
[✓] Foreign keys validated
[✓] Sample data inserted
[✓] Join queries verified

Assumptions
Document paths are placeholders
Demo sample data included

Support Testing Status
Status: Validated Successfully