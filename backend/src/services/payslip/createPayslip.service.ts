import { createPayslipRepository } from "../../repositories/payslip/createPayslip.repository";

interface CreatePayslipResult {
  success: boolean;
  message?: string;
  statusCode?: number;
  payslip_id?: number;
}

export const createPayslipService = async (Emp_id: string, payroll_id: number): Promise<CreatePayslipResult> => {
  try {
    const result = await createPayslipRepository(Emp_id, payroll_id);
    
    return {
      success: true,
      payslip_id: result
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Payroll not found")) {
        return {
          success: false,
          statusCode: 400,
          message: error.message
        };
      }
      
      if (error.message.includes("Payslip already exists")) {
        return {
          success: false,
          statusCode: 400,
          message: error.message
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        message: error.message
      };
    }
    
    return {
      success: false,
      statusCode: 500,
      message: "Failed to create payslip"
    };
  }
};