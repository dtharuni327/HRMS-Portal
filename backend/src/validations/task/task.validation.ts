import { body, param } from "express-validator";

export const createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Task title is required")
    .isString()
    .withMessage("Task title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Task description is required")
    .isString()
    .withMessage("Task description must be a string"),
  body("assignedEmployeeId")
    .notEmpty()
    .withMessage("Assigned Employee Id is required")
    .isString()
    .withMessage("Assigned Employee Id must be a string"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO date")
];

export const taskIdValidation = [
  param("taskId")
    .notEmpty()
    .withMessage("Task Id is required")
    .isString()
    .withMessage("Task Id must be a string")
];
