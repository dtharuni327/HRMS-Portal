import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { updateMyProfileService } from "../../services/profile/updateMyProfile.service";
import { HTTP_STATUS, PROFILE_SP_ERROR } from "../../constants/profile.constants";


const handleSpError = (
  err: any,
  res: Response
): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (num === PROFILE_SP_ERROR.DUPLICATE_KEY || num === PROFILE_SP_ERROR.DUPLICATE_INDEX) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "Email or phone already exists" });
  }
  if (msg.includes("Employee not found")) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Profile not found" });
  }
  if (msg.includes("Access denied")) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied" });
  }
  // Generic SP message fallback (RAISERROR number = 50000)
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const updateMyProfile = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    if (!empId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const profile = await updateMyProfileService({ ...req.body, empId });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("updateMyProfile error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};