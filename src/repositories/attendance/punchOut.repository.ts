import { db } from "../../config/db";
import sql from "mssql";

export interface PunchOutInput {
  Emp_id: string;
}

export const punchOutRepository = async (data: PunchOutInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  const punchOutTime = new Date();

  request.input("Emp_id", sql.VarChar(10), data.Emp_id);
  request.input("PunchOutTime", sql.DateTime, punchOutTime);

  const result = await request.execute("USP_PunchOut");

  return result.recordset[0];
};