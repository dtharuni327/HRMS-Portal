import sql from "mssql";
import { db } from "../../config/db";

export const updateNotificationVisibilityRepository =
async (
  data: any,
  user: any
) => {

  const pool =
    await db;

  return await pool
    .request()
    .input(
      "NotificationId",
      sql.Int,
      data.notification_id
    )
    .input(
      "Emp_id",
      sql.VarChar,
      user.Emp_id
    )
    .execute(
      "SP_Notification_Visibility_Update"
    );

};