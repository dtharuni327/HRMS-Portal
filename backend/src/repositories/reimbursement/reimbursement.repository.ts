import sql from "mssql";
import { db } from "../../config/db";

export const reimbursementRepository = {
  async submitClaim(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, user.Emp_id)
      .input("Title", sql.VarChar, data.title)
      .input("Description", sql.VarChar, data.description)
      .input("Amount", sql.Decimal(18, 2), data.amount)
      .input("Currency", sql.VarChar, data.currency || "USD")
      .input("SubmissionDate", sql.DateTime, data.submissionDate || new Date())
      .input("Status", sql.VarChar, data.status || "PENDING")
      .input("SupportingDocuments", sql.VarChar, data.supportingDocuments || null)
      .execute("USP_Reimbursement_SubmitClaim");

    return result.recordset?.[0] ?? result;
  },

  async getClaimsByEmployeeId(employeeId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .execute("USP_Reimbursement_GetByEmployee");

    return result.recordset ?? [];
  },

  async getAllClaims() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_Reimbursement_GetAll");

    return result.recordset ?? [];
  },

  async getClaimById(claimId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ClaimId", sql.VarChar, claimId)
      .execute("USP_Reimbursement_GetById");

    return result.recordset?.[0] ?? null;
  },

  async reviewClaim(claimId: string, status: string, comment: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ClaimId", sql.VarChar, claimId)
      .input("Status", sql.VarChar, status)
      .input("Comment", sql.VarChar, comment || null)
      .input("ReviewedBy", sql.VarChar, user.Emp_id)
      .input("ReviewedAt", sql.DateTime, new Date())
      .execute("USP_Reimbursement_ReviewClaim");

    return result.recordset?.[0] ?? result;
  },

  async processPayment(claimId: string, paymentReference: string, paymentAmount: number, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ClaimId", sql.VarChar, claimId)
      .input("PaymentReference", sql.VarChar, paymentReference)
      .input("PaymentAmount", sql.Decimal(18, 2), paymentAmount)
      .input("ProcessedBy", sql.VarChar, user.Emp_id)
      .input("ProcessedAt", sql.DateTime, new Date())
      .execute("USP_Reimbursement_ProcessPayment");

    return result.recordset?.[0] ?? result;
  },

  async settlePayment(claimId: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ClaimId", sql.VarChar, claimId)
      .input("SettledBy", sql.VarChar, user.Emp_id)
      .input("SettledAt", sql.DateTime, new Date())
      .execute("USP_Reimbursement_SettlePayment");

    return result.recordset?.[0] ?? result;
  }
};
