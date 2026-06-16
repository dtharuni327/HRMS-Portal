import sql from "mssql";
import { db } from "../../config/db";

export const employeeRoleRepository = {
  async findMapping(employeeId: string, roleId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("RoleId", sql.VarChar, roleId)
      .execute("USP_EmployeeRole_FindMapping");

    return result.recordset?.[0] ?? null;
  },

  async findByEmployeeId(employeeId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .execute("USP_EmployeeRole_GetByEmployee");

    return result.recordset?.[0] ?? null;
  },

  async getAll() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_EmployeeRole_GetAll");

    return result.recordset ?? [];
  },

  async map(employeeId: string, roleId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("RoleId", sql.VarChar, roleId)
      .execute("USP_EmployeeRole_Map");

    return result.recordset?.[0] ?? result;
  },

  async updateMapping(employeeId: string, newRoleId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("RoleId", sql.VarChar, newRoleId)
      .execute("USP_EmployeeRole_Update");

    return result.recordset?.[0] ?? result;
  },

  async deleteMapping(employeeId: string, roleId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("RoleId", sql.VarChar, roleId)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_EmployeeRole_Delete");

    return result.recordset?.[0] ?? result;
  }
};