import sql from "mssql";
import { db } from "../../config/db";

export const getAllLeavesRepository =
async (
  user: any
) => {

  const pool = await db;

  return await pool
    .request()
    .input(
      "Emp_id",
      sql.VarChar,
      user.Emp_id
    )
    .input(
      "Role",
      sql.VarChar,
      user.role
    )
    .execute(
      "SP_Leave_Get"
    );
};