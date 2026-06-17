import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { uploadDocumentSchema } from "../validations/documents/upload.document.validation";
import { getDocumentsSchema, getDocumentByIdSchema } from "../validations/documents/get.document.validation";
import { updateDocumentStatusSchema } from "../validations/documents/updateStatus.document.validation";
import { uploadDocument } from "../controllers/documents/uploadDocument.controller";
import { getDocuments } from "../controllers/documents/getDocuments.controller";
import { getDocumentById } from "../controllers/documents/getDocumentById.controller";
import { updateDocumentStatus } from "../controllers/documents/updateDocumentStatus.controller";
import { deleteDocument } from "../controllers/documents/deleteDocument.controller";

const router = Router();

// Any logged-in employee can upload their own document.
// HR/Admin can upload on behalf of another employee (empId in body).
router.post(
  "/",
  authenticate,
  validate(uploadDocumentSchema, "body"),
  uploadDocument
);

// Employee sees their own docs. HR/Admin/Manager can pass empId= to see others.
router.get(
  "/",
  authenticate,
  validate(getDocumentsSchema, "query"),
  getDocuments
);

// Get single document — ownership enforced in controller
router.get(
  "/:id",
  authenticate,
  validate(getDocumentByIdSchema, "params"),
  getDocumentById
);

// HR / Super Admin only — approve or reject a document
router.put(
  "/:id/status",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"),
  validate(getDocumentByIdSchema, "params"),
  validate(updateDocumentStatusSchema, "body"),
  updateDocumentStatus
);

// Employee can delete their own. HR/Admin can delete any.
router.delete(
  "/:id",
  authenticate,
  validate(getDocumentByIdSchema, "params"),
  deleteDocument
);

export default router;
