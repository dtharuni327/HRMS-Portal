import { body, param } from "express-validator";

export const mapEmployeeDepartmentValidation = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("departmentId")
    .notEmpty()
    .withMessage("Department Id is required")
    .isString()
    .withMessage("Department Id must be a string")
];

export const updateEmployeeDepartmentValidation = [
  param("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  body("departmentId")
    .notEmpty()
    .withMessage("Department Id is required")
    .isString()
    .withMessage("Department Id must be a string")
];

export const deleteEmployeeDepartmentValidation = [
  param("employeeId")
    .notEmpty()
    .withMessage("Employee Id is required")
    .isString()
    .withMessage("Employee Id must be a string"),
  param("departmentId")
    .notEmpty()
    .withMessage("Department Id is required")
    .isString()
    .withMessage("Department Id must be a string")
];