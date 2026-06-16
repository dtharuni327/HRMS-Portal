import { db } from "../../config/db";

export interface GetPayslipOwnParams {
  Emp_id: string;
  month: number | null;
  year: number | null;
  status: string | null;
}

export interface PayslipOwnResult {
  id: number;
  Emp_id: string;
  payroll_id: number;
  month: number;
  year: number;
  basic_salary: number;
  allowances: number;
  bonus: number;
  penalty: number;
  tax: number;
  net_salary: number;
  gross_salary: number;
  total_deductions: number;
  payment_date: Date | null;
  status: string;
  pdf_url: string | null;
  created_at: Date;
  updated_at: Date;
  Name: string;
  designation: string;
  Department_id: number;
  DepartmentName: string;
}

export const getPayslipOwnRepository = async (
  params: GetPayslipOwnParams
): Promise<PayslipOwnResult[]> => {
  const { Emp_id, month, year, status } = params;

  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("Emp_id", Emp_id);
    request.input("month", month);
    request.input("year", year);
    request.input("status", status);

    const result = await request.execute("sp_GetPayslipOwn");
    
    if (!result.recordset || result.recordset.length === 0) {
      throw new Error(`No payslips found for employee ${Emp_id}`);
    }
    
    return result.recordset as PayslipOwnResult[];
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Employee not found")) {
        throw new Error(`Employee not found with ID: ${Emp_id}`);
      }
      
      if (error.message.includes("No payslips found")) {
        throw new Error(`No payslips found for employee ${Emp_id}`);
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        throw new Error("GetPayslipOwn stored procedure not found in database");
      }
      
      throw new Error(error.message);
    }
    
    throw new Error("Failed to get payslips");
  }
};