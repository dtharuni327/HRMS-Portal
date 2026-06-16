import React, { type Dispatch, type SetStateAction } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BadgeDollarSign,
  Bell,
  Briefcase,
  CalendarRange,
  ChartColumn,
  ClipboardList,
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
            const Icon = item.icon;
            const to = pageRouteMap[item.page] ?? `/client/${item.page}`;

            return (
              <NavLink
                key={item.label}
                to={to}
                end={to === '/client'}
                className={({ isActive }) =>
                  `relative flex h-[58px] w-full items-center text-left transition-all duration-300 ${
                    isActive
                      ? 'rounded-[22px] border border-violet-300/25 bg-violet-500/30 text-white shadow-[0_14px_30px_rgba(99,102,241,0.22)]'
                      : 'rounded-[22px] text-white/55 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-violet-300 shadow-[0_0_14px_rgba(167,139,250,0.75)]" />}
                    <div className="flex w-[58px] min-w-[58px] justify-center">
                      <Icon className={`h-5 w-5 ${isActive ? 'text-sky-300' : 'text-white/55'}`} />
                    </div>
                    <span className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${expanded ? 'opacity-100' : 'opacity-0'}`}>
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
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
