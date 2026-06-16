 
import { Request, Response } from "express";
import { deletePayslipService } from "../../services/payslip/deletePayslip.service";

export const deletePayslipController = async (req: Request, res: Response) => {
  try {
    const { payslip_id } = req.params;

    if (!payslip_id) {
      return res.status(400).json({
        success: false,
        message: "Payslip ID is required"
      });
    }

    const result = await deletePayslipService(parseInt(payslip_id));

    if (!result.success) {
      return res.status(result.statusCode || 404).json({
        success: false,
        message: result.message
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payslip deleted successfully"
    });
  } catch (error) {
    console.error("Delete Payslip Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete payslip"
    });
  }
};