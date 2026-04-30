---Sprint 2 Schema Updates---

---1. Attendance - Add WorkMode---
ALTER TABLE Attendance
ADD WorkMode VARCHAR(10) NOT NULL
CONSTRAINT chk_workmode
CHECK (WorkMode IN ('WFH','WFO','Hybrid'))
CONSTRAINT df_workmode DEFAULT 'WFO';


---2. Employee - Replace Role with RoleID FK---
ALTER TABLE Employee ADD RoleID INT;

UPDATE Employee
SET RoleID = CASE Role
 WHEN 'Developer' THEN 1
 WHEN 'HR' THEN 2
 WHEN 'Manager' THEN 3
 WHEN 'Tester' THEN 4
 WHEN 'Support' THEN 5
 WHEN 'Admin' THEN 6
END;

ALTER TABLE Employee
ADD CONSTRAINT fk_employee_role
FOREIGN KEY (RoleID)
REFERENCES Designation(RoleID);

ALTER TABLE Employee DROP COLUMN Role;


---3. Leave_Request - Replace LeaveType, add new columns---
ALTER TABLE Leave_Request
ADD LeaveTypeID INT,
    ApprovedBy VARCHAR(10),
    AppliedDate DATETIME DEFAULT GETDATE();

UPDATE Leave_Request
SET LeaveTypeID = CASE LeaveType
 WHEN 'Sick Leave' THEN 1
 WHEN 'Casual Leave' THEN 2
 WHEN 'Earned Leave' THEN 3
 WHEN 'Maternity Leave' THEN 4
 WHEN 'Paternity Leave' THEN 5
END;

ALTER TABLE Leave_Request
ADD CONSTRAINT fk_leave_type
FOREIGN KEY (LeaveTypeID)
REFERENCES Leave_Type(LeaveTypeID);

ALTER TABLE Leave_Request
ADD CONSTRAINT fk_leave_approver
FOREIGN KEY (ApprovedBy)
REFERENCES Employee(Emp_id);

ALTER TABLE Leave_Request DROP COLUMN LeaveType;

---4. Payroll — Add Month and Year---
ALTER TABLE Payroll ADD [Month] INT, [Year] INT;

UPDATE Payroll SET [Month] = MONTH(PayDate), [Year] = YEAR(PayDate);

ALTER TABLE Payroll ALTER COLUMN [Month] INT NOT NULL;

ALTER TABLE Payroll ALTER COLUMN [Year] INT NOT NULL;