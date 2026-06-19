import { body } from "express-validator";
export const updateLeaveStatusValidation = [body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["APPROVED","REJECTED"])
    .withMessage("Status must be APPROVED or REJECTED")
];