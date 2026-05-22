import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  BarChart3,
  Calendar,
  Contact2,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (v: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menu = [
    {
      id: 'Overview',
      icon: <LayoutDashboard size={22} />,
      label: 'HOME',
    },
    {
      id: 'Attendance',
      icon: <Users size={22} />,
      label: 'ATTENDANCE',
    },
    {
      id: 'Approvals',
      icon: <CheckCircle size={22} />,
      label: 'APPROVALS',
    },
    {
      id: 'Performance',
      icon: <BarChart3 size={22} />,
      label: 'ANALYTICS',
    },
    {
      id: 'Calendar',
      icon: <Calendar size={22} />,
      label: 'CALENDAR',
    },
    {
      id: 'Directory',
      icon: <Contact2 size={22} />,
      label: 'DIRECTORY',
    },
    {
      id: 'Reports',
      icon: <FileText size={22} />,
      label: 'REPORTS',
    },
  ];

  return (
    <aside
      className="
        group/sidebar
        sticky
        top-5
        z-40
        h-[calc(100vh-40px)]
        w-[96px]
        hover:w-[250px]
        overflow-hidden
        rounded-[2.2rem]
        border
        border-[#203a72]
        bg-gradient-to-b
        from-[#071b44]
        via-[#081d45]
        to-[#061738]
        p-4
        shadow-[0_25px_60px_rgba(0,0,0,0.45)]
        transition-all
        duration-300
        backdrop-blur-xl
      "
    >
      {/* SIDEBAR GLOW */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[linear-gradient(to_bottom,rgba(59,130,246,0.08),transparent_18%,transparent_82%,rgba(168,85,247,0.06))]" />

      <div className="relative z-10 flex h-full flex-col">

        {/* MENU */}
        <nav className="flex flex-1 flex-col gap-3">

          {menu.map((item) => {
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  relative
                  flex
                  h-[58px]
                  w-full
                  items-center
                  justify-center
                  rounded-[1.4rem]
                  transition-all
                  duration-300
                  group-hover/sidebar:justify-start
                  group-hover/sidebar:px-[18px]
                  ${
                    active
                      ? 'bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >

                {/* ACTIVE INDICATOR */}
                {active && (
                  <div className="absolute left-0 top-1/2 h-9 w-[4px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
                )}

                {/* ICON */}
                <div
                  className={`
                    absolute
                    left-1/2
                    flex
                    h-12
                    w-12
                    -translate-x-1/2
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    group-hover/sidebar:left-[18px]
                    group-hover/sidebar:translate-x-0
                    ${
                      active
                        ? 'text-[#7dd3fc]'
                        : 'text-slate-400 group-hover:text-white'
                    }
                  `}
                >
                  {item.icon}
                </div>

                {/* LABEL */}
                <span
                  className="
                    ml-[62px]
                    whitespace-nowrap
                    text-[15px]
                    font-semibold
                    tracking-wide
                    opacity-0
                    transition-all
                    duration-300
                    group-hover/sidebar:opacity-100
                  "
                >
                  {item.label}
                </span>

              </button>
            );
          })}

        </nav>

        {/* BOTTOM */}
        <div className="mt-4 flex flex-col gap-3">

          {/* SETTINGS */}
          <button
            className="
              relative
              flex
              h-[58px]
              w-full
              items-center
              justify-center
              rounded-[1.4rem]
              transition-all
              duration-300
              hover:bg-white/5
              hover:text-white
              group-hover/sidebar:justify-start
              group-hover/sidebar:px-[18px]
            "
          >

            <div className="absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center text-slate-300 transition-all duration-300 group-hover/sidebar:left-[18px] group-hover/sidebar:translate-x-0">
              <Settings size={22} />
            </div>

            <span
              className="
                ml-[62px]
                whitespace-nowrap
                text-[15px]
                font-semibold
                tracking-wide
                opacity-0
                transition-all
                duration-300
                group-hover/sidebar:opacity-100
              "
            >
              SETTINGS
            </span>

          </button>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              relative
              flex
              h-[58px]
              w-full
              items-center
              justify-center
              rounded-[1.4rem]
              transition-all
              duration-300
              hover:bg-[#2b163f]
              group-hover/sidebar:justify-start
              group-hover/sidebar:px-[18px]
            "
          >

            <div className="absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center text-[#7dd3fc] transition-all duration-300 group-hover/sidebar:left-[18px] group-hover/sidebar:translate-x-0">
              <LogOut size={22} />
            </div>

            <span
              className="
                ml-[62px]
                whitespace-nowrap
                text-[15px]
                font-semibold
                tracking-wide
                text-[#7dd3fc]
                opacity-0
                transition-all
                duration-300
                group-hover/sidebar:opacity-100
              "
            >
              LOGOUT
            </span>

          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;