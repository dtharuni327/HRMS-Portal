import fs from "fs/promises";
import path from "path";
import jwt from "jsonwebtoken";

export type RoleName =
  | "SUPER_ADMIN"
  | "HR_ADMIN"
  | "MANAGER"
  | "EMPLOYEE"
  | "FINANCE"
  | "CLIENT";

export interface EmployeeRecord {
  Emp_id: string;
  username: string;
  password: string;
  name: string;
  company_email: string;
  personal_email: string;
  role_name: RoleName;
  department_name: string;
  employee_status: string;
  designation: string;
  work_mode: string;
  manager_id: string | null;
  location: string;
  phone: string;
  salary: number;
  experience: number;
  joining_date: string;
  emergency_contact?: string | null;
  DOB?: string | null;
  Gender?: string | null;
  employment_type?: string | null;
  profile_image?: string | null;
  client_id?: number | null;
  role_id?: number | null;
  department_id?: number | null;
  dashboard_id?: number | null;
}

export interface DepartmentRecord {
  DepartmentId: number;
  DepartmentName: string;
  DepartmentCode: string;
  DepartmentHead: string;
  HeadRole: string;
  ParentDepartment: string | null;
  Location: string;
  Status: "ACTIVE" | "ARCHIVED";
}

export interface RoleRecord {
  RoleId: number;
  RoleName: string;
  Description: string;
  Status: "ACTIVE" | "ARCHIVED";
}

export interface HolidayRecord {
  HolidayId: number;
  HolidayName: string;
  HolidayDate: string;
  Region: string;
  Type: string;
  client_id: number;
}

export interface LeaveRecord {
  LeaveId: number;
  Emp_id: string;
  EmployeeName: string;
  LeaveType: string;
  FromDate: string;
  ToDate: string;
  TotalDays: number;
  Reason: string;
  Status: string;
  RequestedAt: string;
  RejectionReason?: string;
}

export interface WfhRecord {
  Id: number;
  Emp_id: string;
  EmployeeName: string;
  FromDate: string;
  ToDate: string;
  Reason: string;
  Status: string;
  RequestedAt: string;
  RejectionReason?: string;
}

export interface AttendanceRecord {
  Emp_id: string;
  Date: string;
  punch_in_time: string;
  punch_out_time?: string;
  work_mode: string;
  punch_in_status: string;
  attendance_status: string;
  total_hours?: number;
}

export interface HrmsStore {
  employees: EmployeeRecord[];
  departments: DepartmentRecord[];
  roles: RoleRecord[];
  holidays: HolidayRecord[];
  leaves: LeaveRecord[];
  wfhRequests: WfhRecord[];
  attendance: AttendanceRecord[];
}

const dataFilePath = path.resolve(__dirname, "../../data/hrms-db.json");

const accessSecret = process.env.JWT_SECRET || "local-dev-secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "local-dev-refresh-secret";

export const readStore = async (): Promise<HrmsStore> => {
  const content = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(content) as HrmsStore;
};

export const writeStore = async (store: HrmsStore) => {
  await fs.writeFile(dataFilePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
};

export const sanitizeEmployee = (employee: EmployeeRecord) => {
  const { password, ...safeEmployee } = employee;
  return safeEmployee;
};

export const findEmployeeByLogin = (
  store: HrmsStore,
  identifier: string,
) => {
  const normalized = identifier.trim().toLowerCase();

  return store.employees.find((employee) => {
    return [
      employee.username,
      employee.company_email,
      employee.personal_email,
      employee.company_email.split("@")[0],
      employee.personal_email.split("@")[0],
    ]
      .filter(Boolean)
      .map((value) => value.toLowerCase())
      .includes(normalized);
  });
};

export const getEmployeeById = (store: HrmsStore, empId: string) =>
  store.employees.find((employee) => employee.Emp_id === empId);

export const issueTokens = (employee: EmployeeRecord) => {
  const payload = {
    Emp_id: employee.Emp_id,
    username: employee.username,
    role: employee.role_name,
  };

  return {
    accessToken: jwt.sign(payload, accessSecret, { expiresIn: "15m" }),
    refreshToken: jwt.sign(payload, refreshSecret, { expiresIn: "7d" }),
  };
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, accessSecret) as {
    Emp_id: string;
    username: string;
    role: RoleName;
  };

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, refreshSecret) as {
    Emp_id: string;
    username: string;
    role: RoleName;
  };

export const normalizeRole = (role: string) =>
  role.trim().toUpperCase().replace(/\s+/g, "_");

export const startOfToday = () => new Date().toISOString().slice(0, 10);

export const calculateTotalDays = (fromDate: string, toDate: string) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  return Math.max(
    1,
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
  );
};

export const calculateWorkedHours = (punchIn: string, punchOut: string) => {
  const totalMs = new Date(punchOut).getTime() - new Date(punchIn).getTime();
  return Number((totalMs / (1000 * 60 * 60)).toFixed(2));
};
