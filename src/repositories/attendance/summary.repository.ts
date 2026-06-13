import { db } from "../../config/db";
import sql from "mssql";

export const getAttendanceSummary = async (
  empId: string,
  month: number,
  year: number
): Promise<any[]> => {
  const pool = await db;

  const result = await pool
    .request()
    .input("Emp_id", sql.VarChar, empId)
    .input("month", sql.Int, month)
    .input("year", sql.Int, year)
    .execute("GetAttendanceSummary");

  return result.recordsets as any[];
};