import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { assignUserRoleValidation } from "../validations/role/userRole.validation";
import { updateUserRoleValidation } from "../validations/role/userRole.validation";
import { assignUserRole, getUserRoles, updateUserRole } from "../controllers/role/userRole.controller";

const router = Router();

router.post(
  "/assign",
  authenticate,
  authorize(["Super Admin"]),
  assignUserRoleValidation,
  validate,
  assignUserRole
);

router.get(
  "/user/:userId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getUserRoles
);

router.put(
  "/update/:userId",
  authenticate,
  authorize(["Super Admin"]),
  updateUserRoleValidation,
  validate,
  updateUserRole
);

export default router;