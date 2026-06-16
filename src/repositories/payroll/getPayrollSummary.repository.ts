import sql from 'mssql';
import { db } from '../../config/db';

export interface GetPayrollSummaryInput {
  month?: string;
  year?: string;
}

export const getPayrollSummaryRepository = async (data: GetPayrollSummaryInput) => {
  const pool = await db;
  const request = new sql.Request(pool);

  const month = data.month ? parseInt(data.month) : new Date().getMonth() + 1;
  const year = data.year ? parseInt(data.year) : new Date().getFullYear();

  request.input("month", sql.Int, month);
  request.input("year", sql.Int, year);

  const result = await request.execute("sp_GetPayrollSummary");
  return result.recordset[0];
};