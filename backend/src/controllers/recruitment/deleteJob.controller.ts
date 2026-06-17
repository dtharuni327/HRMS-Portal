import { Request, Response } from "express";
import { deleteJobService } from "../../services/recruitment/deleteJob.service";
import { HTTP_STATUS, RECRUITMENT_SP_MSG } from "../../constants/recruitment.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (msg.includes(RECRUITMENT_SP_MSG.JOB_NOT_FOUND)) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Job not found" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    await deleteJobService(Number(req.params.id));
    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Job deleted successfully" });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("deleteJob error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};