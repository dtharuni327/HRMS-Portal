import sql from "mssql";
import { db } from "../../config/db";

export const getLeaveNotificationsRepository =
async (
  user: any
) => {

  const pool =
    await db;

  return await pool
    .request()
    .input(
      "Emp_id",
      sql.VarChar,
      user.Emp_id
    )
    .execute(
      "SP_Leave_Notifications"
    );

};