/* HRMS FINAL REVISED - FULLY CORRECTED */

CREATE TABLE RoleMaster (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    permissions VARCHAR(500)
);

CREATE TABLE Designation (
    designation_id INT IDENTITY(1,1) PRIMARY KEY,
    designation_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE Department (
    department_id INT IDENTITY(1,1) PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    manager_id INT NULL
);

CREATE TABLE Employee (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    emp_code VARCHAR(10) UNIQUE NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(15),
    department_id INT NOT NULL,
    designation_id INT NOT NULL,
    manager_id INT NULL,
    joining_date DATE,
    employment_type VARCHAR(20)
        CHECK (employment_type IN ('Full-Time','Intern','Contract')),
    status VARCHAR(20)
        DEFAULT 'Active'
        CHECK (status IN ('Active','Resigned','Terminated')),
    dob DATE,
    gender VARCHAR(20)
        CHECK (gender IN ('Male','Female','Other')),
    emergency_contact VARCHAR(15),

    CONSTRAINT FK_Employee_Department
        FOREIGN KEY (department_id) REFERENCES Department(department_id),

    CONSTRAINT FK_Employee_Designation
        FOREIGN KEY (designation_id) REFERENCES Designation(designation_id),

    CONSTRAINT FK_Employee_Manager
        FOREIGN KEY (manager_id) REFERENCES Employee(employee_id)
);

CREATE UNIQUE INDEX UX_Employee_Email_NotNull
ON Employee(email)
WHERE email IS NOT NULL;

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    last_login DATETIME2 NULL,
    is_active BIT DEFAULT 1,
    role_id INT NOT NULL,
    failed_login_attempts INT DEFAULT 0
        CHECK (failed_login_attempts >= 0),
    password_reset_token VARCHAR(255),
    password_reset_expires_at DATETIME2 NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (role_id) REFERENCES RoleMaster(role_id)
);

CREATE TABLE Attendance (
    attendance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    punch_in DATETIME2,
    punch_out DATETIME2,
    status VARCHAR(20)
        DEFAULT 'Present'
        CHECK (status IN ('Present','Absent','Late','Half-Day','Leave')),
    work_hours DECIMAL(5,2),
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    attendance_type VARCHAR(20)
        CHECK (attendance_type IN ('WFH','Office','Hybrid')),
    late_minutes INT DEFAULT 0,

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),

    CONSTRAINT UQ_Attendance_Employee_Date
        UNIQUE (employee_id, attendance_date),

    CONSTRAINT CK_Attendance_Punch_Times
        CHECK (
            punch_in IS NULL
            OR punch_out IS NULL
            OR punch_out >= punch_in
        ),

    CONSTRAINT CK_Attendance_NonNegative_Values
        CHECK (
            (work_hours IS NULL OR work_hours >= 0)
            AND (overtime_hours >= 0)
            AND (late_minutes >= 0)
        )
);

CREATE TABLE Leave_Type (
    leave_type_id INT IDENTITY(1,1) PRIMARY KEY,
    leave_name VARCHAR(50) NOT NULL UNIQUE,
    max_days INT NOT NULL
        CHECK (max_days > 0)
);

CREATE TABLE Leave_Request (
    leave_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(20)
        DEFAULT 'Pending'
        CHECK (status IN ('Pending','Approved','Rejected')),
    approved_by INT NULL,
    applied_at DATETIME2 DEFAULT SYSDATETIME(),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES Leave_Type(leave_type_id),
    FOREIGN KEY (approved_by) REFERENCES Employee(employee_id),

    CONSTRAINT CK_Leave_Request_Dates
        CHECK (end_date >= start_date),

    CONSTRAINT CK_Leave_Request_Approval
        CHECK (
            (status = 'Pending' AND approved_by IS NULL)
            OR
            (status IN ('Approved','Rejected') AND approved_by IS NOT NULL)
        )
);

CREATE TABLE Leave_Balance (
    balance_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    balance_year INT NOT NULL,
    allocated INT DEFAULT 0,
    used INT DEFAULT 0,
    remaining AS (allocated - used),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (leave_type_id) REFERENCES Leave_Type(leave_type_id),

    CONSTRAINT CK_Leave_Balance_Values
        CHECK (
            allocated >= 0
            AND used >= 0
            AND used <= allocated
        ),

    CONSTRAINT UQ_Leave_Balance_Employee_Type_Year
        UNIQUE (employee_id, leave_type_id, balance_year)
);

CREATE TABLE Payroll (
    payroll_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    bonus DECIMAL(10,2) NOT NULL DEFAULT 0,
    deductions DECIMAL(10,2) NOT NULL DEFAULT 0,
    net_salary AS (basic_salary + bonus - deductions),
    pay_month INT NOT NULL CHECK (pay_month BETWEEN 1 AND 12),
    pay_year INT NOT NULL CHECK (pay_year >= 2000),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),

    CONSTRAINT UQ_Payroll_Employee_Period
        UNIQUE (employee_id, pay_month, pay_year),

    CONSTRAINT CK_Payroll_NonNegative
        CHECK (
            basic_salary >= 0
            AND bonus >= 0
            AND deductions >= 0
        )
);

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

CREATE TABLE Notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    title VARCHAR(150),
    message VARCHAR(500),
    is_read BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE TABLE Audit_Logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255),
    table_name VARCHAR(100),
    created_at DATETIME2 DEFAULT SYSDATETIME(),

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Holiday (
    holiday_id INT IDENTITY(1,1) PRIMARY KEY,
    holiday_name VARCHAR(100),
    holiday_date DATE,
    description VARCHAR(255)
);

CREATE TABLE Client (
    client_id INT IDENTITY(1,1) PRIMARY KEY,
    client_name VARCHAR(100),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15)
);

CREATE TABLE Project (
    project_id INT IDENTITY(1,1) PRIMARY KEY,
    project_name VARCHAR(100) NOT NULL,
    client_id INT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50)
        DEFAULT 'Planned'
        CHECK (status IN ('Planned','Active','Completed','On Hold','Cancelled')),

    FOREIGN KEY (client_id) REFERENCES Client(client_id),

    CONSTRAINT CK_Project_Dates
        CHECK (end_date >= start_date)
);

CREATE TABLE Project_Assignment (
    assignment_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    project_id INT NOT NULL,
    project_role VARCHAR(50),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id),

    CONSTRAINT CK_Project_Assignment_Dates
        CHECK (end_date >= start_date),

    CONSTRAINT UQ_Project_Assignment
        UNIQUE (employee_id, project_id, start_date)
);

CREATE TABLE Employee_Address (
    address_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    address_line VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    country VARCHAR(100),

    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);

CREATE INDEX IX_Attendance_EmpDate
ON Attendance(employee_id, attendance_date);

CREATE INDEX IX_Leave_Emp
ON Leave_Request(employee_id, status);

CREATE INDEX IX_Payroll_Emp
ON Payroll(employee_id);

CREATE INDEX IX_Project_Assignment_Emp
ON Project_Assignment(employee_id);

CREATE INDEX IX_Project_Assignment_Project
ON Project_Assignment(project_id);

ALTER TABLE Department
ADD CONSTRAINT FK_Department_Manager
FOREIGN KEY (manager_id) REFERENCES Employee(employee_id);

