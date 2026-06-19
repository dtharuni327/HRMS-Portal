import { getAttendanceSummary } from "../../repositories/attendance/summary.repository";
import { HISTORY } from "../../constants/attendance.constants";

export const getAttendanceSummaryData = async (
  empId: string,
  month: number,
  year: number
): Promise<any> => {
  const recordsets = await getAttendanceSummary(empId, month, year);

  if (recordsets.length < 3) {
    throw new Error("Failed to fetch attendance summary");
  }

  const summary = recordsets[2][0];

  return {
    success: true,
    message: HISTORY.MESSAGE.FETCH_SUCCESS,
    data: {
      month: summary.month,
      year: summary.year,
      employee_id: summary.employee_id,
      office_working_days: summary.office_working_days,
      full_day: summary.full_day,
      half_day: summary.half_day,
      late: summary.late,
      absent: summary.absent,
      leave_days: summary.leave_days,
      wfh_days: summary.wfh_days,
      total_hours: summary.total_hours,
      permanent_wfh: summary.permanent_wfh,
      holiday_days: summary.holiday_days,
    },
  };
};