import sql from "mssql";
import { db } from "../../config/db";

export const applyLeaveRepository =
async (
  data: any,
  user: any
) => {

  const pool = await db;

  return await pool
    .request()
    .input("Emp_id", sql.VarChar, user.Emp_id)
    .input("LeaveType", sql.VarChar, data.leave_type)
    .input("FromDate", sql.Date, data.from_date)
    .input("ToDate", sql.Date, data.to_date)
    .input("Reason", sql.VarChar, data.reason)
    .execute("SP_Leave_Request");

};