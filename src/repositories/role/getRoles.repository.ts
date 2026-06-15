import sql from "mssql";
import { db } from "../../config/db";

export const getRolesRepository = async (departmentId?: number) => {
  const pool = await db;
  const request = pool.request();
  
  if (departmentId !== undefined && departmentId !== null && !isNaN(departmentId)) {
    request.input("DepartmentId", sql.Int, departmentId);
  }
  
  return await request.execute("USP_Role_Get");
};