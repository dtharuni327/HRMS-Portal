import type {
  AuditLog,
  Department,
  EmployeeUser,
  Holiday,
  LeaveType,
  SystemConfig,
  SystemHealth,
} from "../types/superAdmin.types";
import { hrmsApi } from "./hrmsApi";

const toDisplayRole = (role: string): EmployeeUser["role"] => {
  const normalized = role.trim().toUpperCase().replace(/\s+/g, "_");

  switch (normalized) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "HR_ADMIN":
    case "HR_MANAGER":
      return "HR";
    case "MANAGER":
      return "Manager";
    case "FINANCE":
      return "Finance";
    default:
      return "Employee";
  }
};

const toBackendRole = (role?: EmployeeUser["role"]) => {
  switch (role) {
    case "Super Admin":
      return "SUPER_ADMIN";
    case "HR":
      return "HR_ADMIN";
    case "Manager":
      return "MANAGER";
    case "Finance":
      return "FINANCE";
    default:
      return "EMPLOYEE";
  }
};

export const superAdminApi = {
  getDepartments: async () => {
    const rows = await hrmsApi.getDepartments();
    return rows.map((row: any, index: number) => ({
      id: String(row.DepartmentId ?? row.id ?? index + 1),
      name: row.DepartmentName ?? row.name ?? "Department",
      head: row.DepartmentHead ?? row.head ?? row.manager ?? "Not assigned",
      employeesCount: Number(row.EmployeeCount ?? row.employeesCount ?? 0),
      status:
        String(row.Status ?? row.status ?? "active").toLowerCase() === "archived"
          ? "inactive"
          : "active",
    })) as Department[];
  },

  createDepartment: async (data: Partial<Department>) => {
    const payload = await hrmsApi.createDepartment({
      name: data.name ?? "Department",
      head: data.head ?? "",
      status: data.status === "inactive" ? "ARCHIVED" : "ACTIVE",
    });

    const row = payload?.data ?? payload;
    return {
      id: String(row.DepartmentId ?? Date.now()),
      name: row.DepartmentName ?? data.name ?? "Department",
      head: row.DepartmentHead ?? data.head ?? "Not assigned",
      employeesCount: Number(row.EmployeeCount ?? 0),
      status:
        String(row.Status ?? "ACTIVE").toLowerCase() === "archived"
          ? "inactive"
          : "active",
    } as Department;
  },

  updateDepartment: async (id: string, data: Partial<Department>) => {
    const payload = await hrmsApi.updateDepartment(id, {
      name: data.name,
      head: data.head,
      status: data.status === "inactive" ? "ARCHIVED" : "ACTIVE",
    });

    const row = payload?.data ?? payload;
    return {
      id: String(row.DepartmentId ?? id),
      name: row.DepartmentName ?? data.name ?? "Department",
      head: row.DepartmentHead ?? data.head ?? "Not assigned",
      employeesCount: Number(row.EmployeeCount ?? 0),
      status:
        String(row.Status ?? "ACTIVE").toLowerCase() === "archived"
          ? "inactive"
          : "active",
    } as Department;
  },

  getHolidays: async () => {
    const rows = await hrmsApi.getHolidays();
    return rows.map((row: any, index: number) => ({
      id: String(row.HolidayId ?? row.id ?? index + 1),
      name: row.HolidayName ?? row.holiday_name ?? row.name ?? "Holiday",
      date: String(row.HolidayDate ?? row.holiday_date ?? row.date ?? "").slice(
        0,
        10,
      ),
      region: row.Region ?? row.region ?? "India",
      type:
        String(row.Type ?? row.type ?? "public").toLowerCase() === "restricted"
          ? "restricted"
          : "public",
    })) as Holiday[];
  },

  createHoliday: async (data: Partial<Holiday>) => {
    await hrmsApi.createHoliday({
      holiday_name: data.name ?? "Holiday",
      holiday_date: data.date ?? new Date().toISOString().slice(0, 10),
      client_id: 1,
      region: data.region ?? "India",
    });

    return {
      id: String(Date.now()),
      name: data.name ?? "Holiday",
      date: data.date ?? new Date().toISOString().slice(0, 10),
      region: data.region ?? "India",
      type: (data.type ?? "public") as Holiday["type"],
    } as Holiday;
  },

  deleteHoliday: async (_id: string) => ({
    message: "Holiday deleted locally",
  }),

  getEmployees: async () => {
    const rows = await hrmsApi.getEmployees();

    return rows.map((row: any, index: number) => ({
      id: String(row.Emp_id ?? row.emp_id ?? row.id ?? index + 1),
      name: row.name ?? row.Name ?? "Employee",
      email:
        row.company_email ??
        row.personal_email ??
        row.email ??
        "employee@example.com",
      role:
        toDisplayRole(String(row.role_name ?? row.role ?? row.RoleName ?? "Employee")),
      department:
        row.department_name ??
        row.DepartmentName ??
        row.department ??
        "General",
      status:
        String(row.employee_status ?? row.status ?? "active").toLowerCase() !==
        "active"
          ? "inactive"
          : "active",
    })) as EmployeeUser[];
  },

  updateEmployee: async (id: string, data: Partial<EmployeeUser>) => {
    await hrmsApi.updateEmployee(id, {
      employee_status: data.status?.toUpperCase(),
      role: toBackendRole(data.role),
      department: data.department,
      name: data.name,
      personal_email: data.email,
    });

    return {
      id,
      name: data.name ?? "Employee",
      email: data.email ?? "employee@example.com",
      role: (data.role ?? "Employee") as EmployeeUser["role"],
      department: data.department ?? "General",
      status: (data.status ?? "active") as EmployeeUser["status"],
    };
  },

  getLeaveTypes: async () => [] as LeaveType[],

  createLeaveType: async (data: Partial<LeaveType>) => data as LeaveType,

  updateLeaveType: async (_id: string, data: Partial<LeaveType>) =>
    data as LeaveType,

  getSystemConfig: async () =>
    ({
      gracePeriodMinutes: 10,
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      weekOffDays: ["Saturday", "Sunday"],
      autoPunchOutTime: "18:30",
      overtimeRate: 1.5,
    }) as SystemConfig,

  updateSystemConfig: async (data: SystemConfig) => data,

  getAuditLogs: async () => [] as AuditLog[],

  getSystemHealth: async () =>
    ({
      apiStatus: "Online",
      databaseStatus: "Connected",
      activeSessions: 0,
      errorRate: "0%",
      lastBackup: "N/A",
    }) as SystemHealth,
};
