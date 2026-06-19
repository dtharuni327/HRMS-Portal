import { body } from "express-validator";

export const addInternalJobValidation = [
  body("title")
    .notEmpty()
    .withMessage("Job title is required")
    .isString()
    .withMessage("Job title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Job description is required")
    .isString()
    .withMessage("Job description must be a string"),
  body("department")
    .notEmpty()
    .withMessage("Department is required")
    .isString()
    .withMessage("Department must be a string"),
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string"),
  body("applicationDeadline")
    .notEmpty()
    .withMessage("Application deadline is required")
    .isISO8601()
    .withMessage("Application deadline must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Application deadline must be a future date");
      }
      return true;
    }),
  body("requirements")
    .optional()
    .isString()
    .withMessage("Requirements must be a string"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];
