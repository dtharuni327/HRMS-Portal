CREATE PROCEDURE USP_Get_Total_Holidays
AS
BEGIN
    SELECT
        COUNT(*) AS TotalHolidays
    FROM Holidays
    WHERE YEAR(HolidayDate) = YEAR(GETDATE());
END
GO