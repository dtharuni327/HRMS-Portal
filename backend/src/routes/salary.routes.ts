import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createSalaryStructureValidation,
  updateSalaryStructureValidation,
  salaryIdValidation,
  payrollProcessingValidation,
  payslipIdValidation,
  bonusManagementValidation
} from "../validations/salary/salary.validation";
import {
  createSalaryStructure,
  getSalaryStructures,
  getEmployeeSalary,
  getSalaryById,
  updateSalaryStructure,
  processPayroll,
  generatePayslip,
  getPayslips,
  getPayslipById,
  addBonus,
  getBonuses,
  addIncentive,
  getSalaryReports
} from "../controllers/salary/salary.controller";

const router = Router();

// Salary Structure Management
router.post(
  "/structure/create",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  createSalaryStructureValidation,
  validate,
  createSalaryStructure
);

router.get(
  "/structure/all",
  authenticate,
  authorize(["Finance", "HR Admin", "Super Admin"]),
  getSalaryStructures
);

router.get(
  "/structure/employee/:employeeId",
  authenticate,
  authorize(["Employee", "Finance", "HR Admin", "Super Admin"]),
  getEmployeeSalary
);

router.get(
  "/structure/:salaryId",
  authenticate,
  authorize(["Employee", "Finance", "HR Admin", "Super Admin"]),
  salaryIdValidation,
  validate,
  getSalaryById
);

router.put(
  "/structure/:salaryId/update",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  updateSalaryStructureValidation,
  validate,
  updateSalaryStructure
);

// Payroll Processing
router.post(
  "/payroll/process",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  payrollProcessingValidation,
  validate,
  processPayroll
);

// Payslip Management
router.post(
  "/:salaryId/payslip/generate",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  payslipIdValidation,
  validate,
  generatePayslip
);

router.get(
  "/payslip/all",
  authenticate,
  authorize(["Employee", "Finance", "HR Admin", "Super Admin"]),
  getPayslips
);

router.get(
  "/payslip/:payslipId",
  authenticate,
  authorize(["Employee", "Finance", "HR Admin", "Super Admin"]),
  payslipIdValidation,
  validate,
  getPayslipById
);

// Bonus Management
router.post(
  "/:employeeId/bonus/add",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  bonusManagementValidation,
  validate,
  addBonus
);

router.get(
  "/bonus/all",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  getBonuses
);

// Incentive Management
router.post(
  "/:employeeId/incentive/add",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  bonusManagementValidation,
  validate,
  addIncentive
);

// Reports
router.get(
  "/reports/analytics",
  authenticate,
  authorize(["Finance", "HR Admin", "Super Admin"]),
  getSalaryReports
);

export default router;
