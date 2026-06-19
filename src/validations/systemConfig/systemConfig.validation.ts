import { body, param } from "express-validator";

export const getSystemConfigurationValidation: any = [];

export const addSystemConfigurationValidation = [
  body("gracePeriod")
    .notEmpty()
    .withMessage("Grace Period is required")
    .isNumeric()
    .withMessage("Grace Period must be a number")
    .custom((value) => value > 0)
    .withMessage("Grace Period must be a positive number"),
  body("shiftStartTime")
    .notEmpty()
    .withMessage("Shift Start Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Shift Start Time must be a valid HH:mm value"),
  body("shiftEndTime")
    .notEmpty()
    .withMessage("Shift End Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Shift End Time must be a valid HH:mm value"),
  body("autoPunchOutTime")
    .notEmpty()
    .withMessage("Auto Punch-Out Time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Auto Punch-Out Time must be a valid HH:mm value"),
  body("weekOffDays")
    .isArray({ min: 1 })
    .withMessage("At least one Week-Off Day must be selected"),
  body("overtimeRate")
    .notEmpty()
    .withMessage("Overtime Rate is required")
    .isNumeric()
    .withMessage("Overtime Rate must be a number")
    .custom((value) => value > 0)
    .withMessage("Overtime Rate must be a positive numeric value"),
  body()
    .custom((body) => {
      const start = body.shiftStartTime;
      const end = body.shiftEndTime;
      const auto = body.autoPunchOutTime;

      if (start && end && start >= end) {
        throw new Error("Shift End Time must be greater than Shift Start Time");
      }
      if (end && auto && end >= auto) {
        throw new Error("Auto Punch-Out Time must be greater than Shift End Time");
      }
      return true;
    })
];

export const updateSystemConfigurationValidation = [
  param("configKey")
    .notEmpty()
    .withMessage("Config key is required")
    .isString()
    .withMessage("Config key must be a string"),
  body("gracePeriod")
    .optional()
    .isNumeric()
    .withMessage("Grace Period must be a number")
    .custom((value) => value > 0)
    .withMessage("Grace Period must be a positive number"),
  body("shiftStartTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Shift Start Time must be a valid HH:mm value"),
  body("shiftEndTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Shift End Time must be a valid HH:mm value"),
  body("autoPunchOutTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Auto Punch-Out Time must be a valid HH:mm value"),
  body("weekOffDays")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one Week-Off Day must be selected"),
  body("overtimeRate")
    .optional()
    .isNumeric()
    .withMessage("Overtime Rate must be a number")
    .custom((value) => value > 0)
    .withMessage("Overtime Rate must be a positive numeric value"),
  body()
    .custom((body) => {
      const start = body.shiftStartTime;
      const end = body.shiftEndTime;
      const auto = body.autoPunchOutTime;

      if (start && end && start >= end) {
        throw new Error("Shift End Time must be greater than Shift Start Time");
      }
      if (end && auto && end >= auto) {
        throw new Error("Auto Punch-Out Time must be greater than Shift End Time");
      }
      return true;
    })
];

export const systemConfigKeyValidation = [
  param("configKey")
    .notEmpty()
    .withMessage("Config key is required")
    .isString()
    .withMessage("Config key must be a string")
];
