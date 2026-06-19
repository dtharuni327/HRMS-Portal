import { body } from "express-validator";
export const addHolidayValidation = [body("holiday_name")
    .notEmpty()
    .withMessage("Holiday name is required"), body("holiday_date")
    .notEmpty()
    .withMessage("Holiday date is required"),body("client_id")
    .notEmpty()
    .withMessage("Client id is required")
];