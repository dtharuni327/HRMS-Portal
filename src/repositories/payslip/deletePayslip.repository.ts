import { db } from "../../config/db";

export const deletePayslipRepository = async (payslip_id: number) => {
  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("payslip_id", payslip_id);

    const result = await request.execute("sp_DeletePayslip");
    
    if (!result.recordset || result.recordset.length === 0) {
      throw new Error(`Failed to delete payslip with ID: ${payslip_id}`);
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
          message: `Payslip not found with ID: ${payslip_id}`
        };
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        return {
          success: false,
          statusCode: 500,
          message: "DeletePayslip stored procedure not found in database"
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