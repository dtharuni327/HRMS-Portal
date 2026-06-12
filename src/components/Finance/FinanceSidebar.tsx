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
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active = false, onClick, isLogout = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex h-[58px] w-full items-center justify-center rounded-[1.4rem] transition-all duration-300 group-hover/sidebar:justify-start group-hover/sidebar:px-[18px] ${
      active
        ? 'bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]'
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
    navigate('/auth/login');
  };

  return (
    <>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`group/sidebar fixed inset-y-5 left-5 z-50 overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#081a4a] py-4 px-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out backdrop-blur-xl ${sidebarOpen ? 'w-[250px]' : 'w-[96px]'}`}
      >
        <div className="relative z-10 flex h-full flex-col">
          <nav className="hide-scrollbar flex flex-1 flex-col gap-1.5 pt-1 overflow-y-auto">
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
    </>
  );
};

export default FinanceSidebar;
