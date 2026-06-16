CREATE PROCEDURE USP_Email_Verification
(
    @Email VARCHAR(150),
    @OTP VARCHAR(10)
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
            IsVerified=1,
            OTP=NULL
        WHERE Email=@Email;
    END
    ELSE
    BEGIN
        RAISERROR(
        'Invalid OTP',
        16,
        1
        );
    END
END