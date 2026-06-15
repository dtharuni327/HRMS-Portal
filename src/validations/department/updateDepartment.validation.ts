import { body } from "express-validator";

export const updateDepartmentValidation = [
  body("department_id")
    .notEmpty()
    .withMessage("Department Id is required")
    .isNumeric()
    .withMessage("Department Id must be numeric"),
  body("department_name")
    .notEmpty()
    .withMessage("Department name is required"),
  body("description")
    .notEmpty()
    .withMessage("Description is required"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];