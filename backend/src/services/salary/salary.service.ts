import { salaryRepository } from "../../repositories/salary/salary.repository";
import { SALARY_MESSAGES } from "../../constants/salary.constants";

export const createSalaryStructureService = async (data: any, user: any) => {
  const salary = await salaryRepository.createSalaryStructure(data, user);
  return {
    success: true,
    message: SALARY_MESSAGES.CREATED,
    data: salary
  };
};

export const getSalaryStructuresService = async (filters?: any) => {
  return await salaryRepository.getSalaryStructures(filters);
};

export const getEmployeeSalaryService = async (employeeId: string, user: any) => {
  if (user?.role?.toUpperCase() === "EMPLOYEE" && user.Emp_id !== employeeId) {
    throw new Error(SALARY_MESSAGES.UNAUTHORIZED);
  }
  
  const salaries = await salaryRepository.getSalaryStructures({ employeeId });
  return salaries;
};

export const getSalaryByIdService = async (salaryId: string, user: any) => {
  const salary = await salaryRepository.getSalaryById(salaryId);
  if (!salary) {
    throw new Error(SALARY_MESSAGES.NOT_FOUND);
  }
  
  if (user?.role?.toUpperCase() === "EMPLOYEE") {
    const employeeId = salary?.EmployeeId ?? salary?.employeeId ?? salary?.employee_id;
    if (employeeId !== user.Emp_id) {
      throw new Error(SALARY_MESSAGES.UNAUTHORIZED);
    }
  }
  
  return salary;
};

export const updateSalaryStructureService = async (salaryId: string, data: any, user: any) => {
  const salary = await salaryRepository.getSalaryById(salaryId);
  if (!salary) {
    throw new Error(SALARY_MESSAGES.NOT_FOUND);
  }
  
  return await salaryRepository.updateSalaryStructure(salaryId, data, user);
};

export const processPayrollService = async (data: any, user: any) => {
  const result = await salaryRepository.processPayroll(data, user);
  return {
    success: true,
    message: SALARY_MESSAGES.PROCESSED,
    data: result
  };
};

export const generatePayslipService = async (salaryId: string, month: number, year: number, user: any) => {
  const salary = await salaryRepository.getSalaryById(salaryId);
  if (!salary) {
    throw new Error(SALARY_MESSAGES.NOT_FOUND);
  }
  
  const payslip = await salaryRepository.generatePayslip(salaryId, month, year, user);
  return {
    success: true,
    message: SALARY_MESSAGES.GENERATED,
    data: payslip
  };
};

export const getPayslipsService = async (employeeId?: string, user?: any) => {
  if (user?.role?.toUpperCase() === "EMPLOYEE") {
    return await salaryRepository.getPayslips(user.Emp_id);
  }
  return await salaryRepository.getPayslips(employeeId);
};

export const getPayslipByIdService = async (payslipId: string, user?: any) => {
  const payslip = await salaryRepository.getPayslipById(payslipId);
  if (!payslip) {
    throw new Error(SALARY_MESSAGES.NOT_FOUND);
  }
  
  if (user?.role?.toUpperCase() === "EMPLOYEE") {
    const employeeId = payslip?.EmployeeId ?? payslip?.employeeId ?? payslip?.employee_id;
    if (employeeId !== user.Emp_id) {
      throw new Error(SALARY_MESSAGES.UNAUTHORIZED);
    }
  }
  
  return payslip;
};

export const addBonusService = async (employeeId: string, data: any, user: any) => {
  const bonus = await salaryRepository.addBonus(employeeId, data, user);
  return {
    success: true,
    message: SALARY_MESSAGES.CREATED,
    data: bonus
  };
};

export const getBonusesService = async (employeeId?: string) => {
  return await salaryRepository.getBonuses(employeeId);
};

export const addIncentiveService = async (employeeId: string, data: any, user: any) => {
  const incentive = await salaryRepository.addIncentive(employeeId, data, user);
  return {
    success: true,
    message: SALARY_MESSAGES.CREATED,
    data: incentive
  };
};

export const getSalaryReportsService = async (filters?: any) => {
  return await salaryRepository.getSalaryReports(filters);
};
