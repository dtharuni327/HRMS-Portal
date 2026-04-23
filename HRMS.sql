SELECT * FROM INFORMATION_SCHEMA.TABLES

---Department
CREATE TABLE Department (
 Id INT PRIMARY KEY,
 DepartmentName VARCHAR(100) NOT NULL
);

SELECT * FROM Department;

INSERT INTO Department VALUES
(1,'IT'),(2,'HR'),(3,'Management'),
(4,'Testing'),(5,'Support'),(6,'Admin');

---Employee
CREATE TABLE Employee (
 Id INT PRIMARY KEY,
 Emp_id VARCHAR(10) UNIQUE NOT NULL,
 Name VARCHAR(100) NOT NULL,
 Email VARCHAR(100) UNIQUE,
 Phone VARCHAR(15),
 Role VARCHAR(50),
 Department_id INT,
 FOREIGN KEY (Department_id) REFERENCES Department(Id)
);

SELECT * FROM Employee;

INSERT INTO Employee VALUES
(1,'E101','Shree','ravi@gmail.com','98710','Developer',1),
(2,'E102','Anita','anita@gmail.com','98711','HR',2),
(3,'E103','Bhagya','bhagya@gmail.com','98712','Manager',3),
(4,'E104','Sneha','sneha@gmail.com','98713','Tester',4),
(5,'E105','Arjun','arjun@gmail.com','98714','Developer',1),
(6,'E106','Pooja','pooja@gmail.com','98715','HR',2),
(7,'E107','Rahul','rahul@gmail.com','98716','Support',5),
(8,'E108','Meena','meena@gmail.com','98717','Admin',6),
(9,'E109','Vikram','vikram@gmail.com','98718','Manager',3),
(10,'E110','Divya','divya@gmail.com','98719','Developer',1);

---Designation
CREATE TABLE Designation (
 RoleID INT PRIMARY KEY,
 RoleName VARCHAR(50),
 Description VARCHAR(255)
);

SELECT * FROM Designation;

INSERT INTO Designation VALUES
(1,'Developer','Software development'),
(2,'HR','Human resources'),
(3,'Manager','Team management'),
(4,'Tester','Quality assurance'),
(5,'Support','Support operations'),
(6,'Admin','Administration');

