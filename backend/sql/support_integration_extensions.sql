IF OBJECT_ID('dbo.WFH_Request', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.WFH_Request (
    wfh_request_id INT IDENTITY(1,1) PRIMARY KEY,
    employee_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending'
      CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    rejection_reason VARCHAR(255) NULL,
    approved_by INT NULL,
    requested_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_WFH_Request_Employee
      FOREIGN KEY (employee_id) REFERENCES dbo.Employee(employee_id),
    CONSTRAINT FK_WFH_Request_Approver
      FOREIGN KEY (approved_by) REFERENCES dbo.Employee(employee_id),
    CONSTRAINT CK_WFH_Request_Dates
      CHECK (to_date >= from_date)
  );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'SUPER_ADMIN')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('SUPER_ADMIN', 'all');
IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'HR_ADMIN')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('HR_ADMIN', 'hr');
IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'MANAGER')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('MANAGER', 'manager');
IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'EMPLOYEE')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('EMPLOYEE', 'employee');
IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'FINANCE')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('FINANCE', 'finance');
IF NOT EXISTS (SELECT 1 FROM dbo.RoleMaster WHERE role_name = 'CLIENT')
  INSERT INTO dbo.RoleMaster (role_name, permissions) VALUES ('CLIENT', 'client');

IF NOT EXISTS (SELECT 1 FROM dbo.Leave_Type WHERE leave_name = 'Annual Leave')
  INSERT INTO dbo.Leave_Type (leave_name, max_days) VALUES ('Annual Leave', 12);
IF NOT EXISTS (SELECT 1 FROM dbo.Leave_Type WHERE leave_name = 'Sick Leave')
  INSERT INTO dbo.Leave_Type (leave_name, max_days) VALUES ('Sick Leave', 10);
IF NOT EXISTS (SELECT 1 FROM dbo.Leave_Type WHERE leave_name = 'Casual Leave')
  INSERT INTO dbo.Leave_Type (leave_name, max_days) VALUES ('Casual Leave', 8);
IF NOT EXISTS (SELECT 1 FROM dbo.Leave_Type WHERE leave_name = 'Loss of Pay')
  INSERT INTO dbo.Leave_Type (leave_name, max_days) VALUES ('Loss of Pay', 30);
