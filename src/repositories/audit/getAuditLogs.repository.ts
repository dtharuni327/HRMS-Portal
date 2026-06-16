import { db } from "../../config/db";
export const getAuditLogsRepository =
async () => {
  const pool = await db;
  return await pool
    .request()
    .query(`
      SELECT *
      FROM audit_logs
      ORDER BY created_at DESC
    `);
};