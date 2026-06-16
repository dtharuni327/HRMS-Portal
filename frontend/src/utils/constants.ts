export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  HR_ADMIN: "HR_ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  CLIENT: "CLIENT",
  FINANCE: "FINANCE",
} as const;

export const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
  'Operations',
  'Design',
  'Product',
] as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;
