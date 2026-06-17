import { db } from "../../config/db";

export const updatePayslipStatusRepository = async (
  payslip_id: number,
  status: string,
  payment_date: string | null
) => {
  try {
    const pool = await db;
    
    const request = pool.request();
    request.input("payslip_id", payslip_id);
    request.input("status", status);
    request.input("payment_date", payment_date);

    const result = await request.execute("sp_UpdatePayslipStatus");
    
    if (!result.recordset || result.recordset.length === 0) {
      throw new Error(`Failed to update payslip status for ID: ${payslip_id}`);
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
      
      if (error.message.includes("Invalid status")) {
        return {
          success: false,
          statusCode: 400,
          message: "Invalid status. Allowed values: PENDING, GENERATED, PAID, SENT"
        };
      }
      
      if (error.message.includes("Could not find stored procedure")) {
        return {
          success: false,
          statusCode: 500,
          message: "UpdatePayslipStatus stored procedure not found in database"
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