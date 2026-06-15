import { config } from "../config/env";
import { useAuthStore } from "../store/authStore";

const normalizeRole = (role?: string) =>
  role?.trim().toUpperCase().replace(/\s+/g, "_") ?? "";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const apiRequest = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${config.API_BASE_URL}${path}`, {
    headers: getAuthHeaders(),
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.message || "API request failed");
  }

  return payload as T;
};

const unwrapData = <T>(payload: any, fallback: T): T => {
  if (payload?.data !== undefined) return payload.data as T;
  if (payload?.employee !== undefined) return payload.employee as T;
  if (payload?.user !== undefined) return payload.user as T;
  return fallback;
};

const roleToDashboard = (role?: string) => {
  switch (normalizeRole(role)) {
    case "SUPER_ADMIN":
      return "/superadmin";
    case "HR_ADMIN":
      return "/hr";
    case "MANAGER":
      return "/manager";
    case "FINANCE":
      return "/finance";
    case "CLIENT":
      return "/client";
    default:
      return "/employee";
  }
};

export const hrmsApi = {
  async login(credentials: { username: string; password: string }) {
    const payload = await apiRequest<{
      accessToken: string;
      refreshToken?: string;
      user: {
        Emp_id?: string;
        username?: string;
        name?: string;
        email?: string;
        role?: string;
      };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const user = payload.user ?? {};
    const role = normalizeRole(user.role);

    return {
      token: payload.accessToken,
      refreshToken: payload.refreshToken,
      user: {
        id: String(user.Emp_id ?? user.username ?? user.email ?? credentials.username),
        username: user.username ?? credentials.username,
        email: user.email ?? credentials.username,
        role,
        name: user.name ?? user.username ?? credentials.username,
        dashboard: roleToDashboard(role),
      },
    };
  },

  async getEmployees() {
    const payload = await apiRequest<any>("/api/employees");
    return unwrapData<any[]>(payload, []);
  },

  async updateEmployeeStatus(empId: string, employeeStatus: string) {
    return apiRequest<any>(`/api/employees/${empId}`, {
      method: "PUT",
      body: JSON.stringify({ employee_status: employeeStatus }),
    });
  },

  async getHolidays() {
    const payload = await apiRequest<any>("/api/holidays/all");
    return unwrapData<any[]>(payload, []);
  },

  async createHoliday(data: {
    holiday_name: string;
    holiday_date: string;
    client_id: number;
    region?: string;
  }) {
    return apiRequest<any>("/api/holidays/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getLeaves() {
    const payload = await apiRequest<any>("/api/leave/all");
    return unwrapData<any[]>(payload, []);
  },

  async applyLeave(data: {
    leave_type: string;
    from_date: string;
    to_date: string;
    reason: string;
  }) {
    return apiRequest<any>("/api/leave/apply", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateLeaveStatus(data: {
    leave_id: number;
    status: "APPROVED" | "REJECTED";
    empId: string;
  }) {
    const { empId, ...body } = data;

    return apiRequest<any>(`/api/leave/status/${empId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  async createWfhRequest(data: {
    from_date: string;
    to_date: string;
    reason: string;
  }) {
    return apiRequest<any>("/api/wfh/create", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getAllWfhRequests() {
    const payload = await apiRequest<any>("/api/wfh/all-requests");
    return unwrapData<any[]>(payload, []);
  },

  async updateWfhStatus(data: {
    empId: string;
    status: "APPROVED" | "REJECTED";
  }) {
    return apiRequest<any>(`/api/wfh/update-status/${data.empId}`, {
      method: "PUT",
      body: JSON.stringify({ status: data.status }),
    });
  },

  async punchIn(data?: { latitude?: number; longitude?: number }) {
    return apiRequest<any>("/api/attendance/punch-in", {
      method: "POST",
      body: JSON.stringify(data ?? {}),
    });
  },

  async punchOut() {
    return apiRequest<any>("/api/attendance/punch-out", {
      method: "POST",
      body: JSON.stringify({}),
    });
  },

  async getAttendanceSummary(empId: string, month: number, year: number) {
    return apiRequest<any>(
      `/api/attendance/summary/${empId}?month=${month}&year=${year}`,
    );
  },
};
