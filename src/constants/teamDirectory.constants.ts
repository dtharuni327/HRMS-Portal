export const TEAM_DIRECTORY_SP = {
  GET_TEAM:          "sp_GetTeamDirectory",
  GET_MEMBER_DETAIL: "sp_GetTeamMemberDetail",
} as const;

export const TEAM_DIRECTORY_SP_MSG = {
  EMPLOYEE_NOT_FOUND: "Employee not found",
  ACCESS_DENIED:      "Access denied",
} as const;

export const SENIORITY = {
  JUNIOR:    "Junior",
  MID_LEVEL: "Mid-Level",
  SENIOR:    "Senior",
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT:  "P",
  ABSENT:   "A",
  HALF_DAY: "H",
  WEEKEND:  "W",
} as const;

export const HTTP_STATUS = {
  OK:                    200,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  INTERNAL_SERVER_ERROR: 500,
} as const;