import express from "express";
import { punchIn, punchOut, getAttendance ,getAttendanceSummary } from "../controllers/attendanceController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/punch-in", verifyToken, punchIn);
router.post("/punch-out", verifyToken, punchOut);
router.get("/:empId", verifyToken, getAttendance);
router.get("/summary/:empId", verifyToken, getAttendanceSummary);
export default router;