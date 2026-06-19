import { Request, Response } from "express";
import { getJobByIdService } from "../../services/recruitment/getJobById.service";
import { HTTP_STATUS } from "../../constants/recruitment.constants";

export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await getJobByIdService(Number(req.params.id));
    if (!job) return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Job not found" });
    return res.status(HTTP_STATUS.OK).json({ success: true, data: job });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    console.error("getJobById error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
