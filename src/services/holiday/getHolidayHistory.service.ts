import { getHolidayHistoryRepository } from "../../repositories/holiday/getHolidayHistory.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const getHolidayHistoryService = async () => {
  const result = await getHolidayHistoryRepository();
  return {success: true,
    message: HOLIDAY_MESSAGES.HOLIDAY_HISTORY_FETCHED,
    data: result.recordset
  };
};