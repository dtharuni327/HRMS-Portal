import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getMyProfileService } from "../../services/profile/getMyProfile.service";
import { HTTP_STATUS } from "../../constants/profile.constants";

export const getMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    if (!empId) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });

    const profile = await getMyProfileService(empId);
    if (!profile) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Profile not found" });

    return res.status(HTTP_STATUS.OK).json({ success: true, profile });
  } catch (err: any) {
    // RAISERROR('...', 16, 1) in the SP surfaces as err.number === 50000
    if (err?.number === 50000 && err?.message) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    }
    console.error("getMyProfile error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
