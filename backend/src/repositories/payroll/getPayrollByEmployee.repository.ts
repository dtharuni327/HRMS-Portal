import sql from 'mssql';
import { db } from '../../config/db';

export interface GetPayrollByEmployeeInput {
  month?: string;
  year?: string;
}

export const getPayrollByEmployeeRepository = async (employee_id: string, data: GetPayrollByEmployeeInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("employee_id", sql.VarChar(10), employee_id);
  request.input("month", sql.Int, data.month ? parseInt(data.month) : null);
  request.input("year", sql.Int, data.year ? parseInt(data.year) : null);

  const result = await request.execute("sp_GetPayrollByEmployee");
  return result.recordset;
};