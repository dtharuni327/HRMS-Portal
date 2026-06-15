import sql from "mssql";
import { db } from "../../config/db";
export const deleteHolidayRepository =async (client_id: number) => {
    const pool =await db;
    return await pool
      .request()
      .input("ClientId",sql.Int,client_id)
      .execute("USP_Holiday_Delete");
};