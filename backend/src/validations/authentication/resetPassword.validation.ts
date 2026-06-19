import { body } from "express-validator";
export const resetPasswordValidation = [body("email")
    .notEmpty()
    .withMessage("Email is required"),body("otp")
    .notEmpty()
    .withMessage("OTP is required"),
    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
    .withMessage("Password must contain uppercase, number and special character")
];