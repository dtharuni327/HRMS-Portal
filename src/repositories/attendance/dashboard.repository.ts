import { db } from "../../config/db";
import sql from "mssql";
import { getISTDate } from "../../utils/datetime";

export const getDashboardData = async () => {
  const pool = await db;
  const today = getISTDate();

  const result = await pool
    .request()
    .input("today", sql.Date, today)
    .execute("sp_GetAttendanceDashboard");

  return result.recordset[0];
};