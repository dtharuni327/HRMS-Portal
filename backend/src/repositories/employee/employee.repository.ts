import sql from "mssql";
import { db } from "../../config/db";
import { EMPLOYEE_SP } from "../../constants/employee.constants";
import { CreateEmployeeInput } from "../../validations/employee/create.employee.validation";
import { UpdateEmployeeInput } from "../../validations/employee/update.employee.validation";

interface GetAllParams {
  page: number;
  limit: number;
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  userEmpId?: string;
  isManager: boolean;
}

export const getAllEmployeesRepo = async (params: GetAllParams) => {
  const { page, limit, search, department, role, status, userEmpId, isManager } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("page", sql.Int, page);
  request.input("limit", sql.Int, limit);
  request.input("search", sql.VarChar, search ?? null);
  request.input("department", sql.VarChar, department ?? null);
  request.input("role", sql.VarChar, role ?? null);
  request.input("status", sql.VarChar, status ?? null);
  request.input("userEmpId", sql.VarChar, userEmpId ?? null);
  request.input("isManager", sql.Bit, isManager ? 1 : 0); // SP expects bit, not bool

  return request.execute(EMPLOYEE_SP.GET_ALL);
};

export const getEmployeeByIdRepo = async (
  empId: string,
  loggedInEmpId: string,
  role?: string
) => {
  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId", sql.VarChar, empId);
  request.input("loggedInEmpId", sql.VarChar, loggedInEmpId); // SP uses this for access control
  request.input("role", sql.VarChar, role ?? null);

  return request.execute(EMPLOYEE_SP.GET_BY_ID);
};

export const createEmployeeRepo = async (data: CreateEmployeeInput) => {
  const {
    name, personal_email, phone,
    RoleID, Department_id, Dashboard_id,
    designation, joining_date, employment_type, work_mode,
    client_id, manager_id, profile_image, emergency_contact,
    DOB, Gender,
  } = data;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("name", sql.VarChar, name);
  request.input("personal_email", sql.VarChar, personal_email);
  request.input("phone", sql.VarChar, phone);
  request.input("RoleID", sql.Int, RoleID);
  request.input("Department_id", sql.Int, Department_id);
  request.input("Dashboard_id", sql.Int, Dashboard_id);
  request.input("designation", sql.VarChar, designation);
  request.input("joining_date", sql.Date, joining_date);
  request.input("employment_type", sql.VarChar, employment_type);
  request.input("work_mode", sql.VarChar, work_mode);
  request.input("client_id", sql.Int, client_id ?? null);
  request.input("manager_id", sql.VarChar, manager_id ?? null);
  request.input("profile_image", sql.VarChar, profile_image ?? null);
  request.input("emergency_contact", sql.VarChar, emergency_contact ?? null);
  request.input("DOB", sql.Date, DOB);
  request.input("Gender", sql.VarChar, Gender);

  return request.execute(EMPLOYEE_SP.CREATE);
};

interface UpdateParams extends UpdateEmployeeInput {
  empId: string;
  loggedInEmpId: string;
  loggedInRole: string;
}

export const updateEmployeeRepo = async (params: UpdateParams) => {
  const {
    empId, loggedInEmpId, loggedInRole,
    name, personal_email, phone, emergency_contact, profile_image,
    designation, employment_type, work_mode,
    manager_id, department_id, client_id, role_id, employee_status,
    DOB, Gender,
  } = params;

  const pool = await db;
  const request = new sql.Request(pool);

  request.input("empId", sql.VarChar, empId);
  request.input("loggedInEmpId", sql.VarChar, loggedInEmpId);
  request.input("loggedInRole", sql.VarChar, loggedInRole); // SP uses role to gate field-level writes
  request.input("name", sql.VarChar, name ?? null);
  request.input("personal_email", sql.VarChar, personal_email ?? null);
  request.input("phone", sql.VarChar, phone ?? null);
  request.input("emergency_contact", sql.VarChar, emergency_contact ?? null);
  request.input("profile_image", sql.VarChar, profile_image ?? null);
  request.input("designation", sql.VarChar, designation ?? null);
  request.input("employment_type", sql.VarChar, employment_type ?? null);
  request.input("work_mode", sql.VarChar, work_mode ?? null);
  request.input("manager_id", sql.VarChar, manager_id ?? null);
  request.input("department_id", sql.Int, department_id ?? null);
  request.input("client_id", sql.Int, client_id ?? null);
  request.input("role_id", sql.Int, role_id ?? null);
  request.input("employee_status", sql.VarChar, employee_status ?? null);
  request.input("DOB", sql.Date, DOB ?? null);
  request.input("Gender", sql.VarChar, Gender ?? null);

  return request.execute(EMPLOYEE_SP.UPDATE);
};
