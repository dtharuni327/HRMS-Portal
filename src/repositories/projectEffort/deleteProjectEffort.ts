import sql from "mssql";
import {db} from "../../config/db";

export const deleteProjectEffort = async (effortId: number) => {
  const pool = await db;

  const result = await pool
    .request()
    .input("EffortId", sql.Int, effortId)
    .execute("sp_DeleteProjectEffort");

  return result.recordset[0];
};