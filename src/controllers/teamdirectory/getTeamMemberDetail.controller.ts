import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getTeamMemberDetailService } from "../../services/teamdirectory/getTeamMemberDetail.service";
import { HTTP_STATUS, TEAM_DIRECTORY_SP_MSG } from "../../constants/teamDirectory.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (msg.includes(TEAM_DIRECTORY_SP_MSG.EMPLOYEE_NOT_FOUND)) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Employee not found" });
  }
  if (msg.includes(TEAM_DIRECTORY_SP_MSG.ACCESS_DENIED)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied: not your team member" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const getTeamMemberDetail = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;
    const loggedInRole  = req.user?.role ?? "";

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const member = await getTeamMemberDetailService({
      empId: req.params.empId,
      loggedInEmpId,
      loggedInRole,
    });

    if (!member) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Employee not found" });
    }

    return res.status(HTTP_STATUS.OK).json({ success: true, data: member });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("getTeamMemberDetail error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};