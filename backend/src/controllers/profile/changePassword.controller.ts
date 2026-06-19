import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { changePasswordService } from "../../services/profile/changePassword.service";
import { HTTP_STATUS, PROFILE_SP_ERROR } from "../../constants/profile.constants";

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    if (!empId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    await changePasswordService({ ...req.body, empId });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err: any) {
    const num: number = err?.number ?? 0;
    const msg: string = err?.message ?? "";

    
    if (num === PROFILE_SP_ERROR.NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Employee not found" });
    }
    if (num === PROFILE_SP_ERROR.INVALID_PASSWORD) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Current password is incorrect" });
    }
    // sp_ChangeEmployeePassword THROW 50010 preserves error number
    if (msg.includes("Employee not found")) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Employee not found" });
    }
    if (num === 50000 && msg) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
    }
    console.error("changePassword error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};