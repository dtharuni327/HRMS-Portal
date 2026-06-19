import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { approvePayrollService } from "../../services/payroll/approvePayroll.service";
import { ACCESS } from "../../constants/payroll.constants";

export const approvePayrollController = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id: userEmpId, Dashboard_id } = req.user || {};
    const { Emp_id, month, year } = req.params;

    if (!userEmpId) {
      return res.status(401).json({ message: ACCESS.MESSAGE.UNAUTHORIZED });
    }

    if (Dashboard_id !== 1 && Dashboard_id !== 2 && Dashboard_id !== 5) {
      return res.status(403).json({ message: ACCESS.MESSAGE.ACCESS_DENIED });
    }

    const result = await approvePayrollService(Emp_id, parseInt(month), parseInt(year), userEmpId);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};