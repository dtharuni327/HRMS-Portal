/*HRMS – FINAL SQL SERVER SCRIPT*/

/*DEPARTMENT*/
CREATE TABLE Department (
 Id INT IDENTITY(1,1) PRIMARY KEY,
 DepartmentName VARCHAR(100) NOT NULL
);

/*DESIGNATION*/
CREATE TABLE Designation (
 RoleID INT IDENTITY(1,1) PRIMARY KEY,
 RoleName VARCHAR(50),
 Description VARCHAR(255)
);

/*ROLES*/
CREATE TABLE roles (
 id INT IDENTITY(1,1) PRIMARY KEY,
 role_name NVARCHAR(50) UNIQUE NOT NULL
);

/* Seed roles (IMPORTANT) */
INSERT INTO roles (role_name) VALUES
('SUPER_ADMIN'),('HR_ADMIN'),('MANAGER'),
('EMPLOYEE'),('FINANCE'),('CLIENT');

/*EMPLOYEE*/
CREATE TABLE Employee (
 Id INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10) UNIQUE NOT NULL,
 Name VARCHAR(100) NOT NULL,
 Email VARCHAR(100) UNIQUE,
 Phone VARCHAR(10),
 RoleID INT,
 Department_id INT,
 IsActive BIT NOT NULL DEFAULT 1,
 FOREIGN KEY (RoleID) REFERENCES Designation(RoleID),
 FOREIGN KEY (Department_id) REFERENCES Department(Id)
);

/*USERS*/
CREATE TABLE Users (
 UserID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 Username VARCHAR(50) UNIQUE,
 PasswordHash VARCHAR(255),
 LastLogin DATETIME DEFAULT GETDATE(),
 IsActive BIT NOT NULL DEFAULT 1,
 role_id INT,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
 FOREIGN KEY (role_id) REFERENCES roles(id)
);

/*ATTENDANCE*/
CREATE TABLE Attendance (
 Id INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 Attendance_date DATE,
 Punch_in DATETIME,
 Punch_out DATETIME,
 Status VARCHAR(20),
 Punch_out_type VARCHAR(20),
 Total_hours DECIMAL(5,2),
 WorkMode VARCHAR(10) DEFAULT 'WFO',
 CONSTRAINT chk_workmode CHECK (WorkMode IN ('WFH','WFO','HYBRID')),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

/*LEAVE TYPE*/
CREATE TABLE Leave_Type (
 LeaveTypeID INT IDENTITY(1,1) PRIMARY KEY,
 LeaveTypeName VARCHAR(50),
 Description VARCHAR(255)
);

/*LEAVE REQUEST*/
CREATE TABLE Leave_Request (
 LeaveID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 LeaveTypeID INT,
 StartDate DATE,
 EndDate DATE,
 Reason VARCHAR(255),
 Status VARCHAR(20),
 ApprovedBy VARCHAR(10),
 AppliedDate DATETIME DEFAULT GETDATE(),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
 FOREIGN KEY (LeaveTypeID) REFERENCES Leave_Type(LeaveTypeID),
 FOREIGN KEY (ApprovedBy) REFERENCES Employee(Emp_id)
);

/*HOLIDAY*/
CREATE TABLE Holiday (
 HolidayID INT IDENTITY(1,1) PRIMARY KEY,
 HolidayName VARCHAR(100),
 Date DATE,
 Description VARCHAR(255)
);

/*PAYROLL*/
CREATE TABLE Payroll (
 PayrollID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 BasicSalary DECIMAL(10,2),
 Allowances DECIMAL(10,2),
 Deductions DECIMAL(10,2),
 NetSalary DECIMAL(10,2),
 PayDate DATE,
 [Month] INT,
 [Year] INT,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

/*ADDRESS*/
CREATE TABLE Address (
 AddressID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 AddressLine VARCHAR(255),
 City VARCHAR(50),
 State VARCHAR(50),
 Pincode VARCHAR(10),
 Country VARCHAR(50),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

/*DOCUMENTS*/
CREATE TABLE Documents (
 DocumentID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 DocumentType VARCHAR(50),
 FilePath VARCHAR(255),
 UploadedDate DATE,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

/*PERFORMANCE*/
CREATE TABLE Performance (
 ReviewID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 ReviewDate DATE,
 Rating INT,
 Comments VARCHAR(255),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

/*CLIENT*/
CREATE TABLE Client (
 ClientID INT IDENTITY(1,1) PRIMARY KEY,
 ClientName VARCHAR(100),
 ContactPerson VARCHAR(100),
 Email VARCHAR(100),
 Phone VARCHAR(10)
);

/*PROJECT*/
CREATE TABLE Project (
 ProjectID INT IDENTITY(1,1) PRIMARY KEY,
 ProjectName VARCHAR(100),
 ClientID INT,
 StartDate DATE,
 EndDate DATE,
 Status VARCHAR(50),
 FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
);

/*PROJECT ASSIGNMENT*/
CREATE TABLE Project_Assignment (
 AssignmentID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10),
 ProjectID INT,
 Role VARCHAR(50),
 StartDate DATE,
 EndDate DATE,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
 FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

/* INDEXES */

CREATE INDEX IX_Employee_Email ON Employee(Email);
CREATE INDEX IX_Attendance_EmpDate ON Attendance(Emp_id, Attendance_date);
CREATE INDEX IX_LeaveReq_Emp ON Leave_Request(Emp_id, Status);
CREATE INDEX IX_Users_Email ON Users(Username);
CREATE INDEX IX_Payroll_Emp ON Payroll(Emp_id);