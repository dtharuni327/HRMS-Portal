import React, { useState } from 'react';
import DashboardNavbar from '../../components/DashboardNavbar';
import { FinanceSidebar } from '../../components/Finance/FinanceSidebar';
import DashboardModule from './modules/dashboard';
import PayrollModule from './modules/Payroll';
import SalaryDisbursementModule from './modules/SalaryDisbursement';
import PayslipManagement from './modules/PayslipManagement';
import TaxReportsModule from './modules/TaxReports';
import ReimbursementRequests from './modules/ReimbursementRequests';
import BonusIncentives from './modules/BonusIncentives';
import DeductionsManagement from './modules/DeductionsManagement';
import InvoiceManagement from './modules/InvoiceManagement';
import PaymentTrackingModule from './modules/PaymentTracking';
import PayrollReports from './modules/PayrollReports';
import AuditLogs from './modules/AuditLogs';
import Notifications from './modules/Notifications';
import EmployeeSalaryDetails from './modules/EmployeeSalaryDetails';

const FinanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#081a4a] p-4 text-slate-100">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <FinanceSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className={`relative z-10 flex flex-1 flex-col overflow-visible bg-[#081a4a] transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[132px]'}`}>
        <DashboardNavbar
          title="Finance Dashboard"
          subtitle="Finance • Role-based Access"
        />

        <div className="hide-scrollbar flex-1 overflow-x-visible overflow-y-auto p-1">
          <div className="space-y-6">
            {activeTab === 'Dashboard' && <DashboardModule />}
            {activeTab === 'Payroll' && <PayrollModule />}
            {activeTab === 'Salary Processing' && <SalaryDisbursementModule />}
            {activeTab === 'Payslips' && <PayslipManagement />}
            {activeTab === 'Tax Reports' && <TaxReportsModule />}
            {activeTab === 'Reimbursements' && <ReimbursementRequests />}
            {activeTab === 'Bonus & Incentives' && <BonusIncentives />}
            {activeTab === 'Deductions' && <DeductionsManagement />}
            {activeTab === 'Invoices' && <InvoiceManagement />}
            {activeTab === 'Payment Tracking' && <PaymentTrackingModule />}
            {activeTab === 'Payroll Reports' && <PayrollReports />}
            {activeTab === 'Audit Logs' && <AuditLogs />}
            {activeTab === 'Notifications' && <Notifications />}
            {activeTab === 'Employee Salary' && <EmployeeSalaryDetails />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;
