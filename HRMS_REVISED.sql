
/* HRMS FINAL SQL SERVER SCRIPT - REVISED */

CREATE TABLE RoleMaster (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions VARCHAR(500)
);

SELECT * FROM RoleMaster;

CREATE TABLE Designation (
    designation_id INT IDENTITY(1,1) PRIMARY KEY,
    designation_name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

SELECT * FROM Designation;

CREATE TABLE Department (
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    manager_id INT NULL
);

SELECT * FROM Department;

CREATE TABLE Employee (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    emp_code VARCHAR(10) UNIQUE NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    department_id INT NOT NULL,
    designation_id INT NOT NULL,
    manager_id INT NULL,
    joining_date DATE,
    employment_type VARCHAR(20) CHECK (employment_type IN ('Full-Time','Intern','Contract')),
    status VARCHAR(20) CHECK (status IN ('Active','Resigned','Terminated')),
    dob DATE,
    gender VARCHAR(20),
    address VARCHAR(255),
    emergency_contact VARCHAR(15)
);

SELECT * FROM Employee;

ALTER TABLE Employee
ADD CONSTRAINT FK_Employee_Department FOREIGN KEY (department_id) REFERENCES Department(department_id),
    CONSTRAINT FK_Employee_Designation FOREIGN KEY (designation_id) REFERENCES Designation(designation_id),
    CONSTRAINT FK_Employee_Manager FOREIGN KEY (manager_id) REFERENCES Employee(employee_id);

ALTER TABLE Department
ADD CONSTRAINT FK_Department_Manager FOREIGN KEY (manager_id) REFERENCES Employee(employee_id);

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME NULL,
    is_active BIT DEFAULT 1,
    role_id INT NOT NULL,
    failed_login_attempts INT DEFAULT 0,
    password_reset_token VARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (role_id) REFERENCES RoleMaster(role_id)
);

SELECT * FROM Users;

CREATE TABLE Attendance (
    attendance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    punch_in DATETIME,
    punch_out DATETIME,
    status VARCHAR(20),
    work_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    attendance_type VARCHAR(20) CHECK (attendance_type IN ('WFH','Office','Hybrid')),
    late_minutes INT DEFAULT 0,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

SELECT * FROM Attendance;

CREATE TABLE Leave_Type (
    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,
    leave_name VARCHAR(50) NOT NULL,
    max_days INT NOT NULL
);

SELECT * FROM Leave_Type;

CREATE TABLE Leave_Request (
    leave_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('Pending','Approved','Rejected')),
    approved_by INT NULL,
    applied_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES Leave_Type(leave_type_id),
    FOREIGN KEY (approved_by) REFERENCES Employee(employee_id)
);

SELECT * FROM Leave_Request;

CREATE TABLE Leave_Balance (
    balance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    balance_year INT NOT NULL,
    allocated INT DEFAULT 0,
    used INT DEFAULT 0,
    remaining AS (allocated - used),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES Leave_Type(leave_type_id)
);

SELECT * FROM Leave_Balance;

CREATE TABLE Payroll (
    payroll_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    basic_salary DECIMAL(10,2),
    bonus DECIMAL(10,2) DEFAULT 0,
    deductions DECIMAL(10,2) DEFAULT 0,
    net_salary DECIMAL(10,2),
    pay_month VARCHAR(20),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

SELECT * FROM Payroll;

CREATE TABLE Performance_Review (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    feedback VARCHAR(500),
    review_date DATE,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (reviewer_id) REFERENCES Employee(employee_id)
);

SELECT * FROM Performance_Review;

CREATE TABLE Notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    title VARCHAR(150),
    message VARCHAR(500),
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

SELECT * FROM Notifications;

CREATE TABLE Audit_Logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255),
    table_name VARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

SELECT * FROM Audit_Logs

CREATE TABLE Holiday (
    holiday_id INT IDENTITY(1,1) PRIMARY KEY,
    holiday_name VARCHAR(100),
    holiday_date DATE,
    description VARCHAR(255)
);

SELECT * FROM Holiday

