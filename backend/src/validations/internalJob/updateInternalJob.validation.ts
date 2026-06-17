import { body, param } from "express-validator";

export const updateInternalJobValidation = [
  param("jobId")
    .notEmpty()
    .withMessage("Job Id is required")
    .isString()
    .withMessage("Job Id must be a string"),
  body("title")
    .optional()
    .isString()
    .withMessage("Job title must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Job description must be a string"),
  body("department")
    .optional()
    .isString()
    .withMessage("Department must be a string"),
  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),
  body("applicationDeadline")
    .optional()
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
