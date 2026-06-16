CREATE PROCEDURE USP_Leave_Get
(
    @Emp_id VARCHAR(50),
    @Role VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;
    IF UPPER(@Role) IN
    (
        'SUPER_ADMIN',
        'HR_ADMIN',
        'MANAGER'
    )
    BEGIN
        SELECT *
        FROM Leaves
        ORDER BY Created_At DESC;
    END
    ELSE
    BEGIN
        SELECT *
        FROM Leaves
        WHERE Emp_id = @Emp_id
        ORDER BY Created_At DESC;
    END
END