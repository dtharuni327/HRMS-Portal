CREATE PROCEDURE USP_Holiday_Create
(
    @HolidayName VARCHAR(200),
    @HolidayDate DATE,
    @ClientId INT,
    @Region VARCHAR(100)
)
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Holidays
    (
        Holiday_Name,
        Holiday_Date,
        Client_Id,
        Region
    )
    VALUES
    (
        @HolidayName,
        @HolidayDate,
        @ClientId,
        @Region
    );
    SELECT
        'SUCCESS' AS Status,
        'Holiday added successfully'
        AS Message;
END