import TasksPage from "./modules/TasksPage";
import PayrollPage from "./modules/PayrollPage";
import InternalJobsPage from "./modules/InternalJobsPage";
import ProfilePage from "./modules/ProfilePage";
import AnnouncementsPage from "./modules/AnnouncementsPage";
import HomePage from "./modules/HomePage";
import LeaveApplyPage from "./modules/LeaveApplyPage";
import ViewAllEmployeesPage from "./modules/ViewAllEmployeesPage";
import Login from "../auth/Login";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  ClipboardList,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Plane,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthContext } from "../../context/AuthContext";

type ActivePage =
  | "home"
  | "leave-apply"
  | "tasks"
  | "payroll"
  | "internal-jobs"
  | "profile"
  | "announcements"
  | "view-all-employees"
  | "login";

const sidebarItems = [
  { label: "Home", icon: Home, page: "home" as ActivePage },
  { label: "Leave Apply", icon: Plane, page: "leave-apply" as ActivePage },
  { label: "Tasks", icon: ClipboardList, page: "tasks" as ActivePage },
  { label: "Payroll", icon: Wallet, page: "payroll" as ActivePage },
  { label: "Internal Jobs", icon: Briefcase, page: "internal-jobs" as ActivePage },
  { label: "View All Employees", icon: Users, page: "view-all-employees" as ActivePage },
  { label: "Profile", icon: User, page: "profile" as ActivePage },
  { label: "Announcements", icon: Megaphone, page: "announcements" as ActivePage },
  { label: "Signout", icon: LogOut, page: "login" as ActivePage },
];

const attendanceData = [
  { day: "Mon", hours: 8.2 },
  { day: "Tue", hours: 8.6 },
  { day: "Wed", hours: 7.9 },
  { day: "Thu", hours: 8.8 },
  { day: "Fri", hours: 8.4 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 0 },
];

const holidays = [
  { title: "Independence Day", date: "15 Aug 2026", type: "National Holiday" },
  { title: "Ganesh Chaturthi", date: "27 Aug 2026", type: "Festival Holiday" },
  { title: "Gandhi Jayanti", date: "02 Oct 2026", type: "National Holiday" },
];

const events = [
  { title: "Quarterly Town Hall", date: "24 Apr, 10:30 AM" },
  { title: "Team Engagement Activity", date: "26 Apr, 04:00 PM" },
  { title: "Leadership Connect", date: "29 Apr, 11:00 AM" },
];

const pendingTasks = [
  { title: "Submit weekly timesheet", due: "Today" },
  { title: "Upload expense proofs", due: "Tomorrow" },
  { title: "Complete compliance module", due: "Apr 28" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="h-2 w-full rounded-full bg-slate-200/70">
      <div
        className="h-2 rounded-full bg-[#18c4d8] transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const days: Array<{
    day: number | null;
    type?: "present" | "leave" | "today";
  }> = [];

  for (let i = 0; i < startDay; i++) days.push({ day: null });

  for (let d = 1; d <= lastDate; d++) {
    let type: "present" | "leave" | "today" | undefined;

    if ([3, 5, 8, 10, 11, 15, 16, 17, 18, 22].includes(d)) {
      type = "present";
    }

    if ([12].includes(d)) {
      type = "leave";
    }

    const today = new Date();

    if (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d
    ) {
      type = "today";
    }

    days.push({ day: d, type });
  }

  return days;
};

