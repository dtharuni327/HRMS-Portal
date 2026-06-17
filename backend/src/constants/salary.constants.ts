export const SALARY_MESSAGES = {
  FETCHED: "Salary records fetched successfully.",
  FETCHED_ONE: "Salary record fetched successfully.",
  CREATED: "Salary record created successfully.",
  UPDATED: "Salary record updated successfully.",
  PROCESSED: "Payroll processed successfully.",
  GENERATED: "Payslip generated successfully.",
  NOT_FOUND: "Salary record not found.",
  UNAUTHORIZED: "You do not have access to this salary record.",
  INVALID_STATUS: "Invalid salary status."
};

export const PAYSLIP_STATUS = [
  "DRAFT",
  "GENERATED",
  "SENT",
  "VIEWED",
  "DOWNLOADED"
];

export const PAYROLL_STATUS = [
  "PENDING",
  "PROCESSING",
  "PROCESSED",
  "PAID",
  "CANCELLED"
];

export const SALARY_COMPONENT_TYPES = [
  "BASIC",
  "ALLOWANCE",
  "BONUS",
  "INCENTIVE",
  "DEDUCTION",
  "REIMBURSEMENT"
];
