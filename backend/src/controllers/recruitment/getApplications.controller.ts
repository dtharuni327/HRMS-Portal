import { Request, Response } from "express";
import { getApplicationsService } from "../../services/recruitment/getApplications.service";
import { HTTP_STATUS } from "../../constants/recruitment.constants";

export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await getApplicationsService(req.query as any);
    return res.status(HTTP_STATUS.OK).json({ success: true, data: applications });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    console.error("getApplications error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
