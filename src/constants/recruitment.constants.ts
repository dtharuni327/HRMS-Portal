export const RECRUITMENT_SP = {
  GET_ALL_JOBS:              "sp_GetAllJobs",
  GET_JOB_BY_ID:             "sp_GetJobById",
  CREATE_JOB:                "sp_CreateJob",
  UPDATE_JOB:                "sp_UpdateJob",
  DELETE_JOB:                "sp_DeleteJob",
  GET_APPLICATIONS:          "sp_GetApplications",
  APPLY_TO_JOB:              "sp_ApplyToJob",
  UPDATE_APPLICATION_STATUS: "sp_UpdateApplicationStatus",
} as const;

// SQL Server RAISERROR always surfaces as err.number === 50000.
// Constraint violations (2627/2601) do keep their real numbers.
export const RECRUITMENT_SP_ERROR = {
  DUPLICATE_KEY:   2627,
  DUPLICATE_INDEX: 2601,
} as const;

// Message substrings thrown by each SP (match RAISERROR text in recruitment.sql exactly)
export const RECRUITMENT_SP_MSG = {
  JOB_NOT_FOUND:         "Job not found",
  APPLICATION_NOT_FOUND: "Application not found",
  ALREADY_APPLIED:       "You have already applied for this job",
  JOB_CLOSED:            "This job posting is closed",
  INVALID_DEPARTMENT:    "Invalid department",
} as const;

export const JOB_STATUS = {
  OPEN:         "Open",
  URGENT:       "Urgent",
  CLOSING_SOON: "Closing Soon",
  CLOSED:       "Closed",
} as const;

export const EMPLOYMENT_TYPE = {
  FULL_TIME:         "Full Time",
  PART_TIME:         "Part Time",
  CONTRACT:          "Contract",
  INTERNAL_TRANSFER: "Internal Transfer",
  INTERN:            "Internship",
} as const;

export const APPLICATION_TYPE = {
  SELF:     "Self",
  REFERRAL: "Referral",
} as const;

export const APPLICATION_STATUS = {
  PENDING:   "Pending",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER:     "Offer",
  HIRED:     "Hired",
  REJECTED:  "Rejected",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE:  1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT:     100,
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