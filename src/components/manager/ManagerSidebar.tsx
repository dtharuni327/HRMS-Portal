import React, { type ReactNode } from 'react';
import {
  Home,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  FileText,
  Briefcase,
  Calendar,
  LogOut,
} from 'lucide-react';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isLogout?: boolean;
}

interface ManagerSidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  onTaskManagerClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active, onClick, isLogout }) => (
  <button
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
    {active && <div className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] shadow-[0_0_12px_rgba(192,132,252,0.9)]" />}
  </button>
);

const ManagerSidebar: React.FC<ManagerSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  onTaskManagerClick,
}) => {
  return (
    <aside
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
      className={`group/sidebar fixed inset-y-6 left-6 z-50 overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#081a4a] py-5 px-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out backdrop-blur-xl ${sidebarOpen ? 'w-[250px]' : 'w-[96px]'}`}
    >
      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex flex-1 flex-col gap-1.5 pt-1 min-h-0 overflow-hidden">
          <SidebarIcon icon={<Home size={20} />} label="HOME" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} />
          <SidebarIcon icon={<Users size={20} />} label="EMPLOYEES" active={activeTab === 'Employee'} onClick={() => setActiveTab('Employee')} />
          <SidebarIcon icon={<CheckCircle2 size={20} />} label="APPROVALS" active={activeTab === 'Approvals'} onClick={() => setActiveTab('Approvals')} />
          <SidebarIcon icon={<Clock size={20} />} label="REGULARISATION" active={activeTab === 'Regularisation'} onClick={() => setActiveTab('Regularisation')} />
          <SidebarIcon icon={<Clock size={20} />} label="ATTENDANCE" active={activeTab === 'Attendance'} onClick={() => setActiveTab('Attendance')} />
          <SidebarIcon icon={<BarChart3 size={20} />} label="ANALYTICS" active={activeTab === 'AttendanceAnalytics'} onClick={() => setActiveTab('AttendanceAnalytics')} />
          <SidebarIcon icon={<FileText size={20} />} label="PROJECT REPORT" active={activeTab === 'ProjectEffortReport'} onClick={() => setActiveTab('ProjectEffortReport')} />
          <SidebarIcon icon={<Users size={20} />} label="TEAM DIRECTORY" active={activeTab === 'TeamDirectory'} onClick={() => setActiveTab('TeamDirectory')} />
          <SidebarIcon icon={<Briefcase size={20} />} label="TASK MANAGER" active={activeTab === 'TaskManager'} onClick={onTaskManagerClick} />
          <SidebarIcon icon={<Calendar size={20} />} label="LEAVE CALENDAR" active={activeTab === 'TeamLeaveCalendar'} onClick={() => setActiveTab('TeamLeaveCalendar')} />
        </nav>

        <div className="mt-3 pt-3 pb-1 border-t border-white/10">
          <button
            onClick={onLogout}
            className="relative flex h-[56px] w-full items-center rounded-[1.4rem] transition-all duration-300 justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-[18px] text-[#7dd3fc] hover:bg-white/5"
          >
            <div className="flex h-10 w-10 items-center justify-center shrink-0">
              <LogOut size={20} />
            </div>
            <span className="whitespace-nowrap text-[15px] font-semibold tracking-wide opacity-0 w-0 transition-all duration-300 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-3">
              SIGN OUT
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
