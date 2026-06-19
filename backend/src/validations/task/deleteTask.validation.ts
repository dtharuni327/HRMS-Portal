import { param } from "express-validator";

export const deleteTaskValidation = [
  param("taskId")
    .notEmpty()
    .withMessage("Task Id is required")
    .isString()
    .withMessage("Task Id must be a string")
];
