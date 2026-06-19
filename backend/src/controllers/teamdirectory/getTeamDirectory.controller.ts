import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getTeamDirectoryService } from "../../services/teamdirectory/getTeamDirectory.service";
import { HTTP_STATUS } from "../../constants/teamDirectory.constants";

export const getTeamDirectory = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;
    const loggedInRole  = req.user?.role ?? "";

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const teams = await getTeamDirectoryService({
      ...(req.query as any),
      loggedInEmpId,
      loggedInRole,
    });

    return res.status(HTTP_STATUS.OK).json({ success: true, data: teams });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
    console.error("getTeamDirectory error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
