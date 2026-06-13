import { getDashboardData } from "../../repositories/attendance/dashboard.repository";
import { DASHBOARD } from "../../constants/attendance.constants";

export const getDashboard = async () => {
  const data = await getDashboardData();

  return {
    success: true,
    message: DASHBOARD.MESSAGE.FETCH_SUCCESS,
    data,
  };
};