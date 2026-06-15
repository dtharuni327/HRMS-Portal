import { body } from "express-validator";
export const registerValidation = [body("username")
    .notEmpty()
    .withMessage("Username is required"),body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
    .withMessage("Password must contain uppercase, number and special character")
];