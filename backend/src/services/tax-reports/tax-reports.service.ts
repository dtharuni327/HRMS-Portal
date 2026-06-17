import { taxReportsRepository } from "../../repositories/tax-reports/tax-reports.repository";
import { TAX_REPORT_MESSAGES } from "../../constants/tax-reports.constants";

export const generateTaxReportService = async (data: any, user: any) => {
  const report = await taxReportsRepository.generateTaxReport(data, user);
  return {
    success: true,
    message: TAX_REPORT_MESSAGES.GENERATED,
    data: report
  };
};

export const getTaxReportsService = async (filters?: any) => {
  return await taxReportsRepository.getTaxReports(filters);
};

export const getTaxReportByIdService = async (reportId: string) => {
  const report = await taxReportsRepository.getTaxReportById(reportId);
  if (!report) {
    throw new Error(TAX_REPORT_MESSAGES.NOT_FOUND);
  }
  return report;
};

export const exportTaxReportService = async (reportId: string, format: string) => {
  const report = await taxReportsRepository.getTaxReportById(reportId);
  if (!report) {
    throw new Error(TAX_REPORT_MESSAGES.NOT_FOUND);
  }
  
  const exportResult = await taxReportsRepository.exportTaxReport(reportId, format);
  return {
    success: true,
    message: TAX_REPORT_MESSAGES.EXPORTED,
    data: exportResult,
    format: format
  };
};

export const updateFilingStatusService = async (reportId: string, filingStatus: string, filingDate: Date, user: any) => {
  const report = await taxReportsRepository.getTaxReportById(reportId);
  if (!report) {
    throw new Error(TAX_REPORT_MESSAGES.NOT_FOUND);
  }
  
  return await taxReportsRepository.updateFilingStatus(reportId, filingStatus, filingDate, user);
};

export const getComplianceDeadlinesService = async () => {
  return await taxReportsRepository.getComplianceDeadlines();
};
