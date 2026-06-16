import { Router } from "express";
import { getAuditLogs } from "../controllers/audit/getAuditLogs.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();
router.get(
  "/all",
  authenticate,
  getAuditLogs
);
export default router;