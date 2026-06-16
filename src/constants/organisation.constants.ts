export const ORGANISATION_SP = {
  GET_STRUCTURE: "sp_GetOrganisationStructure", // all depts + employees, HR/admin only
} as const;

export const ORGANISATION_SP_ERROR = {
  ACCESS_DENIED: 50060, // non-HR role attempting to access
} as const;

export const SENIORITY = {
  JUNIOR:    "Junior",    // experience <= 1 yr
  MID_LEVEL: "Mid-Level", // experience <= 4 yrs
  SENIOR:    "Senior",    // experience > 4 yrs
} as const;

export const HTTP_STATUS = {
  OK:                    200,
  BAD_REQUEST:           400,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
