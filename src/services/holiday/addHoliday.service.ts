import { addHolidayRepository } from "../../repositories/holiday/addHoliday.repository";
import { HOLIDAY_MESSAGES } from "../../constants/holiday.constants";
export const addHolidayService = async (data: any) => {
  const { holiday_name, holiday_date, client_id, region } = data;
  await addHolidayRepository({holiday_name,holiday_date,
    client_id,region});
  return {success: true,message: HOLIDAY_MESSAGES.HOLIDAY_CREATED
};
};