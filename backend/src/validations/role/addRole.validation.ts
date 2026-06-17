import { body } from "express-validator";

export const addRoleValidation = [
  body("role_name")
    .notEmpty()
    .withMessage("Role name is required"),
  body("permissions")
    .notEmpty()
    .withMessage("Permissions are required")
];