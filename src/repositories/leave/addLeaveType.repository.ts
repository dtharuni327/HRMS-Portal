import sql from "mssql";
import { db } from "../../config/db";
export const addLeaveTypeRepository = async(data:any)=>{
    const pool = await db;
    return await pool.request()
    .input("LeaveTypeName",sql.VarChar,data.leave_type_name)
    .input("MaxDays",sql.Int,data.max_days)
    .input("CarryForward",sql.Bit,data.carry_forward)
    .input("Description",sql.VarChar,data.description)
    .query(`
        INSERT INTO leave_types
        (
            leave_type_name,
            max_days,
            carry_forward,
            description
        )
        VALUES
        (
            @LeaveTypeName,
            @MaxDays,
            @CarryForward,
            @Description
        )
    `);
};