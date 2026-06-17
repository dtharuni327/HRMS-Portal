import sql from 'mssql';
import { db } from '../../config/db';

export interface CreatePayrollInput {
  Emp_id: string;
  month: number;
  year: number;
  basic_salary: number;
  allowances?: number;
  bonus?: number;
  penalty?: number;
  tax?: number;
}

export const createPayrollRepository = async (data: CreatePayrollInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  const net_salary = data.basic_salary + (data.allowances || 0) + (data.bonus || 0) - (data.penalty || 0) - (data.tax || 0);

  request.input("Emp_id", sql.VarChar(10), data.Emp_id);
  request.input("month", sql.Int, data.month);
  request.input("year", sql.Int, data.year);
  request.input("basic_salary", sql.Decimal(10, 2), data.basic_salary);
  request.input("allowances", sql.Decimal(10, 2), data.allowances || 0);
  request.input("bonus", sql.Decimal(10, 2), data.bonus || 0);
  request.input("penalty", sql.Decimal(10, 2), data.penalty || 0);
  request.input("tax", sql.Decimal(10, 2), data.tax || 0);
  request.output("payroll_id", sql.Int);

  await request.execute("sp_CreatePayroll");
  
  const payroll_id = request.parameters.payroll_id.value;
  return payroll_id;
};