export const HOLIDAY_MESSAGES = {
  HOLIDAY_CREATED:"Holiday added successfully",
  HOLIDAY_UPDATED:"Holiday updated successfully",
  HOLIDAY_DELETED:"Holiday deleted successfully",
  HOLIDAY_FETCHED:"Holidays fetched successfully",
  HOLIDAY_HISTORY_FETCHED:"Holiday history fetched successfully",
  REMAINING_HOLIDAYS_FETCHED:"Remaining holidays fetched successfully",
  USED_HOLIDAYS_FETCHED:"Used holidays fetched successfully",
  TOTAL_HOLIDAYS_FETCHED:"Total holidays fetched successfully",
  HOLIDAY_NOT_FOUND:"Holiday not found",
  INVALID_HOLIDAY_ID:"Invalid holiday id",
  HOLIDAY_NAME_REQUIRED:"Holiday name is required",
  HOLIDAY_DATE_REQUIRED:"Holiday date is required",
  CLIENT_ID_REQUIRED:"Client id is required",
  UNAUTHORIZED:"Unauthorized",
  INTERNAL_SERVER_ERROR:"Internal server error"
};
export const HOLIDAY_STATUS = {
  ACTIVE:"ACTIVE",
  INACTIVE:"INACTIVE"
};
export const HOLIDAY_API = {
  ADD:"/add",
  GET_ALL:"/all",
  HISTORY:"/history",
  REMAINING:"/remaining",
  USED:"/used",
  TOTAL:"/total",
  DELETE:"/delete/:client_id"
};