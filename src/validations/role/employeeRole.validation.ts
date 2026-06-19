import { body, param } from "express-validator";

export const mapEmployeeRoleValidation = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role Id must be a string")
];

export const updateEmployeeRoleValidation = [
  param("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role Id must be a string")
];

export const deleteEmployeeRoleValidation = [
  param("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  param("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role Id must be a string")
];