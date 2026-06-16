import sql from "mssql";
import { db } from "../../config/db";

export const taxReportsRepository = {
  async generateTaxReport(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ReportType", sql.VarChar, data.reportType)
      .input("Component", sql.VarChar, data.component)
      .input("Month", sql.Int, data.month || null)
      .input("Year", sql.Int, data.year)
      .input("GeneratedBy", sql.VarChar, user.Emp_id)
      .input("GeneratedAt", sql.DateTime, new Date())
      .execute("USP_TaxReport_Generate");

    return result.recordset?.[0] ?? result;
  },

  async getTaxReports(filters?: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Component", sql.VarChar, filters?.component || null)
      .input("ReportType", sql.VarChar, filters?.reportType || null)
      .input("Year", sql.Int, filters?.year || null)
      .execute("USP_TaxReport_GetAll");

    return result.recordset ?? [];
  },

  async getTaxReportById(reportId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ReportId", sql.VarChar, reportId)
      .execute("USP_TaxReport_GetById");

    return result.recordset?.[0] ?? null;
  },

  async exportTaxReport(reportId: string, format: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ReportId", sql.VarChar, reportId)
      .input("Format", sql.VarChar, format || "PDF")
      .execute("USP_TaxReport_Export");

    return result.recordset?.[0] ?? result;
  },

  async updateFilingStatus(reportId: string, filingStatus: string, filingDate: Date, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("ReportId", sql.VarChar, reportId)
      .input("FilingStatus", sql.VarChar, filingStatus)
      .input("FilingDate", sql.DateTime, filingDate || null)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .input("UpdatedAt", sql.DateTime, new Date())
      .execute("USP_TaxReport_UpdateFilingStatus");

    return result.recordset?.[0] ?? result;
  },

  async getComplianceDeadlines() {
    const pool = await db;
    const result = await pool
      .request()
      .execute("USP_TaxReport_GetComplianceDeadlines");

    return result.recordset ?? [];
  }
};
