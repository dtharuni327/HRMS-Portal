import { db } from '../../config/db';
import sql from 'mssql';

export const createWFHRequest = async (params: {
  empId: string;
  from_date: Date;
  to_date: Date;
  reason: string;
}) => {
  const pool = await db;
  const result = await pool
    .request()
    .input('Emp_id', sql.VarChar, params.empId)
    .input('from_date', sql.Date, params.from_date)
    .input('to_date', sql.Date, params.to_date)
    .input('reason', sql.VarChar, params.reason)
    .execute('CreateWFHRequest');
  
  return result.recordset[0] || null;
};