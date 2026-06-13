import { db } from "../../config/db";
import sql from "mssql";

export const getAttendanceHistory = async (
  empId: string,
  page: number,
  limit: number
): Promise<{ total: number; records: any[]; error?: string }> => {
  const pool = await db;

  const result = await pool
    .request()
    .input("Emp_id", sql.VarChar, empId)
    .input("page", sql.Int, page)
    .input("limit", sql.Int, limit)
    .execute("GetAttendanceHistory");

  const recordsets = result.recordsets as any[];
  const firstRow = recordsets[0][0];

  return {
    total: firstRow.total,
    records: recordsets[1],
    error: firstRow.error,
  };
};