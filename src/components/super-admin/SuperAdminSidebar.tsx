import { type Dispatch, type SetStateAction } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  Building,
  CalendarDays,
  Clock,
  IndianRupee,
  FileText,
  Home,
  LogOut,
  Plane,
  Settings,
  Users,
  UserPlus,
} from "lucide-react";

type SuperAdminSidebarProps = {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
};

const menuItems = [
  { label: "Home", icon: Home, path: "/superadmin" },
  { label: "Attendance", icon: Clock, path: "/superadmin/attendance-overview" },
  { label: "Leave Management", icon: Plane, path: "/superadmin/leave-management-overview" },
  { label: "Payroll", icon: IndianRupee, path: "/superadmin/payroll-overview" },
  { label: "System Config", icon: Settings, path: "/superadmin/system-config" },
  { label: "Users & Roles", icon: Users, path: "/superadmin/user-roles" },
  { label: "New User", icon: UserPlus, path: "/superadmin/new-user" },
  { label: "Departments", icon: Building, path: "/superadmin/departments" },
  { label: "Holidays", icon: CalendarDays, path: "/superadmin/holidays" },
  { label: "Leave Types", icon: CalendarDays, path: "/superadmin/leave-types" },
  { label: "Projects", icon: FileText, path: "/superadmin/projects" },
  { label: "Audit Logs", icon: FileText, path: "/superadmin/audit-logs" },
  { label: "System Health", icon: Activity, path: "/superadmin/system-health" },
];

const SuperAdminSidebar = ({ isExpanded, setIsExpanded }: SuperAdminSidebarProps) => {
  const navigate = useNavigate();

  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] overflow-x-hidden whitespace-nowrap rounded-[28px] border border-white/12 bg-[#10213d]/90 text-white/75 shadow-[0_24px_70px_rgba(2,8,23,0.32)] backdrop-blur-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
        isExpanded ? "w-[260px]" : "w-[64px]"
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={`mb-8 flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          <h2
            className={`text-sm font-bold uppercase tracking-[0.18em] text-white transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Tharuni
          </h2>

          {isExpanded && (
            <span className="rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-200">
              Super Admin
            </span>
          )}
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/superadmin"}
              className={({ isActive }) =>
                `relative flex h-[58px] w-full items-center rounded-[1.4rem] transition-all duration-300 ${
                  isActive
                    ? `${isExpanded ? 'px-3 justify-start' : 'justify-center'} bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]`
                    : `${isExpanded ? 'px-3 justify-start' : 'justify-center'} text-slate-400 hover:bg-white/5 hover:text-white`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 h-6 w-1 rounded-r-full bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] shadow-[0_0_12px_rgba(192,132,252,0.9)]" />}

                  <div
                    className={`flex h-12 w-12 min-w-[48px] items-center justify-center transition-all duration-300 ${
                      isActive ? 'text-[#7dd3fc]' : 'text-slate-400'
                    }`}
                  >
                    <item.icon size={20} />
                  </div>

                  <span className={`ml-3 overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-wide transition-all duration-300 ${isExpanded ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 flex h-[58px] w-full items-center rounded-[22px] px-3 text-sm font-bold uppercase tracking-wide text-sky-300 transition hover:bg-white/10"
        >
          <div className="flex w-[58px] min-w-[58px] justify-center">
            <LogOut className="h-5 w-5 text-sky-300" />
          </div>
          <span
            className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${
              isExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Signout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
