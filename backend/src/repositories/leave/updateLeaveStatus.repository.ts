import sql from "mssql";
import { db } from "../../config/db";

export const updateLeaveStatusRepository =
async (
  data: any,
  user: any
) => {
  const pool =
    await db;

  return await pool
    .request()
    .input(
      "LeaveId",
      sql.Int,
      data.leave_id
    )
    .input(
      "Status",
      sql.VarChar,
      data.status
    )
    .input(
      "UpdatedBy",
      sql.VarChar,
      user.Emp_id
    )
    .execute(
      "USP_Leave_Status_Update"
    );

};