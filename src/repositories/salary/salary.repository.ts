import sql from "mssql";
import { db } from "../../config/db";

export const salaryRepository = {
  async createSalaryStructure(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, data.employeeId)
      .input("BasicSalary", sql.Decimal(18, 2), data.basicSalary)
      .input("Allowances", sql.VarChar, data.allowances ? JSON.stringify(data.allowances) : null)
      .input("Deductions", sql.VarChar, data.deductions ? JSON.stringify(data.deductions) : null)
      .input("EffectiveDate", sql.DateTime, data.effectiveDate)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .input("CreatedAt", sql.DateTime, new Date())
      .execute("USP_Salary_CreateStructure");

    return result.recordset?.[0] ?? result;
  },

  async getSalaryStructures(filters?: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, filters?.employeeId || null)
      .execute("USP_Salary_GetStructures");

    return result.recordset ?? [];
  },

  async getSalaryById(salaryId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("SalaryId", sql.VarChar, salaryId)
      .execute("USP_Salary_GetById");

    return result.recordset?.[0] ?? null;
  },

  async updateSalaryStructure(salaryId: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("SalaryId", sql.VarChar, salaryId)
      .input("BasicSalary", sql.Decimal(18, 2), data.basicSalary || null)
      .input("Allowances", sql.VarChar, data.allowances ? JSON.stringify(data.allowances) : null)
      .input("Deductions", sql.VarChar, data.deductions ? JSON.stringify(data.deductions) : null)
      .input("UpdatedBy", sql.VarChar, user.Emp_id)
      .input("UpdatedAt", sql.DateTime, new Date())
      .execute("USP_Salary_UpdateStructure");

    return result.recordset?.[0] ?? result;
  },

  async processPayroll(data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Month", sql.Int, data.month)
      .input("Year", sql.Int, data.year)
      .input("ProcessEmployees", sql.VarChar, data.processEmployees ? JSON.stringify(data.processEmployees) : null)
      .input("ProcessedBy", sql.VarChar, user.Emp_id)
      .input("ProcessedAt", sql.DateTime, new Date())
      .execute("USP_Salary_ProcessPayroll");

    return result.recordset?.[0] ?? result;
  },

  async generatePayslip(salaryId: string, month: number, year: number, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("SalaryId", sql.VarChar, salaryId)
      .input("Month", sql.Int, month)
      .input("Year", sql.Int, year)
      .input("GeneratedBy", sql.VarChar, user.Emp_id)
      .input("GeneratedAt", sql.DateTime, new Date())
      .execute("USP_Salary_GeneratePayslip");

    return result.recordset?.[0] ?? result;
  },

  async getPayslips(employeeId?: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId || null)
      .execute("USP_Salary_GetPayslips");

    return result.recordset ?? [];
  },

  async getPayslipById(payslipId: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("PayslipId", sql.VarChar, payslipId)
      .execute("USP_Salary_GetPayslipById");

    return result.recordset?.[0] ?? null;
  },

  async addBonus(employeeId: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("BonusAmount", sql.Decimal(18, 2), data.bonusAmount)
      .input("BonusMonth", sql.Int, data.bonusMonth)
      .input("BonusYear", sql.Int, data.bonusYear || new Date().getFullYear())
      .input("Description", sql.VarChar, data.description || null)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .input("CreatedAt", sql.DateTime, new Date())
      .execute("USP_Salary_AddBonus");

    return result.recordset?.[0] ?? result;
  },

  async getBonuses(employeeId?: string) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId || null)
      .execute("USP_Salary_GetBonuses");

    return result.recordset ?? [];
  },

  async addIncentive(employeeId: string, data: any, user: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("EmployeeId", sql.VarChar, employeeId)
      .input("IncentiveAmount", sql.Decimal(18, 2), data.incentiveAmount)
      .input("IncentiveType", sql.VarChar, data.incentiveType)
      .input("Month", sql.Int, data.month)
      .input("Year", sql.Int, data.year)
      .input("Description", sql.VarChar, data.description || null)
      .input("CreatedBy", sql.VarChar, user.Emp_id)
      .input("CreatedAt", sql.DateTime, new Date())
      .execute("USP_Salary_AddIncentive");

    return result.recordset?.[0] ?? result;
  },

  async getSalaryReports(filters?: any) {
    const pool = await db;
    const result = await pool
      .request()
      .input("Month", sql.Int, filters?.month || null)
      .input("Year", sql.Int, filters?.year || null)
      .execute("USP_Salary_GetReports");

    return result.recordset ?? [];
  }
};
