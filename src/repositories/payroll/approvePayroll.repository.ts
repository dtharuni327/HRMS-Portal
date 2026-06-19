import sql from 'mssql';
import { db } from '../../config/db';

export const approvePayrollRepository = async (Emp_id: string, month: number, year: number, approved_by: string) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("Emp_id", sql.VarChar(10), Emp_id);
  request.input("month", sql.Int, month);
  request.input("year", sql.Int, year);
  request.input("approved_by", sql.VarChar(10), approved_by);

  await request.execute("sp_ApprovePayroll");
  return { success: true };
};