import { Router } from "express";

import { applyLeave } from "../controllers/leave/applyLeave.controller";
import { getAllLeaves } from "../controllers/leave/getAllLeaves.controller";
import { updateLeaveStatus } from "../controllers/leave/updateLeaveStatus.controller";
import { getTeamLeaveCalendar } from "../controllers/leave/getTeamLeaveCalender.controller";

import { applyLeaveValidation } from "../validations/leave/applyLeave.validation";
import { updateLeaveStatusValidation } from "../validations/leave/updateLeaveStatus.validation";

import { validate } from "../middleware/validation.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/apply",
  authenticate,
  applyLeaveValidation,
  validate,
  applyLeave
);

router.get(
  "/all",
  authenticate,
  getAllLeaves
);
router.put(
  "/status/:Emp_id",
  authenticate,
  updateLeaveStatusValidation,
  validate,
  updateLeaveStatus
);

router.get(
  "/team-calendar",
  authenticate,
  getTeamLeaveCalendar
);

export default router;