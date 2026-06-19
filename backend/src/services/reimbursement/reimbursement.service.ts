import { reimbursementRepository } from "../../repositories/reimbursement/reimbursement.repository";
import {
  REIMBURSEMENT_MESSAGES,
  REIMBURSEMENT_REVIEW_STATUSES
} from "../../constants/reimbursement.constants";

export const submitReimbursementClaimService = async (data: any, user: any) => {
  const claim = await reimbursementRepository.submitClaim(data, user);
  return {
    success: true,
    message: REIMBURSEMENT_MESSAGES.SUBMITTED,
    data: claim
  };
};

export const getMyReimbursementClaimsService = async (employeeId: string) => {
  return await reimbursementRepository.getClaimsByEmployeeId(employeeId);
};

export const getAllReimbursementClaimsService = async () => {
  return await reimbursementRepository.getAllClaims();
};

const getEmployeeIdFromClaim = (claim: any) => {
  return claim?.EmployeeId ?? claim?.employeeId ?? claim?.employee_id;
};

export const getReimbursementClaimByIdService = async (claimId: string, user: any) => {
  const claim = await reimbursementRepository.getClaimById(claimId);
  if (!claim) {
    throw new Error(REIMBURSEMENT_MESSAGES.NOT_FOUND);
  }

  if (user?.role?.toUpperCase() === "EMPLOYEE") {
    const employeeId = getEmployeeIdFromClaim(claim);
    if (!employeeId || employeeId !== user.Emp_id) {
      throw new Error("Access denied");
    }
  }

  return claim;
};

export const reviewReimbursementClaimService = async (claimId: string, status: string, comment: string, user: any) => {
  const claim = await reimbursementRepository.getClaimById(claimId);
  if (!claim) {
    throw new Error(REIMBURSEMENT_MESSAGES.NOT_FOUND);
  }
  if (!REIMBURSEMENT_REVIEW_STATUSES.includes(status)) {
    throw new Error(REIMBURSEMENT_MESSAGES.INVALID_STATUS);
  }
  return await reimbursementRepository.reviewClaim(claimId, status, comment, user);
};

export const processReimbursementPaymentService = async (claimId: string, paymentReference: string, paymentAmount: number, user: any) => {
  const claim = await reimbursementRepository.getClaimById(claimId);
  if (!claim) {
    throw new Error(REIMBURSEMENT_MESSAGES.NOT_FOUND);
  }
  return await reimbursementRepository.processPayment(claimId, paymentReference, paymentAmount, user);
};

export const settleReimbursementPaymentService = async (claimId: string, user: any) => {
  const claim = await reimbursementRepository.getClaimById(claimId);
  if (!claim) {
    throw new Error(REIMBURSEMENT_MESSAGES.NOT_FOUND);
  }
  return await reimbursementRepository.settlePayment(claimId, user);
};
