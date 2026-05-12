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

/*LEAVE_BALANCE*/
CREATE TABLE Leave_Balance (
 BalanceID INT IDENTITY(1,1) PRIMARY KEY,
 Emp_id VARCHAR(10) NOT NULL,
 LeaveTypeID INT NOT NULL,
 [Year] INT NOT NULL,
 Allocated INT NOT NULL DEFAULT 0,
 Used INT NOT NULL DEFAULT 0,
 Remaining AS (Allocated - Used),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
 FOREIGN KEY (LeaveTypeID) REFERENCES Leave_Type(LeaveTypeID),
 CONSTRAINT uq_leave_balance UNIQUE (Emp_id, LeaveTypeID, [Year])
);

/* INDEXES */

CREATE INDEX IX_Employee_Email ON Employee(Email);
CREATE INDEX IX_Attendance_EmpDate ON Attendance(Emp_id, Attendance_date);
CREATE INDEX IX_LeaveReq_Emp ON Leave_Request(Emp_id, Status);
CREATE INDEX IX_Users_Email ON Users(Username);
CREATE INDEX IX_Payroll_Emp ON Payroll(Emp_id);


=================================================

-- Department
INSERT INTO Department (DepartmentName) VALUES
('HR'),('IT'),('Finance'),('Sales'),
('Marketing'),('Support'),('Operations');

SELECT * FROM DEPARTMENT

-- Designation
INSERT INTO Designation (RoleName, Description) VALUES
('Developer','Writes code'),
('HR','Handles recruitment'),
('Manager','Manages team'),
('Tester','Tests application'),
('Support','Handles tickets'),
('Admin','System admin'),
('Analyst','Business analysis');

SELECT * FROM DESIGNATION

-- Employee
INSERT INTO Employee (Emp_id, Name, Email, Phone, RoleID, Department_id)
VALUES
('E101','Arjun','arjun@mail.com','9876543210',1,2),
('E102','Meena','meena@mail.com','9876543211',2,1),
('E103','Ravi','ravi@mail.com','9876543212',3,2),
('E104','Sneha','sneha@mail.com','9876543213',4,2),
('E105','Kiran','kiran@mail.com','9876543214',5,6),
('E106','Divya','divya@mail.com','9876543215',6,3),
('E107','Manoj','manoj@mail.com','9876543216',7,4);

SELECT * FROM EMPLOYEE

-- Users
INSERT INTO Users (Emp_id, Username, PasswordHash, role_id)
VALUES
('E101','arjun','pass123',1),
('E102','meena','pass123',2),
('E103','ravi','pass123',3),
('E104','sneha','pass123',4),
('E105','kiran','pass123',5),
('E106','divya','pass123',6),
('E107','manoj','pass123',4);

SELECT * FROM USERS

-- Attendance
INSERT INTO Attendance (Emp_id, Attendance_date, Punch_in, Punch_out, Status, WorkMode)
VALUES
('E101','2026-04-01',GETDATE(),GETDATE(),'Present','WFO'),
('E102','2026-04-01',GETDATE(),GETDATE(),'Present','WFH'),
('E103','2026-04-01',GETDATE(),GETDATE(),'Late','HYBRID'),
('E104','2026-04-01',GETDATE(),GETDATE(),'Present','WFO'),
('E105','2026-04-01',GETDATE(),GETDATE(),'Absent','WFH'),
('E106','2026-04-01',GETDATE(),GETDATE(),'Present','HYBRID'),
('E107','2026-04-01',GETDATE(),GETDATE(),'Present','WFO');

SELECT * FROM ATTENDANCE

--Leave_Type
INSERT INTO Leave_Type (LeaveTypeName, Description) VALUES
('Sick Leave','Medical'),
('Casual Leave','Personal'),
('Earned Leave','Annual'),
('Maternity Leave','For mothers'),
('Paternity Leave','For fathers'),
('Emergency Leave','Urgent'),
('Unpaid Leave','No salary');

SELECT * FROM LEAVE_TYPE

-- Leave_Request
INSERT INTO Leave_Request (Emp_id, LeaveTypeID, StartDate, EndDate, Reason, Status, ApprovedBy)
VALUES
('E101',1,'2026-04-10','2026-04-12','Fever','Approved','E103'),
('E102',2,'2026-04-05','2026-04-06','Personal','Pending',NULL),
('E103',3,'2026-04-15','2026-04-20','Vacation','Approved','E106'),
('E104',1,'2026-04-08','2026-04-09','Cold','Rejected','E103'),
('E105',6,'2026-04-11','2026-04-11','Emergency','Approved','E106'),
('E106',3,'2026-04-18','2026-04-22','Trip','Pending',NULL),
('E107',2,'2026-04-07','2026-04-08','Personal','Approved','E103');

SELECT * FROM LEAVE_REQUEST

-- Holiday
INSERT INTO Holiday (HolidayName, Date, Description) VALUES
('New Year','2026-01-01','New Year Holiday'),
('Republic Day','2026-01-26','India Holiday'),
('Holi','2026-03-14','Festival'),
('Independence Day','2026-08-15','National Holiday'),
('Gandhi Jayanti','2026-10-02','Holiday'),
('Diwali','2026-11-12','Festival'),
('Christmas','2026-12-25','Holiday');

