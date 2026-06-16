import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { mapEmployeeDepartmentValidation, updateEmployeeDepartmentValidation, deleteEmployeeDepartmentValidation } from "../validations/department/employeeDepartment.validation";
import { mapEmployeeDepartment, getEmployeeDepartment, getAllEmployeeDepartments, updateEmployeeDepartment, deleteEmployeeDepartment } from "../controllers/department/employeeDepartment.controller";

const router = Router();

router.post(
  "/map",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  mapEmployeeDepartmentValidation,
  validate,
  mapEmployeeDepartment
);

router.get(
  "/all",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getAllEmployeeDepartments
);

router.get(
  "/employee/:employeeId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  getEmployeeDepartment
);

router.put(
  "/update/:employeeId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  updateEmployeeDepartmentValidation,
  validate,
  updateEmployeeDepartment
);

router.delete(
  "/delete/:employeeId/:departmentId",
  authenticate,
  authorize(["Super Admin", "HR Admin"]),
  deleteEmployeeDepartmentValidation,
  validate,
  deleteEmployeeDepartment
);

export default router;