import { Response } from "express";
import { punchOutService } from "../../services/attendance/punchOut.service";
import { AuthRequest } from "../../middleware/auth.middleware";

const toIST = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 60 * 60 * 1000);
};

export const punchOutController = async (req: AuthRequest, res: Response) => {
  try {
    const Emp_id = req.user?.Emp_id;

    if (!Emp_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await punchOutService({ Emp_id });

    const istPunchIn = toIST(new Date(result.data.punch_in_time));
    const istPunchOut = toIST(new Date(result.data.punch_out_time));

    return res.status(200).json({
      success: true,
      message: result.message,
      work_mode: result.data.work_mode,
      punch_in_time: istPunchIn.toISOString().replace('T', ' ').substring(0, 19),
      punch_out_time: istPunchOut.toISOString().replace('T', ' ').substring(0, 19),
      total_hours: result.data.total_hours,
      attendance_status: result.data.attendance_status
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};