import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { uploadDocumentService } from "../../services/documents/uploadDocument.service";
import { HTTP_STATUS, DOCUMENT_SP_ERROR, DOCUMENT_SP_MSG } from "../../constants/documents.constants";
import { ROLES } from "../../middleware/role.middleware";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (num === DOCUMENT_SP_ERROR.DUPLICATE_KEY || num === DOCUMENT_SP_ERROR.DUPLICATE_INDEX) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "Duplicate document entry detected" });
  }
  if (msg.includes(DOCUMENT_SP_MSG.INVALID_EMPLOYEE)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Employee not found" });
  }
  if (msg.includes(DOCUMENT_SP_MSG.ALREADY_EXISTS)) {
    return res.status(HTTP_STATUS.CONFLICT).json({ message: "A document with this name already exists for this employee. Please delete it first." });
  }
  if (msg.includes(DOCUMENT_SP_MSG.ACCESS_DENIED)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Access denied" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const uploadedByEmpId = req.user?.Emp_id;
    const loggedInRole    = req.user?.role ?? "";

    if (!uploadedByEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }
    
    const isAdminRole = [ROLES.SUPER_ADMIN, ROLES.HR_ADMIN].includes(loggedInRole as any);
    const empId = (isAdminRole && req.body.empId) ? req.body.empId : uploadedByEmpId;

    const document = await uploadDocumentService({
      ...req.body,
      empId,
      uploadedByEmpId,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("uploadDocument error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};