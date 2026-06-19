import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { updatePayrollService } from "../../services/payroll/updatePayroll.service";
import { updatePayrollValidation } from "../../validations/payroll/updatePayroll.validation";
import { ACCESS } from "../../constants/payroll.constants";

export const updatePayrollController = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id: userEmpId, Dashboard_id } = req.user || {};
    const { Emp_id, month, year } = req.params;

    if (!userEmpId) {
      return res.status(401).json({ message: ACCESS.MESSAGE.UNAUTHORIZED });
    }

    if (Dashboard_id !== 1 && Dashboard_id !== 2 && Dashboard_id !== 5) {
      return res.status(403).json({ message: ACCESS.MESSAGE.ACCESS_DENIED });
    }

    const validated = updatePayrollValidation.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validated.error 
      });
    }

    const result = await updatePayrollService(Emp_id, parseInt(month), parseInt(year), validated.data);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};