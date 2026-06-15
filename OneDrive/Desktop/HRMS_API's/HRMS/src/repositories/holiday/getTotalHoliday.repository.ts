import { db } from "../../config/db";
export const getTotalHolidayRepository = async () => {
  const pool = await db;
  return await pool
    .request()
    .execute("SP_Get_Total_Holidays");
};