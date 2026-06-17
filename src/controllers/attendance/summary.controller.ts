import { Request, Response } from "express";
import { getAttendanceSummaryData } from "../../services/attendance/summary.service";

export const getAttendanceSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const empId = req.params.empId;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "month and year are required",
      });
    }

    const user = req.user;
    const role = user.role.trim().toUpperCase().replace(/\s+/g, "_");

    if (role !== "SUPER_ADMIN" && role !== "HR_ADMIN") {
      if (user.Emp_id !== empId) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const result = await getAttendanceSummaryData(empId, month, year);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Get Attendance Summary Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};