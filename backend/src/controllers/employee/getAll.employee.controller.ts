import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getAllEmployeesService } from "../../services/employee/getAll.employee.service";
import { HTTP_STATUS } from "../../constants/employee.constants";

export const getAllEmployees = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAllEmployeesService({
      ...(req.query as any), // query params forwarded as-is to service
      userRole: req.user?.role,
      userEmpId: req.user?.Emp_id,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Employees fetched successfully",
      data: result.employees,
      pagination: result.pagination,
    });
  } catch (err: unknown) {
    console.error("getAllEmployees error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Server Error",
    });
  }
};