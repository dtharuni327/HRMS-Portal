import { Request, Response } from "express";
import { getAllPayslipsService } from "../../services/payslip/getAllPayslips.service";

export const getAllPayslipsController = async (req: Request, res: Response) => {
  try {
    const dashboard_id = req.user?.Dashboard_id;

    if (dashboard_id !== 1 && dashboard_id !== 2) {
      return res.status(403).json({
        success: false,
        message: "Only Super Admin and HR Admin can view all payslips"
      });
    }

    const { month, year, status } = req.query;

    const monthNum = month ? Number(month) : null;
    const yearNum = year ? Number(year) : null;
    const statusStr = status as string || null;

    const result = await getAllPayslipsService(monthNum, yearNum, statusStr);

    if (!result.success) {
      return res.status(result.statusCode ?? 404).json({
        success: false,
        message: result.message ?? "Failed to get payslips"
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data ?? []
    });
  } catch (error) {
    console.error("[GetAllPayslipsController] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get payslips"
    });
  }
};