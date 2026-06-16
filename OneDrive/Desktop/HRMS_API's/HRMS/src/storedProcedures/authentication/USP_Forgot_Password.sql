CREATE PROCEDURE USP_Forgot_Password
(
    @Email VARCHAR(150),
    @OTP VARCHAR(10)
)
AS
BEGIN
    UPDATE Users
    SET
        OTP = @OTP,
        OTPCreatedAt = GETDATE()
    WHERE Email = @Email;
END