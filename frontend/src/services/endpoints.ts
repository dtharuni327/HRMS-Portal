export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
  },
  EMPLOYEES: {
    LIST: '/api/employees',
    DETAIL: (id: string) => `/api/employees/${id}`,
    CREATE: '/api/employees',
    UPDATE: (id: string) => `/api/employees/${id}`,
    DELETE: (id: string) => `/api/employees/${id}`,
  },
  ATTENDANCE: {
    LIST: '/api/attendance',
    CHECK_IN: '/api/attendance/punch-in',
    CHECK_OUT: '/api/attendance/punch-out',
  },
  PAYROLL: {
    LIST: '/payroll',
    DETAIL: (id: string) => `/payroll/${id}`,
  },
  PROJECTS: {
    LIST: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
  },
};
