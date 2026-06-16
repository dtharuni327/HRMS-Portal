import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getPayrollByEmployeeService } from "../../services/payroll/getPayrollByEmployee.service";
import { getPayrollByEmployeeValidation } from "../../validations/payroll/getPayrollByEmployee.validation";
import { ACCESS } from "../../constants/payroll.constants";

export const getPayrollByEmployeeController = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id, Dashboard_id } = req.user || {};
    const { employee_id } = req.params;

    if (!Emp_id) {
      return res.status(401).json({ message: ACCESS.MESSAGE.UNAUTHORIZED });
    }

    if (Dashboard_id !== 1 && Dashboard_id !== 2 && Dashboard_id !== 5) {
      return res.status(403).json({ message: ACCESS.MESSAGE.ACCESS_DENIED });
    }

    const validated = getPayrollByEmployeeValidation.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validated.error 
      });
    }

    const result = await getPayrollByEmployeeService(employee_id, validated.data);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};