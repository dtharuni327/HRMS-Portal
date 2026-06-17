import type { Dispatch, SetStateAction } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BadgeDollarSign,
  Bell,
  Briefcase,
  CalendarRange,
  ChartColumn,
  FileText,
  Home,
  LifeBuoy,
  LogOut,
  MessageCircleMore,
  MessageSquareText,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import { useAuthStore } from "../../store/authStore";

const sidebarItems = [
  { label: "Home", icon: Home, page: "home" },
  { label: "Project Overview", icon: Briefcase, page: "projectoverview" },
  { label: "Team Members", icon: Users, page: "team-members" },
  { label: "Attendance", icon: ShieldCheck, page: "attendance" },
  { label: "Chat", icon: MessageSquareText, page: "chat" },
  { label: "Document Sharing", icon: FileText, page: "documentsharing" },
  { label: "Feedback Section", icon: MessageCircleMore, page: "feedbacksection" },
  { label: "Invoice Summary", icon: Wallet, page: "invoicesummary" },
  { label: "Meeting Schedule", icon: CalendarRange, page: "meetingschedule" },
  { label: "Notifications", icon: Bell, page: "notifications" },
  { label: "Payment History", icon: BadgeDollarSign, page: "paymenthistory" },
  
  { label: "Project Report", icon: ChartColumn, page: "projectreport" },
  { label: "Support", icon: LifeBuoy, page: "support" },
  // Task removed for client view
  
];

const pageRouteMap: Record<string, string> = {
  home: "/client",
  projects: "/client/projects",
  "team-members": "/client/contacts",
  attendance: "/client/attendance",
  chat: "/client/chat",
  documentsharing: "/client/documents",
  feedbacksection: "/client/feedback",
  invoicesummary: "/client/invoices",
  meetingschedule: "/client/calendar",
  notifications: "/client/notifications",
  paymenthistory: "/client/payments",
  projectoverview: "/client/project-overview",
  projectreport: "/client/project-report",
  support: "/client/support",
  invoices: "/client/invoices",
};

type ClientSidebarProps = {
  isExpanded?: boolean;
  setIsExpanded?: Dispatch<SetStateAction<boolean>>;
};

const ClientSidebar = ({ isExpanded, setIsExpanded }: ClientSidebarProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const expanded = typeof isExpanded === 'boolean' ? isExpanded : true;

  return (
    <aside
      onMouseEnter={() => setIsExpanded?.(true)}
      onMouseLeave={() => setIsExpanded?.(false)}
      className={`fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] overflow-x-hidden whitespace-nowrap rounded-[28px] border border-white/12 bg-[#10213d]/90 text-white/75 shadow-[0_24px_70px_rgba(2,8,23,0.32)] backdrop-blur-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
        expanded ? 'w-[260px]' : 'w-[64px]'
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className={`mb-6 flex items-center ${expanded ? 'justify-between' : 'justify-center'}`}>
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-[0.18em] text-white transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
              Client
            </h2>
            {expanded && <p className="mt-1 text-xs text-white/60">Dashboard</p>}
          </div>

          {expanded && <div className="rounded-full bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-200">Client</div>}
        </div>

        <nav className="space-y-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon as any;
            const to = pageRouteMap[item.page] ?? `/client/${item.page}`;

            return (
              <NavLink
                key={item.label}
                to={to}
                end={to === '/client'}
                className={({ isActive }) =>
                  `relative flex h-[58px] w-full items-center rounded-[1.4rem] transition-all duration-300 ${
                    isActive
                      ? `${expanded ? 'px-3 justify-start' : 'justify-center'} bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]`
                      : `${expanded ? 'px-3 justify-start' : 'justify-center'} text-slate-400 hover:bg-white/5 hover:text-white`
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
                      <Icon size={20} />
                    </div>

                    <span className={`ml-3 overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-wide transition-all duration-300 ${expanded ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="mt-4 flex h-[58px] w-full items-center rounded-[22px] px-3 text-sm font-bold uppercase tracking-wide text-sky-300 transition hover:bg-white/10">
          <div className="flex w-[58px] min-w-[58px] justify-center">
            <LogOut className="h-5 w-5 text-sky-300" />
          </div>
          <span className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
            Signout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
