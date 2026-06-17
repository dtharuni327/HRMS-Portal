import { body, param } from "express-validator";

export const createInternalJobValidation = [
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
  body("location")
    .notEmpty()
    .withMessage("Location is required")
    .isString()
    .withMessage("Location must be a string"),
  body("employmentType")
    .notEmpty()
    .withMessage("Employment type is required")
    .isString()
    .withMessage("Employment type must be a string"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];

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
  body("location")
    .optional()
    .isString()
    .withMessage("Location must be a string"),
  body("employmentType")
    .optional()
    .isString()
    .withMessage("Employment type must be a string"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];

export const internalJobIdValidation = [
  param("jobId")
    .notEmpty()
    .withMessage("Job Id is required")
    .isString()
    .withMessage("Job Id must be a string")
];