---Users
CREATE TABLE Users (
 UserID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 Username VARCHAR(50) UNIQUE,
 PasswordHash VARCHAR(255),
 LastLogin DATETIME,
 IsActive BIT,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Users;

INSERT INTO Users VALUES
(1,'E101','shree','hash1',GETDATE(),1),
(2,'E102','anita','hash2',GETDATE(),1),
(3,'E103','bhagya','hash3',GETDATE(),1),
(4,'E104','sneha','hash4',GETDATE(),1),
(5,'E105','arjun','hash5',GETDATE(),1),
(6,'E106','pooja','hash6',GETDATE(),0);

---Attendance
CREATE TABLE Attendance (
 Id INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 Attendance_date DATE,
 Punch_in TIME,
 Punch_out TIME,
 Status VARCHAR(20),
 Punch_out_type VARCHAR(20),
 Total_hours DECIMAL(5,2),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Attendance; 

INSERT INTO Attendance VALUES
(1,'E101','2026-04-20','09:00','18:00','Present','Regular',9),
(2,'E102','2026-04-20','09:15','18:10','Late','Regular',8.92),
(3,'E103','2026-04-20','08:50','17:45','Present','Regular',8.92),
(4,'E104','2026-04-20','09:05','18:20','Present','WFH',9.25),
(5,'E105','2026-04-20','09:10','18:05','Present','Regular',8.92),
(6,'E106','2026-04-20','09:00','17:50','Present','Regular',8.83),
(7,'E107','2026-04-20','09:30','18:00','Late','Regular',8.50),
(8,'E108','2026-04-20','00:00','00:00','Absent','NA',0.00);

---Leave_Type
CREATE TABLE Leave_Type (
 LeaveTypeID INT PRIMARY KEY,
 LeaveTypeName VARCHAR(50),
 Description VARCHAR(255)
);

SELECT * FROM Leave_Type;

INSERT INTO Leave_Type VALUES
(1,'Sick Leave','Medical'),
(2,'Casual Leave','Personal'),
(3,'Earned Leave','Paid'),
(4,'Maternity Leave','Extended leave'),
(5,'Paternity Leave','Extended leave');

---Leave_Request
CREATE TABLE Leave_Request (
 LeaveID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 LeaveType VARCHAR(50),
 StartDate DATE,
 EndDate DATE,
 Reason VARCHAR(255),
 Status VARCHAR(20),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Leave_Request;

INSERT INTO Leave_Request VALUES
(1,'E101','Sick Leave','2026-04-10','2026-04-11','Fever','Approved'),
(2,'E102','Casual Leave','2026-04-22','2026-04-22','Personal','Pending'),
(3,'E103','Earned Leave','2026-05-01','2026-05-03','Vacation','Approved'),
(4,'E104','Sick Leave','2026-05-10','2026-05-10','Checkup','Rejected'),
(5,'E105','Casual Leave','2026-05-15','2026-05-16','Family Event','Approved');

---Holiday
CREATE TABLE Holiday (
 HolidayID INT PRIMARY KEY,
 HolidayName VARCHAR(100),
 Date DATE,
 Description VARCHAR(255)
);

SELECT * FROM Holiday;

INSERT INTO Holiday VALUES
(1,'Republic Day','2026-01-26','National Holiday'),
(2,'May Day','2026-05-01','Holiday'),
(3,'Independence Day','2026-08-15','National Holiday'),
(4,'Gandhi Jayanti','2026-10-02','Holiday'),
(5,'Christmas','2026-12-25','Holiday');

---Payroll
CREATE TABLE Payroll (
 PayrollID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 BasicSalary DECIMAL(10,2),
 Allowances DECIMAL(10,2),
 Deductions DECIMAL(10,2),
 NetSalary DECIMAL(10,2),
 PayDate DATE,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Payroll;

INSERT INTO Payroll VALUES 
(1,'E101',50000,5000,2000,53000,'2026-04-30'),
(2,'E102',45000,4000,1500,47500,'2026-04-30'),
(3,'E103',70000,7000,3000,74000,'2026-04-30'),
(4,'E104',42000,3000,1200,43800,'2026-04-30'),
(5,'E105',51000,5000,2200,53800,'2026-04-30');

---Address
CREATE TABLE Address (
 AddressID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 AddressLine VARCHAR(255),
 City VARCHAR(50),
 State VARCHAR(50),
 Pincode VARCHAR(10),
 Country VARCHAR(50),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Address; 

INSERT INTO Address VALUES
(1,'E101','BTM Layout','Bangalore','Karnataka','560076','India'),
(2,'E102','Whitefield','Bangalore','Karnataka','560066','India'),
(3,'E103','HSR Layout','Bangalore','Karnataka','560102','India'),
(4,'E104','Marathahalli','Bangalore','Karnataka','560037','India'),
(5,'E105','Electronic City','Bangalore','Karnataka','560100','India');

---Documents
CREATE TABLE Documents (
 DocumentID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 DocumentType VARCHAR(50),
 FilePath VARCHAR(255),
 UploadedDate DATE,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Documents;

INSERT INTO Documents VALUES
(1,'E101','Aadhar','C:/HRMS/docs/e101.pdf','2026-04-01'),
(2,'E102','PAN','C:/HRMS/docs/e102.pdf','2026-04-02'),
(3,'E103','Passport','C:/HRMS/docs/e103.pdf','2026-04-03');

---Performance
CREATE TABLE Performance (
 ReviewID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 ReviewDate DATE,
 Rating INT,
 Comments VARCHAR(255),
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id)
);

SELECT * FROM Performance;

INSERT INTO Performance VALUES
(1,'E101','2026-04-15',4,'Good'),
(2,'E102','2026-04-15',5,'Excellent'),
(3,'E103','2026-04-15',4,'Strong Leadership'),
(4,'E104','2026-04-15',3,'Needs Improvement'),
(5,'E105','2026-04-15',5,'Top Performer');

---Client
CREATE TABLE Client (
 ClientID INT PRIMARY KEY,
 ClientName VARCHAR(100),
 ContactPerson VARCHAR(100),
 Email VARCHAR(100),
 Phone VARCHAR(15)
);

SELECT * FROM Client;

INSERT INTO Client VALUES
(1,'ABC Corp','Ramesh','abc@gmail.com','9999999991'),
(2,'XYZ Ltd','Suresh','xyz@gmail.com','9999999992'),
(3,'TechNova','Priya','tn@gmail.com','9999999993'),
(4,'FinEdge','Kiran','fe@gmail.com','9999999994'),
(5,'RetailPro','Asha','rp@gmail.com','9999999995');

---Project
CREATE TABLE Project (
 ProjectID INT PRIMARY KEY,
 ProjectName VARCHAR(100),
 ClientID INT,
 StartDate DATE,
 EndDate DATE,
 Status VARCHAR(50),
 FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
);

SELECT * FROM Project;

INSERT INTO Project VALUES
(1,'HRMS Portal',1,'2026-01-01','2026-06-30','Ongoing'),
(2,'CRM System',2,'2026-02-01','2026-07-31','Ongoing'),
(3,'Payroll Upgrade',3,'2026-03-01','2026-08-31','Planned'),
(4,'Support Dashboard',4,'2026-04-01','2026-09-30','Ongoing'),
(5,'Employee App',5,'2026-05-01','2026-12-31','Planned');

---Project_Assignment
CREATE TABLE Project_Assignment (
 AssignmentID INT PRIMARY KEY,
 Emp_id VARCHAR(10),
 ProjectID INT,
 Role VARCHAR(50),
 StartDate DATE,
 EndDate DATE,
 FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
 FOREIGN KEY (ProjectID) REFERENCES Project(ProjectID)
);

SELECT * FROM Project_Assignment;

INSERT INTO Project_Assignment VALUES
(1,'E101',1,'Developer','2026-01-01',NULL),
(2,'E103',1,'Manager','2026-01-01',NULL),
(3,'E104',2,'Tester','2026-02-01',NULL),
(4,'E105',3,'Developer','2026-03-01',NULL),
(5,'E107',4,'Support','2026-04-01',NULL),
(6,'E110',5,'Developer','2026-05-01',NULL);
