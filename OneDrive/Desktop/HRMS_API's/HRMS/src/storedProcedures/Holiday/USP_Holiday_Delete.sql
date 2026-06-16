CREATE PROCEDURE USP_Holiday_Delete
(
    @ClientId INT
)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM Holidays
    WHERE Client_Id =
          @ClientId;
END