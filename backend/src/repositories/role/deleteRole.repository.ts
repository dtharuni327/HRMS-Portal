import sql from "mssql";
import { db } from "../../config/db";

export const deleteRoleRepository = async (id: number, user: any) => {
  const pool = await db;
  return await pool
    .request()
    .input("RoleId", sql.Int, id)
    .input("DeletedBy", sql.VarChar, user.Emp_id)
    .execute("USP_Role_Delete");
};