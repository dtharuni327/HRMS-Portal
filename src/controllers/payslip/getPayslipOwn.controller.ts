import { Request, Response } from "express";
import { getPayslipByEmployeeService } from "../../services/payslip/getPayslipByEmployee.service";

export const getPayslipOwnController = async (req: Request, res: Response) => {
  try {
    const userEmp_id = req.user?.Emp_id;
    const { month, year } = req.query;

    if (!userEmp_id) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const monthNum = month ? Number(month) : null;
    const yearNum = year ? Number(year) : null;

    const result = await getPayslipByEmployeeService(userEmp_id, monthNum, yearNum);

    if (!result.success) {
      return res.status(result.statusCode ?? 404).json({
        success: false,
        message: result.message ?? "Failed to get your payslips"
      });
    }

    return res.status(200).json({
      success: true,
      data: result.data ?? []
    });
  } catch (error) {
    console.error("[GetPayslipOwnController] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get your payslips"
    });
  }
};