import { db } from '../../config/db';
import sql from 'mssql';

export const updateWFHStatus = async (params: {
  empId: string;
  status: string;
  approvedBy: string;
}) => {
  const pool = await db;
  const result = await pool
    .request()
    .input('Emp_id', sql.VarChar, params.empId)
    .input('status', sql.VarChar, params.status)
    .input('approved_by', sql.VarChar, params.approvedBy)
    .execute('UpdateWFHStatus');
  
  return result.recordset[0] || null;
};