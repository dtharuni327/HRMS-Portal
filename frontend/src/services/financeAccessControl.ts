// Finance module access control
// Maps roles to module-level permissions
export type FinanceRole = 'Super Admin' | 'Finance Admin' | 'HR Admin' | 'Manager' | 'Employee' | 'Client';

export interface FinanceModuleAccess {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canExport: boolean;
}

// TODO: Move this to database for easier updates
export const FINANCE_ACCESS_CONTROL: Record<FinanceRole, Record<string, FinanceModuleAccess>> = {
  'Super Admin': {
    'Dashboard': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Salary Processing': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Payslips': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Tax Reports': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Reimbursements': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Bonus & Incentives': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Deductions': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Invoices': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Payment Tracking': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Payroll Reports': { canView: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    'Audit Logs': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Notifications': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
  },
  'Finance Admin': {
    'Dashboard': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Salary Processing': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Payslips': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Tax Reports': { canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
    'Reimbursements': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Bonus & Incentives': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Deductions': { canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
    'Invoices': { canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: true },
    'Payment Tracking': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Payroll Reports': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Audit Logs': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Notifications': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
  },
  'HR Admin': {
    'Dashboard': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Salary Processing': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Payslips': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Tax Reports': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Reimbursements': { canView: true, canEdit: true, canDelete: false, canApprove: true, canExport: true },
    'Bonus & Incentives': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Deductions': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Invoices': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payment Tracking': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Payroll Reports': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Audit Logs': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Notifications': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
  },
  'Manager': {
    'Dashboard': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Salary Processing': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payslips': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Tax Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Reimbursements': { canView: true, canEdit: false, canDelete: false, canApprove: true, canExport: false },
    'Bonus & Incentives': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Deductions': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Invoices': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payment Tracking': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Audit Logs': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Notifications': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
  },
  'Employee': {
    'Dashboard': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Salary Processing': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payslips': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Tax Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Reimbursements': { canView: true, canEdit: true, canDelete: false, canApprove: false, canExport: false },
    'Bonus & Incentives': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Deductions': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Invoices': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payment Tracking': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Audit Logs': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Notifications': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: false },
  },
  'Client': {
    'Dashboard': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Salary Processing': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payslips': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Tax Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Reimbursements': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Bonus & Incentives': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Deductions': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Invoices': { canView: true, canEdit: false, canDelete: false, canApprove: false, canExport: true },
    'Payment Tracking': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Payroll Reports': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Audit Logs': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Notifications': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
    'Employee Salary': { canView: false, canEdit: false, canDelete: false, canApprove: false, canExport: false },
  },
};

export const getFinanceModuleAccess = (
  role: FinanceRole,
  module: string
): FinanceModuleAccess => {
  return FINANCE_ACCESS_CONTROL[role]?.[module] || {
    canView: false,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canExport: false,
  };
};

export const canAccessFinanceModule = (role: FinanceRole, module: string): boolean => {
  const access = getFinanceModuleAccess(role, module);
  return access.canView;
};
