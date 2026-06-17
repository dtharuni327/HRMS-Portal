export const EMPLOYEE_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  RESIGNED: "RESIGNED",
  TERMINATED: "TERMINATED",
  ON_NOTICE: "ON_NOTICE",
} as const;

export const EMPLOYMENT_TYPE = {
  FULL_TIME: "FULL_TIME",
  CONTRACT: "CONTRACT",
  INTERN: "INTERN",
} as const;

export const WORK_MODE = {
  WFH: "WFH",
  WFO: "WFO",
  HYBRID: "HYBRID",
} as const;

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export const EMPLOYEE_SP = {
  GET_ALL: "sp_GetEmployeesByFilter",
  GET_BY_ID: "sp_GetEmployeeById",
  CREATE: "sp_CreateEmployee",
  UPDATE: "sp_UpdateEmployee",
} as const; // names must stay in sync with DB stored procedures

export const EMPLOYEE_SP_ERROR = {
  EMAIL_EXISTS: 50001,
  PHONE_EXISTS: 50002,
  INVALID_ROLE: 50003,
  INVALID_DEPARTMENT: 50004,
  INVALID_DASHBOARD: 50005,
  INVALID_CLIENT: 50006,
  INVALID_MANAGER: 50007,
  SELF_MANAGER: 50008,
  NOT_FOUND: 50010,
  MANAGER_SELF_ONLY: 50011,
  ACCESS_DENIED: 50012,
  DUPLICATE_KEY: 2627, // unique constraint violation
  DUPLICATE_INDEX: 2601, // unique index violation
} as const; // 50xxx = SP-thrown errors, 2xxx = native SQL constraint errors

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
