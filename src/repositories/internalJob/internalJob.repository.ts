import sql from "mssql";
import { db } from "../../config/db";

export const internalJobRepository = {
  async createInternalJob(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, data.title)
      .input("Description", sql.VarChar, data.description)
      .input("Location", sql.VarChar, data.location)
      .input("Department", sql.VarChar, data.department ?? null)
      .input("EmploymentType", sql.VarChar, data.employmentType)
      .input("ApplicationDeadline", sql.DateTime, data.applicationDeadline ? new Date(data.applicationDeadline) : null)
      .input("Status", sql.VarChar, data.status || "ACTIVE")
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_InternalJob_Create");

    return result.recordset?.[0] ?? result;
  },

  async updateInternalJob(jobId: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("JobId", sql.VarChar, jobId)
      .input("Title", sql.VarChar, data.title ?? null)
      .input("Description", sql.VarChar, data.description ?? null)
      .input("Location", sql.VarChar, data.location ?? null)
      .input("Department", sql.VarChar, data.department ?? null)
      .input("EmploymentType", sql.VarChar, data.employmentType ?? null)
      .input("ApplicationDeadline", sql.DateTime, data.applicationDeadline ? new Date(data.applicationDeadline) : null)
      .input("Status", sql.VarChar, data.status ?? null)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_InternalJob_Update");

    return result.recordset?.[0] ?? result;
  },

  async checkDuplicate(title: string, location: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Title", sql.VarChar, title)
      .input("Location", sql.VarChar, location)
      .execute("USP_InternalJob_CheckDuplicate");

    return result.recordset?.[0] ?? null;
  },

  async deleteInternalJob(jobId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("JobId", sql.VarChar, jobId)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_InternalJob_Delete");

    return result.recordset?.[0] ?? result;
  },

  async getAllInternalJobs() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_InternalJob_GetAll");

    return result.recordset ?? [];
  },

  async getActiveInternalJobs() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_InternalJob_GetActive");

    return result.recordset ?? [];
  },

  async getInternalJobById(jobId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("JobId", sql.VarChar, jobId)
      .execute("USP_InternalJob_GetById");

    return result.recordset?.[0] ?? null;
  }
};
