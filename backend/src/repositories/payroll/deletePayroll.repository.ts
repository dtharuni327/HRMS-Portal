import sql from 'mssql';
import { db } from '../../config/db';

export const deletePayrollRepository = async (Emp_id: string, month: number, year: number) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("Emp_id", sql.VarChar(10), Emp_id);
  request.input("month", sql.Int, month);
  request.input("year", sql.Int, year);

  await request.execute("sp_DeletePayroll");
  return { success: true };
};