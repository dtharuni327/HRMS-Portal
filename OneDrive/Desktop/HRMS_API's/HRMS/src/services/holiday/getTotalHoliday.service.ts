import { getTotalHolidayRepository } from "../../repositories/holiday/getTotalHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const getTotalHolidayService = async () => {
  const result = await getTotalHolidayRepository();
  return {success: true,
    message: HOLIDAY_MESSAGES.TOTAL_HOLIDAYS_FETCHED,
    data: result.recordset
  };
};