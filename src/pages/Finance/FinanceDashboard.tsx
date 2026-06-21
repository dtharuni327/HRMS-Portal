import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // reset scroll to top when switching finance tabs
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0 });
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [activeTab]);

  // initialize active tab from URL (if present)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && tab !== activeTab) setActiveTab(tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // push tab changes to history so browser Back navigates between tabs
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') !== activeTab) {
      params.set('tab', activeTab);
      navigate(`${location.pathname}?${params.toString()}`, { replace: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="flex min-h-screen w-full overflow-visible bg-[#0f1d36] p-4 text-slate-100">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <FinanceSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className={`relative z-10 flex min-h-0 flex-1 flex-col overflow-visible bg-[#0f1d36] transition-all duration-300 ${sidebarOpen ? 'ml-[292px]' : 'ml-[140px]'}`}>
        <DashboardNavbar
          title="Finance Dashboard"
          subtitle="Finance • Role-based Access"
        />

        <div ref={contentRef} className="hide-scrollbar flex-1 overflow-visible overflow-x-visible p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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