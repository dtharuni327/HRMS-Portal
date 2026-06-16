CREATE PROCEDURE USP_Refresh_Token
(
    @Emp_id VARCHAR(20),
    @RefreshToken VARCHAR(MAX)
)
AS
BEGIN
    UPDATE Users
    SET
        RefreshToken=@RefreshToken
    WHERE Emp_id=@Emp_id;
END