import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { authorize } from "../middleware/role.middleware";

import { addDepartment } from "../controllers/department/addDepartment.controller";
import { updateDepartment } from "../controllers/department/updateDepartment.controller";
import { deleteDepartment } from "../controllers/department/deleteDepartment.controller";
import { getDepartments } from "../controllers/department/getDepartments.controller";

import { addDepartmentValidation } from "../validations/department/addDepartment.validation";
import {
  departmentIdParamValidation,
  updateDepartmentValidation
} from "../validations/department/updateDepartment.validation";

const router = Router();

// Add a new department - Restricted to Super Admin and HR Admin
router.post(
  "/add",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  addDepartmentValidation,
  validate,
  addDepartment
);

// Get all departments - Restricted to Super Admin and HR Admin
router.get(
  "/all",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getDepartments
);

// Update an existing department - Restricted to Super Admin and HR Admin
router.put(
  "/update/:id",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  departmentIdParamValidation,
  updateDepartmentValidation,
  validate,
  updateDepartment
);

router.delete(
  "/delete/:id",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  departmentIdParamValidation,
  validate,
  deleteDepartment
);

export default router;