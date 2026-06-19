import { Response } from "express";
import { punchInService } from "../../services/attendance/punchIn.service";
import { punchInValidation } from "../../validations/attendance/punchIn.validation";
import { AuthRequest } from "../../middleware/auth.middleware";

const toIST = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 5.5 * 60 * 60 * 1000);
};

export const punchInController = async (req: AuthRequest, res: Response) => {
  try {
    const Emp_id = req.user?.Emp_id;

    if (!Emp_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const validated = punchInValidation.safeParse(req.body);

    if (!validated.success) {
      return res.status(400).json({ 
        message: "Invalid input", 
        errors: validated.error 
      });
    }

    const data = validated.data;

    const result = await punchInService({
      Emp_id,
      latitude: data.latitude,
      longitude: data.longitude
    });

    const istTime = toIST(new Date(result.data.punch_in_time));

    return res.status(200).json({
      success: true,
      message: result.message,
      work_mode: result.data.work_mode,
      punch_in_status: result.data.punch_in_status,
      punch_in_time: istTime.toISOString().replace('T', ' ').substring(0, 19)
    });
  } catch (error: any) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Server error" 
    });
  }
};