import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
	getSystemStatus,
	getSystemMetrics,
	checkDatabase,
	checkApi,
	activeSessions,
	errorRate,
	backupStatus,
	getHealthConfiguration,
	createHealthConfiguration,
	updateHealthConfiguration
} from "../controllers/systemHealth/systemHealth.controller";

const router = Router();

// All endpoints restricted to Super Admin
router.get("/status", authenticate, authorize(["Super Admin"]), getSystemStatus);
router.get("/metrics", authenticate, authorize(["Super Admin"]), getSystemMetrics);
router.get("/check-db", authenticate, authorize(["Super Admin"]), checkDatabase);
router.get("/check-api", authenticate, authorize(["Super Admin"]), checkApi);
router.get("/active-sessions", authenticate, authorize(["Super Admin"]), activeSessions);
router.get("/error-rate", authenticate, authorize(["Super Admin"]), errorRate);
router.get("/backup-status", authenticate, authorize(["Super Admin"]), backupStatus);

// Health config (Super Admin only)
router.get("/config", authenticate, authorize(["Super Admin"]), getHealthConfiguration);
router.post("/config", authenticate, authorize(["Super Admin"]), createHealthConfiguration);
router.put("/config", authenticate, authorize(["Super Admin"]), updateHealthConfiguration);

export default router;
