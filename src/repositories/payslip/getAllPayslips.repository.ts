import { db } from "../../config/db";

export const getAllPayslipsRepository = async (
  month: number | null,
  year: number | null,
  status: string | null
) => {
  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("month", month);
    request.input("year", year);
    request.input("status", status);

    const result = await request.execute("sp_GetAllPayslips");
    
    if (!result.recordset) {
      throw new Error("No payslips found with the given filters");
    }
    
    return result.recordset;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("No payslips found")) {
        throw new Error("No payslips found with the given filters");
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        throw new Error("GetAllPayslips stored procedure not found in database");
      }
      
      throw new Error(error.message);
    }
    
    throw new Error("Failed to get payslips");
  }
};