import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize, canAccessEmployeeData } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getAllEmployeeSchema } from "../validations/employee/getAll.employee.validation";
import { getByIdEmployeeSchema } from "../validations/employee/getById.employee.validation";
import { createEmployeeSchema } from "../validations/employee/create.employee.validation";
import { updateEmployeeSchema } from "../validations/employee/update.employee.validation";
import { getAllEmployees } from "../controllers/employee/getAll.employee.controller";
import { getEmployeeById } from "../controllers/employee/getById.employee.controller";
import { createEmployee } from "../controllers/employee/create.employee.controller";
import { updateEmployee } from "../controllers/employee/update.employee.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"), // admin-only
  validate(getAllEmployeeSchema, "query"),
  getAllEmployees
);

router.get(
  "/:empId",
  authenticate,
  canAccessEmployeeData, // self + admin access
  validate(getByIdEmployeeSchema, "params"),
  getEmployeeById
);

router.post(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"), // creation restricted to admins
  validate(createEmployeeSchema, "body"),
  createEmployee
);

router.put(
  "/:empId",
  authenticate,
  canAccessEmployeeData, // self + admin access
  validate(updateEmployeeSchema, "body"),
  updateEmployee
);

export default router;