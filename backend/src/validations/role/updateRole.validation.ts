import { body, param } from "express-validator";

export const roleIdParamValidation = [
  param("id")
    .notEmpty()
    .withMessage("Role Id is required")
    .isNumeric()
    .withMessage("Role Id must be numeric")
];

export const updateRoleValidation = [
  body("role_name")
    .notEmpty()
    .withMessage("Role name is required"),
  body("permissions")
    .notEmpty()
    .withMessage("Permissions are required"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];