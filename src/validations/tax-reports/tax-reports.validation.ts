import { body, param, query } from "express-validator";
import { TAX_COMPONENTS, TAX_REPORT_TYPES, FILING_STATUS } from "../../constants/tax-reports.constants";

export const generateTaxReportValidation = [
  body("reportType")
    .notEmpty()
    .withMessage("Report type is required")
    .isIn(TAX_REPORT_TYPES)
    .withMessage(`Report type must be one of: ${TAX_REPORT_TYPES.join(", ")}`),
  body("component")
    .notEmpty()
    .withMessage("Tax component is required")
    .isIn(TAX_COMPONENTS)
    .withMessage(`Tax component must be one of: ${TAX_COMPONENTS.join(", ")}`),
  body("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage("Year must be valid")
];

export const taxReportIdValidation = [
  param("reportId")
    .notEmpty()
    .withMessage("Report Id is required")
    .isString()
    .withMessage("Report Id must be a string")
];

export const exportTaxReportValidation = [
  param("reportId")
    .notEmpty()
    .withMessage("Report Id is required")
    .isString()
    .withMessage("Report Id must be a string"),
  query("format")
    .optional()
    .isIn(["PDF", "EXCEL", "CSV"])
    .withMessage("Format must be PDF, EXCEL, or CSV")
];

export const updateFilingStatusValidation = [
  param("reportId")
    .notEmpty()
    .withMessage("Report Id is required")
    .isString()
    .withMessage("Report Id must be a string"),
  body("filingStatus")
    .notEmpty()
    .withMessage("Filing status is required")
    .isIn(FILING_STATUS)
    .withMessage(`Filing status must be one of: ${FILING_STATUS.join(", ")}`),
  body("filingDate")
    .optional()
    .isISO8601()
    .withMessage("Filing date must be a valid ISO date")
];
