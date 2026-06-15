import { db } from "../../config/db";
export const getUsedHolidayRepository = async () => {
  const pool = await db;
  return await pool
    .request()
    .execute("SP_Get_Used_Holidays");
};