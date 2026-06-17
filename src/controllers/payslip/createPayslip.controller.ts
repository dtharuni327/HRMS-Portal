import { Request, Response } from "express";
import { createPayslipService } from "../../services/payslip/createPayslip.service";

export const createPayslipController = async (req: Request, res: Response) => {
  try {
    const dashboard_id = req.user?.Dashboard_id;
    if (dashboard_id !== 1 && dashboard_id !== 2) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin and HR Admin can create payslips"
      });
    }
    const { Emp_id, payroll_id } = req.body;
    if (!Emp_id) {
      return res.status(400).json({
        success: false,
        message: "Emp_id is required"
      });
    }
    if (!payroll_id) {
      return res.status(400).json({
        success: false,
        message: "payroll_id is required"
      });
    }
    const result = await createPayslipService(Emp_id, Number(payroll_id));

    if (!result.success) {
      return res.status(result.statusCode ?? 400).json({
        success: false,
        message: result.message ?? "Failed to create payslip"
      });
    }
    return res.status(201).json({
      success: true,
      message: "Payslip created successfully",
      payslip_id: result.payslip_id ?? Number(payroll_id)
    });
  } catch (error) {
    console.error("[CreatePayslipController] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payslip"
    });
  }
};