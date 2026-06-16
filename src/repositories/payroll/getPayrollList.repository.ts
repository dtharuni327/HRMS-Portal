import sql from 'mssql';
import { db } from '../../config/db';

export interface GetPayrollListInput {
  month?: string;
  year?: string;
  status?: string;
  employee_id?: string;
}

export const getPayrollListRepository = async (data: GetPayrollListInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("month", sql.Int, data.month ? parseInt(data.month) : null);
  request.input("year", sql.Int, data.year ? parseInt(data.year) : null);
  request.input("status", sql.VarChar(20), data.status || null);
  request.input("employee_id", sql.VarChar(10), data.employee_id || null);

  const result = await request.execute("sp_GetPayrollList");
  return result.recordset;
};