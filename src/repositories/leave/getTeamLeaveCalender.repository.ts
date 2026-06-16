import { db } from "../../config/db";
export const getTeamLeaveCalendarRepository =
async (month?: number, year?: number) => {
  const pool = await db;
  return await pool
    .request()
    .input("Month", month || null)
    .input("Year", year || null)
    .execute("SP_GetTeamLeaveCalendar");
};