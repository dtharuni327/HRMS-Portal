import { deleteHolidayRepository } from "../../repositories/holiday/deleteHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const deleteHolidayService = async (client_id: number) => {
  await deleteHolidayRepository(client_id);
  return {success: true,
    message: HOLIDAY_MESSAGES.HOLIDAY_DELETED
  };
};