CREATE PROCEDURE USP_Login
(
    @UserName VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        Emp_id,
        UserName,
        Email,
        PasswordHash,
        Role,
        IsVerified
    FROM Users
    WHERE UserName = @UserName;
END