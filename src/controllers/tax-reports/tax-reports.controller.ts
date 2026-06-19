import { Request, Response } from "express";
import {
  generateTaxReportService,
  getTaxReportsService,
  getTaxReportByIdService,
  exportTaxReportService,
  updateFilingStatusService,
  getComplianceDeadlinesService
} from "../../services/tax-reports/tax-reports.service";
import { TAX_REPORT_MESSAGES } from "../../constants/tax-reports.constants";

export const generateTaxReport = async (req: Request, res: Response) => {
  try {
    const result = await generateTaxReportService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getTaxReports = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const reports = await getTaxReportsService(filters);
    return res.status(200).json({ message: TAX_REPORT_MESSAGES.FETCHED, data: reports });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaxReportById = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const report = await getTaxReportByIdService(reportId);
    return res.status(200).json({ message: TAX_REPORT_MESSAGES.FETCHED_ONE, data: report });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const exportTaxReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    const format = (req.query.format as string) || "PDF";
    const result = await exportTaxReportService(reportId, format);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateFilingStatus = async (req: any, res: Response) => {
  try {
    const { reportId } = req.params;
    const { filingStatus, filingDate } = req.body;
    const result = await updateFilingStatusService(reportId, filingStatus, filingDate, req.user);
    return res.status(200).json({ message: TAX_REPORT_MESSAGES.FETCHED_ONE, data: result });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getComplianceDeadlines = async (req: Request, res: Response) => {
  try {
    const deadlines = await getComplianceDeadlinesService();
    return res.status(200).json({ message: "Compliance deadlines fetched successfully.", data: deadlines });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
