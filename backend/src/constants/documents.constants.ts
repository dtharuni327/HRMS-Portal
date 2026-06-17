export const DOCUMENT_TYPE = {
  IDENTITY:   "Identity",
  HR:         "HR",
  PAYROLL:    "Payroll",
  TAX:        "Tax",
  EDUCATION:  "Education",
  EXPERIENCE: "Experience",
} as const;

export const REQUIRED_DOCUMENTS = [
  "Aadhaar Card",
  "PAN Card",
  "Resume",
  "Offer Letter",
  "Passport Photo",
] as const;

export const DOCUMENT_STATUS = {
  PENDING:  "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
} as const;

export const DOCUMENT_SP = {
  UPLOAD:          "sp_UploadEmployeeDocumentMetadata",
  GET_BY_EMPLOYEE: "sp_GetEmployeeDocuments",
  GET_BY_ID:       "sp_GetDocumentById",
  UPDATE_STATUS:   "sp_UpdateDocumentStatus",
  DELETE:          "sp_DeleteDocument",
} as const;


export const DOCUMENT_SP_ERROR = {
  DUPLICATE_KEY:   2627,
  DUPLICATE_INDEX: 2601,
} as const;


export const DOCUMENT_SP_MSG = {
  NOT_FOUND:        "Document not found",
  ACCESS_DENIED:    "Access denied",
  ALREADY_EXISTS:   "A document with this name already exists",
  INVALID_EMPLOYEE: "Employee not found",
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