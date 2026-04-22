export type UserRole = 'admin' | 'hr' | 'manager' | 'employee' | 'client' | 'superadmin';

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
  superadmin: {
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
  admin: {
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
  hr: {
    canViewEmployees: true,
    canEditEmployees: true,
    canDeleteEmployees: false,
    canViewPayroll: false,
    canEditPayroll: false,
    canViewProjects: false,
    canEditProjects: false,
    canViewAttendance: true,
    canEditAttendance: false,
  },
  manager: {
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
  employee: {
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
  client: {
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
};