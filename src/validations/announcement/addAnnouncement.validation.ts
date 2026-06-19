import { body } from "express-validator";

export const addAnnouncementValidation = [
  body("title")
    .notEmpty()
    .withMessage("Announcement title is required")
    .isString()
    .withMessage("Announcement title must be a string")
    .isLength({ max: 255 })
    .withMessage("Announcement title should not exceed 255 characters"),
  body("content")
    .notEmpty()
    .withMessage("Announcement content is required")
    .isString()
    .withMessage("Announcement content must be a string"),
  body("status")
    .optional()
    .isIn(["PUBLISHED", "DRAFT"])
    .withMessage("Status must be PUBLISHED or DRAFT")
];
