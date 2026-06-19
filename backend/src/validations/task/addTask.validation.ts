import { body } from "express-validator";

export const addTaskValidation = [
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
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
  body("status")
    .optional()
    .isIn(["PENDING", "IN_PROGRESS", "COMPLETED"])
    .withMessage("Status must be PENDING, IN_PROGRESS, or COMPLETED")
];
