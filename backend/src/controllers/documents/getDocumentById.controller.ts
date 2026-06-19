import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { getDocumentByIdService } from "../../services/documents/getDocumentById.service";
import { HTTP_STATUS } from "../../constants/documents.constants";
import { ROLES } from "../../middleware/role.middleware";

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const loggedInEmpId = req.user?.Emp_id;
    const loggedInRole  = req.user?.role ?? "";

    if (!loggedInEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    const document = await getDocumentByIdService(Number(req.params.id));

    if (!document) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Document not found" });
    }

    // Non-admins can only view their own documents
    const isAdminRole = [ROLES.SUPER_ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER].includes(loggedInRole as any);
    if (!isAdminRole && document.emp_id !== loggedInEmpId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied" });
    }

    return res.status(HTTP_STATUS.OK).json({ success: true, data: document });
  } catch (err: any) {
    if (err?.number === 50000 && err?.message) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
    console.error("getDocumentById error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};
