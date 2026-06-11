import React, { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DashboardNavbar from '../../components/DashboardNavbar';
import { Briefcase, FileSpreadsheet, IndianRupee, LayoutDashboard, LogOut, ReceiptText } from 'lucide-react';
import DashboardModule from './modules/dashboard';
import PayrollModule from './modules/Payroll';
import SalaryDisbursementModule from './modules/SalaryDisbursement';
import ReimbursementsModule from './modules/Reimbursements';
import TaxReportsModule from './modules/TaxReports';
import { SparkCard } from './FinanceShared';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isLogout?: boolean;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active = false, onClick, isLogout = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex h-[58px] w-full items-center justify-center rounded-[1.4rem] transition-all duration-300 group-hover/sidebar:justify-start group-hover/sidebar:px-[18px] ${
      active
        ? 'bg-[#172554] text-white shadow-[0_10px_30px_rgba(15,23,42,0.35)]'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    } ${isLogout ? 'hover:text-rose-400 hover:bg-rose-500/10' : ''}`}
  >
    <div
      className={`absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center transition-all duration-300 group-hover/sidebar:left-[18px] group-hover/sidebar:translate-x-0 ${
        active ? 'text-[#7dd3fc]' : 'text-slate-400 group-hover/sidebar:text-white'
      }`}
    >
      {icon}
    </div>
    <span className="ml-[62px] whitespace-nowrap text-[15px] font-semibold tracking-wide opacity-0 transition-all duration-300 group-hover/sidebar:opacity-100">
      {label}
    </span>
    {active && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-[#38bdf8] shadow-[0_0_12px_rgba(56,189,248,0.9)]" />}
  </button>
);

const FinanceDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Payroll' | 'Salary Disbursement' | 'Reimbursements' | 'Tax Reports'>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { key: 'Dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { key: 'Payroll', label: 'Payroll', icon: <IndianRupee size={18} /> },
    { key: 'Salary Disbursement', label: 'Salary Disbursement', icon: <Briefcase size={18} /> },
    { key: 'Reimbursements', label: 'Reimbursements', icon: <ReceiptText size={18} /> },
    { key: 'Tax Reports', label: 'Tax Reports', icon: <FileSpreadsheet size={18} /> },
  ] as const;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#07111f] p-4 text-slate-100">
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`group/sidebar fixed inset-y-5 left-5 z-50 overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#0b172b] py-4 px-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out backdrop-blur-xl ${sidebarOpen ? 'w-[250px]' : 'w-[96px]'}`}
      >
        <div className="relative z-10 flex h-full flex-col">
        

          <nav className="flex flex-1 flex-col gap-1.5 pt-1 min-h-0 overflow-hidden">
            {menuItems.map((item) => (
              <SidebarIcon
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.key}
                onClick={() => setActiveTab(item.key)}
              />
            ))}
          </nav>

          <div className="mt-3 border-t border-white/10 pt-3 pb-1">
            <SidebarIcon
              icon={<LogOut size={20} />}
              label="SIGN OUT"
              onClick={handleLogout}
              isLogout
            />
          </div>
        </div>
      </aside>

      <main className={`relative z-10 flex flex-1 flex-col overflow-visible transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[132px]'}`}>
        <DashboardNavbar
          title="Finance Dashboard"
          
        />

        <div className="hide-scrollbar flex-1 overflow-x-visible overflow-y-auto p-1">
          <div className="space-y-6">
            <SparkCard className="rounded-[2rem] border border-sky-100 bg-[#edf5ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Finance operations</p>
                  <h3 className="text-2xl font-black text-slate-900">Finance Dashboard</h3>
                  <p className="max-w-2xl text-sm text-slate-700">Monitor payroll, reimbursements, tax reporting, and monthly financial controls from one finance-only workspace.</p>
                </div>
                <div className="rounded-3xl border border-sky-200 bg-white/85 px-4 py-3 text-sm text-slate-800">Live focus: {activeTab}</div>
              </div>
            </SparkCard>

            {activeTab === 'Dashboard' && <DashboardModule />}
            {activeTab === 'Payroll' && <PayrollModule />}
            {activeTab === 'Salary Disbursement' && <SalaryDisbursementModule />}
            {activeTab === 'Reimbursements' && <ReimbursementsModule />}
            {activeTab === 'Tax Reports' && <TaxReportsModule />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinanceDashboard;
