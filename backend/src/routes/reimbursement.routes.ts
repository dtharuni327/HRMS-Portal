import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  submitClaimValidation,
  claimIdValidation,
  reviewClaimValidation,
  updateClaimStatusValidation
} from "../validations/reimbursement/reimbursement.validation";
import {
  submitReimbursementClaim,
  getMyReimbursementClaims,
  getAllReimbursementClaims,
  getReimbursementClaimById,
  reviewReimbursementClaim,
  processReimbursementPayment,
  settleReimbursementPayment
} from "../controllers/reimbursement/reimbursement.controller";

const router = Router();

router.post(
  "/submit",
  authenticate,
  authorize(["Employee", "Manager", "HR Admin", "Finance", "Super Admin"]),
  submitClaimValidation,
  validate,
  submitReimbursementClaim
);

router.get(
  "/my",
  authenticate,
  authorize(["Employee", "Manager", "HR Admin", "Finance", "Super Admin"]),
  getMyReimbursementClaims
);

router.get(
  "/all",
  authenticate,
  authorize(["Manager", "HR Admin", "Finance", "Super Admin"]),
  getAllReimbursementClaims
);

router.get(
  "/:claimId",
  authenticate,
  authorize(["Employee", "Manager", "HR Admin", "Finance", "Super Admin"]),
  claimIdValidation,
  validate,
  getReimbursementClaimById
);

router.put(
  "/review/:claimId",
  authenticate,
  authorize(["Manager", "HR Admin", "Finance", "Super Admin"]),
  reviewClaimValidation,
  validate,
  reviewReimbursementClaim
);

router.put(
  "/process/:claimId",
  authenticate,
  authorize(["HR Admin", "Finance", "Super Admin"]),
  updateClaimStatusValidation,
  validate,
  processReimbursementPayment
);

router.put(
  "/settle/:claimId",
  authenticate,
  authorize(["HR Admin", "Finance", "Super Admin"]),
  claimIdValidation,
  validate,
  settleReimbursementPayment
);

export default router;
