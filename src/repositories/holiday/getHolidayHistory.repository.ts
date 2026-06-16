import { db } from "../../config/db";
export const getHolidayHistoryRepository =async () => {
    const pool =
      await db;
    return await pool
      .request()
      .execute(
        "SP_Holiday_History"
      );
};