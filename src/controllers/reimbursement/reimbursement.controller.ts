import { Request, Response } from "express";
import {
  submitReimbursementClaimService,
  getMyReimbursementClaimsService,
  getAllReimbursementClaimsService,
  getReimbursementClaimByIdService,
  reviewReimbursementClaimService,
  processReimbursementPaymentService,
  settleReimbursementPaymentService
} from "../../services/reimbursement/reimbursement.service";
import { REIMBURSEMENT_MESSAGES } from "../../constants/reimbursement.constants";

export const submitReimbursementClaim = async (req: any, res: Response) => {
  try {
    const result = await submitReimbursementClaimService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMyReimbursementClaims = async (req: any, res: Response) => {
  try {
    const claims = await getMyReimbursementClaimsService(req.user.Emp_id);
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.FETCHED, data: claims });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllReimbursementClaims = async (req: Request, res: Response) => {
  try {
    const claims = await getAllReimbursementClaimsService();
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.FETCHED, data: claims });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getReimbursementClaimById = async (req: any, res: Response) => {
  try {
    const { claimId } = req.params;
    const claim = await getReimbursementClaimByIdService(claimId, req.user);
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.FETCHED_ONE, data: claim });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const reviewReimbursementClaim = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const { status, comment } = req.body;
    const result = await reviewReimbursementClaimService(claimId, status, comment, req.user);
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.REVIEWED, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const processReimbursementPayment = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const { paymentReference, paymentAmount } = req.body;
    const result = await processReimbursementPaymentService(claimId, paymentReference, paymentAmount, req.user);
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.PROCESSED, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const settleReimbursementPayment = async (req: Request, res: Response) => {
  try {
    const { claimId } = req.params;
    const result = await settleReimbursementPaymentService(claimId, req.user);
    return res.status(200).json({ message: REIMBURSEMENT_MESSAGES.SETTLED, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
