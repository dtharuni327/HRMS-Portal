export const PAYSLIP_STATUS = {
  PENDING: "PENDING",
  GENERATED: "GENERATED",
  PAID: "PAID",
  SENT: "SENT"
};

export const PAYSLIP_STATUS_LIST = ["PENDING", "GENERATED", "PAID", "SENT"];

export const PAYSLIP_TABLE_NAME = "payslip";

export const PAYSLIP_ERROR_MESSAGES = {
  EMPLOYEE_NOT_FOUND: "Employee not found with ID: %s",
  PAYROLL_NOT_FOUND: "Payroll not found with ID: %d",
  PAYSLIP_NOT_FOUND: "Payslip not found with ID: %d",
  PAYSLIP_ALREADY_EXISTS: "Payslip already exists for employee %s and payroll ID %d",
  NO_PAYSLIPS_FOUND: "No payslips found for employee %s",
  NO_PAYSLIPS_WITH_FILTERS: "No payslips found with the given filters",
  INVALID_STATUS: "Invalid status. Allowed values: PENDING, GENERATED, PAID, SENT",
  EMP_ONLY_VIEW_OWN: "You can only view your own payslips",
  ADMIN_ONLY_CREATE: "Only Super Admin and HR Admin can create payslips",
  ADMIN_ONLY_VIEW_ALL: "Only Super Admin and HR Admin can view all payslips",
  ADMIN_ONLY_UPDATE: "Only Super Admin and HR Admin can update payslip status",
  ADMIN_ONLY_DELETE: "Only Super Admin and HR Admin can delete payslips"
};

export const PAYSLIP_VALIDATION_ERRORS = {
  EMP_ID_REQUIRED: "Emp_id is required",
  PAYROLL_ID_REQUIRED: "payroll_id is required",
  PAYROLL_ID_POSITIVE: "payroll_id must be a positive number",
  EMPLOYEE_ID_REQUIRED: "Employee ID is required",
  MONTH_REQUIRED: "Month must be a number",
  MONTH_RANGE: "Month must be between 1 and 12",
  YEAR_REQUIRED: "Year must be a number",
  STATUS_REQUIRED: "Status is required",
  STATUS_INVALID: "Status must be one of: PENDING, GENERATED, PAID, SENT",
  PAYSLIP_ID_REQUIRED: "Payslip ID is required",
  PAYSLIP_ID_NUMBER: "Payslip ID must be a number",
  PAYSLIP_ID_POSITIVE: "Payslip ID must be a positive number",
  PAYMENT_DATE_VALID: "payment_date must be a valid date"
};