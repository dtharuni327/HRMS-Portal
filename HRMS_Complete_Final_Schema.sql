CREATE DATABASE HRMS;
GO

USE HRMS;
GO

--Department
CREATE TABLE Department
(
    DepartmentId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentName VARCHAR(200) NOT NULL,
    Description VARCHAR(MAX),
    Status BIT DEFAULT 1,

    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL
);
GO

--Role
CREATE TABLE Role
(
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    DepartmentId INT NOT NULL,

    RoleName VARCHAR(200) NOT NULL,
    Description VARCHAR(MAX),

    Status BIT DEFAULT 1,

    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

CONSTRAINT FK_Role_Department
FOREIGN KEY (DepartmentId)
REFERENCES Department(DepartmentId)
);
GO

--Client
CREATE TABLE Client
(
    ClientId INT IDENTITY(1,1) PRIMARY KEY,

    ClientName VARCHAR(200) NOT NULL,
    CompanyName VARCHAR(200),
    Email VARCHAR(200),
    PhoneNumber VARCHAR(20),
    Address VARCHAR(MAX),

    Status BIT DEFAULT 1,

    CreatedBy INT NULL,
    UpdatedBy INT NULL,
    DeletedBy INT NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL

);
GO


--EMPLOYEE TABLE — FINAL SCHEMA
CREATE TABLE Employee (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id            VARCHAR(12)   UNIQUE NOT NULL,
    Name              VARCHAR(100)  NOT NULL,
    username          VARCHAR(100)  UNIQUE NOT NULL,
    personal_email    VARCHAR(150)  UNIQUE NOT NULL,
    company_email     VARCHAR(150)  UNIQUE NOT NULL,
    Phone             VARCHAR(10)   UNIQUE NOT NULL,
    DOB               DATE          NULL,
    Gender            VARCHAR(10)   NULL CHECK (Gender IN ('MALE', 'FEMALE', 'OTHER')),
    RoleID            INT           NOT NULL,
    Department_id     INT           NOT NULL,
    client_id         INT           NULL,
    designation       VARCHAR(100)  NOT NULL,
    manager_id        VARCHAR(12)   NULL,
    joining_date      DATE          NOT NULL,
    employment_type   VARCHAR(20)   NOT NULL CHECK (employment_type IN ('FULL_TIME', 'CONTRACT', 'INTERN')),
    work_mode         VARCHAR(20)   NOT NULL CHECK (work_mode IN ('WFH', 'WFO', 'HYBRID')),
    profile_image     VARCHAR(255)  NULL,
    emergency_contact VARCHAR(10)   NULL,
    employee_status   VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE' CHECK (employee_status IN ('ACTIVE', 'INACTIVE', 'RESIGNED', 'TERMINATED', 'ON_NOTICE')),
    address           VARCHAR(255)  NULL,
    CreatedAt         DATETIME2     DEFAULT GETDATE(),
    UpdatedAt         DATETIME2     DEFAULT GETDATE(),

    CONSTRAINT fk_role            FOREIGN KEY (RoleID)        REFERENCES Role(RoleId),
    CONSTRAINT fk_department      FOREIGN KEY (Department_id) REFERENCES Department(DepartmentId),
    CONSTRAINT fk_employee_client FOREIGN KEY (client_id)     REFERENCES Client(ClientId),
    CONSTRAINT fk_manager         FOREIGN KEY (manager_id)    REFERENCES Employee(Emp_id)
);
GO



CREATE INDEX idx_employee_role       ON Employee(RoleID);
CREATE INDEX idx_employee_department ON Employee(Department_id);
CREATE INDEX idx_employee_manager    ON Employee(manager_id);
CREATE INDEX idx_employee_status     ON Employee(employee_status);
CREATE INDEX idx_employee_client     ON Employee(client_id);
GO

