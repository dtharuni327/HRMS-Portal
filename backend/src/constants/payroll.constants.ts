export const PAYROLL_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PAID: 'PAID',
};

export const PAYMENT_MODE = {
  BANK: 'BANK',
  CASH: 'CASH',
  UPI: 'UPI',
};

export const PAYROLL = {
  MESSAGE: {
    FETCH_SUCCESS: "Payroll fetched successfully",
    FETCH_FAILED: "Failed to fetch payroll",
    CREATE_SUCCESS: "Payroll created successfully",
    CREATE_FAILED: "Failed to create payroll",
    UPDATE_SUCCESS: "Payroll updated successfully",
    UPDATE_FAILED: "Failed to update payroll",
    DELETE_SUCCESS: "Payroll deleted successfully",
    DELETE_FAILED: "Failed to delete payroll",
    APPROVE_SUCCESS: "Payroll approved successfully",
    APPROVE_FAILED: "Failed to approve payroll",
    NOT_FOUND: "Payroll not found",
  },
};

export const ACCESS = {
  MESSAGE: {
    UNAUTHORIZED: "Unauthorized",
    ACCESS_DENIED: "Access denied",
  },
};