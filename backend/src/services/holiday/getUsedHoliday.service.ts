import { getUsedHolidayRepository } from "../../repositories/holiday/getUsedHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const getUsedHolidayService = async () => {
  const result = await getUsedHolidayRepository();
  return {success: true,
    message: HOLIDAY_MESSAGES.USED_HOLIDAYS_FETCHED,
    data: result.recordset
  };
};