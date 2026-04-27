import express from "express";
import {
  applyLeave,
  getLeaves,
  updateLeave,
} from "../controllers/leaveController";
import { verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/leave", verifyToken, applyLeave);
router.get("/leave", getLeaves);
router.put("/leave/:id", updateLeave);

export default router;