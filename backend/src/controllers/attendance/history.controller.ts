import { Request, Response } from "express";
import { getAttendanceData } from "../../services/attendance/history.service";

export const getAttendanceHistory = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const empId = req.params.empId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;

    const result = await getAttendanceData(empId, page, limit);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Get Attendance Error:", error);

    const statusCode =
      error.message === "Employee not found"
        ? 404
        : error.message === "Managers can access only their team members"
        ? 403
        : error.message === "Access denied"
        ? 403
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};