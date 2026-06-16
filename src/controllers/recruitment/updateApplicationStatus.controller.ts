import { Request, Response } from "express";
import { updateApplicationStatusService } from "../../services/recruitment/updateApplicationStatus.service";
import { HTTP_STATUS, RECRUITMENT_SP_MSG } from "../../constants/recruitment.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (msg.includes(RECRUITMENT_SP_MSG.APPLICATION_NOT_FOUND)) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Application not found" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const application = await updateApplicationStatusService(Number(req.params.id), req.body);
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("updateApplicationStatus error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};