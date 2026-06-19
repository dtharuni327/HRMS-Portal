import { db } from "../../config/db";

export const getDepartmentsRepository = async () => {
  const pool = await db;
  return await pool
    .request()
    .execute("USP_Department_Get");
};