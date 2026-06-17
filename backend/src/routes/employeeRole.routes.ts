import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { mapEmployeeRoleValidation, updateEmployeeRoleValidation, deleteEmployeeRoleValidation } from "../validations/role/employeeRole.validation";
import { mapEmployeeRole, getEmployeeRole, getAllEmployeeRoles, updateEmployeeRole, deleteEmployeeRole } from "../controllers/role/employeeRole.controller";

const router = Router();

router.post(
  "/map",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  mapEmployeeRoleValidation,
  validate,
  mapEmployeeRole
);

router.get(
  "/all",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getAllEmployeeRoles
);

router.get(
  "/employee/:employeeId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getEmployeeRole
);

router.put(
  "/update/:employeeId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  updateEmployeeRoleValidation,
  validate,
  updateEmployeeRole
);

router.delete(
  "/delete/:employeeId/:roleId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  deleteEmployeeRoleValidation,
  validate,
  deleteEmployeeRole
);

export default router;