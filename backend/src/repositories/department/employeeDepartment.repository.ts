import sql from "mssql";
import { db } from "../../config/db";

export const employeeDepartmentRepository = {
  async findMapping(employeeId: string, departmentId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentId", sql.VarChar, departmentId)
      .execute("USP_EmployeeDepartment_FindMapping");

    return result.recordset?.[0] ?? null;
  },

  async findByEmployeeId(employeeId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .execute("USP_EmployeeDepartment_GetByEmployee");

    return result.recordset?.[0] ?? null;
  },

  async getAll() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_EmployeeDepartment_GetAll");

    return result.recordset ?? [];
  },

  async map(employeeId: string, departmentId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentId", sql.VarChar, departmentId)
      .execute("USP_EmployeeDepartment_Map");

    return result.recordset?.[0] ?? result;
  },

  async updateMapping(employeeId: string, newDepartmentId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentId", sql.VarChar, newDepartmentId)
      .execute("USP_EmployeeDepartment_Update");

    return result.recordset?.[0] ?? result;
  },

  async deleteMapping(employeeId: string, departmentId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("DepartmentId", sql.VarChar, departmentId)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_EmployeeDepartment_Delete");

    return result.recordset?.[0] ?? result;
  }
};