import { db } from '../../config/db';
import sql from 'mssql';

export class UpdateAttendanceRepository {
  async getAttendanceByEmpDate(empId: string, date: Date) {
    const pool = await db;
    const result = await pool
      .request()
      .input('Emp_id', sql.VarChar, empId)
      .input('date', sql.Date, date)
      .execute('GetAttendanceByEmpDate');
    
    return result.recordset[0] || null;
  }

  async updateAttendance(params: {
    empId: string;
    date: Date;
    punchInTime: string | null;
    punchOutTime: string | null;
    totalHours: number;
    punchInStatus: string;
    attendanceStatus: string;
  }) {
    const pool = await db;
    await pool
      .request()
      .input('Emp_id', sql.VarChar, params.empId)
      .input('date', sql.Date, params.date)
      .input('punch_in_time', sql.VarChar, params.punchInTime)
      .input('punch_out_time', sql.VarChar, params.punchOutTime)
      .input('total_hours', sql.Decimal(10, 2), params.totalHours)
      .input('punch_in_status', sql.VarChar, params.punchInStatus)
      .input('attendance_status', sql.VarChar, params.attendanceStatus)
      .execute('sp_UpdateAttendanceRecord');
  }
}

export const updateAttendanceRepository = new UpdateAttendanceRepository();