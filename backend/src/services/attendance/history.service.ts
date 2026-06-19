import { getAttendanceHistory } from "../../repositories/attendance/history.repository";
import { HISTORY } from "../../constants/attendance.constants";

export const getAttendanceData = async (
  empId: string,
  page: number,
  limit: number
): Promise<any> => {
  const data = await getAttendanceHistory(empId, page, limit);

  if (data.error) {
    throw new Error(data.error);
  }

  return {
    success: true,
    message: HISTORY.MESSAGE.FETCH_SUCCESS,
    data: {
      employee_id: empId,
      pagination: {
        page,
        limit,
        total: data.total,
        total_pages: Math.ceil(data.total / limit),
      },
      records: data.records,
    },
  };
};