import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getSystemConfigurationValidation, addSystemConfigurationValidation, updateSystemConfigurationValidation, systemConfigKeyValidation } from "../validations/systemConfig/systemConfig.validation";
import { createSystemConfig, updateSystemConfig, deleteSystemConfig, getAllSystemConfig, getSystemConfigByKey } from "../controllers/systemConfig/systemConfig.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize(["Super Admin"]),
  addSystemConfigurationValidation,
  validate,
  createSystemConfig
);

router.get(
  "/all",
  authenticate,
  authorize(["Super Admin"]),
  getSystemConfigurationValidation,
  validate,
  getAllSystemConfig
);

router.get(
  "/:configKey",
  authenticate,
  systemConfigKeyValidation,
  validate,
  getSystemConfigByKey
);

router.put(
  "/update/:configKey",
  authenticate,
  authorize(["Super Admin"]),
  updateSystemConfigurationValidation,
  validate,
  updateSystemConfig
);

router.delete(
  "/delete/:configKey",
  authenticate,
  authorize(["Super Admin"]),
  systemConfigKeyValidation,
  validate,
  deleteSystemConfig
);

export default router;
