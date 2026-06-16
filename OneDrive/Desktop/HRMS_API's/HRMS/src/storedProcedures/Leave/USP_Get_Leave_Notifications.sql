CREATE PROCEDURE USP_Get_Leave_Notifications
(
    @Emp_id VARCHAR(50),
    @Role VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;
    IF UPPER(@Role)
    IN
    (
        'SUPER_ADMIN',
        'HR_ADMIN',
        'MANAGER'
    )
    BEGIN
        SELECT
            Leave_Id,
            Emp_id,
            Leave_Type,
            Status,
            Created_At
        FROM Leaves
        WHERE Status = 'PENDING'
        ORDER BY Created_At DESC;
    END
    ELSE
    BEGIN
        SELECT
            Leave_Id,
            Leave_Type,
            Status,
            Approved_At
        FROM Leaves
        WHERE Emp_id = @Emp_id
        AND Status IN
        (
            'APPROVED',
            'REJECTED'
        )
        ORDER BY Approved_At DESC;
    END
END