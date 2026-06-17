import sql from "mssql";
import { db } from "../../config/db";

export const updateDepartmentRepository = async (id: number, data: any, user: any) => {
  const pool = await db;
  return await pool
    .request()
    .input("DepartmentId", sql.Int, id)
    .input("DepartmentName", sql.VarChar, data.departmentName)
    .input("UpdatedBy", sql.VarChar, user.Emp_id)
    .execute("USP_Department_Update");
};