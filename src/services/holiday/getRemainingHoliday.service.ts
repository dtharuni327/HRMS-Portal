import { getRemainingHolidayRepository } from "../../repositories/holiday/getRemainingHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const getRemainingHolidayService = async () => {
  const result = await getRemainingHolidayRepository();
  return {success: true,
    message: HOLIDAY_MESSAGES.REMAINING_HOLIDAYS_FETCHED,
    data: result.recordset
  };
};