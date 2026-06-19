import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getInternalJobsValidation } from "../validations/internalJob/getInternalJobs.validation";
import { addInternalJobValidation } from "../validations/internalJob/addInternalJob.validation";
import { updateInternalJobValidation } from "../validations/internalJob/updateInternalJob.validation";
import { getInternalJobByIdValidation } from "../validations/internalJob/getInternalJobById.validation";
import { createInternalJob, updateInternalJob, deleteInternalJob, getAllInternalJobs, getActiveInternalJobs, getInternalJobById } from "../controllers/internalJob/internalJob.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize(["HR Admin"]),
  addInternalJobValidation,
  validate,
  createInternalJob
);

router.get(
  "/all",
  authenticate,
  authorize(["HR Admin"]),
  getInternalJobsValidation,
  validate,
  getAllInternalJobs
);

router.get(
  "/active",
  authenticate,
  getActiveInternalJobs
);

router.get(
  "/:jobId",
  authenticate,
  getInternalJobByIdValidation,
  validate,
  getInternalJobById
);

router.put(
  "/update/:jobId",
  authenticate,
  authorize(["HR Admin"]),
  updateInternalJobValidation,
  validate,
  updateInternalJob
);

router.delete(
  "/delete/:jobId",
  authenticate,
  authorize(["HR Admin"]),
  getInternalJobByIdValidation,
  validate,
  deleteInternalJob
);

export default router;
