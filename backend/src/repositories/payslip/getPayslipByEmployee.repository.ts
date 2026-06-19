import { db } from "../../config/db";

export const getPayslipByEmployeeRepository = async (
  Emp_id: string,
  month: number | null,
  year: number | null
) => {
  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("Emp_id", Emp_id);
    request.input("month", month);
    request.input("year", year);

    const result = await request.execute("sp_GetPayslipByEmployee");
    
    if (!result.recordset) {
      throw new Error(`No payslips found for employee ${Emp_id}`);
    }
    
    return result.recordset;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Employee not found")) {
        throw new Error(`Employee not found with ID: ${Emp_id}`);
      }
      
      if (error.message.includes("No payslips found")) {
        throw new Error(`No payslips found for employee ${Emp_id}`);
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        throw new Error("GetPayslipByEmployee stored procedure not found in database");
      }
      
      throw new Error(error.message);
    }
    
    throw new Error("Failed to get payslips");
  }
};