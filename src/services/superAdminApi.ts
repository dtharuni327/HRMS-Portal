import type {
  AuditLog,
  Department,
  EmployeeUser,
  Holiday,
  LeaveType,
  SystemConfig,
  SystemHealth,
} from "../types/superAdmin.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

export const superAdminApi = {
  getDepartments: () => request<Department[]>("/departments"),

  createDepartment: (data: Partial<Department>) =>
    request<Department>("/department", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateDepartment: (id: string, data: Partial<Department>) =>
    request<Department>(`/department/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getHolidays: () => request<Holiday[]>("/holidays"),

  createHoliday: (data: Partial<Holiday>) =>
    request<Holiday>("/holiday", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteHoliday: (id: string) =>
    request<{ message: string }>(`/holiday/${id}`, {
      method: "DELETE",
    }),

  getEmployees: () => request<EmployeeUser[]>("/employees"),

  updateEmployee: (id: string, data: Partial<EmployeeUser>) =>
    request<EmployeeUser>(`/employee/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getLeaveTypes: () => request<LeaveType[]>("/leave-types"),

  createLeaveType: (data: Partial<LeaveType>) =>
    request<LeaveType>("/leave-type", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLeaveType: (id: string, data: Partial<LeaveType>) =>
    request<LeaveType>(`/leave-type/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getSystemConfig: () => request<SystemConfig>("/system-config"),

  updateSystemConfig: (data: SystemConfig) =>
    request<SystemConfig>("/system-config", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getAuditLogs: () => request<AuditLog[]>("/audit-logs"),

  getSystemHealth: () => request<SystemHealth>("/system-health"),
};