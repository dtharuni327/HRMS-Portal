import sql from 'mssql';
import { db } from '../../config/db';

export interface GetPayrollOwnInput {
  month?: string;
  year?: string;
}

export const getPayrollOwnRepository = async (Emp_id: string, data: GetPayrollOwnInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("Emp_id", sql.VarChar(10), Emp_id);
  request.input("month", sql.Int, data.month ? parseInt(data.month) : null);
  request.input("year", sql.Int, data.year ? parseInt(data.year) : null);

  const result = await request.execute("sp_GetPayrollOwn");
  return result.recordset;
};