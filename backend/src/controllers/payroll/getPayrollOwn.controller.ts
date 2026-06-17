import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getPayrollOwnService } from "../../services/payroll/getPayrollOwn.service";
import { getPayrollOwnValidation } from "../../validations/payroll/getPayrollOwn.validation";
import { PAYROLL } from "../../constants/payroll.constants";

export const getPayrollOwnController = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id, Dashboard_id } = req.user || {};

    if (!Emp_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validated = getPayrollOwnValidation.safeParse(req.query);

    if (!validated.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validated.error 
      });
    }

    const result = await getPayrollOwnService(Emp_id, validated.data);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};