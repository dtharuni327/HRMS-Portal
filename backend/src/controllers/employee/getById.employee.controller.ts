import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getEmployeeByIdService } from "../../services/employee/getById.employee.service";
import { HTTP_STATUS } from "../../constants/employee.constants";

export const getEmployeeById = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Unauthorized: Missing user ID",
      });
    }

    const employee = await getEmployeeByIdService({
      empId: req.params.empId,
      loggedInEmpId, // used by service to enforce self-access rule
      role: req.user?.role,
    });

    if (!employee) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Employee not found or you do not have permission to view this profile",
      });
    }

    return res.status(HTTP_STATUS.OK).json({ employee });
  } catch (err: unknown) {
    console.error("getEmployeeById error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};