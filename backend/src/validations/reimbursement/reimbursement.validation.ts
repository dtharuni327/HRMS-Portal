import { body, param } from "express-validator";
import { REIMBURSEMENT_REVIEW_STATUSES } from "../../constants/reimbursement.constants";

export const submitClaimValidation = [
  body("title")
    .notEmpty()
    .withMessage("Claim title is required")
    .isString()
    .withMessage("Claim title must be a string"),
  body("description")
    .notEmpty()
    .withMessage("Claim description is required")
    .isString()
    .withMessage("Claim description must be a string"),
  body("amount")
    .notEmpty()
    .withMessage("Claim amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Claim amount must be a positive number"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("submissionDate")
    .optional()
    .isISO8601()
    .withMessage("Submission date must be a valid ISO date"),
  body("supportingDocuments")
    .optional()
    .isString()
    .withMessage("Supporting documents path must be a string")
];

export const claimIdValidation = [
  param("claimId")
    .notEmpty()
    .withMessage("Claim Id is required")
    .isString()
    .withMessage("Claim Id must be a string")
];

export const reviewClaimValidation = [
  param("claimId")
    .notEmpty()
    .withMessage("Claim Id is required")
    .isString()
    .withMessage("Claim Id must be a string"),
  body("status")
    .notEmpty()
    .withMessage("Review status is required")
    .isString()
    .withMessage("Review status must be a string")
    .isIn(REIMBURSEMENT_REVIEW_STATUSES)
    .withMessage(`Status must be one of: ${REIMBURSEMENT_REVIEW_STATUSES.join(", ")}`),
  body("comment")
    .optional()
    .isString()
    .withMessage("Comment must be a string")
];

export const updateClaimStatusValidation = [
  param("claimId")
    .notEmpty()
    .withMessage("Claim Id is required")
    .isString()
    .withMessage("Claim Id must be a string"),
  body("paymentReference")
    .notEmpty()
    .withMessage("Payment reference is required")
    .isString()
    .withMessage("Payment reference must be a string"),
  body("paymentAmount")
    .notEmpty()
    .withMessage("Payment amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Payment amount must be a positive number")
];
