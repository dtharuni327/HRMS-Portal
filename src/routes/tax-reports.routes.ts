import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  generateTaxReportValidation,
  taxReportIdValidation,
  exportTaxReportValidation,
  updateFilingStatusValidation
} from "../validations/tax-reports/tax-reports.validation";
import {
  generateTaxReport,
  getTaxReports,
  getTaxReportById,
  exportTaxReport,
  updateFilingStatus,
  getComplianceDeadlines
} from "../controllers/tax-reports/tax-reports.controller";

const router = Router();

router.post(
  "/generate",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  generateTaxReportValidation,
  validate,
  generateTaxReport
);

router.get(
  "/",
  authenticate,
  authorize(["Finance", "HR Admin", "Super Admin"]),
  getTaxReports
);

router.get(
  "/deadlines",
  authenticate,
  authorize(["Finance", "HR Admin", "Super Admin"]),
  getComplianceDeadlines
);

router.get(
  "/:reportId",
  authenticate,
  authorize(["Finance", "HR Admin", "Super Admin"]),
  taxReportIdValidation,
  validate,
  getTaxReportById
);

router.get(
  "/:reportId/export",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  exportTaxReportValidation,
  validate,
  exportTaxReport
);

router.put(
  "/:reportId/filing-status",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  updateFilingStatusValidation,
  validate,
  updateFilingStatus
);

export default router;
