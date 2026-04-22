import express from "express";
import { punchIn, punchOut } from "../controllers/attendanceController";
const router = express.Router();

// ---------------- PUNCH IN ----------------
router.post("/punch-in", punchIn);


// ---------------- PUNCH OUT ----------------
router.post("/punch-out", punchOut);
export default router;