export const HOLIDAY_MESSAGES = {

  HOLIDAY_ADDED:
    "Holiday added successfully",

  HOLIDAY_UPDATED:
    "Holiday updated successfully",

  HOLIDAY_DELETED:
    "Holiday deleted successfully",

  HOLIDAYS_FETCHED:
    "Holidays fetched successfully",

  HOLIDAY_FETCHED:
    "Holiday fetched successfully",

  HOLIDAY_NOT_FOUND:
    "Holiday not found",

  HOLIDAY_ALREADY_EXISTS:
    "Holiday already exists",

  HOLIDAY_HISTORY_FETCHED:
    "Holiday history fetched successfully",

  REMAINING_HOLIDAYS_FETCHED:
    "Remaining holidays fetched successfully",

  USED_HOLIDAYS_FETCHED:
    "Used holidays fetched successfully",

  TOTAL_HOLIDAYS_FETCHED:
    "Total holidays fetched successfully",

  HOLIDAY_NAME_REQUIRED:
    "Holiday name is required",

  HOLIDAY_DATE_REQUIRED:
    "Holiday date is required",

  CLIENT_ID_REQUIRED:
    "Client id is required",

  REGION_REQUIRED:
    "Region is required",

  INVALID_HOLIDAY_ID:
    "Invalid holiday id",

  UNAUTHORIZED:
    "Unauthorized access",

  INTERNAL_SERVER_ERROR:
    "Internal server error"
};

export const HOLIDAY_STATUS = {

  ACTIVE: "ACTIVE",

  INACTIVE: "INACTIVE"

};

export const HOLIDAY_API = {

  ADD_HOLIDAY:
    "/add",

  GET_HOLIDAYS:
    "/all",

  DELETE_HOLIDAY:
    "/delete/:id",

  HOLIDAY_HISTORY:
    "/history",

  REMAINING_HOLIDAYS:
    "/remaining",

  USED_HOLIDAYS:
    "/used",

  TOTAL_HOLIDAYS:
    "/total"

};

export const HOLIDAY_TYPES = {

  NATIONAL:
    "National Holiday",

  REGIONAL:
    "Regional Holiday",

  COMPANY:
    "Company Holiday",

  CLIENT:
    "Client Holiday"

};