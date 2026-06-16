import { Request, Response } from "express";
import {
  createSalaryStructureService,
  getSalaryStructuresService,
  getEmployeeSalaryService,
  getSalaryByIdService,
  updateSalaryStructureService,
  processPayrollService,
  generatePayslipService,
  getPayslipsService,
  getPayslipByIdService,
  addBonusService,
  getBonusesService,
  addIncentiveService,
  getSalaryReportsService
} from "../../services/salary/salary.service";
import { SALARY_MESSAGES } from "../../constants/salary.constants";

export const createSalaryStructure = async (req: any, res: Response) => {
  try {
    const result = await createSalaryStructureService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getSalaryStructures = async (req: Request, res: Response) => {
  try {
    const salaries = await getSalaryStructuresService();
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED, data: salaries });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getEmployeeSalary = async (req: any, res: Response) => {
  try {
    const { employeeId } = req.params;
    const salary = await getEmployeeSalaryService(employeeId, req.user);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED, data: salary });
  } catch (error: any) {
    return res.status(403).json({ message: error.message });
  }
};

export const getSalaryById = async (req: any, res: Response) => {
  try {
    const { salaryId } = req.params;
    const salary = await getSalaryByIdService(salaryId, req.user);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED_ONE, data: salary });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateSalaryStructure = async (req: any, res: Response) => {
  try {
    const { salaryId } = req.params;
    const salary = await updateSalaryStructureService(salaryId, req.body, req.user);
    return res.status(200).json({ message: SALARY_MESSAGES.UPDATED, data: salary });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const processPayroll = async (req: any, res: Response) => {
  try {
    const result = await processPayrollService(req.body, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const generatePayslip = async (req: any, res: Response) => {
  try {
    const { salaryId } = req.params;
    const { month, year } = req.body;
    const result = await generatePayslipService(salaryId, month, year, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getPayslips = async (req: any, res: Response) => {
  try {
    const employeeId = req.query.employeeId as string;
    const payslips = await getPayslipsService(employeeId, req.user);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED, data: payslips });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPayslipById = async (req: any, res: Response) => {
  try {
    const { payslipId } = req.params;
    const payslip = await getPayslipByIdService(payslipId, req.user);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED_ONE, data: payslip });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const addBonus = async (req: any, res: Response) => {
  try {
    const { employeeId } = req.params;
    const result = await addBonusService(employeeId, req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getBonuses = async (req: Request, res: Response) => {
  try {
    const employeeId = req.query.employeeId as string;
    const bonuses = await getBonusesService(employeeId);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED, data: bonuses });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const addIncentive = async (req: any, res: Response) => {
  try {
    const { employeeId } = req.params;
    const result = await addIncentiveService(employeeId, req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getSalaryReports = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const reports = await getSalaryReportsService(filters);
    return res.status(200).json({ message: SALARY_MESSAGES.FETCHED, data: reports });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
