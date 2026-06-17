import { Request, Response } from "express";
import { getPayslipByEmployeeService } from "../../services/payslip/getPayslipByEmployee.service";

export const getPayslipByEmployeeController = async (req: Request, res: Response) => {
  try {
    const { Emp_id } = req.params;
    const { month, year } = req.query;
    const userEmp_id = req.user?.Emp_id;
    const dashboard_id = req.user?.Dashboard_id;

    if (!Emp_id) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required"
      });
    }
    if (dashboard_id === 4 && Emp_id !== userEmp_id) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own payslips"
      });
    }

    const monthNum = month ? Number(month) : null;
    const yearNum = year ? Number(year) : null;

    const result = await getPayslipByEmployeeService(Emp_id, monthNum, yearNum);

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
    console.error("[GetPayslipByEmployeeController] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get payslips"
    });
  }
};