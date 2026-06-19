// create.employee.controller.ts
import { Request, Response } from "express";
import { createEmployeeService } from "../../services/employee/create.employee.service";
import { HTTP_STATUS, EMPLOYEE_SP_ERROR } from "../../constants/employee.constants";

// native SQL constraint errors — these have real err.number values
const NATIVE_ERROR_MAP: Record<number, { status: number; message: string }> = {
  [EMPLOYEE_SP_ERROR.DUPLICATE_KEY]: { status: HTTP_STATUS.CONFLICT, message: "Duplicate entry detected" },
  [EMPLOYEE_SP_ERROR.DUPLICATE_INDEX]: { status: HTTP_STATUS.CONFLICT, message: "Duplicate entry detected" },
};

// RAISERROR always delivers err.number === 50000, so match by message text instead
const SP_MSG_MAP: Array<{ match: string; status: number; message: string }> = [
  { match: "Personal email already exists", status: HTTP_STATUS.CONFLICT, message: "Email already exists" },
  { match: "Phone number already exists", status: HTTP_STATUS.CONFLICT, message: "Phone already exists" },
  { match: "Invalid RoleID", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid RoleID" },
  { match: "Invalid Department_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid Department_id" },
  { match: "Invalid Dashboard_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid Dashboard_id" },
  { match: "Invalid client_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid client_id" },
  { match: "Invalid manager_id", status: HTTP_STATUS.BAD_REQUEST, message: "Invalid or unauthorized manager_id" },
];

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await createEmployeeService(req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      message: "Employee created successfully",
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

    console.error("createEmployee error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};