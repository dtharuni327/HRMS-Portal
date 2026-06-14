import { db } from "../../config/db";
import sql from "mssql";

export interface PunchInInput {
  Emp_id: string;
  latitude?: number;
  longitude?: number;
}

export const punchInRepository = async (data: PunchInInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  const punchInTime = new Date();

  request.input("Emp_id", sql.VarChar(10), data.Emp_id);
  request.input("PunchInTime", sql.DateTime, punchInTime);
  request.input("Latitude", sql.Decimal(10, 6), data.latitude || null);
  request.input("Longitude", sql.Decimal(10, 6), data.longitude || null);

  const result = await request.execute("sp_PunchIn");

  return result.recordset[0];
};