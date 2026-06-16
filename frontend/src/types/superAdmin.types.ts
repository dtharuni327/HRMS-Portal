export type Status = "active" | "inactive";

export type Department = {
  id: string;
  name: string;
  head: string;
  employeesCount: number;
  status: Status;
};

export type Holiday = {
  id: string;
  name: string;
  date: string;
  region: string;
  type: "public" | "optional" | "restricted";
};

export type LeaveType = {
  id: string;
  name: string;
  maxDays: number;
  carryForward: boolean;
  status: Status;
};

export type EmployeeUser = {
  id: string;
  name: string;
  email: string;
  role: "Employee" | "HR" | "Manager" | "Finance" | "Super Admin";
  department: string;
  status: Status;
};

export type AuditLog = {
  id: string;
  user: string;
  action: string;
  module: string;
  date: string;
};

export type SystemConfig = {
  gracePeriodMinutes: number;
  shiftStartTime: string;
  shiftEndTime: string;
  weekOffDays: string[];
  autoPunchOutTime: string;
  overtimeRate: number;
};

export type SystemHealth = {
  apiStatus: "Online" | "Offline";
  databaseStatus: "Connected" | "Disconnected";
  activeSessions: number;
  errorRate: string;
  lastBackup: string;
};