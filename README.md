# HRMS Portal - Employee CRUD API

## Description

This project provides REST APIs to perform CRUD operations on Employee data.

---

##  Features

* Get all employees
* Get employee by ID
* Filter employees (department, role, status)
* Create new employee
* Update employee (partial update)

---

##  Tech Stack

* Node.js
* Express.js
* TypeScript
* MySQL

---

##  Setup Instructions

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in root:

   ```env
   PORT=5000
   ALLOWED_ORIGIN=http://localhost:5173

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=hrms_portal
   ```

4. Run the app (development):

   ```bash
   npm run dev
   ```


##  Base URL

```
http://localhost:5000/api/employees
```

> Note: All APIs are prefixed with `/api`

---



```
http://localhost:5000/
```

---

##  API Endpoints (Postman Ready)

### 🔹 GET APIs

Get all employees

```
http://localhost:5000/api/employees
```

Get employee by ID

```
http://localhost:5000/api/employees/1
```

Filter by Department

```
http://localhost:5000/api/employees?department=Engineering
```

Filter by Role

```
http://localhost:5000/api/employees?role=Manager
```

Filter by Status

```
http://localhost:5000/api/employees?status=active
```

Combined Filters

```
http://localhost:5000/api/employees?department=Engineering&role=Developer&status=active
```

---

### 🔹 POST API

Create employee

```
http://localhost:5000/api/employees
```

Method: **POST**

Body:

```json
{
  "Name": "John",
  "Email": "john@gmail.com",
  "Phone": "9876543210",
  "Role": "Developer",
  "Department": "Engineering",
  "IsActive": 1
}
```

---

### 🔹 PUT API

Update employee

```
http://localhost:5000/api/employees/2
```

Method: **PUT**

Body:

```json
{
  "Role": "Manager"
}
```

---

## Update Rules

### Allowed Fields:

* Name
* Email
* Phone
* Role
* Department
* IsActive

### Restricted Fields:

* Id cannot be updated
* Emp_id cannot be updated

---

## 🗄 Database Setup (MySQL)

```sql
CREATE DATABASE hrms_portal;
USE hrms_portal;

DROP TABLE IF EXISTS Employee;

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

INSERT INTO Employee (Name, Email, Phone, Role, Department, IsActive) VALUES
('John', 'john@gmail.com', '9876543210', 'Developer', 'Engineering', 1),
('Sara', 'sara@gmail.com', '9876543211', 'Tester', 'QA', 1),
('David', 'david@gmail.com', '9876543212', 'Manager', 'Engineering', 0),
('Priya', 'priya@gmail.com', '9876543213', 'HR', 'HR', 1);

UPDATE Employee
SET Emp_id = CONCAT('E', LPAD(Id, 3, '0'))
WHERE Emp_id IS NULL;

SELECT * FROM Employee;
```

---

##  Notes

* Emp_id is auto-generated (E001, E002…)
* IsActive: 1 = Active, 0 = Inactive
* Email and Phone must be unique

---

## Testing

* APIs tested using Postman
* All endpoints validated successfully

---

##  Error Handling

* Global error handler implemented
* Proper HTTP status codes used
* Validation handled in controller

---
