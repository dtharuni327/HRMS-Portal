import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createJobService } from "../../services/recruitment/createJob.service";
import { HTTP_STATUS, RECRUITMENT_SP_ERROR, RECRUITMENT_SP_MSG } from "../../constants/recruitment.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (num === RECRUITMENT_SP_ERROR.DUPLICATE_KEY || num === RECRUITMENT_SP_ERROR.DUPLICATE_INDEX) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "Duplicate entry detected" });
  }
  if (msg.includes(RECRUITMENT_SP_MSG.INVALID_DEPARTMENT)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid department" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const createJob = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    if (!empId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const job = await createJobService(req.body, empId);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Job posting created successfully",
      data: job,
    });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("createJob error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};