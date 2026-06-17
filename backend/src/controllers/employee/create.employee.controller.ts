import { Request, Response } from "express";
import { createEmployeeService } from "../../services/employee/create.employee.service";
import { HTTP_STATUS, EMPLOYEE_SP_ERROR } from "../../constants/employee.constants";

// Maps SP error codes to HTTP responses
const SP_ERROR_MAP: Record<number, { status: number; message: string }> = {
  [EMPLOYEE_SP_ERROR.EMAIL_EXISTS]: { status: HTTP_STATUS.CONFLICT, message: "Email already exists" },
  [EMPLOYEE_SP_ERROR.PHONE_EXISTS]: { status: HTTP_STATUS.CONFLICT, message: "Phone already exists" },
  [EMPLOYEE_SP_ERROR.INVALID_ROLE]: { status: HTTP_STATUS.BAD_REQUEST, message: "Invalid RoleID" },
  [EMPLOYEE_SP_ERROR.INVALID_DEPARTMENT]: { status: HTTP_STATUS.BAD_REQUEST, message: "Invalid Department_id" },
  [EMPLOYEE_SP_ERROR.INVALID_DASHBOARD]: { status: HTTP_STATUS.BAD_REQUEST, message: "Invalid Dashboard_id" },
  [EMPLOYEE_SP_ERROR.INVALID_CLIENT]: { status: HTTP_STATUS.BAD_REQUEST, message: "Invalid client_id" },
  [EMPLOYEE_SP_ERROR.INVALID_MANAGER]: { status: HTTP_STATUS.BAD_REQUEST, message: "Invalid or unauthorized manager_id" },
  [EMPLOYEE_SP_ERROR.SELF_MANAGER]: { status: HTTP_STATUS.BAD_REQUEST, message: "Employee cannot be their own manager" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_KEY]: { status: HTTP_STATUS.CONFLICT, message: "Duplicate entry detected" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_INDEX]: { status: HTTP_STATUS.CONFLICT, message: "Duplicate entry detected" },
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createEmployeeService(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (err: any) {
    // Check if the DB threw a known SP error before falling back to 500
    const spErr = SP_ERROR_MAP[err?.number];
    if (spErr) return res.status(spErr.status).json({ message: spErr.message });
    if (err?.number === 50000 && err?.message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
    console.error("createEmployee error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
