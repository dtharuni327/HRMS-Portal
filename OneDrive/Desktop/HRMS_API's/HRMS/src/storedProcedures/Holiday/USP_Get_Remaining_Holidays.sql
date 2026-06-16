CREATE PROCEDURE USP_Get_Remaining_Holidays
AS
BEGIN
    SELECT
        HolidayId,
        HolidayName,
        HolidayDate
    FROM Holidays
    WHERE HolidayDate >= CAST(GETDATE() AS DATE)
    ORDER BY HolidayDate ASC;
END
GO