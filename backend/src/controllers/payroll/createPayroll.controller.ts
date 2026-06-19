import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createPayrollService } from "../../services/payroll/createPayroll.service";
import { createPayrollValidation } from "../../validations/payroll/createPayroll.validation";
import { PAYROLL, ACCESS } from "../../constants/payroll.constants";

export const createPayrollController = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id, Dashboard_id } = req.user || {};

    if (!Emp_id) {
      return res.status(401).json({ message: ACCESS.MESSAGE.UNAUTHORIZED });
    }

    if (Dashboard_id !== 1 && Dashboard_id !== 2 && Dashboard_id !== 5) {
      return res.status(403).json({ message: ACCESS.MESSAGE.ACCESS_DENIED });
    }

    const validated = createPayrollValidation.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validated.error 
      });
    }

    const result = await createPayrollService(validated.data);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};