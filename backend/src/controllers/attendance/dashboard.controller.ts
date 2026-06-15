import { Request, Response } from "express";
import { getDashboard } from "../../services/attendance/dashboard.service";

export const getAttendanceDashboard = async (req: Request, res: Response) => {
  try {
    const result = await getDashboard();

    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message,
    });
  }
};