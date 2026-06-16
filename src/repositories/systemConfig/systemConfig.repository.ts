import sql from "mssql";
import { db } from "../../config/db";

export const systemConfigRepository = {
  async createSystemConfig(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("GracePeriod", sql.Int, data.gracePeriod)
      .input("ShiftStartTime", sql.VarChar, data.shiftStartTime)
      .input("ShiftEndTime", sql.VarChar, data.shiftEndTime)
      .input("AutoPunchOutTime", sql.VarChar, data.autoPunchOutTime)
      .input("WeekOffDays", sql.VarChar, Array.isArray(data.weekOffDays) ? data.weekOffDays.join(",") : data.weekOffDays)
      .input("OvertimeRate", sql.Decimal(18, 2), data.overtimeRate)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_SystemConfig_Create");

    return result.recordset?.[0] ?? result;
  },

  async updateSystemConfig(configKey: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ConfigKey", sql.VarChar, configKey)
      .input("GracePeriod", sql.Int, data.gracePeriod ?? null)
      .input("ShiftStartTime", sql.VarChar, data.shiftStartTime ?? null)
      .input("ShiftEndTime", sql.VarChar, data.shiftEndTime ?? null)
      .input("AutoPunchOutTime", sql.VarChar, data.autoPunchOutTime ?? null)
      .input("WeekOffDays", sql.VarChar, data.weekOffDays ? (Array.isArray(data.weekOffDays) ? data.weekOffDays.join(",") : data.weekOffDays) : null)
      .input("OvertimeRate", sql.Decimal(18, 2), data.overtimeRate ?? null)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_SystemConfig_Update");

    return result.recordset?.[0] ?? result;
  },

  async getActiveSystemConfig() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_SystemConfig_GetActive");

    return result.recordset?.[0] ?? null;
  },

  async deleteSystemConfig(configKey: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ConfigKey", sql.VarChar, configKey)
      .input("DeletedBy", sql.VarChar, user.Emp_id)
      .execute("USP_SystemConfig_Delete");

    return result.recordset?.[0] ?? result;
  },

  async getAllSystemConfig() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_SystemConfig_GetAll");

    return result.recordset ?? [];
  },

  async getSystemConfigByKey(configKey: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ConfigKey", sql.VarChar, configKey)
      .execute("USP_SystemConfig_GetByKey");

    return result.recordset?.[0] ?? null;
  }
};
