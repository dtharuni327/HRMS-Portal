CREATE PROCEDURE USP_Holiday_Get
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        Holiday_Id,
        Holiday_Name,
        Holiday_Date,
        Client_Id,
        Region
    FROM Holidays
    ORDER BY Holiday_Date ASC;
END