import sql from "mssql";
import { db } from "../../config/db";

export const updateRoleRepository = async (id: number, data: any, user: any) => {
  const pool = await db;
  return await pool
    .request()
    .input("RoleId", sql.Int, id)
    .input("RoleName", sql.VarChar, data.roleName)
    .input("DepartmentId", sql.Int, data.departmentId)
    .input("UpdatedBy", sql.VarChar, user.Emp_id)
    .execute("USP_Role_Update");
};