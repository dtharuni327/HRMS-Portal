import { body, param } from "express-validator";

export const createAnnouncementValidation = [
  body("title")
    .notEmpty()
    .withMessage("Announcement title is required")
    .isString()
    .withMessage("Announcement title must be a string"),
  body("content")
    .notEmpty()
    .withMessage("Announcement content is required")
    .isString()
    .withMessage("Announcement content must be a string")
];

export const announcementIdValidation = [
  param("announcementId")
    .notEmpty()
    .withMessage("Announcement Id is required")
    .isString()
    .withMessage("Announcement Id must be a string")
];
