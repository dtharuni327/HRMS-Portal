CREATE PROCEDURE USP_Leave_Update
(
    @Emp_id VARCHAR(50),
    @Status VARCHAR(20),
    @ApprovedBy VARCHAR(50)
)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE Leaves
    SET
        Status = @Status,
        Approved_By = @ApprovedBy,
        Approved_At = GETDATE()
    WHERE Emp_id = @Emp_id;
    SELECT
        'SUCCESS' AS Status,
        'Leave updated successfully'
        AS Message;
END