import { Request, Response } from "express";
import { getAllJobsService } from "../../services/recruitment/getAllJobs.service";
import { HTTP_STATUS } from "../../constants/recruitment.constants";

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { jobs, total } = await getAllJobsService(req.query as any);
    return res.status(HTTP_STATUS.OK).json({ success: true, data: jobs, total });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    console.error("getAllJobs error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
