import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getOrganisationStructureService } from "../../services/organisation/getOrganisationStructure.service";
import { HTTP_STATUS } from "../../constants/organisation.constants";

export const getOrganisationStructure = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.Emp_id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const data = await getOrganisationStructureService(req.query as any);

    return res.status(HTTP_STATUS.OK).json({ success: true, data });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
    console.error("getOrganisationStructure error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
