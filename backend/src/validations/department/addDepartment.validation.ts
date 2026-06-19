import { body } from "express-validator";

export const addDepartmentValidation = [
  body("department_name")
    .notEmpty()
    .withMessage("Department name is required"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
];