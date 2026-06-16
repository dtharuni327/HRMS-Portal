import sql from "mssql";
import { db }from "../../config/db";
export const resetPasswordRepository =async (email: string,otp: string,
    password: string) => {
        const pool =await db;
        return await pool.request()
        .input("Email",sql.VarChar,email)
        .input("OTP",sql.VarChar,otp)
        .input("Password",sql.VarChar,password)
        .execute("SP_Reset_Password");
};