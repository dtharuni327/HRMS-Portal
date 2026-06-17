
--//Employee Module//--
--sp_CreateEmployee--
CREATE PROCEDURE sp_CreateEmployee
(
    @EmployeeName VARCHAR(100),
    @Email VARCHAR(100),
    @Phone VARCHAR(15),
    @DepartmentID INT,
    @DesignationID INT,
    @EmploymentType VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Department
        WHERE department_id = @DepartmentID
    )
    BEGIN
        RAISERROR('Department does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Designation
        WHERE designation_id = @DesignationID
    )
    BEGIN
        RAISERROR('Designation does not exist.',16,1);
        RETURN;
    END

    INSERT INTO Employee
    (
        emp_code,
        employee_name,
        email,
        phone,
        department_id,
        designation_id,
        employment_type,
        status
    )
    VALUES
    (
        'EMP' +
        RIGHT
        (
            '000' +
            CAST(NEXT VALUE FOR EmployeeSeq AS VARCHAR(10)),
            3
        ),
        @EmployeeName,
        @Email,
        @Phone,
        @DepartmentID,
        @DesignationID,
        @EmploymentType,
        'Active'
    );

    SELECT
        'Employee Created Successfully' AS Message;
END;
GO
--sp_GetEmployeeById--
CREATE PROCEDURE sp_GetEmployeeById
(
    @EmployeeID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee not found.',16,1);
        RETURN;
    END

    SELECT
        E.*,
        D.department_name,
        DG.designation_name
    FROM Employee E
    INNER JOIN Department D
        ON E.department_id = D.department_id
    INNER JOIN Designation DG
        ON E.designation_id = DG.designation_id
    WHERE E.employee_id = @EmployeeID;
END;
GO

--sp_UpdateEmployee--
CREATE PROCEDURE sp_UpdateEmployee
(
    @EmployeeID INT,
    @Phone VARCHAR(15),
    @DepartmentID INT,
    @DesignationID INT,
    @Status VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Department
        WHERE department_id = @DepartmentID
    )
    BEGIN
        RAISERROR('Department does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Designation
        WHERE designation_id = @DesignationID
    )
    BEGIN
        RAISERROR('Designation does not exist.',16,1);
        RETURN;
    END

    UPDATE Employee
    SET
        phone = @Phone,
        department_id = @DepartmentID,
        designation_id = @DesignationID,
        status = @Status
    WHERE employee_id = @EmployeeID;

    SELECT 'Employee updated successfully' AS Message;
END;
GO

--sp_GetEmployeesByFilter--
CREATE PROCEDURE sp_GetEmployeesByFilter
(
    @DepartmentID INT = NULL,
    @Status VARCHAR(20) = NULL,
    @EmployeeName VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        E.employee_id,
        E.emp_code,
        E.employee_name,
        E.email,
        D.department_name,
        DG.designation_name,
        E.status
    FROM Employee E
    INNER JOIN Department D
        ON E.department_id = D.department_id
    INNER JOIN Designation DG
        ON E.designation_id = DG.designation_id
    WHERE
        (@DepartmentID IS NULL OR E.department_id = @DepartmentID)
        AND
        (@Status IS NULL OR E.status = @Status)
        AND
        (@EmployeeName IS NULL OR E.employee_name LIKE '%' + @EmployeeName + '%');
END;
GO

--//User/Login Module//--
--sp_CreateUserLogin--
CREATE OR ALTER PROCEDURE sp_CreateUserLogin
(
    @EmployeeID INT,
    @Username VARCHAR(50),
    @PasswordHash VARCHAR(255),
    @RoleID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id=@EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM RoleMaster
        WHERE role_id=@RoleID
    )
    BEGIN
        RAISERROR('Role does not exist.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Users
        WHERE employee_id=@EmployeeID
    )
    BEGIN
        RAISERROR('User already exists for employee.',16,1);
        RETURN;
    END

    INSERT INTO Users
    (
        employee_id,
        username,
        password_hash,
        role_id
    )
    VALUES
    (
        @EmployeeID,
        @Username,
        @PasswordHash,
        @RoleID
    );

    SELECT 'User Login Created Successfully' AS Message;
END;
GO

--sp_UpdateUserStatus--
CREATE PROCEDURE sp_UpdateUserStatus
(
    @UserID INT,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Users
        WHERE user_id = @UserID
    )
    BEGIN
        RAISERROR('User not found.',16,1);
        RETURN;
    END

    UPDATE Users
    SET
        is_active = @IsActive,
        updated_at = SYSDATETIME()
    WHERE user_id = @UserID;

    SELECT 'User status updated successfully' AS Message;
END;
GO

--sp_UpdateLastLogin--
CREATE PROCEDURE sp_UpdateLastLogin
(
    @UserID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Users
        WHERE user_id = @UserID
    )
    BEGIN
        RAISERROR('User not found.',16,1);
        RETURN;
    END

    UPDATE Users
    SET
        last_login = SYSDATETIME(),
        failed_login_attempts = 0,
        updated_at = SYSDATETIME()
    WHERE user_id = @UserID;

    SELECT 'Last login updated successfully' AS Message;
END;
GO

--sp_RecordFailedLogin--
CREATE PROCEDURE sp_RecordFailedLogin
(
    @Username VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Users
        WHERE username = @Username
    )
    BEGIN
        RAISERROR('Username not found.',16,1);
        RETURN;
    END

    UPDATE Users
    SET
        failed_login_attempts = failed_login_attempts + 1,
        updated_at = SYSDATETIME()
    WHERE username = @Username;

    SELECT 'Failed login recorded successfully' AS Message;
END;
GO

--//Department Module//--
--sp_CreateDepartment--
CREATE PROCEDURE sp_CreateDepartment
(
    @DepartmentName VARCHAR(100),
    @DepartmentCode VARCHAR(20),
    @ManagerID INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM Department
        WHERE department_code = @DepartmentCode
    )
    BEGIN
        RAISERROR('Department code already exists.',16,1);
        RETURN;
    END

    IF @ManagerID IS NOT NULL
    AND NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @ManagerID
    )
    BEGIN
        RAISERROR('Manager does not exist.',16,1);
        RETURN;
    END

    INSERT INTO Department
    (
        department_name,
        department_code,
        manager_id
    )
    VALUES
    (
        @DepartmentName,
        @DepartmentCode,
        @ManagerID
    );

    SELECT 'Department Created Successfully' AS Message;
END;
GO

--sp_AssignEmployeeDepartment--
CREATE PROCEDURE sp_AssignEmployeeDepartment
(
    @EmployeeID INT,
    @DepartmentID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Department
        WHERE department_id = @DepartmentID
    )
    BEGIN
        RAISERROR('Department does not exist.',16,1);
        RETURN;
    END

    UPDATE Employee
    SET department_id = @DepartmentID
    WHERE employee_id = @EmployeeID;

    SELECT 'Employee department updated successfully' AS Message;
END;
GO

--sp_GetDepartments--
CREATE PROCEDURE sp_GetDepartments
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        department_id,
        department_name,
        department_code,
        manager_id
    FROM Department
    ORDER BY department_name;
END;
GO

--//Role Module//--
--sp_CreateRole--
CREATE PROCEDURE sp_CreateRole
(
    @RoleName VARCHAR(50),
    @Permissions VARCHAR(500)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM RoleMaster
        WHERE role_name=@RoleName
    )
    BEGIN
        RAISERROR('Role already exists.',16,1);
        RETURN;
    END

    INSERT INTO RoleMaster
    (
        role_name,
        permissions
    )
    VALUES
    (
        @RoleName,
        @Permissions
    );

    SELECT 'Role Created Successfully' AS Message;
END;
GO

--sp_AssignEmployeeRole--
CREATE PROCEDURE sp_AssignEmployeeRole
(
    @EmployeeID INT,
    @RoleID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM RoleMaster
        WHERE role_id = @RoleID
    )
    BEGIN
        RAISERROR('Role does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Users
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('User account does not exist.',16,1);
        RETURN;
    END

    UPDATE Users
    SET
        role_id = @RoleID,
        updated_at = SYSDATETIME()
    WHERE employee_id = @EmployeeID;

    SELECT 'Role assigned successfully' AS Message;
END;
GO

--sp_GetRoles--
CREATE PROCEDURE sp_GetRoles
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        role_id,
        role_name,
        permissions
    FROM RoleMaster
    ORDER BY role_name;
END;
GO

--sp_GetRoleUsers--
CREATE PROCEDURE sp_GetRoleUsers
(
    @RoleID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM RoleMaster
        WHERE role_id = @RoleID
    )
    BEGIN
        RAISERROR('Role not found.',16,1);
        RETURN;
    END

    SELECT
        U.user_id,
        U.username,
        E.employee_name,
        R.role_name
    FROM Users U
    INNER JOIN Employee E
        ON U.employee_id = E.employee_id
    INNER JOIN RoleMaster R
        ON U.role_id = R.role_id
    WHERE U.role_id = @RoleID;
END;
GO


--//Attendance Module//--
--sp_PunchIn--
CREATE PROCEDURE sp_PunchIn
(
    @EmployeeID INT,
    @PunchInTime DATETIME2
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM Employee
            WHERE employee_id = @EmployeeID
        )
        BEGIN
            RAISERROR('Employee does not exist.',16,1);
            RETURN;
        END

        IF EXISTS
        (
            SELECT 1
            FROM Attendance
            WHERE employee_id = @EmployeeID
            AND attendance_date = CAST(@PunchInTime AS DATE)
        )
        BEGIN
            RAISERROR('Attendance already marked for today.',16,1);
            RETURN;
        END

        INSERT INTO Attendance
        (
            employee_id,
            attendance_date,
            punch_in,
            status
        )
        VALUES
        (
            @EmployeeID,
            CAST(@PunchInTime AS DATE),
            @PunchInTime,
            CASE
                WHEN CAST(@PunchInTime AS TIME) > '09:30:00'
                THEN 'Late'
                ELSE 'Present'
            END
        );

        SELECT 'Punch In Successful' AS Message;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--sp_PunchOut--
CREATE PROCEDURE sp_PunchOut
(
    @EmployeeID INT,
    @PunchOutTime DATETIME2
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        IF NOT EXISTS
        (
            SELECT 1
            FROM Attendance
            WHERE employee_id = @EmployeeID
            AND attendance_date = CAST(@PunchOutTime AS DATE)
        )
        BEGIN
            RAISERROR('Attendance record not found.',16,1);
            RETURN;
        END

        UPDATE Attendance
        SET
            punch_out = @PunchOutTime,
            work_hours =
                DATEDIFF
                (
                    MINUTE,
                    punch_in,
                    @PunchOutTime
                ) / 60.0
        WHERE employee_id = @EmployeeID
        AND attendance_date = CAST(@PunchOutTime AS DATE);

        SELECT 'Punch Out Successful' AS Message;

    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--sp_GetMonthlyAttendanceReport--
CREATE PROCEDURE sp_GetMonthlyAttendanceReport
(
    @EmployeeID INT,
    @Month INT,
    @Year INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        attendance_id,
        attendance_date,
        punch_in,
        punch_out,
        work_hours,
        overtime_hours,
        status
    FROM Attendance
    WHERE employee_id = @EmployeeID
    AND MONTH(attendance_date) = @Month
    AND YEAR(attendance_date) = @Year
    ORDER BY attendance_date;
END;
GO

--//Leave Module//--
--sp_ApplyLeave--
CREATE PROCEDURE sp_ApplyLeave
(
    @EmployeeID INT,
    @LeaveTypeID INT,
    @StartDate DATE,
    @EndDate DATE,
    @Reason VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @EndDate < @StartDate
    BEGIN
        RAISERROR('End date cannot be earlier than start date.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Leave_Request
        WHERE employee_id = @EmployeeID
        AND status IN ('Pending','Approved')
        AND
        (
            @StartDate BETWEEN start_date AND end_date
            OR
            @EndDate BETWEEN start_date AND end_date
            OR
            start_date BETWEEN @StartDate AND @EndDate
        )
    )
    BEGIN
        RAISERROR('Overlapping leave request already exists.',16,1);
        RETURN;
    END

    INSERT INTO Leave_Request
    (
        employee_id,
        leave_type_id,
        start_date,
        end_date,
        reason,
        status
    )
    VALUES
    (
        @EmployeeID,
        @LeaveTypeID,
        @StartDate,
        @EndDate,
        @Reason,
        'Pending'
    );

    SELECT 'Leave Applied Successfully' AS Message;
END;
GO
--sp_ApproveRejectLeave--
CREATE PROCEDURE sp_ApproveRejectLeave
(
    @LeaveID INT,
    @ApproverID INT,
    @Status VARCHAR(20),
    @Remarks VARCHAR(500) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Status NOT IN ('Approved','Rejected')
    BEGIN
        RAISERROR('Invalid Status.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Leave_Request
        WHERE leave_id = @LeaveID
    )
    BEGIN
        RAISERROR('Leave request not found.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @ApproverID
    )
    BEGIN
        RAISERROR('Approver does not exist.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Leave_Request
        WHERE leave_id = @LeaveID
        AND status <> 'Pending'
    )
    BEGIN
        RAISERROR('Leave request already processed.',16,1);
        RETURN;
    END

    UPDATE Leave_Request
    SET
        status = @Status,
        approved_by = @ApproverID,
        approval_remarks = @Remarks
    WHERE leave_id = @LeaveID;

    SELECT 'Leave Updated Successfully' AS Message;
END;
GO

--sp_GetLeaveBalance--
CREATE PROCEDURE sp_GetLeaveBalance
(
    @EmployeeID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        LB.balance_id,
        LT.leave_name,
        LB.allocated,
        LB.used,
        LB.remaining,
        LB.balance_year
    FROM Leave_Balance LB
    INNER JOIN Leave_Type LT
        ON LB.leave_type_id = LT.leave_type_id
    WHERE LB.employee_id = @EmployeeID;
END;
GO

--sp_GetPendingLeaves--
CREATE PROCEDURE sp_GetPendingLeaves
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        LR.leave_id,
        E.employee_name,
        LT.leave_name,
        LR.start_date,
        LR.end_date,
        LR.reason,
        LR.applied_at
    FROM Leave_Request LR
    INNER JOIN Employee E
        ON LR.employee_id = E.employee_id
    INNER JOIN Leave_Type LT
        ON LR.leave_type_id = LT.leave_type_id
    WHERE LR.status = 'Pending'
    ORDER BY LR.applied_at DESC;
END;
GO

--//Payroll Module//--
--sp_GeneratePayroll--
CREATE PROCEDURE sp_GeneratePayroll
(
    @EmployeeID INT,
    @BasicSalary DECIMAL(10,2),
    @Bonus DECIMAL(10,2),
    @Deductions DECIMAL(10,2),
    @PayMonth INT,
    @PayYear INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id=@EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Payroll
        WHERE employee_id=@EmployeeID
        AND pay_month=@PayMonth
        AND pay_year=@PayYear
    )
    BEGIN
        RAISERROR('Payroll already generated for this period.',16,1);
        RETURN;
    END

    INSERT INTO Payroll
    (
        employee_id,
        basic_salary,
        bonus,
        deductions,
        pay_month,
        pay_year
    )
    VALUES
    (
        @EmployeeID,
        @BasicSalary,
        @Bonus,
        @Deductions,
        @PayMonth,
        @PayYear
    );

    SELECT 'Payroll Generated Successfully' AS Message;
END;
GO

--sp_GetPayslip--
CREATE PROCEDURE sp_GetPayslip
(
    @EmployeeID INT,
    @PayMonth INT,
    @PayYear INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.payroll_id,
        E.emp_code,
        E.employee_name,
        P.basic_salary,
        P.bonus,
        P.deductions,
        P.net_salary,
        P.pay_month,
        P.pay_year
    FROM Payroll P
    INNER JOIN Employee E
        ON P.employee_id = E.employee_id
    WHERE P.employee_id = @EmployeeID
    AND P.pay_month = @PayMonth
    AND P.pay_year = @PayYear;
END;
GO

--sp_GetPayrollReport--
CREATE PROCEDURE sp_GetPayrollReport
(
    @PayMonth INT,
    @PayYear INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        E.emp_code,
        E.employee_name,
        D.department_name,
        P.basic_salary,
        P.bonus,
        P.deductions,
        P.net_salary,
        P.pay_month,
        P.pay_year
    FROM Payroll P
    INNER JOIN Employee E
        ON P.employee_id = E.employee_id
    INNER JOIN Department D
        ON E.department_id = D.department_id
    WHERE P.pay_month = @PayMonth
    AND P.pay_year = @PayYear
    ORDER BY E.employee_name;
END;
GO

--//Holiday Module//--
--sp_CreateHoliday--
CREATE PROCEDURE sp_CreateHoliday
(
    @HolidayName VARCHAR(100),
    @HolidayDate DATE,
    @HolidayType VARCHAR(50),
    @Description VARCHAR(255)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM Holiday
        WHERE holiday_date=@HolidayDate
    )
    BEGIN
        RAISERROR('Holiday already exists for this date.',16,1);
        RETURN;
    END

    INSERT INTO Holiday
    (
        holiday_name,
        holiday_date,
        holiday_type,
        description
    )
    VALUES
    (
        @HolidayName,
        @HolidayDate,
        @HolidayType,
        @Description
    );

    SELECT 'Holiday Created Successfully' AS Message;
END;
GO

--sp_UpdateHoliday--
CREATE PROCEDURE sp_UpdateHoliday
(
    @HolidayID INT,
    @HolidayName VARCHAR(100),
    @HolidayDate DATE,
    @HolidayType VARCHAR(50),
    @Description VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Holiday
        WHERE holiday_id=@HolidayID
    )
    BEGIN
        RAISERROR('Holiday not found.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Holiday
        WHERE holiday_date=@HolidayDate
        AND holiday_id<>@HolidayID
    )
    BEGIN
        RAISERROR('Holiday already exists for this date.',16,1);
        RETURN;
    END

    UPDATE Holiday
    SET
        holiday_name=@HolidayName,
        holiday_date=@HolidayDate,
        holiday_type=@HolidayType,
        description=@Description
    WHERE holiday_id=@HolidayID;

    SELECT 'Holiday Updated Successfully' AS Message;
END;
GO
--sp_DeleteHoliday--
CREATE PROCEDURE sp_DeleteHoliday
(
@HolidayID INT
)
AS
BEGIN
SET NOCOUNT ON;

IF NOT EXISTS
(
    SELECT 1
    FROM Holiday
    WHERE holiday_id = @HolidayID
)
BEGIN
    RAISERROR('Holiday not found.',16,1);
    RETURN;
END

DELETE FROM Holiday
WHERE holiday_id = @HolidayID;

SELECT 'Holiday Deleted Successfully' AS Message;

END;
GO

--sp_GetHolidays--
CREATE PROCEDURE sp_GetHolidays
AS
BEGIN
SET NOCOUNT ON;

SELECT
    holiday_id,
    holiday_name,
    holiday_date,
    holiday_type,
    description,
    created_at
FROM Holiday
ORDER BY holiday_date;

END;
GO

--sp_AssignEmployeeToProject--
CREATE PROCEDURE sp_AssignEmployeeToProject
(
    @EmployeeID INT,
    @ProjectID INT,
    @ProjectRole VARCHAR(50),
    @StartDate DATE,
    @EndDate DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    IF NOT EXISTS
    (
        SELECT 1
        FROM Project
        WHERE project_id = @ProjectID
    )
    BEGIN
        RAISERROR('Project does not exist.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Project_Assignment
        WHERE employee_id = @EmployeeID
        AND project_id = @ProjectID
        AND start_date = @StartDate
    )
    BEGIN
        RAISERROR('Assignment already exists.',16,1);
        RETURN;
    END

    INSERT INTO Project_Assignment
    (
        employee_id,
        project_id,
        project_role,
        start_date,
        end_date
    )
    VALUES
    (
        @EmployeeID,
        @ProjectID,
        @ProjectRole,
        @StartDate,
        @EndDate
    );

    SELECT 'Employee Assigned Successfully' AS Message;
END;
GO

--sp_RemoveEmployeeFromProject--
CREATE PROCEDURE sp_RemoveEmployeeFromProject
(
    @AssignmentID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Project_Assignment
        WHERE assignment_id = @AssignmentID
    )
    BEGIN
        RAISERROR('Assignment not found.',16,1);
        RETURN;
    END

    DELETE FROM Project_Assignment
    WHERE assignment_id = @AssignmentID;

    SELECT 'Assignment Removed Successfully' AS Message;
END;
GO

--sp_GetProjectAssignments--
CREATE PROCEDURE sp_GetProjectAssignments
AS
BEGIN
SELECT
PA.assignment_id,
E.employee_name,
P.project_name,
PA.project_role,
PA.start_date,
PA.end_date
FROM Project_Assignment PA
INNER JOIN Employee E
ON PA.employee_id = E.employee_id
INNER JOIN Project P
ON PA.project_id = P.project_id;
END;
GO

--sp_GetEmployeeProjects--
CREATE PROCEDURE sp_GetEmployeeProjects
(
    @EmployeeID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee not found.',16,1);
        RETURN;
    END

    SELECT
        P.project_name,
        PA.project_role,
        PA.start_date,
        PA.end_date
    FROM Project_Assignment PA
    INNER JOIN Project P
        ON PA.project_id = P.project_id
    WHERE PA.employee_id = @EmployeeID;
END;
GO

--sp_AddEmployeeAddress--
CREATE PROCEDURE sp_AddEmployeeAddress
(
    @EmployeeID INT,
    @AddressLine VARCHAR(255),
    @City VARCHAR(100),
    @State VARCHAR(100),
    @Pincode VARCHAR(20),
    @Country VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Employee does not exist.',16,1);
        RETURN;
    END

    INSERT INTO Employee_Address
    (
        employee_id,
        address_line,
        city,
        state,
        pincode,
        country
    )
    VALUES
    (
        @EmployeeID,
        @AddressLine,
        @City,
        @State,
        @Pincode,
        @Country
    );

    SELECT 'Address Added Successfully' AS Message;
END;
GO

--sp_UpdateEmployeeAddress--
CREATE PROCEDURE sp_UpdateEmployeeAddress
(
    @EmployeeID INT,
    @AddressLine VARCHAR(255),
    @City VARCHAR(100),
    @State VARCHAR(100),
    @Pincode VARCHAR(20),
    @Country VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee_Address
        WHERE employee_id = @EmployeeID
    )
    BEGIN
        RAISERROR('Address record not found.',16,1);
        RETURN;
    END

    UPDATE Employee_Address
    SET
        address_line = @AddressLine,
        city = @City,
        state = @State,
        pincode = @Pincode,
        country = @Country
    WHERE employee_id = @EmployeeID;

    SELECT 'Address Updated Successfully' AS Message;
END;
GO

--sp_GetEmployeeAddress--
CREATE PROCEDURE sp_GetEmployeeAddress
(
@EmployeeID INT
)
AS
BEGIN
SELECT *
FROM Employee_Address
WHERE employee_id = @EmployeeID;
END;
GO

--sp_DashboardSummary--
CREATE PROCEDURE sp_DashboardSummary
AS
BEGIN
SELECT
(SELECT COUNT(*) FROM Employee) AS TotalEmployees,
(SELECT COUNT(*) FROM Employee WHERE status='Active') AS ActiveEmployees,
(SELECT COUNT(*) FROM Department) AS TotalDepartments,
(SELECT COUNT(*) FROM Project) AS TotalProjects,
(SELECT COUNT(*) FROM Client) AS TotalClients,
(SELECT COUNT(*) FROM Leave_Request WHERE status='Pending') AS PendingLeaves;
END;
GO

--sp_EmployeeCountByDepartment--
CREATE PROCEDURE sp_EmployeeCountByDepartment
AS
BEGIN
SELECT
D.department_name,
COUNT(E.employee_id) AS EmployeeCount
FROM Department D
LEFT JOIN Employee E
ON D.department_id = E.department_id
GROUP BY D.department_name;
END;
GO

--sp_LeaveSummaryReport--
CREATE PROCEDURE sp_LeaveSummaryReport
AS
BEGIN
SELECT
LT.leave_name,
COUNT(LR.leave_id) AS TotalRequests,
SUM(CASE WHEN LR.status='Approved' THEN 1 ELSE 0 END) AS ApprovedLeaves,
SUM(CASE WHEN LR.status='Rejected' THEN 1 ELSE 0 END) AS RejectedLeaves,
SUM(CASE WHEN LR.status='Pending' THEN 1 ELSE 0 END) AS PendingLeaves
FROM Leave_Request LR
INNER JOIN Leave_Type LT
ON LR.leave_type_id = LT.leave_type_id
GROUP BY LT.leave_name;
END;
GO

--sp_AttendanceSummaryReport--
CREATE PROCEDURE sp_AttendanceSummaryReport
AS
BEGIN
SELECT
E.employee_name,
COUNT(A.attendance_id) AS TotalAttendance,
SUM(CASE WHEN A.status='Present' THEN 1 ELSE 0 END) AS PresentDays,
SUM(CASE WHEN A.status='Absent' THEN 1 ELSE 0 END) AS AbsentDays,
SUM(CASE WHEN A.status='Late' THEN 1 ELSE 0 END) AS LateDays
FROM Employee E
LEFT JOIN Attendance A
ON E.employee_id = A.employee_id
GROUP BY E.employee_name;
END;
GO

--sp_ProjectResourceReport--
CREATE PROCEDURE sp_ProjectResourceReport
AS
BEGIN
SELECT
P.project_name,
COUNT(PA.employee_id) AS ResourceCount
FROM Project P
LEFT JOIN Project_Assignment PA
ON P.project_id = PA.project_id
GROUP BY P.project_name;
END;
GO

--//CLIENT MODULE//--
--sp_CreateClient--
CREATE PROCEDURE sp_CreateClient
(
    @ClientName VARCHAR(100),
    @ContactPerson VARCHAR(100),
    @Email VARCHAR(100),
    @Phone VARCHAR(15)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM Client
        WHERE email = @Email
    )
    BEGIN
        RAISERROR('Client email already exists.',16,1);
        RETURN;
    END

    INSERT INTO Client
    (
        client_name,
        contact_person,
        email,
        phone
    )
    VALUES
    (
        @ClientName,
        @ContactPerson,
        @Email,
        @Phone
    );

    SELECT 'Client Created Successfully' AS Message;
END;
GO

--sp_UpdateClient--
CREATE PROCEDURE sp_UpdateClient
(
    @ClientID INT,
    @ClientName VARCHAR(100),
    @ContactPerson VARCHAR(100),
    @Email VARCHAR(100),
    @Phone VARCHAR(15),
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Client
        WHERE client_id = @ClientID
    )
    BEGIN
        RAISERROR('Client not found.',16,1);
        RETURN;
    END

    IF EXISTS
    (
        SELECT 1
        FROM Client
        WHERE email = @Email
        AND client_id <> @ClientID
    )
    BEGIN
        RAISERROR('Client email already exists.',16,1);
        RETURN;
    END

    UPDATE Client
    SET
        client_name = @ClientName,
        contact_person = @ContactPerson,
        email = @Email,
        phone = @Phone,
        is_active = @IsActive,
        updated_at = SYSDATETIME()
    WHERE client_id = @ClientID;

    SELECT 'Client Updated Successfully' AS Message;
END;
GO

--sp_GetClients--
CREATE PROCEDURE sp_GetClients
AS
BEGIN
SELECT *
FROM Client
ORDER BY client_name;
END;
GO

--//PROJECT MODULE//--
--sp_CreateProject--
CREATE PROCEDURE sp_CreateProject
(
    @ProjectName VARCHAR(100),
    @ClientID INT,
    @StartDate DATE,
    @EndDate DATE,
    @ProjectDescription VARCHAR(500),
    @Budget DECIMAL(12,2)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Client
        WHERE client_id = @ClientID
    )
    BEGIN
        RAISERROR('Client does not exist.',16,1);
        RETURN;
    END

    IF @EndDate < @StartDate
    BEGIN
        RAISERROR('End date cannot be less than start date.',16,1);
        RETURN;
    END

    INSERT INTO Project
    (
        project_name,
        client_id,
        start_date,
        end_date,
        project_description,
        budget
    )
    VALUES
    (
        @ProjectName,
        @ClientID,
        @StartDate,
        @EndDate,
        @ProjectDescription,
        @Budget
    );

    SELECT 'Project Created Successfully' AS Message;
END;
GO

--sp_UpdateProjectStatus--
CREATE PROCEDURE sp_UpdateProjectStatus
(
    @ProjectID INT,
    @Status VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Project
        WHERE project_id = @ProjectID
    )
    BEGIN
        RAISERROR('Project not found.',16,1);
        RETURN;
    END

    IF @Status NOT IN
    (
        'Planned',
        'Active',
        'Completed',
        'On Hold',
        'Cancelled'
    )
    BEGIN
        RAISERROR('Invalid project status.',16,1);
        RETURN;
    END

    UPDATE Project
    SET
        status = @Status,
        updated_at = SYSDATETIME()
    WHERE project_id = @ProjectID;

    SELECT 'Project Status Updated Successfully' AS Message;
END;
GO

--sp_GetProjectDetails--
CREATE PROCEDURE sp_GetProjectDetails
(
    @ProjectID INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Project
        WHERE project_id = @ProjectID
    )
    BEGIN
        RAISERROR('Project not found.',16,1);
        RETURN;
    END

    SELECT
        P.project_id,
        P.project_name,
        C.client_name,
        P.start_date,
        P.end_date,
        P.status,
        P.project_description,
        P.budget
    FROM Project P
    LEFT JOIN Client C
        ON P.client_id = C.client_id
    WHERE P.project_id = @ProjectID;
END;
GO

--sp_GetProjectsByStatus--
CREATE PROCEDURE sp_GetProjectsByStatus
(
@Status VARCHAR(50)
)
AS
BEGIN
SELECT *
FROM Project
WHERE status = @Status
ORDER BY project_name;
END;
GO

