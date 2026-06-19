USE HRMS;
GO
--USP_Login
CREATE OR ALTER PROCEDURE USP_Login
(
    @Username VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        A.User_Id,
        A.Emp_id,
        A.Username,
        A.PasswordHash,
        A.IsActive,
        A.EmailVerified,
        E.Name,
        E.RoleID,
        E.Department_id,
        E.Company_Email
    FROM Authentication A
    INNER JOIN Employee E
        ON A.Emp_id = E.Emp_id
    WHERE A.Username = @Username
      AND A.IsActive = 1;
END
GO
--USP_Refresh_Token
CREATE OR ALTER PROCEDURE USP_Refresh_Token
(
    @Emp_id VARCHAR(12),
    @RefreshToken VARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Authentication
    SET
        RefreshToken = @RefreshToken,
        LastLogin = GETDATE()
    WHERE Emp_id = @Emp_id;

    SELECT
        Emp_id,
        Username,
        RefreshToken
    FROM Authentication
    WHERE Emp_id = @Emp_id;
END
GO
--USP_Send_OTP
CREATE OR ALTER PROCEDURE USP_Send_OTP
(
    @Emp_id VARCHAR(12),
    @OTP VARCHAR(10),
    @OTP_Expiry DATETIME
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Authentication
    SET
        OTP = @OTP,
        OTP_Expiry = @OTP_Expiry
    WHERE Emp_id = @Emp_id;

    SELECT 'OTP Sent Successfully' AS Message;
END
GO
--USP_Email_Verification
CREATE OR ALTER PROCEDURE USP_Email_Verification
(
    @Emp_id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Authentication
    SET
        EmailVerified = 1,
        EmailVerificationToken = NULL
    WHERE Emp_id = @Emp_id;

    SELECT 'Email Verified Successfully' AS Message;
END
GO
--USP_Forgot_Password
CREATE OR ALTER PROCEDURE USP_Forgot_Password
(
    @Username VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Emp_id,
        Username,
        Personal_Email,
        Company_Email
    FROM Authentication
    WHERE Username = @Username;
END
GO
--USP_Reset_Password
CREATE OR ALTER PROCEDURE USP_Reset_Password
(
    @Emp_id VARCHAR(12),
    @PasswordHash VARCHAR(255)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Authentication
    SET
        PasswordHash = @PasswordHash,
        OTP = NULL,
        OTP_Expiry = NULL
    WHERE Emp_id = @Emp_id;

    SELECT 'Password Reset Successfully' AS Message;
END
GO
--sp_GetEmployeeById
CREATE OR ALTER PROCEDURE sp_GetEmployeeById
(
    @empId VARCHAR(12),
    @loggedInEmpId VARCHAR(12),
    @role VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          E.Id
        , E.Emp_id
        , E.Name
        , E.username
        , E.personal_email
        , E.company_email
        , E.Phone
        , E.DOB
        , E.Gender
        , E.RoleID
        , R.RoleName
        , E.Department_id
        , D.DepartmentName
        , E.client_id
        , C.ClientName
        , E.designation
        , E.manager_id
        , E.joining_date
        , E.employment_type
        , E.work_mode
        , E.profile_image
        , E.emergency_contact
        , E.employee_status
        , E.address
        , E.CreatedAt
        , E.UpdatedAt
    FROM Employee E
    LEFT JOIN Role R
        ON E.RoleID = R.RoleId
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    LEFT JOIN Client C
        ON E.client_id = C.ClientId
    WHERE E.Emp_id = @empId;
END
GO
--sp_GetEmployeesByFilter
CREATE OR ALTER PROCEDURE sp_GetEmployeesByFilter
(
    @page INT = 1,
    @limit INT = 10,
    @search VARCHAR(100) = NULL,
    @department VARCHAR(100) = NULL,
    @role VARCHAR(100) = NULL,
    @status VARCHAR(20) = NULL,
    @userEmpId VARCHAR(12) = NULL,
    @isManager BIT = 0
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT;
    SET @Offset = (@page - 1) * @limit;

    SELECT
          E.*
        , D.DepartmentName
        , R.RoleName
        , C.ClientName
    FROM Employee E
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    LEFT JOIN Role R
        ON E.RoleID = R.RoleId
    LEFT JOIN Client C
        ON E.client_id = C.ClientId
    WHERE
        (@search IS NULL
            OR E.Name LIKE '%' + @search + '%'
            OR E.Emp_id LIKE '%' + @search + '%'
            OR E.company_email LIKE '%' + @search + '%')
        AND (@department IS NULL OR D.DepartmentName = @department)
        AND (@role IS NULL OR R.RoleName = @role)
        AND (@status IS NULL OR E.employee_status = @status)
    ORDER BY E.Id DESC
    OFFSET @Offset ROWS
    FETCH NEXT @limit ROWS ONLY;
END
GO
--sp_CreateEmployee
CREATE OR ALTER PROCEDURE sp_CreateEmployee
(
    @name VARCHAR(100),
    @personal_email VARCHAR(150),
    @phone VARCHAR(10),
    @RoleID INT,
    @Department_id INT,
    @designation VARCHAR(100),
    @joining_date DATE,
    @employment_type VARCHAR(20),
    @work_mode VARCHAR(20),
    @client_id INT = NULL,
    @manager_id VARCHAR(12) = NULL,
    @profile_image VARCHAR(255) = NULL,
    @emergency_contact VARCHAR(10) = NULL,
    @DOB DATE = NULL,
    @Gender VARCHAR(10) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NextNo INT;
    DECLARE @Emp_id VARCHAR(12);

    SELECT @NextNo =
        ISNULL(MAX(CAST(RIGHT(Emp_id,4) AS INT)),0) + 1
    FROM Employee
    WHERE LEFT(Emp_id,7) = 'CFT' + CAST(YEAR(GETDATE()) AS VARCHAR(4));

    SET @Emp_id =
        'CFT'
        + CAST(YEAR(GETDATE()) AS VARCHAR(4))
        + RIGHT('0000' + CAST(@NextNo AS VARCHAR(4)),4);

    INSERT INTO Employee
    (
        Emp_id,
        Name,
        username,
        personal_email,
        company_email,
        Phone,
        DOB,
        Gender,
        RoleID,
        Department_id,
        client_id,
        designation,
        manager_id,
        joining_date,
        employment_type,
        work_mode,
        profile_image,
        emergency_contact
    )
    VALUES
    (
        @Emp_id,
        @name,
        @personal_email,
        @personal_email,
        @personal_email,
        @phone,
        @DOB,
        @Gender,
        @RoleID,
        @Department_id,
        @client_id,
        @designation,
        @manager_id,
        @joining_date,
        @employment_type,
        @work_mode,
        @profile_image,
        @emergency_contact
    );

    SELECT @Emp_id AS Emp_id;
END
GO
--sp_UpdateEmployee
CREATE OR ALTER PROCEDURE sp_UpdateEmployee
(
    @empId VARCHAR(12),
    @loggedInEmpId VARCHAR(12),
    @loggedInRole VARCHAR(100),

    @name VARCHAR(100) = NULL,
    @personal_email VARCHAR(150) = NULL,
    @phone VARCHAR(10) = NULL,
    @emergency_contact VARCHAR(10) = NULL,
    @profile_image VARCHAR(255) = NULL,
    @designation VARCHAR(100) = NULL,
    @employment_type VARCHAR(20) = NULL,
    @work_mode VARCHAR(20) = NULL,
    @manager_id VARCHAR(12) = NULL,
    @department_id INT = NULL,
    @client_id INT = NULL,
    @role_id INT = NULL,
    @employee_status VARCHAR(20) = NULL,
    @DOB DATE = NULL,
    @Gender VARCHAR(10) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Employee
    SET
        Name = ISNULL(@name, Name),
        personal_email = ISNULL(@personal_email, personal_email),
        Phone = ISNULL(@phone, Phone),
        emergency_contact = ISNULL(@emergency_contact, emergency_contact),
        profile_image = ISNULL(@profile_image, profile_image),
        designation = ISNULL(@designation, designation),
        employment_type = ISNULL(@employment_type, employment_type),
        work_mode = ISNULL(@work_mode, work_mode),
        manager_id = ISNULL(@manager_id, manager_id),
        Department_id = ISNULL(@department_id, Department_id),
        client_id = ISNULL(@client_id, client_id),
        RoleID = ISNULL(@role_id, RoleID),
        employee_status = ISNULL(@employee_status, employee_status),
        DOB = ISNULL(@DOB, DOB),
        Gender = ISNULL(@Gender, Gender),
        UpdatedAt = GETDATE()
    WHERE Emp_id = @empId;

    SELECT 'Employee Updated Successfully' AS Message;
END
GO
--USP_Department_Create
CREATE OR ALTER PROCEDURE USP_Department_Create
(
    @DepartmentName VARCHAR(200),
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS
    (
        SELECT 1
        FROM Department
        WHERE DepartmentName = @DepartmentName
          AND Status = 1
    )
    BEGIN
        RAISERROR('Department already exists',16,1);
        RETURN;
    END

    INSERT INTO Department
    (
        DepartmentName,
        CreatedBy,
        CreatedDate,
        Status
    )
    VALUES
    (
        @DepartmentName,
        NULL,
        GETDATE(),
        1
    );

    SELECT
        SCOPE_IDENTITY() AS DepartmentId,
        'Department created successfully' AS Message;
END
GO
--USP_Department_GetAll
CREATE OR ALTER PROCEDURE USP_Department_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        DepartmentId,
        DepartmentName,
        Description,
        Status,
        CreatedDate
    FROM Department
    WHERE Status = 1
    ORDER BY DepartmentName;
END
GO
--USP_Department_Update
CREATE OR ALTER PROCEDURE USP_Department_Update
(
    @DepartmentId INT,
    @DepartmentName VARCHAR(200),
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Department
    SET
        DepartmentName = @DepartmentName,
        UpdatedDate = GETDATE()
    WHERE DepartmentId = @DepartmentId;

    SELECT 'Department updated successfully' AS Message;
END
GO
--USP_Department_Delete
CREATE OR ALTER PROCEDURE USP_Department_Delete
(
    @DepartmentId INT,
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Department
    SET
        Status = 0,
        UpdatedDate = GETDATE()
    WHERE DepartmentId = @DepartmentId;

    SELECT 'Department deleted successfully' AS Message;
END
GO
--USP_Role_Create
CREATE OR ALTER PROCEDURE USP_Role_Create
(
    @RoleName VARCHAR(200),
    @DepartmentId INT,
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Role
    (
        RoleName,
        DepartmentId,
        Status,
        CreatedDate
    )
    VALUES
    (
        @RoleName,
        @DepartmentId,
        1,
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS RoleId,
        'Role created successfully' AS Message;
END
GO
--USP_Role_GetAll
CREATE OR ALTER PROCEDURE USP_Role_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.RoleId,
        R.RoleName,
        R.DepartmentId,
        D.DepartmentName,
        R.Status
    FROM Role R
    LEFT JOIN Department D
        ON R.DepartmentId = D.DepartmentId
    WHERE R.Status = 1;
END
GO
--USP_Role_Update
CREATE OR ALTER PROCEDURE USP_Role_Update
(
    @RoleId INT,
    @RoleName VARCHAR(200),
    @DepartmentId INT,
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Role
    SET
        RoleName = @RoleName,
        DepartmentId = @DepartmentId,
        UpdatedDate = GETDATE()
    WHERE RoleId = @RoleId;

    SELECT 'Role updated successfully' AS Message;
END
GO
--USP_Role_Delete
CREATE OR ALTER PROCEDURE USP_Role_Delete
(
    @RoleId INT,
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Role
    SET
        Status = 0,
        UpdatedDate = GETDATE()
    WHERE RoleId = @RoleId;

    SELECT 'Role deleted successfully' AS Message;
END
GO
--sp_PunchIn
CREATE OR ALTER PROCEDURE sp_PunchIn
(
    @Emp_id VARCHAR(12),
    @PunchInTime DATETIME,
    @Latitude DECIMAL(10,6) = NULL,   -- ignored
    @Longitude DECIMAL(10,6) = NULL   -- ignored
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = CAST(@PunchInTime AS DATE);

    IF EXISTS
    (
        SELECT 1
        FROM Attendance
        WHERE Emp_id = @Emp_id
        AND work_date = @Today
    )
    BEGIN
        SELECT
            0 AS Success,
            'Already punched in today' AS Message;
        RETURN;
    END

    INSERT INTO Attendance
    (
        Emp_id,
        work_date,
        punch_in_time,
        punch_in_status,
        work_mode,
        attendance_status
    )
    VALUES
    (
        @Emp_id,
        @Today,
        @PunchInTime,
        CASE
            WHEN CAST(@PunchInTime AS TIME) <= '09:30:00'
                THEN 'ON_TIME'
            ELSE 'LATE'
        END,
        'WFO',
        'PRESENT'
    );

    SELECT
        1 AS Success,
        'Punch In Successful' AS Message;
END
GO
--sp_PunchOut
CREATE OR ALTER PROCEDURE sp_PunchOut
(
    @Emp_id VARCHAR(12),
    @PunchOutTime DATETIME
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = CAST(@PunchOutTime AS DATE);

    UPDATE Attendance
    SET
        punch_out_time = @PunchOutTime,
        total_hours =
            CAST(
                DATEDIFF
                (
                    MINUTE,
                    punch_in_time,
                    @PunchOutTime
                ) / 60.0
            AS DECIMAL(10,2)),
        updated_at = SYSDATETIME()
    WHERE Emp_id = @Emp_id
      AND work_date = @Today;

    SELECT
        1 AS Success,
        'Punch Out Successful' AS Message;
END
GO
--GetAttendanceByEmpDate
CREATE OR ALTER PROCEDURE GetAttendanceByEmpDate
(
    @Emp_id VARCHAR(12),
    @date DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 *
    FROM Attendance
    WHERE Emp_id = @Emp_id
      AND work_date = @date;
END
GO
--sp_UpdateAttendanceRecord
CREATE OR ALTER PROCEDURE sp_UpdateAttendanceRecord
(
    @Emp_id VARCHAR(12),
    @date DATE,
    @punch_in_time DATETIME = NULL,
    @punch_out_time DATETIME = NULL,
    @total_hours DECIMAL(10,2),
    @punch_in_status VARCHAR(20),
    @attendance_status VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Attendance
    SET
        punch_in_time = @punch_in_time,
        punch_out_time = @punch_out_time,
        total_hours = @total_hours,
        punch_in_status = @punch_in_status,
        attendance_status = @attendance_status,
        updated_at = SYSDATETIME()
    WHERE Emp_id = @Emp_id
      AND work_date = @date;

    SELECT 'Attendance Updated Successfully' AS Message;
END
GO
--sp_GetAttendanceHistory
CREATE OR ALTER PROCEDURE sp_GetAttendanceHistory
(
    @Emp_id VARCHAR(12),
    @page INT = 1,
    @limit INT = 10
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT;
    SET @Offset = (@page - 1) * @limit;

    SELECT
        COUNT(*) AS total,
        NULL AS error
    FROM Attendance
    WHERE Emp_id = @Emp_id;

    SELECT *
    FROM Attendance
    WHERE Emp_id = @Emp_id
    ORDER BY work_date DESC
    OFFSET @Offset ROWS
    FETCH NEXT @limit ROWS ONLY;
END
GO
--sp_GetAttendanceSummary
CREATE OR ALTER PROCEDURE sp_GetAttendanceSummary
(
    @Emp_id VARCHAR(12),
    @month INT,
    @year INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS TotalDays,
        SUM(CASE WHEN attendance_status = 'PRESENT' THEN 1 ELSE 0 END) AS PresentDays,
        SUM(CASE WHEN attendance_status = 'ABSENT' THEN 1 ELSE 0 END) AS AbsentDays,
        SUM(ISNULL(total_hours,0)) AS TotalHours
    FROM Attendance
    WHERE Emp_id = @Emp_id
      AND MONTH(work_date) = @month
      AND YEAR(work_date) = @year;

    SELECT *
    FROM Attendance
    WHERE Emp_id = @Emp_id
      AND MONTH(work_date) = @month
      AND YEAR(work_date) = @year
    ORDER BY work_date DESC;
END
GO
--sp_GetAttendanceDashboard
CREATE OR ALTER PROCEDURE sp_GetAttendanceDashboard
(
    @today DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS TotalEmployees,

        SUM(
            CASE
                WHEN work_date = @today
                THEN 1
                ELSE 0
            END
        ) AS PresentToday,

        SUM(
            CASE
                WHEN work_date = @today
                 AND punch_in_status = 'LATE'
                THEN 1
                ELSE 0
            END
        ) AS LateToday
    FROM Attendance;
END
GO
--USP_Leave_Request
CREATE OR ALTER PROCEDURE USP_Leave_Request
(
    @Emp_id VARCHAR(12),
    @LeaveType VARCHAR(100),
    @FromDate DATE,
    @ToDate DATE,
    @Reason VARCHAR(500)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @LeaveType_Id INT;

    SELECT @LeaveType_Id = LeaveType_Id
    FROM Leave_Type
    WHERE LeaveType_Name = @LeaveType;

    IF @LeaveType_Id IS NULL
    BEGIN
        RAISERROR('Invalid Leave Type',16,1);
        RETURN;
    END

    INSERT INTO Leave_Request
    (
        Emp_id,
        LeaveType_Id,
        From_Date,
        To_Date,
        Total_Days,
        Reason,
        Status,
        Created_At
    )
    VALUES
    (
        @Emp_id,
        @LeaveType_Id,
        @FromDate,
        @ToDate,
        DATEDIFF(DAY,@FromDate,@ToDate)+1,
        @Reason,
        'PENDING',
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS LeaveId,
        'Leave Applied Successfully' AS Message;
END
GO
--USP_Leave_Get
CREATE OR ALTER PROCEDURE USP_Leave_Get
(
    @Emp_id VARCHAR(12),
    @Role VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Role IN ('SUPER_ADMIN','HR_ADMIN','MANAGER')
    BEGIN
        SELECT
            LR.*,
            LT.LeaveType_Name,
            E.Name
        FROM Leave_Request LR
        INNER JOIN Leave_Type LT
            ON LR.LeaveType_Id = LT.LeaveType_Id
        INNER JOIN Employee E
            ON LR.Emp_id = E.Emp_id
        ORDER BY LR.Created_At DESC;
    END
    ELSE
    BEGIN
        SELECT
            LR.*,
            LT.LeaveType_Name
        FROM Leave_Request LR
        INNER JOIN Leave_Type LT
            ON LR.LeaveType_Id = LT.LeaveType_Id
        WHERE LR.Emp_id = @Emp_id
        ORDER BY LR.Created_At DESC;
    END
END
GO
--USP_Leave_Status_Update
CREATE OR ALTER PROCEDURE USP_Leave_Status_Update
(
    @LeaveId INT,
    @Status VARCHAR(20),
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Leave_Request
    SET
        Status = @Status,
        ApprovedBy = @UpdatedBy,
        ApprovedAt = GETDATE()
    WHERE Leave_Id = @LeaveId;

    SELECT
        'Leave Status Updated Successfully' AS Message;
END
GO
--USP_Leave_Notifications
CREATE OR ALTER PROCEDURE USP_Leave_Notifications
(
    @Emp_id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Leave_Id AS NotificationId,
        Status,
        From_Date,
        To_Date,
        Created_At
    FROM Leave_Request
    WHERE Emp_id = @Emp_id
      AND Status IN ('APPROVED','REJECTED')
    ORDER BY Created_At DESC;
END
GO
--USP_Notification_Visibility_Update
CREATE OR ALTER PROCEDURE USP_Notification_Visibility_Update
(
    @NotificationId INT,
    @Emp_id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        1 AS Success,
        'Notification Visibility Updated' AS Message;
END
GO
--sp_CreateWFHRequest
CREATE OR ALTER PROCEDURE sp_CreateWFHRequest
(
    @Emp_id VARCHAR(12),
    @from_date DATE,
    @to_date DATE,
    @reason VARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO WFH_Request
    (
        Emp_id,
        from_date,
        to_date,
        reason,
        status,
        created_at
    )
    VALUES
    (
        @Emp_id,
        @from_date,
        @to_date,
        @reason,
        'PENDING',
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS RequestId,
        'WFH Request Created Successfully' AS Message;
END
GO
--sp_GetMyWFHRequests
CREATE OR ALTER PROCEDURE sp_GetMyWFHRequests
(
    @Emp_id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM WFH_Request
    WHERE Emp_id = @Emp_id
    ORDER BY created_at DESC;
END
GO
--sp_GetAllWFHRequests
CREATE OR ALTER PROCEDURE sp_GetAllWFHRequests
(
    @Emp_id VARCHAR(12),
    @Role VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF @Role IN ('SUPER_ADMIN','HR_ADMIN','MANAGER')
    BEGIN
        SELECT
            W.*,
            E.Name
        FROM WFH_Request W
        INNER JOIN Employee E
            ON W.Emp_id = E.Emp_id
        ORDER BY W.created_at DESC;
    END
    ELSE
    BEGIN
        SELECT *
        FROM WFH_Request
        WHERE Emp_id = @Emp_id
        ORDER BY created_at DESC;
    END
END
GO
--sp_UpdateWFHStatus
CREATE OR ALTER PROCEDURE sp_UpdateWFHStatus
(
    @Emp_id VARCHAR(12),
    @status VARCHAR(20),
    @approved_by VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE WFH_Request
    SET
        status = @status,
        approved_by = @approved_by
    WHERE id =
    (
        SELECT TOP 1 id
        FROM WFH_Request
        WHERE Emp_id = @Emp_id
          AND status = 'PENDING'
        ORDER BY created_at DESC
    );

    SELECT
        'WFH Status Updated Successfully' AS Message;
END
GO
--USP_Holiday_Create
CREATE OR ALTER PROCEDURE USP_Holiday_Create
(
    @HolidayName VARCHAR(200),
    @HolidayDate DATE,
    @ClientId INT,
    @Region VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Holiday
    (
        Holiday_Name,
        Holiday_Date,
        Client_Id,
        Region
    )
    VALUES
    (
        @HolidayName,
        @HolidayDate,
        @ClientId,
        @Region
    );

    SELECT 'Holiday Created Successfully' AS Message;
END
GO
--USP_Holiday_Delete
CREATE OR ALTER PROCEDURE USP_Holiday_Delete
(
    @ClientId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Holiday
    WHERE Client_Id = @ClientId;

    SELECT 'Holiday Deleted Successfully' AS Message;
END
GO
--USP_Holiday_Get
CREATE OR ALTER PROCEDURE USP_Holiday_Get
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Holiday
    WHERE Status = 'ACTIVE'
    ORDER BY Holiday_Date;
END
GO
--USP_Holiday_History
CREATE OR ALTER PROCEDURE USP_Holiday_History
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Holiday
    ORDER BY Holiday_Date DESC;
END
GO
--USP_Get_Total_Holidays
CREATE OR ALTER PROCEDURE USP_Get_Total_Holidays
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS TotalHolidays
    FROM Holiday
    WHERE Status = 'ACTIVE';
END
GO
--USP_Get_Used_Holidays
CREATE OR ALTER PROCEDURE USP_Get_Used_Holidays
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS UsedHolidays
    FROM Holiday
    WHERE Holiday_Date < CAST(GETDATE() AS DATE);
END
GO
--USP_Get_Remaining_Holidays
CREATE OR ALTER PROCEDURE USP_Get_Remaining_Holidays
AS
BEGIN
    SET NOCOUNT ON;

    SELECT COUNT(*) AS RemainingHolidays
    FROM Holiday
    WHERE Holiday_Date >= CAST(GETDATE() AS DATE);
END
GO
--USP_Announcement_Create
CREATE OR ALTER PROCEDURE USP_Announcement_Create
(
    @Title VARCHAR(500),
    @Content VARCHAR(MAX),
    @CreatedBy VARCHAR(12),
    @Status VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Announcement
    (
        Title,
        Content,
        CreatedBy,
        Status,
        CreatedDate
    )
    VALUES
    (
        @Title,
        @Content,
        @CreatedBy,
        1,
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS AnnouncementId,
        'Announcement Created Successfully' AS Message;
END
GO
--USP_Announcement_CheckDuplicate
CREATE OR ALTER PROCEDURE USP_Announcement_CheckDuplicate
(
    @Title VARCHAR(500),
    @Content VARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 *
    FROM Announcement
    WHERE Title = @Title
      AND Content = @Content;
END
GO
--USP_Announcement_GetAll
CREATE OR ALTER PROCEDURE USP_Announcement_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Announcement
    WHERE Status = 1
    ORDER BY CreatedDate DESC;
END
GO
--USP_Announcement_GetById
CREATE OR ALTER PROCEDURE USP_Announcement_GetById
(
    @AnnouncementId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Announcement
    WHERE AnnouncementId = @AnnouncementId;
END
GO
--USP_Announcement_Delete
CREATE OR ALTER PROCEDURE USP_Announcement_Delete
(
    @AnnouncementId INT,
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Announcement
    SET
        Status = 0,
        DeletedBy = @DeletedBy,
        UpdatedDate = GETDATE()
    WHERE AnnouncementId = @AnnouncementId;

    SELECT 'Announcement Deleted Successfully' AS Message;
END
GO
--sp_CreatePayroll
CREATE OR ALTER PROCEDURE sp_CreatePayroll
(
    @Emp_id VARCHAR(12),
    @month INT,
    @year INT,
    @basic_salary DECIMAL(10,2),
    @allowances DECIMAL(10,2),
    @bonus DECIMAL(10,2),
    @penalty DECIMAL(10,2),
    @tax DECIMAL(10,2),
    @payroll_id INT OUTPUT
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @net_salary DECIMAL(10,2);

    SET @net_salary =
        @basic_salary
        + @allowances
        + @bonus
        - @penalty
        - @tax;

    INSERT INTO Payroll
    (
        Emp_id,
        month,
        year,
        basic_salary,
        allowances,
        bonus,
        penalty,
        tax,
        net_salary
    )
    VALUES
    (
        @Emp_id,
        @month,
        @year,
        @basic_salary,
        @allowances,
        @bonus,
        @penalty,
        @tax,
        @net_salary
    );

    SET @payroll_id = SCOPE_IDENTITY();

    SELECT @payroll_id AS payroll_id;
END
GO
--sp_UpdatePayroll
CREATE OR ALTER PROCEDURE sp_UpdatePayroll
(
    @Emp_id VARCHAR(12),
    @month INT,
    @year INT,
    @basic_salary DECIMAL(10,2)=NULL,
    @allowances DECIMAL(10,2)=NULL,
    @bonus DECIMAL(10,2)=NULL,
    @penalty DECIMAL(10,2)=NULL,
    @tax DECIMAL(10,2)=NULL,
    @status VARCHAR(20)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Payroll
    SET
        basic_salary = ISNULL(@basic_salary,basic_salary),
        allowances = ISNULL(@allowances,allowances),
        bonus = ISNULL(@bonus,bonus),
        penalty = ISNULL(@penalty,penalty),
        tax = ISNULL(@tax,tax),
        status = ISNULL(@status,status),
        net_salary =
            ISNULL(@basic_salary,basic_salary)
          + ISNULL(@allowances,allowances)
          + ISNULL(@bonus,bonus)
          - ISNULL(@penalty,penalty)
          - ISNULL(@tax,tax),
        updated_at = SYSDATETIME()
    WHERE Emp_id=@Emp_id
      AND month=@month
      AND year=@year;

    SELECT 'Payroll Updated Successfully' AS Message;
END
GO
--sp_DeletePayroll
CREATE OR ALTER PROCEDURE sp_DeletePayroll
(
    @Emp_id VARCHAR(12),
    @month INT,
    @year INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM Payroll
    WHERE Emp_id=@Emp_id
      AND month=@month
      AND year=@year;

    SELECT 'Payroll Deleted Successfully' AS Message;
END
GO
--sp_ApprovePayroll
CREATE OR ALTER PROCEDURE sp_ApprovePayroll
(
    @Emp_id VARCHAR(12),
    @month INT,
    @year INT,
    @approved_by VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Payroll
    SET
        status='APPROVED',
        approved_by=@approved_by,
        updated_at=SYSDATETIME()
    WHERE Emp_id=@Emp_id
      AND month=@month
      AND year=@year;

    SELECT 'Payroll Approved Successfully' AS Message;
END
GO
--sp_GetPayrollList
CREATE OR ALTER PROCEDURE sp_GetPayrollList
(
    @month INT=NULL,
    @year INT=NULL,
    @status VARCHAR(20)=NULL,
    @employee_id VARCHAR(12)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.*,
        E.Name
    FROM Payroll P
    INNER JOIN Employee E
        ON P.Emp_id = E.Emp_id
    WHERE
        (@month IS NULL OR P.month=@month)
    AND (@year IS NULL OR P.year=@year)
    AND (@status IS NULL OR P.status=@status)
    AND (@employee_id IS NULL OR P.Emp_id=@employee_id)
    ORDER BY P.year DESC,P.month DESC;
END
GO
--sp_GetPayrollByEmployee
CREATE OR ALTER PROCEDURE sp_GetPayrollByEmployee
(
    @employee_id VARCHAR(12),
    @month INT=NULL,
    @year INT=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Payroll
    WHERE Emp_id=@employee_id
      AND (@month IS NULL OR month=@month)
      AND (@year IS NULL OR year=@year)
    ORDER BY year DESC,month DESC;
END
GO
--sp_GetPayrollOwn
CREATE OR ALTER PROCEDURE sp_GetPayrollOwn
(
    @Emp_id VARCHAR(12),
    @month INT=NULL,
    @year INT=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Payroll
    WHERE Emp_id=@Emp_id
      AND (@month IS NULL OR month=@month)
      AND (@year IS NULL OR year=@year)
    ORDER BY year DESC,month DESC;
END
GO
--sp_GetPayrollSummary
CREATE OR ALTER PROCEDURE sp_GetPayrollSummary
(
    @month INT,
    @year INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS TotalPayrolls,
        SUM(net_salary) AS TotalPayout,
        SUM(tax) AS TotalTax,
        SUM(bonus) AS TotalBonus,
        SUM(penalty) AS TotalPenalty
    FROM Payroll
    WHERE month=@month
      AND year=@year;
END
GO
--sp_CreatePayslip
CREATE OR ALTER PROCEDURE sp_CreatePayslip
(
    @Emp_id VARCHAR(12),
    @payroll_id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO payslip
    (
        Emp_id,
        payroll_id,
        month,
        year,
        basic_salary,
        allowances,
        bonus,
        penalty,
        tax,
        net_salary,
        gross_salary,
        total_deductions
    )
    SELECT
        Emp_id,
        id,
        month,
        year,
        basic_salary,
        allowances,
        bonus,
        penalty,
        tax,
        net_salary,
        basic_salary + allowances + bonus,
        penalty + tax
    FROM Payroll
    WHERE id = @payroll_id
      AND Emp_id = @Emp_id;

    SELECT
        SCOPE_IDENTITY() AS payslip_id,
        'Payslip Created Successfully' AS Message;
END
GO
--sp_DeletePayslip
CREATE OR ALTER PROCEDURE sp_DeletePayslip
(
    @payslip_id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM payslip
    WHERE id = @payslip_id;

    SELECT
        'Payslip Deleted Successfully' AS Message;
END
GO
--sp_GetAllPayslips
CREATE OR ALTER PROCEDURE sp_GetAllPayslips
(
    @month INT = NULL,
    @year INT = NULL,
    @status VARCHAR(20) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.*,
        E.Name,
        E.designation
    FROM payslip P
    INNER JOIN Employee E
        ON P.Emp_id = E.Emp_id
    WHERE
        (@month IS NULL OR P.month = @month)
    AND (@year IS NULL OR P.year = @year)
    AND (@status IS NULL OR P.status = @status)
    ORDER BY P.year DESC, P.month DESC;
END
GO
--sp_GetPayslipByEmployee
CREATE OR ALTER PROCEDURE sp_GetPayslipByEmployee
(
    @Emp_id VARCHAR(12),
    @month INT = NULL,
    @year INT = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM payslip
    WHERE Emp_id = @Emp_id
      AND (@month IS NULL OR month = @month)
      AND (@year IS NULL OR year = @year)
    ORDER BY year DESC, month DESC;
END
GO
--sp_GetPayslipOwn
CREATE OR ALTER PROCEDURE sp_GetPayslipOwn
(
    @Emp_id VARCHAR(12),
    @month INT = NULL,
    @year INT = NULL,
    @status VARCHAR(20) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        P.*,
        E.Name,
        E.designation,
        E.Department_id,
        D.DepartmentName
    FROM payslip P
    INNER JOIN Employee E
        ON P.Emp_id = E.Emp_id
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    WHERE
        P.Emp_id = @Emp_id
    AND (@month IS NULL OR P.month = @month)
    AND (@year IS NULL OR P.year = @year)
    AND (@status IS NULL OR P.status = @status)
    ORDER BY P.year DESC, P.month DESC;
END
GO
--sp_UpdatePayslipStatus
CREATE OR ALTER PROCEDURE sp_UpdatePayslipStatus
(
    @payslip_id INT,
    @status VARCHAR(20),
    @payment_date DATE = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE payslip
    SET
        status = @status,
        payment_date = @payment_date,
        updated_at = SYSDATETIME()
    WHERE id = @payslip_id;

    SELECT
        'Payslip Status Updated Successfully' AS Message;
END
GO
--USP_Task_CreateAndAssign
CREATE OR ALTER PROCEDURE USP_Task_CreateAndAssign
(
    @Title VARCHAR(500),
    @Description VARCHAR(MAX) = NULL,
    @AssignedEmployeeId VARCHAR(12),
    @DueDate DATETIME = NULL,
    @CreatedBy VARCHAR(12),
    @Status VARCHAR(50) = 'PENDING'
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Task
    (
        Title,
        Description,
        Emp_id,
        DueDate,
        Status,
        CreatedBy,
        CreatedDate
    )
    VALUES
    (
        @Title,
        @Description,
        @AssignedEmployeeId,
        @DueDate,
        @Status,
        @CreatedBy,
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS TaskId,
        'Task Created Successfully' AS Message;
END
GO
--USP_Task_CheckDuplicate
CREATE OR ALTER PROCEDURE USP_Task_CheckDuplicate
(
    @Title VARCHAR(500),
    @AssignedEmployeeId VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 *
    FROM Task
    WHERE Title = @Title
      AND Emp_id = @AssignedEmployeeId
      AND DeletedBy IS NULL;
END
GO
--USP_Task_GetByEmployee
CREATE OR ALTER PROCEDURE USP_Task_GetByEmployee
(
    @EmployeeId VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        T.*,
        E.Name
    FROM Task T
    INNER JOIN Employee E
        ON T.Emp_id = E.Emp_id
    WHERE T.Emp_id = @EmployeeId
      AND T.DeletedBy IS NULL
    ORDER BY T.CreatedDate DESC;
END
GO
--USP_Task_GetAll
CREATE OR ALTER PROCEDURE USP_Task_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        T.*,
        E.Name
    FROM Task T
    INNER JOIN Employee E
        ON T.Emp_id = E.Emp_id
    WHERE T.DeletedBy IS NULL
    ORDER BY T.CreatedDate DESC;
END
GO
--USP_Task_GetById
CREATE OR ALTER PROCEDURE USP_Task_GetById
(
    @TaskId INT,
    @EmployeeId VARCHAR(12) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        T.*,
        E.Name
    FROM Task T
    INNER JOIN Employee E
        ON T.Emp_id = E.Emp_id
    WHERE T.TaskId = @TaskId
      AND T.DeletedBy IS NULL
      AND (@EmployeeId IS NULL OR T.Emp_id = @EmployeeId);
END
GO
--USP_Task_Delete
CREATE OR ALTER PROCEDURE USP_Task_Delete
(
    @TaskId INT,
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Task
    SET
        DeletedBy = @DeletedBy,
        UpdatedDate = GETDATE()
    WHERE TaskId = @TaskId;

    SELECT
        'Task Deleted Successfully' AS Message;
END
GO
--sp_UploadEmployeeDocumentMetadata
CREATE OR ALTER PROCEDURE sp_UploadEmployeeDocumentMetadata
(
    @empId VARCHAR(12),
    @uploadedByEmpId VARCHAR(12),
    @name VARCHAR(150),
    @type VARCHAR(50),
    @fileName VARCHAR(255),
    @fileUrl VARCHAR(500) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO documents
    (
        emp_id,
        uploaded_by_emp_id,
        name,
        type,
        file_name,
        file_url,
        uploaded_at
    )
    VALUES
    (
        @empId,
        @uploadedByEmpId,
        @name,
        @type,
        @fileName,
        @fileUrl,
        GETDATE()
    );

    SELECT
        SCOPE_IDENTITY() AS DocumentId,
        'Document Uploaded Successfully' AS Message;
END
GO
--sp_GetEmployeeDocuments
CREATE OR ALTER PROCEDURE sp_GetEmployeeDocuments
(
    @empId VARCHAR(12) = NULL,
    @status VARCHAR(20) = NULL,
    @type VARCHAR(50) = NULL,
    @search VARCHAR(150) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        D.*,
        E.Name
    FROM documents D
    INNER JOIN Employee E
        ON D.emp_id = E.Emp_id
    WHERE
        (@empId IS NULL OR D.emp_id = @empId)
        AND (@status IS NULL OR D.status = @status)
        AND (@type IS NULL OR D.type = @type)
        AND (
                @search IS NULL
                OR D.name LIKE '%' + @search + '%'
                OR D.file_name LIKE '%' + @search + '%'
            )
    ORDER BY D.uploaded_at DESC;
END
GO
--sp_GetDocumentById
CREATE OR ALTER PROCEDURE sp_GetDocumentById
(
    @id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM documents
    WHERE id = @id;
END
GO
--sp_UpdateDocumentStatus
CREATE OR ALTER PROCEDURE sp_UpdateDocumentStatus
(
    @id INT,
    @status VARCHAR(20),
    @rejectionReason VARCHAR(500) = NULL,
    @reviewedByEmpId VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE documents
    SET
        status = @status,
        rejection_reason = @rejectionReason,
        reviewed_by_emp_id = @reviewedByEmpId,
        reviewed_at = GETDATE()
    WHERE id = @id;

    SELECT
        'Document Status Updated Successfully' AS Message;
END
GO
--sp_DeleteDocument
CREATE OR ALTER PROCEDURE sp_DeleteDocument
(
    @id INT,
    @requestedByEmpId VARCHAR(12),
    @requestedByRole VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM documents
    WHERE id = @id;

    SELECT
        'Document Deleted Successfully' AS Message;
END
GO
--sp_GetTeamDirectory
CREATE OR ALTER PROCEDURE sp_GetTeamDirectory
(
    @loggedInEmpId VARCHAR(12),
    @loggedInRole VARCHAR(50),
    @dept VARCHAR(100) = NULL,
    @search VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          E.Emp_id
        , E.Name
        , E.company_email
        , E.Phone
        , R.RoleName
        , D.DepartmentName
        , E.designation
        , E.work_mode
        , E.employee_status
        , E.profile_image
        , E.manager_id
        , M.Name AS ManagerName
        , E.joining_date
    FROM Employee E
    LEFT JOIN Role R
        ON E.RoleID = R.RoleId
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    LEFT JOIN Employee M
        ON E.manager_id = M.Emp_id
    WHERE
        E.employee_status = 'ACTIVE'

        AND (@dept IS NULL OR D.DepartmentName = @dept)

        AND
        (
            @search IS NULL
            OR E.Name LIKE '%' + @search + '%'
            OR E.Emp_id LIKE '%' + @search + '%'
            OR E.company_email LIKE '%' + @search + '%'
        )

        AND
        (
            @loggedInRole IN ('SUPER_ADMIN','HR_ADMIN')

            OR

            (
                @loggedInRole = 'MANAGER'
                AND E.manager_id = @loggedInEmpId
            )

            OR

            (
                @loggedInRole = 'EMPLOYEE'
                AND E.manager_id =
                (
                    SELECT manager_id
                    FROM Employee
                    WHERE Emp_id = @loggedInEmpId
                )
            )
        )

    ORDER BY E.Name;
END
GO
--sp_GetTeamMemberDetail
CREATE OR ALTER PROCEDURE sp_GetTeamMemberDetail
(
    @empId VARCHAR(12),
    @loggedInEmpId VARCHAR(12),
    @loggedInRole VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE Emp_id = @empId
    )
    BEGIN
        RAISERROR('Employee not found',16,1);
        RETURN;
    END;

    -- Employee Profile

    SELECT
          E.*
        , R.RoleName
        , D.DepartmentName
        , M.Name AS ManagerName
        , M.Emp_id AS ManagerEmpId
    FROM Employee E
    LEFT JOIN Role R
        ON E.RoleID = R.RoleId
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    LEFT JOIN Employee M
        ON E.manager_id = M.Emp_id
    WHERE E.Emp_id = @empId;

    -- Last 7 Days Attendance

    SELECT
          A.id
        , A.work_date
        , A.punch_in_time
        , A.punch_out_time
        , A.punch_in_status
        , A.work_mode
        , A.total_hours
        , A.attendance_status
    FROM attendance A
    WHERE A.Emp_id = @empId
      AND A.work_date >= DATEADD(DAY,-7,CAST(GETDATE() AS DATE))
    ORDER BY A.work_date DESC;

END
GO
--sp_GetOrganisationStructure
CREATE OR ALTER PROCEDURE sp_GetOrganisationStructure
(
    @dept VARCHAR(100) = NULL,
    @search VARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          E.Emp_id
        , E.Name
        , E.designation
        , R.RoleName
        , D.DepartmentName
        , E.manager_id
        , M.Name AS ManagerName
        , E.employee_status
        , E.joining_date
    FROM Employee E
    LEFT JOIN Role R
        ON E.RoleID = R.RoleId
    LEFT JOIN Department D
        ON E.Department_id = D.DepartmentId
    LEFT JOIN Employee M
        ON E.manager_id = M.Emp_id
    WHERE
        E.employee_status = 'ACTIVE'

        AND (@dept IS NULL OR D.DepartmentName = @dept)

        AND
        (
            @search IS NULL
            OR E.Name LIKE '%' + @search + '%'
            OR E.Emp_id LIKE '%' + @search + '%'
        )

    ORDER BY
          D.DepartmentName
        , E.manager_id
        , E.Name;
END
GO
--CREATE PROJECT EFFORT
CREATE OR ALTER PROCEDURE sp_CreateProjectEffort
(
    @Emp_id VARCHAR(12),
    @ProjectName NVARCHAR(200),
    @WorkDate DATE,
    @HoursWorked DECIMAL(5,2),
    @TaskDescription NVARCHAR(1000) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM Employee
        WHERE Emp_id = @Emp_id
    )
    BEGIN
        RAISERROR('Employee not found',16,1);
        RETURN;
    END;

    IF @HoursWorked <= 0
    BEGIN
        RAISERROR('Hours Worked must be greater than zero',16,1);
        RETURN;
    END;

    INSERT INTO ProjectEffort
    (
        Emp_id,
        ProjectName,
        WorkDate,
        HoursWorked,
        TaskDescription,
        CreatedAt
    )
    VALUES
    (
        @Emp_id,
        @ProjectName,
        @WorkDate,
        @HoursWorked,
        @TaskDescription,
        GETDATE()
    );

    SELECT *
    FROM ProjectEffort
    WHERE EffortId = SCOPE_IDENTITY();
END;
GO
--GET ALL PROJECT EFFORTS
CREATE OR ALTER PROCEDURE sp_GetProjectEfforts
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          PE.EffortId
        , PE.Emp_id
        , E.Name AS EmployeeName
        , PE.ProjectName
        , PE.WorkDate
        , PE.HoursWorked
        , PE.TaskDescription
        , PE.CreatedAt
        , PE.UpdatedAt
    FROM ProjectEffort PE
    INNER JOIN Employee E
        ON PE.Emp_id = E.Emp_id
    ORDER BY PE.WorkDate DESC;
END;
GO
--GET PROJECT EFFORT BY ID
CREATE OR ALTER PROCEDURE sp_GetProjectEffortById
(
    @EffortId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          PE.EffortId
        , PE.Emp_id
        , E.Name AS EmployeeName
        , PE.ProjectName
        , PE.WorkDate
        , PE.HoursWorked
        , PE.TaskDescription
        , PE.CreatedAt
        , PE.UpdatedAt
    FROM ProjectEffort PE
    INNER JOIN Employee E
        ON PE.Emp_id = E.Emp_id
    WHERE PE.EffortId = @EffortId;
END;
GO
--GET PROJECT EFFORT BY EMPLOYEE
CREATE OR ALTER PROCEDURE sp_GetProjectEffortByEmployee
(
    @Emp_id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          PE.EffortId
        , PE.Emp_id
        , E.Name AS EmployeeName
        , PE.ProjectName
        , PE.WorkDate
        , PE.HoursWorked
        , PE.TaskDescription
        , PE.CreatedAt
        , PE.UpdatedAt
    FROM ProjectEffort PE
    INNER JOIN Employee E
        ON PE.Emp_id = E.Emp_id
    WHERE PE.Emp_id = @Emp_id
    ORDER BY PE.WorkDate DESC;
END;
GO
--UPDATE PROJECT EFFORT
CREATE OR ALTER PROCEDURE sp_UpdateProjectEffort
(
    @EffortId INT,
    @ProjectName NVARCHAR(200),
    @WorkDate DATE,
    @HoursWorked DECIMAL(5,2),
    @TaskDescription NVARCHAR(1000)
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM ProjectEffort
        WHERE EffortId = @EffortId
    )
    BEGIN
        RAISERROR('Project Effort not found',16,1);
        RETURN;
    END;

    IF @HoursWorked <= 0
    BEGIN
        RAISERROR('Hours Worked must be greater than zero',16,1);
        RETURN;
    END;

    UPDATE ProjectEffort
    SET
          ProjectName = @ProjectName
        , WorkDate = @WorkDate
        , HoursWorked = @HoursWorked
        , TaskDescription = @TaskDescription
        , UpdatedAt = GETDATE()
    WHERE EffortId = @EffortId;

    SELECT *
    FROM ProjectEffort
    WHERE EffortId = @EffortId;
END;
GO
--DELETE PROJECT EFFORT
CREATE OR ALTER PROCEDURE sp_DeleteProjectEffort
(
    @EffortId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS
    (
        SELECT 1
        FROM ProjectEffort
        WHERE EffortId = @EffortId
    )
    BEGIN
        RAISERROR('Project Effort not found',16,1);
        RETURN;
    END;

    DELETE FROM ProjectEffort
    WHERE EffortId = @EffortId;

    SELECT
        'Project Effort deleted successfully' AS Message,
        @EffortId AS DeletedEffortId;
END;
GO
--sp_GetAllJobs
CREATE OR ALTER PROCEDURE sp_GetAllJobs
(
    @page INT,
    @limit INT,
    @search VARCHAR(100) = NULL,
    @dept VARCHAR(100) = NULL,
    @status VARCHAR(20) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Offset INT = (@page - 1) * @limit;

    SELECT *
    FROM jobs
    WHERE
        (@dept IS NULL OR dept = @dept)
        AND (@status IS NULL OR status = @status)
        AND
        (
            @search IS NULL
            OR title LIKE '%' + @search + '%'
            OR description LIKE '%' + @search + '%'
        )
    ORDER BY posted_date DESC
    OFFSET @Offset ROWS
    FETCH NEXT @limit ROWS ONLY;
END
GO
--sp_GetJobById
CREATE OR ALTER PROCEDURE sp_GetJobById
(
    @id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM jobs
    WHERE id = @id;
END
GO
--sp_CreateJob
CREATE OR ALTER PROCEDURE sp_CreateJob
(
    @title VARCHAR(150),
    @dept VARCHAR(100),
    @status VARCHAR(20),
    @location VARCHAR(100),
    @type VARCHAR(30),
    @experience VARCHAR(50)=NULL,
    @openings INT,
    @description VARCHAR(MAX)=NULL,
    @skills VARCHAR(MAX)=NULL,
    @closingDate DATE=NULL,
    @postedByEmpId VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO jobs
    (
        title,
        dept,
        status,
        location,
        type,
        experience,
        openings,
        description,
        skills,
        posted_by,
        closing_date
    )
    VALUES
    (
        @title,
        @dept,
        @status,
        @location,
        @type,
        @experience,
        @openings,
        @description,
        @skills,
        @postedByEmpId,
        @closingDate
    );

    SELECT
        SCOPE_IDENTITY() AS JobId,
        'Job Created Successfully' AS Message;
END
GO
--sp_UpdateJob
CREATE OR ALTER PROCEDURE sp_UpdateJob
(
    @id INT,
    @title VARCHAR(150)=NULL,
    @dept VARCHAR(100)=NULL,
    @status VARCHAR(20)=NULL,
    @location VARCHAR(100)=NULL,
    @type VARCHAR(30)=NULL,
    @experience VARCHAR(50)=NULL,
    @openings INT=NULL,
    @description VARCHAR(MAX)=NULL,
    @skills VARCHAR(MAX)=NULL,
    @closingDate DATE=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE jobs
    SET
        title = ISNULL(@title,title),
        dept = ISNULL(@dept,dept),
        status = ISNULL(@status,status),
        location = ISNULL(@location,location),
        type = ISNULL(@type,type),
        experience = ISNULL(@experience,experience),
        openings = ISNULL(@openings,openings),
        description = ISNULL(@description,description),
        skills = ISNULL(@skills,skills),
        closing_date = ISNULL(@closingDate,closing_date)
    WHERE id = @id;

    SELECT 'Job Updated Successfully' AS Message;
END
GO
--sp_DeleteJob
CREATE OR ALTER PROCEDURE sp_DeleteJob
(
    @id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM jobs
    WHERE id = @id;

    SELECT 'Job Deleted Successfully' AS Message;
END
GO
--sp_ApplyToJob
CREATE OR ALTER PROCEDURE sp_ApplyToJob
(
    @jobId INT,
    @appliedByEmpId VARCHAR(12),
    @applicationType VARCHAR(20),
    @candidateName VARCHAR(100),
    @candidateEmail VARCHAR(100),
    @resumeFileName VARCHAR(255),
    @resumeUrl VARCHAR(255)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO job_applications
    (
        job_id,
        applied_by_empid,
        application_type,
        candidate_name,
        candidate_email,
        resume_file_name,
        resume_url
    )
    VALUES
    (
        @jobId,
        @appliedByEmpId,
        @applicationType,
        @candidateName,
        @candidateEmail,
        @resumeFileName,
        @resumeUrl
    );

    UPDATE jobs
    SET applicants = applicants + 1
    WHERE id = @jobId;

    SELECT
        SCOPE_IDENTITY() AS ApplicationId,
        'Application Submitted Successfully' AS Message;
END
GO
--sp_GetApplications
CREATE OR ALTER PROCEDURE sp_GetApplications
(
    @jobId INT = NULL,
    @status VARCHAR(20) = NULL,
    @empId VARCHAR(12) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        A.*,
        J.title,
        E.Name
    FROM job_applications A
    INNER JOIN jobs J
        ON A.job_id = J.id
    INNER JOIN Employee E
        ON A.applied_by_empid = E.Emp_id
    WHERE
        (@jobId IS NULL OR A.job_id = @jobId)
        AND (@status IS NULL OR A.status = @status)
        AND (@empId IS NULL OR A.applied_by_empid = @empId)
    ORDER BY A.applied_at DESC;
END
GO
--sp_UpdateApplicationStatus
CREATE OR ALTER PROCEDURE sp_UpdateApplicationStatus
(
    @applicationId INT,
    @status VARCHAR(20),
    @rejectionReason VARCHAR(500)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE job_applications
    SET
        status = @status,
        rejection_reason = @rejectionReason
    WHERE id = @applicationId;

    SELECT 'Application Status Updated Successfully' AS Message;
END
GO
--USP_Reimbursement_SubmitClaim
CREATE OR ALTER PROCEDURE USP_Reimbursement_SubmitClaim
(
    @EmployeeId VARCHAR(12),
    @Title VARCHAR(200),
    @Description VARCHAR(MAX)=NULL,
    @Amount DECIMAL(18,2),
    @Currency VARCHAR(20),
    @SubmissionDate DATETIME=NULL,
    @Status VARCHAR(50)='PENDING',
    @SupportingDocuments VARCHAR(MAX)=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Reimbursement
    (
        EmployeeId,
        Title,
        Description,
        Amount,
        Currency,
        SubmissionDate,
        Status,
        SupportingDocuments
    )
    VALUES
    (
        @EmployeeId,
        @Title,
        @Description,
        @Amount,
        @Currency,
        ISNULL(@SubmissionDate,GETDATE()),
        @Status,
        @SupportingDocuments
    );

    SELECT
        SCOPE_IDENTITY() AS ClaimId,
        'Claim Submitted Successfully' AS Message;
END
GO
--USP_Reimbursement_GetByEmployee
CREATE OR ALTER PROCEDURE USP_Reimbursement_GetByEmployee
(
    @EmployeeId VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Reimbursement
    WHERE EmployeeId = @EmployeeId
    ORDER BY SubmissionDate DESC;
END
GO
--USP_Reimbursement_GetAll
CREATE OR ALTER PROCEDURE USP_Reimbursement_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.*,
        E.Name
    FROM Reimbursement R
    INNER JOIN Employee E
        ON R.EmployeeId = E.Emp_id
    ORDER BY R.SubmissionDate DESC;
END
GO
--USP_Reimbursement_GetById
CREATE OR ALTER PROCEDURE USP_Reimbursement_GetById
(
    @ClaimId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        R.*,
        E.Name
    FROM Reimbursement R
    INNER JOIN Employee E
        ON R.EmployeeId = E.Emp_id
    WHERE R.ClaimId = @ClaimId;
END
GO
--USP_Reimbursement_ReviewClaim
CREATE OR ALTER PROCEDURE USP_Reimbursement_ReviewClaim
(
    @ClaimId INT,
    @Status VARCHAR(50),
    @Comment VARCHAR(MAX)=NULL,
    @ReviewedBy VARCHAR(12),
    @ReviewedAt DATETIME=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reimbursement
    SET
        Status = @Status,
        ReviewedBy = @ReviewedBy,
        ReviewedAt = ISNULL(@ReviewedAt,GETDATE()),
        UpdatedDate = GETDATE()
    WHERE ClaimId = @ClaimId;

    SELECT
        'Claim Reviewed Successfully' AS Message;
END
GO
--USP_Reimbursement_ProcessPayment
CREATE OR ALTER PROCEDURE USP_Reimbursement_ProcessPayment
(
    @ClaimId INT,
    @PaymentReference VARCHAR(200),
    @PaymentAmount DECIMAL(18,2),
    @ProcessedBy VARCHAR(12),
    @ProcessedAt DATETIME=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reimbursement
    SET
        PaymentReference = @PaymentReference,
        PaymentAmount = @PaymentAmount,
        ProcessedBy = @ProcessedBy,
        ProcessedAt = ISNULL(@ProcessedAt,GETDATE()),
        Status = 'PAYMENT_PROCESSED',
        UpdatedDate = GETDATE()
    WHERE ClaimId = @ClaimId;

    SELECT
        'Payment Processed Successfully' AS Message;
END
GO
--USP_Reimbursement_SettlePayment
CREATE OR ALTER PROCEDURE USP_Reimbursement_SettlePayment
(
    @ClaimId INT,
    @SettledBy VARCHAR(12),
    @SettledAt DATETIME=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Reimbursement
    SET
        SettledBy = @SettledBy,
        SettledAt = ISNULL(@SettledAt,GETDATE()),
        Status = 'SETTLED',
        UpdatedDate = GETDATE()
    WHERE ClaimId = @ClaimId;

    SELECT
        'Claim Settled Successfully' AS Message;
END
GO
--USP_Invoice_Create
CREATE OR ALTER PROCEDURE USP_Invoice_Create
(
    @ClientId INT,
    @InvoiceDate DATETIME,
    @DueDate DATETIME,
    @Amount DECIMAL(18,2),
    @Currency VARCHAR(20),
    @Status VARCHAR(20)='DRAFT',
    @Description VARCHAR(MAX)=NULL,
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @InvoiceNumber VARCHAR(50);

    SET @InvoiceNumber =
        'INV-' +
        CAST(YEAR(GETDATE()) AS VARCHAR(4))
        + '-'
        + RIGHT(
            '000000'
            + CAST(
                ISNULL(
                    (
                        SELECT MAX(InvoiceId) + 1
                        FROM Invoice
                    ),
                    1
                ) AS VARCHAR
            ),
            6
        );

    INSERT INTO Invoice
    (
        InvoiceNumber,
        ClientId,
        InvoiceDate,
        DueDate,
        Amount,
        Currency,
        Status,
        Description,
        CreatedBy
    )
    VALUES
    (
        @InvoiceNumber,
        @ClientId,
        @InvoiceDate,
        @DueDate,
        @Amount,
        @Currency,
        @Status,
        @Description,
        @CreatedBy
    );

    SELECT
        SCOPE_IDENTITY() AS InvoiceId,
        @InvoiceNumber AS InvoiceNumber,
        'Invoice Created Successfully' AS Message;
END
GO
--USP_Invoice_GetAll
CREATE OR ALTER PROCEDURE USP_Invoice_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          I.InvoiceId
        , I.InvoiceNumber
        , I.ClientId
        , C.ClientName
        , I.InvoiceDate
        , I.DueDate
        , I.Amount
        , I.Currency
        , I.Status
        , I.Description
        , I.CreatedDate
    FROM Invoice I
    INNER JOIN Client C
        ON I.ClientId = C.ClientId
    ORDER BY I.InvoiceDate DESC;
END
GO
--USP_Invoice_GetById
CREATE OR ALTER PROCEDURE USP_Invoice_GetById
(
    @InvoiceId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          I.InvoiceId
        , I.InvoiceNumber
        , I.ClientId
        , C.ClientName
        , I.InvoiceDate
        , I.DueDate
        , I.Amount
        , I.Currency
        , I.Status
        , I.Description
        , I.CreatedDate
    FROM Invoice I
    INNER JOIN Client C
        ON I.ClientId = C.ClientId
    WHERE I.InvoiceId = @InvoiceId;
END
GO
--USP_Invoice_Update
CREATE OR ALTER PROCEDURE USP_Invoice_Update
(
    @InvoiceId INT,
    @ClientId INT,
    @InvoiceDate DATETIME,
    @DueDate DATETIME,
    @Amount DECIMAL(18,2),
    @Currency VARCHAR(20),
    @Description VARCHAR(MAX)=NULL,
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Invoice
    SET
          ClientId = @ClientId
        , InvoiceDate = @InvoiceDate
        , DueDate = @DueDate
        , Amount = @Amount
        , Currency = @Currency
        , Description = @Description
        , UpdatedBy = @UpdatedBy
        , UpdatedDate = GETDATE()
    WHERE InvoiceId = @InvoiceId;

    SELECT
        'Invoice Updated Successfully' AS Message;
END
GO
--USP_Invoice_UpdateStatus
CREATE OR ALTER PROCEDURE USP_Invoice_UpdateStatus
(
    @InvoiceId INT,
    @Status VARCHAR(20),
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Invoice
    SET
          Status = @Status
        , UpdatedBy = @UpdatedBy
        , UpdatedDate = GETDATE()
    WHERE InvoiceId = @InvoiceId;

    SELECT
        'Invoice Status Updated Successfully' AS Message;
END
GO
--USP_InternalJob_Create
CREATE OR ALTER PROCEDURE USP_InternalJob_Create
(
    @Title VARCHAR(500),
    @Description VARCHAR(MAX)=NULL,
    @Location VARCHAR(200),
    @Department VARCHAR(200)=NULL,
    @EmploymentType VARCHAR(100),
    @ApplicationDeadline DATETIME=NULL,
    @Status VARCHAR(20)='ACTIVE',
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO InternalJob
    (
        Title,
        Description,
        Location,
        Department,
        EmploymentType,
        ApplicationDeadline,
        Status,
        CreatedBy
    )
    VALUES
    (
        @Title,
        @Description,
        @Location,
        @Department,
        @EmploymentType,
        @ApplicationDeadline,
        @Status,
        @CreatedBy
    );

    SELECT
        SCOPE_IDENTITY() AS JobId,
        'Internal Job Created Successfully' AS Message;
END
GO
--USP_InternalJob_Update
CREATE OR ALTER PROCEDURE USP_InternalJob_Update
(
    @JobId INT,
    @Title VARCHAR(500)=NULL,
    @Description VARCHAR(MAX)=NULL,
    @Location VARCHAR(200)=NULL,
    @Department VARCHAR(200)=NULL,
    @EmploymentType VARCHAR(100)=NULL,
    @ApplicationDeadline DATETIME=NULL,
    @Status VARCHAR(20)=NULL,
    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE InternalJob
    SET
          Title = ISNULL(@Title, Title)
        , Description = ISNULL(@Description, Description)
        , Location = ISNULL(@Location, Location)
        , Department = ISNULL(@Department, Department)
        , EmploymentType = ISNULL(@EmploymentType, EmploymentType)
        , ApplicationDeadline = ISNULL(@ApplicationDeadline, ApplicationDeadline)
        , Status = ISNULL(@Status, Status)
        , UpdatedBy = @UpdatedBy
        , UpdatedDate = GETDATE()
    WHERE JobId = @JobId;

    SELECT
        'Internal Job Updated Successfully' AS Message;
END
GO
--USP_InternalJob_CheckDuplicate
CREATE OR ALTER PROCEDURE USP_InternalJob_CheckDuplicate
(
    @Title VARCHAR(500),
    @Location VARCHAR(200)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        JobId,
        Title,
        Location
    FROM InternalJob
    WHERE Title = @Title
      AND Location = @Location;
END
GO
--USP_InternalJob_Delete
CREATE OR ALTER PROCEDURE USP_InternalJob_Delete
(
    @JobId INT,
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM InternalJob
    WHERE JobId = @JobId;

    SELECT
        'Internal Job Deleted Successfully' AS Message;
END
GO
--USP_InternalJob_GetAll
CREATE OR ALTER PROCEDURE USP_InternalJob_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          JobId
        , Title
        , Description
        , Location
        , Department
        , EmploymentType
        , ApplicationDeadline
        , Status
        , CreatedBy
        , CreatedDate
    FROM InternalJob
    ORDER BY CreatedDate DESC;
END
GO
--USP_InternalJob_GetActive
CREATE OR ALTER PROCEDURE USP_InternalJob_GetActive
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          JobId
        , Title
        , Description
        , Location
        , Department
        , EmploymentType
        , ApplicationDeadline
        , Status
        , CreatedDate
    FROM InternalJob
    WHERE Status = 'ACTIVE'
    ORDER BY CreatedDate DESC;
END
GO
--USP_InternalJob_GetById
CREATE OR ALTER PROCEDURE USP_InternalJob_GetById
(
    @JobId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          JobId
        , Title
        , Description
        , Location
        , Department
        , EmploymentType
        , ApplicationDeadline
        , Status
        , CreatedBy
        , UpdatedBy
        , CreatedDate
        , UpdatedDate
    FROM InternalJob
    WHERE JobId = @JobId;
END
GO
--USP_SystemConfig_Create
CREATE OR ALTER PROCEDURE USP_SystemConfig_Create
(
    @GracePeriod INT = NULL,
    @ShiftStartTime VARCHAR(20) = NULL,
    @ShiftEndTime VARCHAR(20) = NULL,
    @AutoPunchOutTime VARCHAR(20) = NULL,
    @WeekOffDays VARCHAR(MAX) = NULL,
    @OvertimeRate DECIMAL(10,2) = NULL,
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @ConfigKey VARCHAR(100);

    SET @ConfigKey =
        'CONFIG-' +
        CAST(YEAR(GETDATE()) AS VARCHAR(4)) +
        '-' +
        RIGHT(
            '00000' +
            CAST(
                ISNULL(
                    (SELECT MAX(ConfigId) + 1 FROM SystemConfig),
                    1
                ) AS VARCHAR
            ),
            5
        );

    INSERT INTO SystemConfig
    (
        ConfigKey,
        GracePeriod,
        ShiftStartTime,
        ShiftEndTime,
        AutoPunchOutTime,
        WeekOffDays,
        OvertimeRate,
        CreatedBy
    )
    VALUES
    (
        @ConfigKey,
        @GracePeriod,
        @ShiftStartTime,
        @ShiftEndTime,
        @AutoPunchOutTime,
        @WeekOffDays,
        @OvertimeRate,
        @CreatedBy
    );

    SELECT
        SCOPE_IDENTITY() AS ConfigId,
        @ConfigKey AS ConfigKey,
        'Configuration Created Successfully' AS Message;
END
GO
--USP_SystemConfig_Update
CREATE OR ALTER PROCEDURE USP_SystemConfig_Update
(
    @ConfigKey VARCHAR(100),

    @GracePeriod INT = NULL,
    @ShiftStartTime VARCHAR(20) = NULL,
    @ShiftEndTime VARCHAR(20) = NULL,
    @AutoPunchOutTime VARCHAR(20) = NULL,
    @WeekOffDays VARCHAR(MAX) = NULL,
    @OvertimeRate DECIMAL(10,2) = NULL,

    @UpdatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE SystemConfig
    SET
        GracePeriod = ISNULL(@GracePeriod, GracePeriod),
        ShiftStartTime = ISNULL(@ShiftStartTime, ShiftStartTime),
        ShiftEndTime = ISNULL(@ShiftEndTime, ShiftEndTime),
        AutoPunchOutTime = ISNULL(@AutoPunchOutTime, AutoPunchOutTime),
        WeekOffDays = ISNULL(@WeekOffDays, WeekOffDays),
        OvertimeRate = ISNULL(@OvertimeRate, OvertimeRate),
        UpdatedBy = @UpdatedBy,
        UpdatedDate = GETDATE()
    WHERE ConfigKey = @ConfigKey;

    SELECT 'Configuration Updated Successfully' AS Message;
END
GO
--USP_SystemConfig_GetActive
CREATE OR ALTER PROCEDURE USP_SystemConfig_GetActive
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1 *
    FROM SystemConfig
    ORDER BY ConfigId DESC;
END
GO
--USP_SystemConfig_Delete
CREATE OR ALTER PROCEDURE USP_SystemConfig_Delete
(
    @ConfigKey VARCHAR(100),
    @DeletedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE SystemConfig
    SET
        DeletedBy = @DeletedBy,
        UpdatedDate = GETDATE()
    WHERE ConfigKey = @ConfigKey;

    SELECT 'Configuration Deleted Successfully' AS Message;
END
GO
--USP_SystemConfig_GetAll
CREATE OR ALTER PROCEDURE USP_SystemConfig_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
          ConfigId
        , ConfigKey
        , GracePeriod
        , ShiftStartTime
        , ShiftEndTime
        , AutoPunchOutTime
        , WeekOffDays
        , OvertimeRate
        , CreatedBy
        , UpdatedBy
        , DeletedBy
        , CreatedDate
        , UpdatedDate
    FROM SystemConfig
    ORDER BY ConfigId DESC;
END
GO
--USP_SystemConfig_GetByKey
CREATE OR ALTER PROCEDURE USP_SystemConfig_GetByKey
(
    @ConfigKey VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM SystemConfig
    WHERE ConfigKey = @ConfigKey;
END
GO
--USP_TaxReport_Generate
CREATE OR ALTER PROCEDURE USP_TaxReport_Generate
(
    @ReportType VARCHAR(20),
    @Component VARCHAR(20),
    @Month INT = NULL,
    @Year INT,
    @GeneratedBy VARCHAR(12),
    @GeneratedAt DATETIME = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO TaxReport
    (
        ReportType,
        Component,
        Month,
        Year,
        GeneratedBy,
        GeneratedAt
    )
    VALUES
    (
        @ReportType,
        @Component,
        @Month,
        @Year,
        @GeneratedBy,
        ISNULL(@GeneratedAt,GETDATE())
    );

    SELECT
        SCOPE_IDENTITY() AS TaxReportId,
        'Tax Report Generated Successfully' AS Message;
END
GO
--USP_TaxReport_GetAll
CREATE OR ALTER PROCEDURE USP_TaxReport_GetAll
(
    @Component VARCHAR(20)=NULL,
    @ReportType VARCHAR(20)=NULL,
    @Year INT=NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM TaxReport
    WHERE
        (@Component IS NULL OR Component = @Component)
        AND (@ReportType IS NULL OR ReportType = @ReportType)
        AND (@Year IS NULL OR Year = @Year)
    ORDER BY GeneratedAt DESC;
END
GO
--USP_TaxReport_GetById
CREATE OR ALTER PROCEDURE USP_TaxReport_GetById
(
    @ReportId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM TaxReport
    WHERE TaxReportId = @ReportId;
END
GO
--USP_TaxReport_Export
CREATE OR ALTER PROCEDURE USP_TaxReport_Export
(
    @ReportId INT,
    @Format VARCHAR(20)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TaxReportId,
        ReportType,
        Component,
        Month,
        Year,
        FilingStatus,
        ReportPath,
        @Format AS ExportFormat
    FROM TaxReport
    WHERE TaxReportId = @ReportId;
END
GO
--USP_TaxReport_UpdateFilingStatus
CREATE OR ALTER PROCEDURE USP_TaxReport_UpdateFilingStatus
(
    @ReportId INT,
    @FilingStatus VARCHAR(20),
    @FilingDate DATETIME = NULL,
    @UpdatedBy VARCHAR(12),
    @UpdatedAt DATETIME = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE TaxReport
    SET
        FilingStatus = @FilingStatus,
        FilingDate = @FilingDate,
        UpdatedBy = @UpdatedBy,
        UpdatedAt = ISNULL(@UpdatedAt,GETDATE())
    WHERE TaxReportId = @ReportId;

    SELECT
        'Filing Status Updated Successfully' AS Message;
END
GO
--USP_TaxReport_GetComplianceDeadlines
CREATE OR ALTER PROCEDURE USP_TaxReport_GetComplianceDeadlines
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        TaxReportId,
        ReportType,
        Component,
        Month,
        Year,
        FilingStatus,
        FilingDate
    FROM TaxReport
    WHERE FilingStatus IN
    (
        'PENDING',
        'OVERDUE'
    )
    ORDER BY Year DESC, Month DESC;
END
GO
--USP_AuditLog_Create
CREATE OR ALTER PROCEDURE USP_AuditLog_Create
(
    @Emp_Id VARCHAR(12),
    @ModuleName VARCHAR(100),
    @ActionType VARCHAR(100),
    @Description VARCHAR(1000) = NULL,
    @CreatedBy VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Audit_Logs
    (
        Emp_Id,
        ModuleName,
        ActionType,
        Description,
        CreatedBy
    )
    VALUES
    (
        @Emp_Id,
        @ModuleName,
        @ActionType,
        @Description,
        @CreatedBy
    );

    SELECT
        SCOPE_IDENTITY() AS AuditId,
        'Audit Log Created Successfully' AS Message;
END
GO
--USP_AuditLog_GetAll
CREATE OR ALTER PROCEDURE USP_AuditLog_GetAll
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Audit_Logs
    ORDER BY CreatedAt DESC;
END
GO
--USP_AuditLog_GetByEmployee
CREATE OR ALTER PROCEDURE USP_AuditLog_GetByEmployee
(
    @Emp_Id VARCHAR(12)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Audit_Logs
    WHERE Emp_Id = @Emp_Id
    ORDER BY CreatedAt DESC;
END
GO
--USP_AuditLog_GetByModule
CREATE OR ALTER PROCEDURE USP_AuditLog_GetByModule
(
    @ModuleName VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Audit_Logs
    WHERE ModuleName = @ModuleName
    ORDER BY CreatedAt DESC;
END
GO
--USP_AuditLog_GetByDateRange
CREATE OR ALTER PROCEDURE USP_AuditLog_GetByDateRange
(
    @FromDate DATETIME,
    @ToDate DATETIME
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Audit_Logs
    WHERE CreatedAt BETWEEN @FromDate AND @ToDate
    ORDER BY CreatedAt DESC;
END
GO
--USP_AuditLog_DeleteOldLogs
CREATE OR ALTER PROCEDURE USP_AuditLog_DeleteOldLogs
(
    @DaysToKeep INT = 365
)
AS
BEGIN
    SET NOCOUNT ON;

    DELETE
    FROM Audit_Logs
    WHERE CreatedAt < DATEADD(DAY, -@DaysToKeep, GETDATE());

    SELECT
        'Old Audit Logs Deleted Successfully' AS Message;
END
GO