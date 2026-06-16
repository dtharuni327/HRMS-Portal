import { param } from "express-validator";

export const getInternalJobByIdValidation = [
  param("jobId")
    .notEmpty()
    .withMessage("Job Id is required")
    .isString()
    .withMessage("Job Id must be a string")
];
