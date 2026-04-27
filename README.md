# HRMS Portal - Employee CRUD API

## Description

This project provides REST APIs to perform CRUD operations on Employee data.

### Features
- Get all employees
- Get employee by ID
- Filter employees (department, role, status)
- Create new employee
- Update employee (partial update)

---

## Tech Stack

- Node.js  
- Express.js  
- TypeScript  
- MySQL  

---

## Setup Instructions

1. Clone the repository  
2. Install dependencies:
   npm install

3. Configure DB in:
   src/config/db.ts

4. Run the app:
   npm run dev

---

## Base URL

http://localhost:3000/api/employees

---

## API Endpoints (Postman Ready)

### GET APIs

Get all employees  
http://localhost:3000/api/employees

Get employee by ID  
http://localhost:3000/api/employees/1

Filter by Department  
http://localhost:3000/api/employees?department=Engineering

Filter by Role  
http://localhost:3000/api/employees?role=Manager

Filter by Status  
http://localhost:3000/api/employees?status=active

Combined Filters  
http://localhost:3000/api/employees?department=Engineering&role=Developer&status=active

---

### POST API

Create employee  
http://localhost:3000/api/employees

Method: POST  

Body (JSON):
{
  "Name": "John",
  "Email": "john@gmail.com",
  "Phone": "9876543210",
  "Role": "Developer",
  "Department": "Engineering",
  "IsActive": 1
}

---

### PUT API

Update employee  
http://localhost:3000/api/employees/2

Method: PUT  

Body (JSON):
{
  "Role": "Manager"
}

---

## Update Rules

Allowed Fields:
- Name  
- Email  
- Phone  
- Role  
- Department  
- IsActive  

Restricted Fields:
- Id cannot be updated  
- Emp_id cannot be updated  

---

## Database Setup (MySQL)

Run the below SQL script:

-- 1. Create Database
CREATE DATABASE hrms_portal;
USE hrms_portal;

-- 2. Drop table if exists
DROP TABLE IF EXISTS Employee;

-- 3. Create Table 
CREATE TABLE Employee (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Emp_id VARCHAR(10) UNIQUE,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(100) UNIQUE,
  Phone VARCHAR(10) UNIQUE,
  Role VARCHAR(50),
  Department VARCHAR(100),
  IsActive TINYINT(1) DEFAULT 1
);

-- 4. Insert Sample Data
INSERT INTO Employee (Name, Email, Phone, Role, Department, IsActive) VALUES
('John', 'john@gmail.com', '9876543210', 'Developer', 'Engineering', 1),
('Sara', 'sara@gmail.com', '9876543211', 'Tester', 'QA', 1),
('David', 'david@gmail.com', '9876543212', 'Manager', 'Engineering', 0),
('Priya', 'priya@gmail.com', '9876543213', 'HR', 'HR', 1);

-- 5. Generate Emp_id
UPDATE Employee
SET Emp_id = CONCAT('E', LPAD(Id, 3, '0'))
WHERE Emp_id IS NULL;

-- 6. Verify
SELECT * FROM Employee;

---

## Notes

- Emp_id is auto-generated (E001, E002…)
- IsActive: 1 = Active, 0 = Inactive
- Email and Phone must be unique

---

## Testing

APIs tested using Postman and validated successfully.

---


