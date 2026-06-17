import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getAllJobsSchema, getJobByIdSchema } from "../validations/recruitment/getJobs.validation";
import { createJobSchema } from "../validations/recruitment/create.job.validation";
import { updateJobSchema } from "../validations/recruitment/update.job.validation";
import { applyToJobSchema } from "../validations/recruitment/apply.job.validation";
import { getApplicationsSchema, updateApplicationStatusSchema } from "../validations/recruitment/application.validation";
import { getAllJobs } from "../controllers/recruitment/getAllJobs.controller";
import { getJobById } from "../controllers/recruitment/getJobById.controller";
import { createJob } from "../controllers/recruitment/createJob.controller";
import { updateJob } from "../controllers/recruitment/updateJob.controller";
import { deleteJob } from "../controllers/recruitment/deleteJob.controller";
import { applyToJob } from "../controllers/recruitment/applyToJob.controller";
import { getApplications } from "../controllers/recruitment/getApplications.controller";
import { updateApplicationStatus } from "../controllers/recruitment/updateApplicationStatus.controller";

const router = Router();

// JOB POSTINGS

// All employees can view jobs (internal jobs board)
router.get("/jobs", authenticate, validate(getAllJobsSchema, "query"), getAllJobs);
router.get("/jobs/:id", authenticate, validate(getJobByIdSchema, "params"), getJobById);

// HR / Super Admin only — job management
router.post("/jobs", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), validate(createJobSchema, "body"), createJob);
router.put("/jobs/:id", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), validate(getJobByIdSchema, "params"), validate(updateJobSchema, "body"), updateJob);
router.delete("/jobs/:id", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), validate(getJobByIdSchema, "params"), deleteJob);

//APPLICATIONS 

// Any logged-in employee can apply (self) or refer (referral)
router.post("/jobs/:id/apply", authenticate, validate(getJobByIdSchema, "params"), validate(applyToJobSchema, "body"), applyToJob);

router.get("/applications", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN", "MANAGER"), validate(getApplicationsSchema, "query"), getApplications);

router.put("/applications/:id/status", authenticate, authorize("SUPER_ADMIN", "HR_ADMIN"), validate(updateApplicationStatusSchema, "body"), updateApplicationStatus);

export default router;
