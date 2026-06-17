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
  BellRing,
} from 'lucide-react';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isLogout?: boolean;
  expanded?: boolean;
}

interface ManagerSidebarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
  onTaskManagerClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active = false, onClick, isLogout = false, expanded = true }) => (
  <button
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

const ManagerSidebar: React.FC<ManagerSidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  onTaskManagerClick,
}) => {
  const expanded = sidebarOpen;

  return (
    <aside
      onMouseEnter={() => setSidebarOpen(true)}
      onMouseLeave={() => setSidebarOpen(false)}
      className={`group/sidebar fixed inset-y-6 left-6 z-50 flex flex-col overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#081a4a] transition-[width] duration-300 ease-in-out ${expanded ? 'w-[260px]' : 'w-[88px]'}`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav className="space-y-3">
          <SidebarIcon icon={<Home size={20} />} label="HOME" active={activeTab === 'Home'} onClick={() => setActiveTab('Home')} expanded={expanded} />
          <SidebarIcon icon={<Users size={20} />} label="EMPLOYEES" active={activeTab === 'Employee'} onClick={() => setActiveTab('Employee')} expanded={expanded} />
          <SidebarIcon icon={<CheckCircle2 size={20} />} label="APPROVALS" active={activeTab === 'Approvals'} onClick={() => setActiveTab('Approvals')} expanded={expanded} />
          <SidebarIcon icon={<Clock size={20} />} label="REGULARISATION" active={activeTab === 'Regularisation'} onClick={() => setActiveTab('Regularisation')} expanded={expanded} />
          <SidebarIcon icon={<Clock size={20} />} label="ATTENDANCE" active={activeTab === 'Attendance'} onClick={() => setActiveTab('Attendance')} expanded={expanded} />
          <SidebarIcon icon={<BarChart3 size={20} />} label="ANALYTICS" active={activeTab === 'AttendanceAnalytics'} onClick={() => setActiveTab('AttendanceAnalytics')} expanded={expanded} />
          <SidebarIcon icon={<FileText size={20} />} label="PROJECT REPORT" active={activeTab === 'ProjectEffortReport'} onClick={() => setActiveTab('ProjectEffortReport')} expanded={expanded} />
          <SidebarIcon icon={<Users size={20} />} label="TEAM DIRECTORY" active={activeTab === 'TeamDirectory'} onClick={() => setActiveTab('TeamDirectory')} expanded={expanded} />
          <SidebarIcon icon={<Briefcase size={20} />} label="TASK MANAGER" active={activeTab === 'TaskManager'} onClick={onTaskManagerClick} expanded={expanded} />
          <SidebarIcon icon={<BellRing size={20} />} label="CLIENT UPDATES" active={activeTab === 'ClientUpdates'} onClick={() => setActiveTab('ClientUpdates')} expanded={expanded} />
          <SidebarIcon icon={<Calendar size={20} />} label="LEAVE CALENDAR" active={activeTab === 'TeamLeaveCalendar'} onClick={() => setActiveTab('TeamLeaveCalendar')} expanded={expanded} />
        </nav>

        <button
          onClick={onLogout}
          className={`mt-4 flex h-[58px] w-full items-center rounded-[22px] transition-all duration-300 ${expanded ? 'px-3 justify-start' : 'justify-center'} text-sm font-bold uppercase tracking-wide text-sky-300 hover:bg-white/10`}
        >
          <div className="flex h-12 w-12 items-center justify-center">
            <LogOut size={20} />
          </div>
          <span className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            SIGN OUT
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;