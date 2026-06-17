import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getDocumentsService } from "../../services/documents/getDocuments.service";
import { HTTP_STATUS } from "../../constants/documents.constants";
import { ROLES } from "../../middleware/role.middleware";

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;
    const loggedInRole  = req.user?.role ?? "";

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const isAdminRole = [ROLES.SUPER_ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER].includes(loggedInRole as any);

    // Admins/HR/Managers can query any empId. Employees can only see their own.
    const empId = isAdminRole
      ? (req.query.empId as string | undefined)
      : loggedInEmpId;

    const documents = await getDocumentsService({
      ...(req.query as any),
      empId,
    });

    return res.status(HTTP_STATUS.OK).json({ success: true, data: documents });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    console.error("getDocuments error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
