import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { applyToJobService } from "../../services/recruitment/applyToJob.service";
import { HTTP_STATUS, RECRUITMENT_SP_ERROR, RECRUITMENT_SP_MSG } from "../../constants/recruitment.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (num === RECRUITMENT_SP_ERROR.DUPLICATE_KEY || num === RECRUITMENT_SP_ERROR.DUPLICATE_INDEX) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "Duplicate application entry" });
  }
  if (msg.includes(RECRUITMENT_SP_MSG.JOB_NOT_FOUND)) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Job not found" });
  }
  if (msg.includes(RECRUITMENT_SP_MSG.JOB_CLOSED)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "This job posting is closed" });
  }
  if (msg.includes(RECRUITMENT_SP_MSG.ALREADY_APPLIED)) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "You have already applied for this job" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const applyToJob = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    if (!empId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const application = await applyToJobService(Number(req.params.id), empId, req.body);
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("applyToJob error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};