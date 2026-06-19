import { body, param } from "express-validator";

export const assignUserRoleValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User Id is required")
    .isString()
    .withMessage("User Id must be a string"),
  body("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role Id must be a string")
];

export const updateUserRoleValidation = [
  param("userId")
    .notEmpty()
    .withMessage("User Id is required")
    .isString()
    .withMessage("User Id must be a string"),
  body("roleId")
    .notEmpty()
    .withMessage("Role Id is required")
    .isString()
    .withMessage("Role Id must be a string")
];