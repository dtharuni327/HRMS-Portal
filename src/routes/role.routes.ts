import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { authorize } from "../middleware/role.middleware"; // Uses your optimized authorize array function

import { addRole } from "../controllers/role/addRole.controller";
import { updateRole } from "../controllers/role/updateRole.controller";
import { getRoles } from "../controllers/role/getRoles.controller";

import { addRoleValidation } from "../validations/role/addRole.validation";
import { updateRoleValidation } from "../validations/role/updateRole.validation";

const router = Router();

router.post(
  "/add", 
  authenticate, 
  authorize(["Super Admin", "HR Admin"]), 
  addRoleValidation, 
  validate, 
  addRole
);

router.get(
  "/all", 
  authenticate, 
  authorize(["Super Admin", "HR Admin"]), 
  getRoles
);

router.put(
  "/update/:role_id", 
  authenticate, 
  authorize(["Super Admin", "HR Admin"]), 
  updateRoleValidation, 
  validate, 
  updateRole
);

export default router;