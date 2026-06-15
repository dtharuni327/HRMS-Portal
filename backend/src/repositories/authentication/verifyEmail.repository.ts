import sql from "mssql";
import { db }from "../../config/db";
export const verifyEmailRepository =async (email: string,
    otp: string) => {
        const pool =await db;
        return await pool
        .request()
        .input("Email",sql.VarChar,email)
        .input("OTP",sql.VarChar,otp)
        .execute("USP_Email_Verification");
};