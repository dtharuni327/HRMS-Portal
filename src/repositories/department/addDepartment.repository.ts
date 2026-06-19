import sql from "mssql";
import { db } from "../../config/db";

export const createDepartmentRepository = async (data: any, user: any) => {
  const pool = await db;
  return await pool
    .request()
    .input("DepartmentName", sql.VarChar, data.departmentName)
    .input("CreatedBy", sql.VarChar, user.Emp_id)
    .execute("USP_Department_Create");
};