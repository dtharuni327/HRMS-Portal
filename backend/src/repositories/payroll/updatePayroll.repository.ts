import sql from 'mssql';
import { db } from '../../config/db';

export interface UpdatePayrollInput {
  basic_salary?: number;
  allowances?: number;
  bonus?: number;
  penalty?: number;
  tax?: number;
  status?: string;
}

export const updatePayrollRepository = async (Emp_id: string, month: number, year: number, data: UpdatePayrollInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("Emp_id", sql.VarChar(10), Emp_id);
  request.input("month", sql.Int, month);
  request.input("year", sql.Int, year);
  request.input("basic_salary", sql.Decimal(10, 2), data.basic_salary || null);
  request.input("allowances", sql.Decimal(10, 2), data.allowances || null);
  request.input("bonus", sql.Decimal(10, 2), data.bonus || null);
  request.input("penalty", sql.Decimal(10, 2), data.penalty || null);
  request.input("tax", sql.Decimal(10, 2), data.tax || null);
  request.input("status", sql.VarChar(20), data.status || null);

  await request.execute("sp_UpdatePayroll");
  return { success: true };
};