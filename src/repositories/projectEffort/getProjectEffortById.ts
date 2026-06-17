import sql from "mssql";
import {db} from "../../config/db";

export const getProjectEffortById = async (effortId: number) => {
  const pool = await db;

  const result = await pool
  
    .request()
    .input("EffortId", sql.Int, effortId)
    .execute("sp_GetProjectEffortById");

  return result.recordset[0];
};