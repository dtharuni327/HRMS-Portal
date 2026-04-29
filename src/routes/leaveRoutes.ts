import express from "express";
import {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/leave", verifyToken, applyLeave);
router.get("/leave", verifyToken, getAllLeaves);
router.put("/leave/:id", verifyToken, updateLeaveStatus);

export default router;