--DOCUMENTS TABLE — FINAL SCHEMA
CREATE TABLE documents (
    id                  INT IDENTITY(1,1) PRIMARY KEY,
    emp_id              VARCHAR(12)   NOT NULL,
    uploaded_by_emp_id  VARCHAR(12)   NOT NULL,
    name                VARCHAR(150)  NOT NULL,
    type                VARCHAR(50)   NOT NULL CHECK (type IN ('Identity', 'HR', 'Payroll', 'Tax', 'Education', 'Experience')),
    file_name           VARCHAR(255)  NOT NULL,
    file_url            VARCHAR(500)  NULL,
    status              VARCHAR(20)   NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    rejection_reason    VARCHAR(500)  NULL,
    reviewed_by_emp_id  VARCHAR(12)   NULL,
    reviewed_at         DATETIME2     NULL,
    uploaded_at         DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_documents_employee     FOREIGN KEY (emp_id)             REFERENCES Employee(Emp_id),
    CONSTRAINT FK_documents_uploaded_by  FOREIGN KEY (uploaded_by_emp_id) REFERENCES Employee(Emp_id),
    CONSTRAINT FK_documents_reviewed_by  FOREIGN KEY (reviewed_by_emp_id) REFERENCES Employee(Emp_id)
);
GO

CREATE INDEX IX_documents_emp_id ON documents(emp_id);
CREATE INDEX IX_documents_status ON documents(status);
CREATE INDEX IX_documents_type   ON documents(emp_id, type);
GO

--JOBS TABLE — FINAL SCHEMA
CREATE TABLE jobs (
    id           INT IDENTITY(1,1) PRIMARY KEY,
    title        VARCHAR(150)  NOT NULL,
    dept         VARCHAR(100)  NOT NULL,
    status       VARCHAR(20)   NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Urgent', 'Closing Soon', 'Closed')),
    location     VARCHAR(100)  NOT NULL DEFAULT 'India',
    type         VARCHAR(30)   NOT NULL DEFAULT 'Full Time' CHECK (type IN ('Full Time', 'Part Time', 'Contract', 'Internal Transfer', 'Internship')),
    experience   VARCHAR(50)   NULL,
    openings     INT           NOT NULL DEFAULT 1,
    description  VARCHAR(MAX)  NULL,
    skills       VARCHAR(MAX)  NULL,
    applicants   INT           NOT NULL DEFAULT 0,
    posted_by    VARCHAR(12)   NOT NULL,
    posted_date  DATETIME2     NOT NULL DEFAULT GETDATE(),
    closing_date DATE          NULL,

    CONSTRAINT FK_jobs_posted_by FOREIGN KEY (posted_by) REFERENCES Employee(Emp_id)
);
GO

CREATE INDEX IX_jobs_status ON jobs(status);
CREATE INDEX IX_jobs_dept   ON jobs(dept);
GO

--JOB APPLICATIONS TABLE — FINAL SCHEMA
CREATE TABLE job_applications (
    id               INT IDENTITY(1,1) PRIMARY KEY,
    job_id           INT           NOT NULL,
    applied_by_empid VARCHAR(12)   NOT NULL,
    application_type VARCHAR(20)   NOT NULL DEFAULT 'Self' CHECK (application_type IN ('Self', 'Referral')),
    candidate_name   VARCHAR(100)  NOT NULL,
    candidate_email  VARCHAR(100)  NOT NULL,
    resume_file_name VARCHAR(255)  NOT NULL,
    resume_url       VARCHAR(255)  NULL,
    status           VARCHAR(20)   NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected')),
    rejection_reason VARCHAR(500)  NULL,
    applied_at       DATETIME2     NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_job_applications_job      FOREIGN KEY (job_id)           REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT FK_job_applications_employee FOREIGN KEY (applied_by_empid) REFERENCES Employee(Emp_id)
);
GO

CREATE UNIQUE INDEX UQ_job_applications_self_apply
    ON job_applications(job_id, applied_by_empid, application_type)
    WHERE application_type = 'Self';

