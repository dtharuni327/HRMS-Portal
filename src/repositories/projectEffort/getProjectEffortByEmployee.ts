import sql from "mssql";
import {db} from "../../config/db";

export const getProjectEffortByEmployee = async (empId: string) => {
  const pool = await db;

  const result = await pool
    .request()
    .input("Emp_id", sql.VarChar(12), empId)
    .execute("sp_GetProjectEffortByEmployee");

  return result.recordset;
};