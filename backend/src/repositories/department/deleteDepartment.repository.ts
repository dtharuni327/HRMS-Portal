import sql from "mssql";
import { db } from "../../config/db";

export const deleteDepartmentRepository = async (id: number, user: any) => {
  const pool = await db;
  return await pool
    .request()
    .input("DepartmentId", sql.Int, id)
    .input("DeletedBy", sql.VarChar, user.Emp_id)
    .execute("USP_Department_Delete");
};