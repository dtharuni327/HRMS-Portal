CREATE PROCEDURE USP_Reset_Password
(
    @Email VARCHAR(150),
    @OTP VARCHAR(10),
    @Password VARCHAR(MAX)
)
AS
BEGIN
    IF EXISTS
    (
        SELECT 1
        FROM Users
        WHERE Email=@Email
        AND OTP=@OTP
    )
    BEGIN
        UPDATE Users
        SET
            PasswordHash=@Password,
            OTP=NULL
        WHERE Email=@Email;
    END
    ELSE
    BEGIN
        RAISERROR(
        'Invalid OTP',16,1);
    END
END