const EmployeeDashboard: React.FC = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const validPages: ActivePage[] = [
    "home",
    "leave-apply",
    "tasks",
    "payroll",
    "internal-jobs",
    "profile",
    "announcements",
    "view-all-employees",
  ];

  const getPageFromSearch = (search: string): ActivePage => {
    const params = new URLSearchParams(search);
    const page = params.get("page") as ActivePage | null;

    return page && validPages.includes(page) ? page : "home";
  };

  const [activePage, setActivePage] = useState<ActivePage>(() =>
    getPageFromSearch(location.search)
  );

  const { logout } = useAuthContext();

  const handlePageChange = (page: ActivePage) => {
    if (page === "login") {
      logout();
      navigate("/login");
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set("page", page);

    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isCheckedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn]);

  // Scroll to top whenever the active page changes (state-based navigation)
  useEffect(() => {
    setActivePage(getPageFromSearch(location.search));

    // scroll window
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.body.scrollTop = 0; // for Safari
      document.documentElement.scrollTop = 0;
    } catch (e) {
      /* ignore */
    }

    // if the main element is a scroll container, reset it as well
    if (mainRef.current) {
      try {
        // modern browsers
        (mainRef.current as HTMLElement).scrollTo?.({ top: 0, left: 0, behavior: "auto" } as any);
      } catch (e) {
        (mainRef.current as HTMLElement).scrollTop = 0;
      }
    }
  }, [location.search]);

  const handleCheckIn = () => {
    if (!isCheckedIn) {
      setIsCheckedIn(true);
      setCheckInTime(new Date());
      setCheckOutTime(null);
      setElapsedSeconds(0);
    }
  };

  const handleCheckOut = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckOutTime(new Date());
    }
  };

  const currentTime = useMemo(
    () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    [elapsedSeconds, isCheckedIn]
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("default", { month: "long" });
  const calendarDays = getMonthDays(year, month);

  if (activePage === "login") {
    return <Login />;
  }

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-[#0f1d36] text-white [font-family:Inter,-apple-system,system-ui,sans-serif]">
  <div className="relative flex min-h-[100dvh] w-full bg-[#0f1d36]">
        <aside
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
          className={`group/sidebar fixed inset-y-6 left-6 z-50 overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-[#081a4a] transition-[width] duration-300 ease-in-out xl:flex xl:flex-col ${
            isSidebarExpanded ? 'w-[260px]' : 'w-[88px]'
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="space-y-3">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                const isLoginItem = item.page === "login";
                const isActive = activePage === item.page;

                return (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.28 }}
                    type="button"
                    onClick={() => handlePageChange(item.page)}
                    className={`relative flex h-[58px] w-full items-center rounded-[1.4rem] transition-all duration-300 ${
                      isActive && !isLoginItem
                        ? `${isSidebarExpanded ? 'px-3 justify-start' : 'pl-3 justify-start'} bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]`
                        : `${isSidebarExpanded ? 'px-3 justify-start' : 'pl-3 justify-start'} text-slate-400 hover:bg-white/5 hover:text-white`
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 min-w-[48px] items-center justify-center transition-all duration-300 ${
                        isActive ? 'text-[#7dd3fc]' : 'text-slate-400'
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <span className={`ml-3 overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-wide transition-all duration-300 ${isSidebarExpanded ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>
                      {item.label}
                    </span>

                    {isActive && (
                      <div className="absolute left-0 h-6 w-1 rounded-r-full bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] shadow-[0_0_12px_rgba(192,132,252,0.9)]" />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main
          ref={mainRef}
          className={`flex min-w-0 flex-1 flex-col bg-transparent transition-all duration-300 ${
            isSidebarExpanded ? "xl:ml-[292px]" : "xl:ml-[102px]"
          }`}
        >
          <header className="sticky top-3 z-30 mx-5 w-auto rounded-[24px] border border-white/10 bg-[#172554]/95 text-white shadow-[inset_3px_0_0_rgba(34,211,238,0.75),0_16px_45px_rgba(2,8,23,0.28)] backdrop-blur-2xl sm:mx-6">
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 lg:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/10 xl:hidden"
                  type="button"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <h2 className="truncate text-[28px] font-bold leading-tight tracking-tight text-white">
                    {activePage === "home"
                      ? "Employee Dashboard"
                      : activePage === "leave-apply"
                      ? "Leave Management"
                      : activePage === "tasks"
                      ? "Tasks"
                      : activePage === "payroll"
                      ? "Payroll"
                      : activePage === "internal-jobs"
                      ? "Internal Jobs"
                      : activePage === "view-all-employees"
                      ? "View All Employees"
                      : activePage === "profile"
                      ? "Profile"
                      : activePage === "announcements"
                      ? "Announcements"
                      : "Settings"}
                  </h2>

                  <p className="truncate text-[15px] text-white/68">
                    {activePage === "home"
                      ? "Monitor attendance, tasks, payroll, and updates"
                      : activePage === "leave-apply"
                      ? "Apply for leave, track balances, and manage your requests"
                      : "Manage your employee workspace"}
                  </p>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-3">
                <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/25 text-[14px] font-bold text-white">
                    RK
                  </div>

                  <div className="hidden sm:block">
                    <p className="text-[14px] font-semibold text-white">
                      Ramakrishna
                    </p>
                    <p className="text-[11px] text-white/70">Employee</p>
                  </div>
                </div>

                <div className="ml-2 rounded-xl bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
                  HRMS
                </div>
              </div>
            </div>
          </header>

          {activePage === "home" && (
            <HomePage
              currentTime={currentTime}
              isCheckedIn={isCheckedIn}
              elapsedSeconds={elapsedSeconds}
              checkInTime={checkInTime}
              checkOutTime={checkOutTime}
              handleCheckIn={handleCheckIn}
              handleCheckOut={handleCheckOut}
              setActivePage={setActivePage}
              calendarDays={calendarDays}
              monthName={monthName}
              year={year}
              formatDuration={formatDuration}
              ProgressBar={ProgressBar}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              attendanceData={attendanceData}
              holidays={holidays}
              events={events}
              pendingTasks={pendingTasks}
            />
          )}

          {activePage === "leave-apply" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <LeaveApplyPage />
            </motion.div>
          )}

          {activePage === "tasks" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <TasksPage />
            </motion.div>
          )}

          {activePage === "payroll" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <PayrollPage />
            </motion.div>
          )}

          {activePage === "internal-jobs" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <InternalJobsPage />
            </motion.div>
          )}

          {activePage === "profile" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <ProfilePage />
            </motion.div>
          )}

          {activePage === "announcements" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <AnnouncementsPage />
            </motion.div>
          )}

          {activePage === "view-all-employees" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="w-full px-4 py-6 sm:px-5 lg:px-7"
            >
              <ViewAllEmployeesPage />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