CREATE INDEX IX_job_applications_status ON job_applications(status);
GO

--Announcement
CREATE TABLE Announcement
(
    AnnouncementId INT IDENTITY(1,1) PRIMARY KEY,

    Title VARCHAR(500) NOT NULL,
    Content VARCHAR(MAX) NOT NULL,

    PublishDate DATETIME DEFAULT GETDATE(),
    ExpiryDate DATETIME NULL,

    Status BIT DEFAULT 1,

    CreatedBy VARCHAR(12) NULL,
    UpdatedBy VARCHAR(12) NULL,
    DeletedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,
CONSTRAINT FK_Announcement_CreatedBy
FOREIGN KEY (CreatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Announcement_UpdatedBy
FOREIGN KEY (UpdatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Announcement_DeletedBy
FOREIGN KEY (DeletedBy)
REFERENCES Employee(Emp_id)
);
GO

--Task
CREATE TABLE Task
(
    TaskId INT IDENTITY(1,1) PRIMARY KEY,

    Title VARCHAR(500) NOT NULL,
    Description VARCHAR(MAX),

    Emp_id VARCHAR(12) NOT NULL,

    Priority VARCHAR(50),
    DueDate DATETIME,

    Status VARCHAR(50) DEFAULT 'Pending',

    CreatedBy VARCHAR(12) NULL,
    UpdatedBy VARCHAR(12) NULL,
    DeletedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

CONSTRAINT FK_Task_Employee
FOREIGN KEY (Emp_id)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Task_CreatedBy
FOREIGN KEY (CreatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Task_UpdatedBy
FOREIGN KEY (UpdatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Task_DeletedBy
FOREIGN KEY (DeletedBy)
REFERENCES Employee(Emp_id)
);
GO


--Internal Job
CREATE TABLE InternalJob
(
    JobId INT IDENTITY(1,1) PRIMARY KEY,

    Title VARCHAR(500) NOT NULL,

    Description VARCHAR(MAX) NULL,

    Location VARCHAR(200) NOT NULL,

    Department VARCHAR(200) NULL,

    EmploymentType VARCHAR(100) NOT NULL,

    ApplicationDeadline DATETIME NULL,

    Status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    CHECK (Status IN ('ACTIVE','INACTIVE')),

    CreatedBy VARCHAR(12) NOT NULL,
    UpdatedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

    CONSTRAINT FK_InternalJob_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_InternalJob_UpdatedBy
        FOREIGN KEY (UpdatedBy)
        REFERENCES Employee(Emp_id)
);
GO

--System Configuration
CREATE TABLE SystemConfig
(
    ConfigId INT IDENTITY(1,1) PRIMARY KEY,

    ConfigKey VARCHAR(100) NOT NULL UNIQUE,

    GracePeriod INT NULL,
    ShiftStartTime VARCHAR(20) NULL,
    ShiftEndTime VARCHAR(20) NULL,
    AutoPunchOutTime VARCHAR(20) NULL,
    WeekOffDays VARCHAR(MAX) NULL,
    OvertimeRate DECIMAL(10,2) NULL,

    CreatedBy VARCHAR(12) NOT NULL,
    UpdatedBy VARCHAR(12) NULL,
    DeletedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

    CONSTRAINT FK_SystemConfig_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_SystemConfig_UpdatedBy
        FOREIGN KEY (UpdatedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_SystemConfig_DeletedBy
        FOREIGN KEY (DeletedBy)
        REFERENCES Employee(Emp_id)
);
GO

--System Health
CREATE TABLE SystemHealth
(
    HealthId BIGINT IDENTITY(1,1) PRIMARY KEY,

    ServiceName VARCHAR(100),

    CpuUsage DECIMAL(5,2),
    MemoryUsage DECIMAL(5,2),

    DatabaseStatus VARCHAR(50),
    ApiStatus VARCHAR(50),

    ActiveSessions INT,
    ErrorCount INT,

    UptimeSeconds BIGINT,

    HealthStatus VARCHAR(50),

    CreatedDate DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE Reimbursement
(
    ClaimId INT IDENTITY(1,1) PRIMARY KEY,

    EmployeeId VARCHAR(12) NOT NULL,

    Title VARCHAR(200) NOT NULL,
    Description VARCHAR(MAX) NULL,

    Amount DECIMAL(18,2) NOT NULL,
    Currency VARCHAR(20) NOT NULL,

    SubmissionDate DATETIME NOT NULL DEFAULT GETDATE(),

    Status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
    CHECK (Status IN
    (
        'PENDING',
        'MANAGER_APPROVED',
        'MANAGER_REJECTED',
        'HR_APPROVED',
        'HR_REJECTED',
        'FINANCE_APPROVED',
        'FINANCE_REJECTED',
        'PAYMENT_PROCESSED',
        'SETTLED'
    )),

    SupportingDocuments VARCHAR(MAX) NULL,

    ReviewedBy VARCHAR(12) NULL,
    ReviewedAt DATETIME NULL,

    PaymentReference VARCHAR(200) NULL,
    PaymentAmount DECIMAL(18,2) NULL,

    ProcessedBy VARCHAR(12) NULL,
    ProcessedAt DATETIME NULL,

    SettledBy VARCHAR(12) NULL,
    SettledAt DATETIME NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

    CONSTRAINT FK_Reimbursement_Employee
        FOREIGN KEY (EmployeeId)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_Reimbursement_ReviewedBy
        FOREIGN KEY (ReviewedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_Reimbursement_ProcessedBy
        FOREIGN KEY (ProcessedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_Reimbursement_SettledBy
        FOREIGN KEY (SettledBy)
        REFERENCES Employee(Emp_id)
);
GO

CREATE INDEX IX_Reimbursement_Employee
ON Reimbursement(EmployeeId);

CREATE INDEX IX_Reimbursement_Status
ON Reimbursement(Status);
GO

--Invoice
CREATE TABLE Invoice
(
    InvoiceId INT IDENTITY(1,1) PRIMARY KEY,

    InvoiceNumber VARCHAR(50) NOT NULL UNIQUE,

    ClientId INT NOT NULL,

    InvoiceDate DATE NOT NULL,
    DueDate DATE NOT NULL,

    Amount DECIMAL(18,2) NOT NULL,

    Currency VARCHAR(20) NOT NULL,

    Status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
    CHECK (Status IN
    (
        'DRAFT',
        'SENT',
        'PAID',
        'OVERDUE',
        'CANCELLED'
    )),

    Description VARCHAR(MAX) NULL,

    CreatedBy VARCHAR(12) NOT NULL,
    UpdatedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

    CONSTRAINT FK_Invoice_Client
        FOREIGN KEY (ClientId)
        REFERENCES Client(ClientId),

    CONSTRAINT FK_Invoice_CreatedBy
        FOREIGN KEY (CreatedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_Invoice_UpdatedBy
        FOREIGN KEY (UpdatedBy)
        REFERENCES Employee(Emp_id)
);
GO

CREATE INDEX IX_Invoice_Client
ON Invoice(ClientId);

CREATE INDEX IX_Invoice_Status
ON Invoice(Status);

CREATE INDEX IX_Invoice_Date
ON Invoice(InvoiceDate);
GO

--Tax Report
CREATE TABLE TaxReport
(
    TaxReportId INT IDENTITY(1,1) PRIMARY KEY,

    ReportType VARCHAR(20) NOT NULL
        CHECK (ReportType IN
        (
            'ANNUAL',
            'QUARTERLY',
            'MONTHLY',
            'COMPLIANCE'
        )),

    Component VARCHAR(20) NOT NULL
        CHECK (Component IN
        (
            'TDS',
            'PF',
            'ESI',
            'PT',
            'OTHER'
        )),

    Month INT NULL,
    Year INT NOT NULL,

    FilingStatus VARCHAR(20) DEFAULT 'PENDING'
        CHECK (FilingStatus IN
        (
            'PENDING',
            'FILED',
            'ACKNOWLEDGED',
            'OVERDUE',
            'REJECTED'
        )),

    GeneratedBy VARCHAR(12) NOT NULL,
    GeneratedAt DATETIME DEFAULT GETDATE(),

    FilingDate DATETIME NULL,

    ReportPath VARCHAR(500) NULL,

    UpdatedBy VARCHAR(12) NULL,
    UpdatedAt DATETIME NULL,

    CONSTRAINT FK_TaxReport_GeneratedBy
        FOREIGN KEY (GeneratedBy)
        REFERENCES Employee(Emp_id),

    CONSTRAINT FK_TaxReport_UpdatedBy
        FOREIGN KEY (UpdatedBy)
        REFERENCES Employee(Emp_id)
);
GO

--Salary
CREATE TABLE Salary
(
    SalaryId INT IDENTITY(1,1) PRIMARY KEY,

    Emp_id VARCHAR(12) NOT NULL,

    BasicSalary DECIMAL(12,2) NOT NULL,
    HRA DECIMAL(12,2) DEFAULT 0,
    Allowances DECIMAL(12,2) DEFAULT 0,
    Bonus DECIMAL(12,2) DEFAULT 0,
    Deductions DECIMAL(12,2) DEFAULT 0,

    NetSalary DECIMAL(12,2) NOT NULL,

    SalaryMonth VARCHAR(20) NOT NULL,
    SalaryYear INT NOT NULL,

    PaymentDate DATE,

    PaymentStatus VARCHAR(50) DEFAULT 'Pending',

    CreatedBy VARCHAR(12) NULL,
    UpdatedBy VARCHAR(12) NULL,
    DeletedBy VARCHAR(12) NULL,

    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME NULL,

CONSTRAINT FK_Salary_Employee
FOREIGN KEY (Emp_id)
REFERENCES Employee(Emp_id),
CONSTRAINT FK_Salary_CreatedBy
FOREIGN KEY (CreatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Salary_UpdatedBy
FOREIGN KEY (UpdatedBy)
REFERENCES Employee(Emp_id),

CONSTRAINT FK_Salary_DeletedBy
FOREIGN KEY (DeletedBy)
REFERENCES Employee(Emp_id)
);
GO



--ATTENDANCE TABLE
CREATE TABLE attendance (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(12) NOT NULL,
    work_date DATE NOT NULL,
    punch_in_time DATETIME NULL,
    punch_out_time DATETIME NULL,
    punch_in_status VARCHAR(20) NULL 
        CHECK (punch_in_status IN ('ON_TIME','LATE')),
    work_mode VARCHAR(10) NOT NULL 
        CHECK (work_mode IN ('WFH','WFO','HYBRID')),
    total_hours DECIMAL(10,2) NULL,
    attendance_status VARCHAR(20) NULL DEFAULT NULL
        CHECK (attendance_status IN ('PRESENT','HALF_DAY','ABSENT')),
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_attendance_emp
        FOREIGN KEY (Emp_id)
        REFERENCES Employee(Emp_id),

    CONSTRAINT uq_attendance UNIQUE (Emp_id, work_date)
);
GO

CREATE INDEX IX_Attendance_EmpDate
ON attendance(Emp_id, work_date);
GO

--WFH REQUEST TABLE
CREATE TABLE WFH_Request (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(12) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR(MAX),
    status VARCHAR(20) DEFAULT 'PENDING',
    approved_by VARCHAR(12) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    
    CONSTRAINT chk_wfh_status
    CHECK (status IN ('PENDING','APPROVED','REJECTED')),
    
    CONSTRAINT fk_wfh_emp
    FOREIGN KEY (Emp_id)
    REFERENCES Employee(Emp_id),

    CONSTRAINT fk_wfh_approved_by
    FOREIGN KEY (approved_by)
    REFERENCES Employee(Emp_id)
);
GO

-- FIX: ADD INDEXES FOR WFH_REQUEST
-- Index 1: Fast overlap queries

CREATE NONCLUSTERED INDEX IX_WFH_Request_EmpStatusDates
ON WFH_Request (Emp_id, status, from_date, to_date)
INCLUDE (reason, approved_by, created_at);

-- Index 2: Prevent overlapping APPROVED requests (unique filtered)
CREATE UNIQUE NONCLUSTERED INDEX UX_WFH_Request_Approved_EmpDate
ON WFH_Request (Emp_id, from_date, to_date)
WHERE status = 'APPROVED';

--PAYROLL
CREATE TABLE Payroll (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(12) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basic_salary DECIMAL(10, 2) NOT NULL,
    allowances DECIMAL(10, 2) DEFAULT 0,
    bonus DECIMAL(10, 2) DEFAULT 0,
    penalty DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    net_salary DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    approved_by VARCHAR(12) NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_payroll_employee FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
    CONSTRAINT unique_payroll_month UNIQUE (Emp_id, month, year),
    CONSTRAINT FK_Payroll_ApprovedBy FOREIGN KEY (approved_by) REFERENCES Employee(Emp_id)
);

CREATE INDEX IX_Payroll_Emp ON Payroll(Emp_id);
CREATE INDEX IX_Payroll_Status ON Payroll(status);

--PAYSLIP TABLE
CREATE TABLE payslip (
    id INT IDENTITY(1,1) PRIMARY KEY,
    Emp_id VARCHAR(12) NOT NULL,
    payroll_id INT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basic_salary DECIMAL(10, 2) NOT NULL,
    allowances DECIMAL(10, 2) DEFAULT 0,
    bonus DECIMAL(10, 2) DEFAULT 0,
    penalty DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    net_salary DECIMAL(10, 2) NOT NULL,
    gross_salary DECIMAL(10, 2) NOT NULL,
    total_deductions DECIMAL(10, 2) NOT NULL,
    payment_date DATE NULL,
    status VARCHAR(20) DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'GENERATED', 'PAID', 'SENT')),
    pdf_url VARCHAR(255) NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    updated_at DATETIME2 DEFAULT SYSDATETIME(),

    CONSTRAINT fk_payslip_employee FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
    CONSTRAINT fk_payslip_payroll FOREIGN KEY (payroll_id) REFERENCES Payroll(id),
    CONSTRAINT unique_payslip_month UNIQUE (Emp_id, month, year)
);

CREATE INDEX IX_Payslip_Emp ON payslip(Emp_id);
CREATE INDEX IX_Payslip_Status ON payslip(status);
GO

--ProjectEffort
CREATE TABLE ProjectEffort
(
    EffortId INT IDENTITY(1,1) PRIMARY KEY,

    Emp_id VARCHAR(12) NOT NULL,

    ProjectName NVARCHAR(200) NOT NULL,

    WorkDate DATE NOT NULL,

    HoursWorked DECIMAL(5,2) NOT NULL,

    TaskDescription NVARCHAR(1000) NULL,

    CreatedAt DATETIME DEFAULT GETDATE(),

    UpdatedAt DATETIME NULL,

    CONSTRAINT FK_ProjectEffort_Employee
        FOREIGN KEY (Emp_id)
        REFERENCES Employee(Emp_id)
);
GO

--Authentication
CREATE TABLE Authentication (
User_Id INT IDENTITY(1,1) PRIMARY KEY,
Emp_id VARCHAR(12) NOT NULL UNIQUE,
Name VARCHAR(100) NOT NULL,
Personal_Email VARCHAR(150) NOT NULL,
Company_Email VARCHAR(150) NOT NULL,
Client_Id INT NULL,
Username VARCHAR(100) NOT NULL UNIQUE,
PasswordHash VARCHAR(255) NOT NULL,
RefreshToken VARCHAR(MAX),
OTP VARCHAR(10),
OTP_Expiry DATETIME,
EmailVerificationToken VARCHAR(255),
EmailVerified BIT DEFAULT 0,
LastLogin DATETIME,
IsActive BIT DEFAULT 1,

FOREIGN KEY (Emp_id) REFERENCES Employee(Emp_id),
FOREIGN KEY (Client_Id) REFERENCES Client(ClientId)

);

--Holiday
CREATE TABLE Holiday (
Holiday_Id INT IDENTITY(1,1) PRIMARY KEY,
Holiday_Name VARCHAR(200) NOT NULL,
Holiday_Date DATE NOT NULL,
Description VARCHAR(500),
Client_Id INT,
Region VARCHAR(100),
Status VARCHAR(20) DEFAULT 'ACTIVE',
CONSTRAINT UQ_Holiday UNIQUE(Holiday_Date, Client_Id),
CONSTRAINT FK_Holiday_Client
FOREIGN KEY (Client_Id)
REFERENCES Client(ClientId)
);

--Leave_Type
CREATE TABLE Leave_Type (
LeaveType_Id INT IDENTITY(1,1) PRIMARY KEY,
LeaveType_Name VARCHAR(100) NOT NULL,
Max_Days INT NOT NULL,
IsActive BIT DEFAULT 1
);

--Leave_Balance
CREATE TABLE Leave_Balance (
Balance_Id INT IDENTITY(1,1) PRIMARY KEY,
Emp_id VARCHAR(12) NOT NULL,
LeaveType_Id INT NOT NULL,

Total_Leave INT DEFAULT 0,
Used_Leave INT DEFAULT 0,
Remaining_Leave INT DEFAULT 0,
CONSTRAINT UQ_LeaveBalance UNIQUE(Emp_id, LeaveType_Id),
CONSTRAINT FK_LeaveBalance_Employee
FOREIGN KEY (Emp_id)
REFERENCES Employee(Emp_id),
CONSTRAINT FK_LeaveBalance_LeaveType
FOREIGN KEY (LeaveType_Id)
REFERENCES Leave_Type(LeaveType_Id)

);

--Leave_Request
CREATE TABLE Leave_Request (
Leave_Id INT IDENTITY(1,1) PRIMARY KEY,
Emp_id VARCHAR(12) NOT NULL,
LeaveType_Id INT NOT NULL,

From_Date DATE NOT NULL,
To_Date DATE NOT NULL,
Total_Days INT,

Reason VARCHAR(500),

Status VARCHAR(20)
DEFAULT 'PENDING',

Remarks VARCHAR(500),
RejectionReason VARCHAR(500),

ApprovedBy VARCHAR(12),
ApprovedAt DATETIME,

Created_At DATETIME
DEFAULT GETDATE(),

CONSTRAINT FK_LeaveRequest_Employee
FOREIGN KEY (Emp_id)
REFERENCES Employee(Emp_id),
CONSTRAINT FK_LeaveRequest_LeaveType
FOREIGN KEY (LeaveType_Id)
REFERENCES Leave_Type(LeaveType_Id),
CONSTRAINT FK_LeaveRequest_ApprovedBy
FOREIGN KEY (ApprovedBy)
REFERENCES Employee(Emp_id)

);

--Audit_Logs
CREATE TABLE Audit_Logs
(
    Audit_Id INT IDENTITY(1,1) PRIMARY KEY,

    Emp_id VARCHAR(12) NOT NULL,

    ModuleName VARCHAR(100) NOT NULL,
    ActionType VARCHAR(100) NOT NULL,
    Description VARCHAR(MAX) NULL,

    CreatedBy VARCHAR(12) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_AuditLogs_Employee
    FOREIGN KEY (Emp_id)
    REFERENCES Employee(Emp_id),

    CONSTRAINT FK_AuditLogs_CreatedBy
    FOREIGN KEY (CreatedBy)
    REFERENCES Employee(Emp_id)
);
GO
