export const PROFILE_SP = {
  GET_MY_PROFILE:    "sp_GetMyProfile",
  UPDATE_MY_PROFILE: "sp_UpdateMyProfile",
  CHANGE_PASSWORD:   "sp_ChangeEmployeePassword",
} as const;


export const PROFILE_SP_ERROR = {
  NOT_FOUND:        50010,
  ACCESS_DENIED:    50012,
  INVALID_PASSWORD: 50020,
  // SQL constraint violations keep their real numbers
  DUPLICATE_KEY:    2627,
  DUPLICATE_INDEX:  2601,
} as const;


export const PROFILE_SP_MSG = {
  NOT_FOUND:    "Employee not found",
  ACCESS_DENIED: "Access denied",
} as const;

export const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  CONFLICT:              409,
  INTERNAL_SERVER_ERROR: 500,
} as const;