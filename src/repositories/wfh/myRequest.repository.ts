import { db } from '../../config/db';
import sql from 'mssql';

export const getMyWFHRequests = async (empId: string) => {
  const pool = await db;
  const result = await pool
    .request()
    .input('Emp_id', sql.VarChar(10), empId)
    .execute('GetMyWFHRequests');
  
  return result.recordset;
};