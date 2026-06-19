import { db } from "../../config/db";
export const getRemainingHolidayRepository = async () => {
  const pool = await db;
  return await pool
    .request()
    .execute("SP_Get_Remaining_Holidays");
};