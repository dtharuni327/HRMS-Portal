import { getTeamLeaveCalendarRepository }
from "../../repositories/leave/getTeamLeaveCalender.repository";
export const getTeamLeaveCalendarService =
async (data: any) => {
  const { month, year } = data;
  const result =
  await getTeamLeaveCalendarRepository(
    month,
    year
  );
  return {
    success: true,
    message: "Team Leave Calendar fetched successfully",
    data: result.recordset
  };
};