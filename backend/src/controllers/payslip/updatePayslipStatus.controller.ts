import { Request, Response } from "express";
import { updatePayslipStatusService } from "../../services/payslip/updatePayslipStatus.service";

export const updatePayslipStatusController = async (req: Request, res: Response) => {
  try {
    const dashboard_id = req.user?.Dashboard_id;

    if (dashboard_id !== 1 && dashboard_id !== 2) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin and HR Admin can update payslip status"
      });
    }
    const { payslip_id } = req.params;
    const { status, payment_date } = req.body;
    if (!payslip_id) {
      return res.status(400).json({
        success: false,
        message: "Payslip ID is required"
      });
    }
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    const result = await updatePayslipStatusService(
      Number(payslip_id),
      status,
      payment_date || null
    );

    if (!result.success) {
      return res.status(result.statusCode ?? 400).json({
        success: false,
        message: result.message ?? "Failed to update payslip status"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payslip status updated successfully"
    });
  } catch (error) {
    console.error("[UpdatePayslipStatusController] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update payslip status"
    });
  }
};