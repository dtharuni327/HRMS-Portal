import { getAllPayslipsRepository } from "../../repositories/payslip/getAllPayslips.repository";

interface GetAllPayslipsResult {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: any[];
}

export const getAllPayslipsService = async (
  month: number | null,
  year: number | null,
  status: string | null
): Promise<GetAllPayslipsResult> => {
  try {
    const result = await getAllPayslipsRepository(month, year, status);
    
    if (result.length === 0) {
      return {
        success: false,
        statusCode: 404,
        message: "No payslips found with the given filters"
      };
    }
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    if (error instanceof Error) {
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