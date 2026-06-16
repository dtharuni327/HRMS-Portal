CREATE PROCEDURE USP_Leave_Request
(
    @Emp_id VARCHAR(50),
    @LeaveType VARCHAR(100),
    @FromDate DATE,
    @ToDate DATE,
    @Reason VARCHAR(500)
)
AS
BEGIN
    INSERT INTO Leaves
    (
        Emp_id,
        Leave_Type,
        From_Date,
        To_Date,
        Reason,
        Status,
        Created_At
    )
    VALUES
    (
        @Emp_id,
        @LeaveType,
        @FromDate,
        @ToDate,
        @Reason,
        'PENDING',
        GETDATE()
    );
    SELECT
        'SUCCESS' AS Status,
        'Leave applied successfully'
        AS Message;
END