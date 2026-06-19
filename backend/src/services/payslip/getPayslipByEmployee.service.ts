import { getPayslipByEmployeeRepository } from "../../repositories/payslip/getPayslipByEmployee.repository";

interface GetPayslipResult {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: any[];
}

export const getPayslipByEmployeeService = async (
  Emp_id: string,
  month: number | null,
  year: number | null
): Promise<GetPayslipResult> => {
  try {
    const result = await getPayslipByEmployeeRepository(Emp_id, month, year);
    
    if (result.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: `No payslips found for employee ${Emp_id}`
      };
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Employee not found")) {
        return {
          success: false,
          statusCode: 404,
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
      message: "Failed to get payslips"
    };
  }
};