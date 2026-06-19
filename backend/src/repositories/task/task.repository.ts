import sql from "mssql";
import { db } from "../../config/db";

export const taskRepository = {
  async createAndAssignTask(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, data.title)
      .input("Description", sql.VarChar, data.description)
      .input("AssignedEmployeeId", sql.VarChar, data.assignedEmployeeId)
      .input("DueDate", sql.DateTime, data.dueDate || null)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .input("Status", sql.VarChar, data.status || "PENDING")
      .execute("USP_Task_CreateAndAssign");

    return result.recordset?.[0] ?? result;
  },

  async checkDuplicate(title: string, assignedEmployeeId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, title)
      .input("AssignedEmployeeId", sql.VarChar, assignedEmployeeId)
      .execute("USP_Task_CheckDuplicate");

    return result.recordset?.[0] ?? null;
  },

  async getTasksByEmployeeId(employeeId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .execute("USP_Task_GetByEmployee");

    return result.recordset ?? [];
  },

  async getAllTasks() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_Task_GetAll");

    return result.recordset ?? [];
  },

  async getTaskById(taskId: string, employeeId?: string) {
    const pool = await db;
    const request = pool.request().input("TaskId", sql.VarChar, taskId);

    if (employeeId) {
      request.input("EmployeeId", sql.VarChar, employeeId);
    }

    const result = await request.execute("USP_Task_GetById");

    return result.recordset?.[0] ?? null;
  },

  async deleteTask(taskId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("TaskId", sql.VarChar, taskId)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_Task_Delete");

    return result.recordset?.[0] ?? result;
  }
};
