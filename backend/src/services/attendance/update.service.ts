import { updateAttendanceRepository } from '../../repositories/attendance/update.repository';
import { ATTENDANCE_STATUS, PUNCH_IN_STATUS } from '../../constants/attendance.constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const IST_TIMEZONE = 'Asia/Kolkata';

export class UpdateAttendanceService {
  async updateAttendance(empId: string, date: string, body: {
    punch_in_time?: string;
    punch_out_time?: string;
  }) {
    const attendance = await updateAttendanceRepository.getAttendanceByEmpDate(empId, new Date(date));

    if (!attendance) {
      throw new Error('Attendance not found');
    }

    const existingPunchIn = attendance.punch_in_time
      ? new Date(attendance.punch_in_time).toISOString().replace('T', ' ').substring(0, 19)
      : null;

    const existingPunchOut = attendance.punch_out_time
      ? new Date(attendance.punch_out_time).toISOString().replace('T', ' ').substring(0, 19)
      : null;

    const punchIn = body.punch_in_time
      ? dayjs.tz(body.punch_in_time, IST_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
      : existingPunchIn;

    const punchOut = body.punch_out_time
      ? dayjs.tz(body.punch_out_time, IST_TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
      : existingPunchOut;

    let totalHours: number = attendance.total_hours || 0;
    let attendanceStatus: string = attendance.attendance_status || ATTENDANCE_STATUS.ABSENT;
    let punchInStatus: string = attendance.punch_in_status || PUNCH_IN_STATUS.ON_TIME;

    if (punchIn) {
      const inTime = dayjs.tz(punchIn, IST_TIMEZONE);
      const currentMinutes = inTime.hour() * 60 + inTime.minute();

      if (currentMinutes <= 9 * 60 + 30) {
        punchInStatus = PUNCH_IN_STATUS.ON_TIME;
      } else if (currentMinutes <= 12 * 60 + 30) {
        punchInStatus = PUNCH_IN_STATUS.LATE;
      }

      if (punchOut) {
        const outTime = dayjs.tz(punchOut, IST_TIMEZONE);
        const diffMs = outTime.diff(inTime);
        totalHours = Math.min(Number((diffMs / (1000 * 60 * 60)).toFixed(2)), 16);

        if (totalHours >= 8) {
          attendanceStatus = punchInStatus === PUNCH_IN_STATUS.ON_TIME
            ? ATTENDANCE_STATUS.PRESENT
            : ATTENDANCE_STATUS.HALF_DAY;
        } else if (totalHours > 0) {
          attendanceStatus = ATTENDANCE_STATUS.HALF_DAY;
        }
      }
    }

    await updateAttendanceRepository.updateAttendance({
      empId,
      date: new Date(date),
      punchInTime: punchIn,
      punchOutTime: punchOut,
      totalHours,
      punchInStatus,
      attendanceStatus,
    });

    const updatedRecord = await updateAttendanceRepository.getAttendanceByEmpDate(empId, new Date(date));

    return {
      id: updatedRecord.id,
      Emp_id: updatedRecord.Emp_id,
      work_date: updatedRecord.work_date,
      date: updatedRecord.work_date
        ? new Date(updatedRecord.work_date).toISOString().split('T')[0]
        : null,
      punch_in_time: updatedRecord.punch_in_time
        ? new Date(updatedRecord.punch_in_time).toISOString().replace('T', ' ').substring(0, 19)
        : null,
      punch_out_time: updatedRecord.punch_out_time
        ? new Date(updatedRecord.punch_out_time).toISOString().replace('T', ' ').substring(0, 19)
        : null,
      punch_in_status: updatedRecord.punch_in_status,
      work_mode: updatedRecord.work_mode,
      total_hours: updatedRecord.total_hours,
      attendance_status: updatedRecord.attendance_status,
      created_at: updatedRecord.created_at,
      updated_at: updatedRecord.updated_at,
    };
  }
}

export const updateAttendanceService = new UpdateAttendanceService();