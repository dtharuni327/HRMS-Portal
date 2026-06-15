import { db } from "../../config/db";
export const getTotalHolidayRepository = async () => {
  const pool = await db;
  return await pool
    .request()
    .execute("USP_Get_Total_Holidays");
};