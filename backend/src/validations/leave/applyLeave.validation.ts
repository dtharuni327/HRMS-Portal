import { body } from "express-validator";
export const applyLeaveValidation = [body("leave_type")
    .notEmpty()
    .withMessage("Leave type is required"),body("from_date")
    .notEmpty()
    .withMessage("From date is required"),body("to_date")
    .notEmpty()
    .withMessage("To date is required"),body("reason")
    .notEmpty()
    .withMessage("Reason is required")
];