import { deletePayslipRepository } from "../../repositories/payslip/deletePayslip.repository";

interface DeletePayslipResult {
  success: boolean;
  message?: string;
  statusCode?: number;
}

export const deletePayslipService = async (payslip_id: number): Promise<DeletePayslipResult> => {
  try {
    const result = await deletePayslipRepository(payslip_id);
    
    if (!result.success) {
      return {
        success: false,
        statusCode: result.statusCode ?? 404,
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
      
      return {
        success: false,
        statusCode: 500,
        message: error.message
      };
    }
    
    return {
      success: false,
      statusCode: 500,
      message: "Failed to delete payslip"
    };
  }
};