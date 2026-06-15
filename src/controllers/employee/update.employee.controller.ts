import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { updateEmployeeService } from "../../services/employee/update.employee.service";
import { HTTP_STATUS, EMPLOYEE_SP_ERROR } from "../../constants/employee.constants";

const SP_ERROR_MAP: Record<number, { status: number; message: string }> = {
  [EMPLOYEE_SP_ERROR.NOT_FOUND]: { status: HTTP_STATUS.NOT_FOUND, message: "Employee not found" },
  [EMPLOYEE_SP_ERROR.MANAGER_SELF_ONLY]: { status: HTTP_STATUS.FORBIDDEN, message: "Managers can only update their own profile" },
  [EMPLOYEE_SP_ERROR.ACCESS_DENIED]: { status: HTTP_STATUS.FORBIDDEN, message: "Access denied" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_KEY]: { status: HTTP_STATUS.CONFLICT, message: "Email or phone already exists" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_INDEX]: { status: HTTP_STATUS.CONFLICT, message: "Email or phone already exists" },
};

export const updateEmployee = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;
    const loggedInRole = req.user?.role?.toUpperCase();

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized: Missing user ID",
      });
    }

    const employee = await updateEmployeeService({
      ...req.body, // caller-supplied fields merged with route context below
      empId: req.params.empId.trim().toUpperCase(),
      loggedInEmpId,
      loggedInRole: loggedInRole ?? "", // fallback keeps service param contract intact
    });

    return res.status(HTTP_STATUS.OK).json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (err: any) {
    const spErr = SP_ERROR_MAP[err?.number]; // SP signals errors via error number
    if (spErr) return res.status(spErr.status).json({ message: spErr.message });

    // String-based RAISERROR('...', 16, 1) calls in the SP default to error
    // number 50000 — surface the SP's own message as a 400 instead of a
    // generic 500 (e.g. "Employee not found", "Invalid Gender",
    // "Access denied: cannot update restricted fields", etc.)
    if (err?.number === 50000 && err?.message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }

    console.error("updateEmployee error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};