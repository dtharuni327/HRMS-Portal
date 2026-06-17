import {db} from "../../config/db";

export const getProjectEfforts = async () => {
  const pool = await db;

  const result = await pool
    .request()
    .execute("sp_GetProjectEfforts");

  return result.recordset;
};