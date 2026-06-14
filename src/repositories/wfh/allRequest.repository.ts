import { db } from '../../config/db';
import sql from 'mssql';

export const getAllWFHRequests = async (empId: string, role: string) => {
  const pool = await db;
  const result = await pool
    .request()
    .input('Emp_id', sql.VarChar(10), empId)
    .input('Role', sql.VarChar(50), role)
    .execute('sp_GetAllWFHRequests');
  
  return result.recordset;
};