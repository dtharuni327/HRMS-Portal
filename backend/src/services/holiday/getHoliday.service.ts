import { getHolidayRepository } from "../../repositories/holiday/getHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const getHolidayService = async () => {
  const result = await getHolidayRepository();
  return {success: true,
    message: HOLIDAY_MESSAGES.HOLIDAY_FETCHED,
    data: result.recordset
  };
};