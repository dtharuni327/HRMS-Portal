import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getOrganisationSchema } from "../validations/organisation/getOrganisation.validation";
import { getOrganisationStructure } from "../controllers/organisation/getOrganisationStructure.controller";

const router = Router();

// HR/Admin only — shows full org chart across all departments
// Managers and employees don't have this view in the frontend
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "HR_ADMIN"),
  validate(getOrganisationSchema, "query"),
  getOrganisationStructure
);

export default router;
