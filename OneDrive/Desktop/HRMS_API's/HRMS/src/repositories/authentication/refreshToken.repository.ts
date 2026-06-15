import sql from "mssql";
import { db } from "../../config/db";
export const refreshTokenRepository =async (Emp_id: string,
    refreshToken: string) => {
        const pool = await db;
        return await pool.request()
        .input("Emp_id",sql.VarChar,Emp_id)
        .input("RefreshToken",sql.VarChar,refreshToken)
        .execute("SP_Refresh_Token");
    };