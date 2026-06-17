import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Briefcase, FileSpreadsheet, IndianRupee, LayoutDashboard, LogOut, ReceiptText, FileText, Gift, Percent, Bell, Users, AlertCircle } from 'lucide-react';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isLogout?: boolean;
  expanded?: boolean;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active = false, onClick, isLogout = false, expanded = true }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex h-[58px] w-full items-center rounded-[1.4rem] transition-all duration-300 ${expanded ? 'px-3 justify-start' : 'pl-3 justify-start'} ${
      active
        ? 'bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    } ${isLogout ? 'hover:text-rose-400 hover:bg-rose-500/10' : ''}`}
  >
    <div
      className={`flex h-12 w-12 min-w-[48px] items-center justify-center transition-all duration-300 ${active ? 'text-[#7dd3fc]' : 'text-slate-400'}`}
    >
      {icon}
    </div>
    <span className={`ml-3 overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-wide transition-all duration-300 ${expanded ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>
      {label}
    </span>
    {active && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] shadow-[0_0_12px_rgba(192,132,252,0.9)]" />}
  </button>
);

interface FinanceSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const FinanceSidebar: React.FC<FinanceSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const allMenuItems = [
    { key: 'Dashboard', label: 'DASHBOARD', icon: <LayoutDashboard size={18} /> },
    { key: 'Payroll', label: 'PAYROLL', icon: <IndianRupee size={18} /> },
    { key: 'Tax Reports', label: 'TAX & COMPILANCE', icon: <FileSpreadsheet size={18} /> },
    { key: 'Salary Processing', label: 'SALARIES', icon: <Briefcase size={18} /> },
    { key: 'Payslips', label: 'PAYSLIPS', icon: <FileText size={18} /> },
    { key: 'Reimbursements', label: 'REIMBURSEMENTS', icon: <ReceiptText size={18} /> },
    { key: 'Bonus & Incentives', label: 'BONUS & INCENTIVES', icon: <Gift size={18} /> },
    { key: 'Deductions', label: 'DEDUCTIONS', icon: <Percent size={18} /> },
    { key: 'Invoices', label: 'INVOICE MANAGEMENT', icon: <FileText size={18} /> },
    { key: 'Payment Tracking', label: 'PAYMENT TRACKING', icon: <IndianRupee size={18} /> },
    { key: 'Payroll Reports', label: 'PAYROLL REPORTS', icon: <ReceiptText size={18} /> },
    { key: 'Audit Logs', label: 'AUDIT LOGS', icon: <AlertCircle size={18} /> },
    { key: 'Notifications', label: 'NOTIFICATIONS', icon: <Bell size={18} /> },
    { key: 'Employee Salary', label: 'EMPLOYEE SALARY', icon: <Users size={18} /> },
  ] as const;

  // Filter based on role-based access
  // TODO: Temporarily showing all items - will filter by role once fixed
  const menuItems = allMenuItems; // .filter(item => canAccessFinanceModule(userRole, item.key));

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const expanded = sidebarOpen;

  return (
    <aside
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
      className={`group/sidebar fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#081a4a] transition-[width] duration-300 xl:flex xl:flex-col ${expanded ? 'w-[260px]' : 'w-[88px]'}`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-3">
          {menuItems.map((item) => (
            <SidebarIcon
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.key}
              onClick={() => setActiveTab(item.key)}
              expanded={expanded}
            />
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className={`mt-4 flex h-[58px] w-full items-center rounded-[22px] transition-all duration-300 ${expanded ? 'px-3 justify-start' : 'justify-center'} text-sm font-bold uppercase tracking-wide text-sky-300 hover:bg-white/10`}
        >
          <div className="flex h-12 w-12 items-center justify-center">
            <LogOut className="h-5 w-5 text-sky-300" />
          </div>
          <span className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            SIGN OUT
          </span>
        </button>
      </div>
    </aside>
  );
};

export default FinanceSidebar;