import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { deleteDocumentService } from "../../services/documents/deleteDocument.service";
import { HTTP_STATUS, DOCUMENT_SP_MSG } from "../../constants/documents.constants";

const handleSpError = (err: any, res: Response): Response | null => {
  const msg: string = err?.message ?? "";
  const num: number = err?.number ?? 0;

  if (msg.includes(DOCUMENT_SP_MSG.NOT_FOUND)) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Document not found" });
  }
  if (msg.includes(DOCUMENT_SP_MSG.ACCESS_DENIED)) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: "You can only delete your own documents" });
  }
  if (num === 50000 && msg) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: msg });
  }
  return null;
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const requestedByEmpId = req.user?.Emp_id;
    const requestedByRole  = req.user?.role ?? "";

    if (!requestedByEmpId) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID" });
    }

    await deleteDocumentService({
      id: Number(req.params.id),
      requestedByEmpId,
      requestedByRole,
    });

    return res.status(HTTP_STATUS.OK).json({ success: true, message: "Document deleted successfully" });
  } catch (err: any) {
    const handled = handleSpError(err, res);
    if (handled) return handled;
    console.error("deleteDocument error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Server Error" });
  }
};