CREATE TABLE Client (
    client_id INT IDENTITY(1,1) PRIMARY KEY,
    client_name VARCHAR(100),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15)
);

SELECT * FROM Client;

CREATE TABLE Project (
    project_id INT IDENTITY(1,1) PRIMARY KEY,
    project_name VARCHAR(100),
    client_id INT,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES Client(client_id)
);

SELECT * FROM Project;

CREATE TABLE Project_Assignment (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT,
    project_id INT,
    project_role VARCHAR(50),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id)
);

SELECT * FROM Project_Assignment;

CREATE INDEX IX_Employee_Email ON Employee(email);
CREATE INDEX IX_Attendance_EmpDate ON Attendance(employe e_id, attendance_date);
CREATE INDEX IX_Leave_Emp ON Leave_Request(employee_id, status);
CREATE INDEX IX_Payroll_Emp ON Payroll(employee_id);


-- ROLE MASTER
INSERT INTO RoleMaster (role_name, permissions) VALUES
('Admin','Full Access'),
('HR','Employee Management'),
('Manager','Team Management'),
('Employee','Self Service'),
('Finance','Payroll Access'),
('Recruiter','Hiring Access'),
('Support','Support Access'),
('Auditor','Audit Read Access');

-- DESIGNATION
INSERT INTO Designation (designation_name, description) VALUES
('HR Manager','Handles HR operations'),
('Software Engineer','Application development'),
('Senior Developer','Backend/API development'),
('QA Engineer','Testing'),
('Project Manager','Project delivery'),
('Finance Executive','Payroll & accounts'),
('Support Engineer','Technical support'),
('Intern','Trainee');

-- DEPARTMENT
INSERT INTO Department (department_name, department_code) VALUES
('Human Resources','HR'),
('Engineering','ENG'),
('Quality Assurance','QA'),
('Project Management','PM'),
('Finance','FIN'),
('Support','SUP'),
('Operations','OPS'),
('Training','TRN');

-- EMPLOYEE
INSERT INTO Employee
(emp_code, employee_name, email, phone, department_id, designation_id, manager_id,
joining_date, employment_type, status, dob, gender, address, emergency_contact)
VALUES
('E101','Bhagya','bhagya@gmail.com','9871000001',1,1,NULL,'2022-01-10','Full-Time','Active','1995-05-10','Female','Bangalore','9871999991'),

('E102','Anita','anita@gmail.com','9871000002',2,5,1,'2021-03-15','Full-Time','Active','1990-07-15','Female','Mysore','9871999992'),

('E103','Ravi','ravi@gmail.com','9871000003',2,3,2,'2022-06-01','Full-Time','Active','1994-03-12','Male','Bangalore','9871999993'),

('E104','Sneha','sneha@gmail.com','9871000004',3,4,2,'2023-01-20','Full-Time','Active','1996-11-08','Female','Tumkur','9871999994'),

('E105','Kiran','kiran@gmail.com','9871000005',5,6,1,'2022-09-11','Full-Time','Active','1993-09-25','Male','Hubli','9871999995'),

('E106','Manoj','manoj@gmail.com','9871000006',6,7,2,'2023-04-18','Contract','Active','1992-02-14','Male','Davanagere','9871999996'),

('E107','Pooja','pooja@gmail.com','9871000007',8,8,1,'2024-01-08','Intern','Active','2001-10-05','Female','Belagavi','9871999997'),

('E108','Arun','arun@gmail.com','9871000008',7,2,2,'2023-07-22','Full-Time','Active','1997-08-19','Male','Shimoga','9871999998');

-- USERS
INSERT INTO Users
(employee_id, username, password_hash, last_login, is_active, role_id, failed_login_attempts)
VALUES
(1,'bhagya','hash1',GETDATE(),1,2,0),
(2,'anita','hash2',GETDATE(),1,3,0),
(3,'ravi','hash3',GETDATE(),1,4,1),
(4,'sneha','hash4',GETDATE(),1,4,0),
(5,'kiran','hash5',GETDATE(),1,5,0),
(6,'manoj','hash6',GETDATE(),1,7,2),
(7,'pooja','hash7',GETDATE(),1,4,0),
(8,'arun','hash8',GETDATE(),1,1,0);

