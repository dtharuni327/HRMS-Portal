import sql from "mssql";
import {db} from "../../config/db";

export const updateProjectEffort = async (
  effortId: number,
  data: any
) => {
  const pool = await db;

  const result = await pool
  
    .request()
    .input("EffortId", sql.Int, effortId)
    .input("ProjectName", sql.NVarChar(200), data.ProjectName)
    .input("WorkDate", sql.Date, data.WorkDate)
    .input("HoursWorked", sql.Decimal(5, 2), data.HoursWorked)
    .input("TaskDescription", sql.NVarChar(1000), data.TaskDescription)
    .execute("sp_UpdateProjectEffort");

  return result.recordset[0];
};