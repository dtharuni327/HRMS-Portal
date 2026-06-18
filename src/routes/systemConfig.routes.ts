import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getSystemConfigurationValidation, addSystemConfigurationValidation, updateSystemConfigurationValidation, systemConfigKeyValidation } from "../validations/systemConfig/systemConfig.validation";
import { createSystemConfig, updateSystemConfig, getAllSystemConfig, getSystemConfigByKey, getActiveSystemConfig } from "../controllers/systemConfig/systemConfig.controller";

const router = Router();
const readRoles = ["Employee", "Manager", "HR Admin", "Finance", "Super Admin"];
const writeRoles = ["Super Admin"];

router.post(
  "/create",
  authenticate,
  authorize(writeRoles),
  addSystemConfigurationValidation,
  validate,
  createSystemConfig
);

router.get(
  "/active",
  authenticate,
  authorize(readRoles),
  getActiveSystemConfig
);

router.get(
  "/all",
  authenticate,
  authorize(readRoles),
  getSystemConfigurationValidation,
  validate,
  getAllSystemConfig
);

router.get(
  "/:configKey",
  authenticate,
  authorize(readRoles),
  systemConfigKeyValidation,
  validate,
  getSystemConfigByKey
);

router.put(
  "/update/:configKey",
  authenticate,
  authorize(writeRoles),
  updateSystemConfigurationValidation,
  validate,
  updateSystemConfig
);

export default router;
