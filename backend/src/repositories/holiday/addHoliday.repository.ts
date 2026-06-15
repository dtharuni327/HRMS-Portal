import sql from "mssql";
import { db } from "../../config/db";
export const addHolidayRepository =async (data: any) => {
    const pool =await db;
    return await pool
      .request()
      .input("HolidayName",sql.VarChar,data.holiday_name)
      .input("HolidayDate",sql.Date,data.holiday_date)
      .input("ClientId",sql.Int,data.client_id)
      .input("Region",sql.VarChar,data.region)
      .execute("USP_Holiday_Create");
};