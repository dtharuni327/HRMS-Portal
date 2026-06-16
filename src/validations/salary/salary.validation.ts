import { body, param, query } from "express-validator";
import { PAYROLL_STATUS, PAYSLIP_STATUS } from "../../constants/salary.constants";

export const createSalaryStructureValidation = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("basicSalary")
    .notEmpty()
    .withMessage("Basic salary is required")
    .isFloat({ gt: 0 })
    .withMessage("Basic salary must be a positive number"),
  body("allowances")
    .optional()
    .isArray()
    .withMessage("Allowances must be an array"),
  body("deductions")
    .optional()
    .isArray()
    .withMessage("Deductions must be an array"),
  body("effectiveDate")
    .notEmpty()
    .withMessage("Effective date is required")
    .isISO8601()
    .withMessage("Effective date must be a valid ISO date")
];

export const updateSalaryStructureValidation = [
  param("salaryId")
    .notEmpty()
    .withMessage("Salary Id is required")
    .isString()
    .withMessage("Salary Id must be a string"),
  body("basicSalary")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Basic salary must be a positive number"),
  body("allowances")
    .optional()
    .isArray()
    .withMessage("Allowances must be an array"),
  body("deductions")
    .optional()
    .isArray()
    .withMessage("Deductions must be an array")
];

export const salaryIdValidation = [
  param("salaryId")
    .notEmpty()
    .withMessage("Salary Id is required")
    .isString()
    .withMessage("Salary Id must be a string")
];

export const payrollProcessingValidation = [
  body("month")
    .notEmpty()
    .withMessage("Month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage("Year must be valid"),
  body("processEmployees")
    .optional()
    .isArray()
    .withMessage("Process employees must be an array of employee IDs")
];

export const payslipIdValidation = [
  param("payslipId")
    .notEmpty()
    .withMessage("Payslip Id is required")
    .isString()
    .withMessage("Payslip Id must be a string")
];

export const bonusManagementValidation = [
  param("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("bonusAmount")
    .notEmpty()
    .withMessage("Bonus amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Bonus amount must be a positive number"),
  body("bonusMonth")
    .notEmpty()
    .withMessage("Bonus month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("Bonus month must be between 1 and 12"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
];
