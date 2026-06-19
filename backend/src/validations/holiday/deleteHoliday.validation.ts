import { param } from "express-validator";
export const deleteHolidayValidation = [param("client_id")
    .notEmpty()
    .withMessage("Client Id is required")
    .isNumeric()
    .withMessage("Client Id must be numeric")
];