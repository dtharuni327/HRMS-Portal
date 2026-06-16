export type UserRole =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "CLIENT"
  | "FINANCE";

export interface RolePermissions {
  canViewEmployees: boolean;
  canEditEmployees: boolean;
  canDeleteEmployees: boolean;
  canViewPayroll: boolean;
  canEditPayroll: boolean;
  canViewProjects: boolean;
  canEditProjects: boolean;
  canViewAttendance: boolean;
  canEditAttendance: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SUPER_ADMIN: {
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: true,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewProjects: true,
    canEditProjects: true,
    canViewAttendance: true,
    canEditAttendance: true,
  },
  HR_ADMIN: {
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewProjects: true,
    canEditProjects: true,
    canViewAttendance: true,
    canEditAttendance: true,
  },
  MANAGER: {
    canViewEmployees: true,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewProjects: true,
    canEditProjects: true,
    canViewAttendance: true,
    canEditAttendance: false,
  },
  EMPLOYEE: {
    canViewEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewProjects: false,
    canEditProjects: false,
    canViewAttendance: true,
    canEditAttendance: true,
  },
  CLIENT: {
    canViewEmployees: false,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewProjects: true,
    canEditProjects: false,
    canViewAttendance: false,
    canEditAttendance: false,
  },
  FINANCE: {
    canViewEmployees: true,
    canEditEmployees: false,
    canDeleteEmployees: false,
    canViewPayroll: true,
    canEditPayroll: true,
    canViewProjects: false,
    canEditProjects: false,
    canViewAttendance: true,
    canEditAttendance: false,
  },
};
