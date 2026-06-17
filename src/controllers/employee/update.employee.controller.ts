// update.employee.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { updateEmployeeService } from "../../services/employee/update.employee.service";
import { HTTP_STATUS, EMPLOYEE_SP_ERROR } from "../../constants/employee.constants";

// native SQL constraint errors — these have real err.number values
const NATIVE_ERROR_MAP: Record<number, { status: number; message: string }> = {
  [EMPLOYEE_SP_ERROR.DUPLICATE_KEY]: { status: HTTP_STATUS.CONFLICT, message: "Email or phone already exists" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_INDEX]: { status: HTTP_STATUS.CONFLICT, message: "Email or phone already exists" },
};

// RAISERROR always delivers err.number === 50000, so match by message text instead
const SP_MSG_MAP: Array<{ match: string; status: number; message: string }> = [
  { match: "Employee not found", status: HTTP_STATUS.NOT_FOUND, message: "Employee not found" },
  { match: "You can only update your own profile", status: HTTP_STATUS.FORBIDDEN, message: "You can only update your own profile" },
  { match: "Access denied: cannot update restricted fields", status: HTTP_STATUS.FORBIDDEN, message: "Access denied: cannot update restricted fields" },
  { match: "Access denied", status: HTTP_STATUS.FORBIDDEN, message: "Access denied" },
  { match: "Email already exists", status: HTTP_STATUS.CONFLICT, message: "Email already exists" },
  { match: "Phone already exists", status: HTTP_STATUS.CONFLICT, message: "Phone already exists" },
  { match: "Employee cannot be their own manager", status: HTTP_STATUS.BAD_REQUEST, message: "Employee cannot be their own manager" },
  { match: "Invalid manager_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid manager_id" },
  { match: "Invalid role_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid role_id" },
  { match: "Invalid department_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid department_id" },
  { match: "Invalid client_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid client_id" },
  { match: "Invalid Gender", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid Gender value" },
];

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
    const nativeErr = NATIVE_ERROR_MAP[err?.number];
    if (nativeErr) return res.status(nativeErr.status).json({ message: nativeErr.message });

    if (err?.number === 50000 && err?.message) {
      const matched = SP_MSG_MAP.find(({ match }) => err.message.includes(match));
      if (matched) return res.status(matched.status).json({ message: matched.message });
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message }); // unknown SP error, still a 400
    }

    console.error("updateEmployee error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};