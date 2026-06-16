import sql from "mssql";
import { db } from "../../config/db";

export const invoiceRepository = {
  async createInvoice(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ClientId", sql.VarChar, data.clientId)
      .input("InvoiceDate", sql.DateTime, data.invoiceDate || new Date())
      .input("DueDate", sql.DateTime, data.dueDate)
      .input("Amount", sql.Decimal(18, 2), data.amount)
      .input("Currency", sql.VarChar, data.currency || "USD")
      .input("Status", sql.VarChar, data.status || "DRAFT")
      .input("Description", sql.VarChar, data.description || null)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_Invoice_Create");

    return result.recordset?.[0] ?? result;
  },

  async getAllInvoices() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_Invoice_GetAll");

    return result.recordset ?? [];
  },

  async getInvoiceById(invoiceId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("InvoiceId", sql.VarChar, invoiceId)
      .execute("USP_Invoice_GetById");

    return result.recordset?.[0] ?? null;
  },

  async updateInvoice(invoiceId: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("InvoiceId", sql.VarChar, invoiceId)
      .input("ClientId", sql.VarChar, data.clientId)
      .input("InvoiceDate", sql.DateTime, data.invoiceDate)
      .input("DueDate", sql.DateTime, data.dueDate)
      .input("Amount", sql.Decimal(18, 2), data.amount)
      .input("Currency", sql.VarChar, data.currency)
      .input("Description", sql.VarChar, data.description || null)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_Invoice_Update");

    return result.recordset?.[0] ?? result;
  },

  async updateInvoiceStatus(invoiceId: string, status: string, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("InvoiceId", sql.VarChar, invoiceId)
      .input("Status", sql.VarChar, status)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .execute("USP_Invoice_UpdateStatus");

    return result.recordset?.[0] ?? result;
  }
};
