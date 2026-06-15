import { body } from "express-validator";

export const updateRoleValidation = [
  body("role_id")
    .notEmpty()
    .withMessage("Role Id is required")
    .isNumeric()
    .withMessage("Role Id must be numeric"),
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