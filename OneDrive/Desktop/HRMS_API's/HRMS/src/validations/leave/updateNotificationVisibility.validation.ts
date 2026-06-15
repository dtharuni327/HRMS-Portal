import { param } from "express-validator";
export const updateNotificationVisibilityValidation = [param("leaveId")
    .notEmpty()
    .withMessage("Leave Id is required")
    .isNumeric()
    .withMessage("Leave Id must be numeric")
];