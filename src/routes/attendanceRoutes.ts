import express from "express";
import { punchIn, punchOut } from "../controllers/attendanceController";
import { verifyToken } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/punch-in", verifyToken, punchIn);
router.post("/punch-out", verifyToken, punchOut);

export default router;