-- ATTENDANCE
INSERT INTO Attendance
(employee_id, attendance_date, punch_in, punch_out, status,
work_hours, overtime_hours, attendance_type, late_minutes)
VALUES
(1,'2026-05-01','2026-05-01 09:00','2026-05-01 18:00','Present',9,0,'Office',0),
(2,'2026-05-01','2026-05-01 09:15','2026-05-01 18:30','Present',9.25,0.5,'Hybrid',15),
(3,'2026-05-01','2026-05-01 09:05','2026-05-01 18:00','Present',8.9,0,'WFH',5),
(4,'2026-05-01','2026-05-01 09:30','2026-05-01 18:15','Present',8.75,0,'Office',30),
(5,'2026-05-01','2026-05-01 09:00','2026-05-01 17:45','Present',8.75,0,'Office',0),
(6,'2026-05-01','2026-05-01 10:00','2026-05-01 19:00','Present',9,1,'Hybrid',60),
(7,'2026-05-01','2026-05-01 09:20','2026-05-01 17:30','Present',8.1,0,'Office',20),
(8,'2026-05-01','2026-05-01 09:10','2026-05-01 18:10','Present',9,0,'WFH',10);

-- LEAVE TYPE
INSERT INTO Leave_Type (leave_name, max_days)
VALUES
('Casual Leave',12),
('Sick Leave',10),
('Earned Leave',15),
('Maternity Leave',180),
('Paternity Leave',15),
('Comp Off',5),
('Loss of Pay',30),
('Optional Holiday',2);

-- LEAVE REQUEST
INSERT INTO Leave_Request
(employee_id, leave_type_id, start_date, end_date, reason, status, approved_by)
VALUES
(3,1,'2026-06-01','2026-06-02','Personal work','Approved',2),
(4,2,'2026-06-03','2026-06-04','Fever','Approved',2),
(5,3,'2026-06-10','2026-06-12','Vacation','Pending',NULL),
(6,7,'2026-06-15','2026-06-15','Emergency','Approved',2),
(7,1,'2026-06-20','2026-06-20','College work','Rejected',1),
(8,6,'2026-06-25','2026-06-25','Comp Off','Approved',2),
(1,8,'2026-08-15','2026-08-15','Festival leave','Approved',2),
(2,3,'2026-07-01','2026-07-05','Family trip','Pending',NULL);

-- PAYROLL
INSERT INTO Payroll
(employee_id, basic_salary, bonus, deductions, net_salary, pay_month)
VALUES
(1,70000,5000,2000,73000,'May-2026'),
(2,120000,10000,5000,125000,'May-2026'),
(3,90000,8000,3000,95000,'May-2026'),
(4,65000,3000,1500,66500,'May-2026'),
(5,80000,4000,2000,82000,'May-2026'),
(6,50000,2000,1000,51000,'May-2026'),
(7,20000,0,0,20000,'May-2026'),
(8,75000,3500,1500,77000,'May-2026');

-- PERFORMANCE REVIEW
INSERT INTO Performance_Review
(employee_id, reviewer_id, rating, feedback, review_date)
VALUES
(3,2,5,'Excellent performance','2026-04-01'),
(4,2,4,'Good testing skills','2026-04-02'),
(5,1,4,'Consistent work','2026-04-03'),
(6,2,3,'Needs improvement in response time','2026-04-04'),
(7,1,4,'Quick learner','2026-04-05'),
(8,2,5,'Strong delivery','2026-04-06'),
(1,2,4,'Good HR leadership','2026-04-07'),
(2,1,5,'Excellent project management','2026-04-08');

