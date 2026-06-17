import { Request, Response } from "express";
import { getProjectEffortByEmployee } from "../../services/projectEffort/getProjectEffortByEmployee";

export const getProjectEffortByEmployeeController = async (
  req: Request,
  res: Response
) => {
  try {
    const { empId } = req.params;

    const result = await getProjectEffortByEmployee(empId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Get Project Effort By Employee Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch employee project efforts",
    });
  }
};