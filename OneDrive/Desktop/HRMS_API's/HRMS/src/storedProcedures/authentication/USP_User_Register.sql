CREATE PROCEDURE USP_User_Register
(
    @Emp_id VARCHAR(20),
    @UserName VARCHAR(100),
    @Email VARCHAR(150),
    @Password VARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS
    (
        SELECT 1
        FROM Users
        WHERE Email = @Email
    )
    BEGIN
        RAISERROR(
        'Email already exists',
        16,
        1
        );
        RETURN;
    END
    INSERT INTO Users
    (
        Emp_id,
        UserName,
        Email,
        PasswordHash,
        IsVerified,
        CreatedAt
    )
    VALUES
    (
        @Emp_id,
        @UserName,
        @Email,
        @Password,
        0,
        GETDATE()
    );
END