-- NOTIFICATIONS
INSERT INTO Notifications
(employee_id, title, message, is_read, created_at)
VALUES
(1,'Policy Update','HR policy updated',1,GETDATE()),
(2,'Meeting Reminder','Project review at 3 PM',0,GETDATE()),
(3,'Leave Approved','Your leave request is approved',1,GETDATE()),
(4,'Attendance Alert','Late mark detected',0,GETDATE()),
(5,'Payroll Update','Salary credited',1,GETDATE()),
(6,'Task Assignment','Support ticket assigned',0,GETDATE()),
(7,'Training Notice','Intern training scheduled',0,GETDATE()),
(8,'System Maintenance','System will be down tonight',1,GETDATE());

-- AUDIT LOGS
INSERT INTO Audit_Logs
(user_id, action, table_name, created_at)
VALUES
(1,'INSERT','Employee',GETDATE()),
(2,'UPDATE','Leave_Request',GETDATE()),
(3,'LOGIN','Users',GETDATE()),
(4,'UPDATE','Attendance',GETDATE()),
(5,'INSERT','Payroll',GETDATE()),
(6,'VIEW','Notifications',GETDATE()),
(7,'LOGIN','Users',GETDATE()),
(8,'DELETE','Employee',GETDATE());

-- LEAVE BALANCE
INSERT INTO Leave_Balance
(employee_id, leave_type_id, balance_year, allocated, used)
VALUES
(1,1,2026,12,2),
(2,1,2026,12,4),
(3,2,2026,10,1),
(4,3,2026,15,5),
(5,1,2026,12,0),
(6,7,2026,30,2),
(7,1,2026,12,1),
(8,6,2026,5,1);

-- HOLIDAY
INSERT INTO Holiday
(holiday_name, holiday_date, description)
VALUES
('New Year','2026-01-01','New Year Holiday'),
('Republic Day','2026-01-26','National Holiday'),
('Ugadi','2026-03-19','Festival Holiday'),
('May Day','2026-05-01','Labour Day'),
('Independence Day','2026-08-15','National Holiday'),
('Gandhi Jayanti','2026-10-02','National Holiday'),
('Kannada Rajyotsava','2026-11-01','State Holiday'),
('Christmas','2026-12-25','Festival Holiday');

-- CLIENT
INSERT INTO Client
(client_name, contact_person, email, phone)
VALUES
('ABC Corp','Ramesh','abc@corp.com','9000000001'),
('XYZ Ltd','Suresh','xyz@corp.com','9000000002'),
('TechNova','Asha','technova@corp.com','9000000003'),
('GlobalSoft','Meera','globalsoft@corp.com','9000000004'),
('FinEdge','Raj','finedge@corp.com','9000000005'),
('HealthPro','Nina','healthpro@corp.com','9000000006'),
('RetailOne','Vijay','retailone@corp.com','9000000007'),
('EduSmart','Kavya','edusmart@corp.com','9000000008');

-- PROJECT
INSERT INTO Project
(project_name, client_id, start_date, end_date, status)
VALUES
('HRMS Upgrade',1,'2026-01-01','2026-06-30','Active'),
('Payroll System',2,'2026-02-01','2026-07-31','Active'),
('QA Automation',3,'2026-03-01','2026-08-31','Active'),
('Support Portal',4,'2026-01-15','2026-05-31','Completed'),
('Finance Dashboard',5,'2026-04-01','2026-09-30','Active'),
('Health App',6,'2026-05-01','2026-12-31','Active'),
('Retail ERP',7,'2026-02-15','2026-10-15','Active'),
('LMS Platform',8,'2026-03-10','2026-11-30','Active');

-- PROJECT ASSIGNMENT
INSERT INTO Project_Assignment
(employee_id, project_id, project_role, start_date, end_date)
VALUES
(2,1,'Project Manager','2026-01-01','2026-06-30'),
(3,1,'Developer','2026-01-01','2026-06-30'),
(4,3,'QA Engineer','2026-03-01','2026-08-31'),
(5,5,'Finance Analyst','2026-04-01','2026-09-30'),
(6,4,'Support Engineer','2026-01-15','2026-05-31'),
(7,8,'Intern','2026-03-10','2026-11-30'),
(8,7,'Software Engineer','2026-02-15','2026-10-15'),
(1,1,'HR Coordinator','2026-01-01','2026-06-30');
