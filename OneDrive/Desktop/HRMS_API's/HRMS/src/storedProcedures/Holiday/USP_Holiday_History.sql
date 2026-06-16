CREATE PROCEDURE USP_Holiday_History
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        Holiday_Id,
        Holiday_Name,
        Holiday_Date,
        Client_Id,
        Region,
        Created_At
    FROM Holidays
    ORDER BY Created_At DESC;
END