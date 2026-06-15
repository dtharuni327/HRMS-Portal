import sql from "mssql";
import { db } from "../../config/db";
export const loginRepository = async( username:string)=>{
    const pool = await db; 
    return await pool.request()
    .input("Username", sql.VarChar, username)
    .execute("SP_Login");
};