import { db } from "../../config/db";
export const getHolidayRepository =async () => {
    const pool =await db;
    return await pool
      .request()
      .execute("SP_Holiday_Get");
};