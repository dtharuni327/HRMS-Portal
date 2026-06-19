import { updatePayslipStatusRepository } from "../../repositories/payslip/updatePayslipStatus.repository";

interface UpdatePayslipStatusResult {
  success: boolean;
  message?: string;
  statusCode?: number;
}

export const updatePayslipStatusService = async (
  payslip_id: number,
  status: string,
  payment_date: string | null
): Promise<UpdatePayslipStatusResult> => {
  try {
    const result = await updatePayslipStatusRepository(payslip_id, status, payment_date);
    
    if (!result.success) {
      return {
        success: false,
        statusCode: result.statusCode ?? 400,
        message: result.message
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Payslip not found")) {
        return {
          success: false,
          statusCode: 404,
          message: error.message
        };
      }
      
      if (error.message.includes("Invalid status")) {
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
      message: "Failed to update payslip status"
    };
  }
};