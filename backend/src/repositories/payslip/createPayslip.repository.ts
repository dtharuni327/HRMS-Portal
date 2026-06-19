import { db } from "../../config/db";

export const createPayslipRepository = async (Emp_id: string, payroll_id: number) => {
  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("Emp_id", Emp_id);
    request.input("payroll_id", payroll_id);

    const result = await request.execute("sp_CreatePayslip");
    
    if (!result.recordset || result.recordset.length === 0) {
      throw new Error(`Failed to create payslip for employee ${Emp_id}`);
    }
    
    return payroll_id;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Payroll not found")) {
        throw new Error(`Payroll not found with ID: ${payroll_id}`);
      }
      
      if (error.message.includes("Payslip already exists")) {
        throw new Error(`Payslip already exists for employee ${Emp_id} and payroll ID ${payroll_id}`);
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        throw new Error("CreatePayslip stored procedure not found in database");
      }
      
      throw new Error(error.message);
    }
    
    throw new Error("Failed to create payslip");
  }
};