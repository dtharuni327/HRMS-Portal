import { Router } from "express";
import { punchInController } from "../controllers/attendance/punchIn.controller";
import { authenticate } from "../middleware/auth.middleware";

import { getAttendanceSummary } from "../controllers/attendance/summary.controller.ts";
import { updateAttendanceValidation } from '../validations/attendance/update.validation';
import { updateAttendance } from '../controllers/attendance/update.controller';

import { canAccessEmployeeData , canViewDashboard, authorize, ROLES} from "../middleware/role.middleware";
import { punchOutController } from "../controllers/attendance/punchOut.controller";
import { getAttendanceDashboard } from "../controllers/attendance/dashboard.controller";

import { getAttendanceHistory } from "../controllers/attendance/history.controller";

const router = Router();

router.post("/punch-in", authenticate, canAccessEmployeeData, punchInController);
router.post("/punch-out", authenticate, punchOutController);

router.get(
  "/dashboard", authenticate, authorize(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER),
  canViewDashboard,
  getAttendanceDashboard
);

router.get(
  "/history/:empId",authenticate, authorize(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE),
  canAccessEmployeeData,
  getAttendanceHistory
);

router.get(
  "/summary/:empId",
  authenticate,
  authorize(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE),
  canAccessEmployeeData,
  getAttendanceSummary
);


router.put(
  '/update/:empId/:date',
  authenticate,
  authorize(ROLES.HR_ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER),
  canAccessEmployeeData,
  updateAttendanceValidation,
  updateAttendance
);



export default router;