SELECT * FROM HOLIDAY

-- Payroll
INSERT INTO Payroll (Emp_id, BasicSalary, Allowances, Deductions, NetSalary, PayDate, [Month], [Year])
VALUES
('E101',50000,5000,2000,53000,'2026-04-30',4,2026),
('E102',45000,4000,1500,47500,'2026-04-30',4,2026),
('E103',60000,6000,2500,63500,'2026-04-30',4,2026),
('E104',48000,3000,2000,49000,'2026-04-30',4,2026),
('E105',42000,2000,1000,43000,'2026-04-30',4,2026),
('E106',55000,5000,2000,58000,'2026-04-30',4,2026),
('E107',47000,3000,1500,48500,'2026-04-30',4,2026);

SELECT * FROM PAYROLL

-- Address
INSERT INTO Address (Emp_id, AddressLine, City, State, Pincode, Country)
VALUES
('E101','Street 1','Bangalore','KA','560001','India'),
('E102','Street 2','Mysore','KA','570001','India'),
('E103','Street 3','Chennai','TN','600001','India'),
('E104','Street 4','Hyderabad','TS','500001','India'),
('E105','Street 5','Pune','MH','411001','India'),
('E106','Street 6','Delhi','DL','110001','India'),
('E107','Street 7','Mumbai','MH','400001','India');

SELECT * FROM ADDRESS

-- Documents
INSERT INTO Documents (Emp_id, DocumentType, FilePath, UploadedDate)
VALUES
('E101','Aadhar','/docs/e101.pdf','2026-04-01'),
('E102','PAN','/docs/e102.pdf','2026-04-01'),
('E103','Passport','/docs/e103.pdf','2026-04-01'),
('E104','Aadhar','/docs/e104.pdf','2026-04-01'),
('E105','PAN','/docs/e105.pdf','2026-04-01'),
('E106','Passport','/docs/e106.pdf','2026-04-01'),
('E107','Aadhar','/docs/e107.pdf','2026-04-01');

SELECT * FROM DOCUMENTS

-- Performance
INSERT INTO Performance (Emp_id, ReviewDate, Rating, Comments)
VALUES
('E101','2026-04-01',4,'Good'),
('E102','2026-04-01',3,'Average'),
('E103','2026-04-01',5,'Excellent'),
('E104','2026-04-01',4,'Good'),
('E105','2026-04-01',3,'Average'),
('E106','2026-04-01',5,'Excellent'),
('E107','2026-04-01',4,'Good');

SELECT * FROM PERFORMANCE

-- Client
INSERT INTO Client (ClientName, ContactPerson, Email, Phone)
VALUES
('ABC Corp','Raj','abc@mail.com','9999990001'),
('XYZ Ltd','Kumar','xyz@mail.com','9999990002'),
('TechSoft','Anil','tech@mail.com','9999990003'),
('Global Inc','John','global@mail.com','9999990004'),
('NextGen','Sara','next@mail.com','9999990005'),
('DataSys','Rohit','data@mail.com','9999990006'),
('CloudNet','Priya','cloud@mail.com','9999990007');

SELECT * FROM CLIENT

-- Project
INSERT INTO Project (ProjectName, ClientID, StartDate, EndDate, Status)
VALUES
('HRMS',1,'2026-01-01','2026-06-01','Active'),
('CRM',2,'2026-02-01','2026-07-01','Active'),
('ERP',3,'2026-03-01','2026-08-01','Planning'),
('Billing',4,'2026-01-15','2026-05-15','Completed'),
('SupportTool',5,'2026-02-10','2026-06-10','Active'),
('Analytics',6,'2026-03-20','2026-09-20','Planning'),
('AIProject',7,'2026-04-01','2026-10-01','Active');

SELECT * FROM PROJECT

-- Project_Assignment
INSERT INTO Project_Assignment (Emp_id, ProjectID, Role, StartDate, EndDate)
VALUES
('E101',1,'Developer','2026-01-01',NULL),
('E102',1,'HR','2026-01-01',NULL),
('E103',2,'Manager','2026-02-01',NULL),
('E104',3,'Tester','2026-03-01',NULL),
('E105',4,'Support','2026-01-15',NULL),
('E106',5,'Admin','2026-02-10',NULL),
('E107',6,'Analyst','2026-03-20',NULL);

SELECT * FROM PROJECT_ASSIGNMENT  

---LEAVE_BALANCE
INSERT INTO Leave_Balance (Emp_id, LeaveTypeID, [Year], Allocated, Used)
VALUES
('E101', 1, 2026, 12, 2),
('E102', 2, 2026, 10, 1),
('E103', 3, 2026, 15, 5),
('E104', 1, 2026, 12, 3),
('E105', 6, 2026, 8, 1),
('E106', 3, 2026, 15, 4),
('E107', 2, 2026, 10, 2),
('E101', 7, 2026, 5, 0);

SELECT * FROM LEAVE_BALANCE;
