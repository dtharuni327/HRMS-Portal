import { param } from "express-validator";

export const getAnnouncementByIdValidation = [
  param("announcementId")
    .notEmpty()
    .withMessage("Announcement Id is required")
    .isString()
    .withMessage("Announcement Id must be a string")
];
