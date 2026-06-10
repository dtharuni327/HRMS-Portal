import TasksPage from "./modules/TasksPage";
import PayrollPage from "./modules/PayrollPage";
import InternalJobsPage from "./modules/InternalJobsPage";
import ProfilePage from "./modules/ProfilePage";
import AnnouncementsPage from "./modules/AnnouncementsPage";
import HomePage from "./modules/HomePage";
import LeaveApplyPage from "./modules/LeaveApplyPage";
import ViewAllEmployeesPage from "./modules/ViewAllEmployeesPage";
import Login from "../auth/Login";

import React, { useEffect, useMemo, useState } from "react";
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
  { label: "Logout", icon: LogOut, page: "login" as ActivePage },
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

const defaultHolidays = [
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
  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [holidays, setHolidays] = useState(() => {
    if (typeof window === "undefined") {
      return defaultHolidays;
    }
    try {
      const stored = window.localStorage.getItem("hrms_global_holidays");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((holiday: any) => ({
            title: holiday.title,
            date: holiday.date,
            type: holiday.type || "Company Holiday",
          }));
        }
      }
    } catch {
      // ignore invalid stored holidays
    }
    return defaultHolidays;
  });

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "hrms_global_holidays" && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          if (Array.isArray(parsed)) {
            setHolidays(
              parsed.map((holiday: any) => ({
                title: holiday.title,
                date: holiday.date,
                type: holiday.type || "Company Holiday",
              }))
            );
          }
        } catch {
          // ignore invalid updates
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
          className={`fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] overflow-x-hidden whitespace-nowrap rounded-[28px] border border-white/12 bg-[#10213d]/90 text-white/75 shadow-[0_24px_70px_rgba(2,8,23,0.32)] backdrop-blur-2xl transition-[width] duration-300 xl:flex xl:flex-col ${
            isSidebarExpanded ? "w-[260px]" : "w-[64px]"
          }`}
        >
          <div className="flex-1 overflow-y-auto px-3 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                    onClick={() => setActivePage(item.page)}
                    className={`relative flex h-[58px] w-full items-center text-left transition-all duration-300 ${
                      isActive && !isLoginItem
                        ? "rounded-[22px] border border-violet-300/25 bg-violet-500/30 text-white shadow-[0_14px_30px_rgba(99,102,241,0.22)]"
                        : isLoginItem
                        ? "rounded-[22px] text-sky-300 hover:bg-white/10 hover:text-sky-100"
                        : "rounded-[22px] text-white/55 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {isActive && !isLoginItem && (
                      <div className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-violet-300 shadow-[0_0_14px_rgba(167,139,250,0.75)]" />
                    )}

                    <div className="flex w-[58px] min-w-[58px] justify-center">
                      <Icon
                        className={`h-5 w-5 ${
                          isActive && !isLoginItem
                            ? "text-sky-300"
                            : isLoginItem
                            ? "text-sky-300"
                            : "text-white/55"
                        }`}
                      />
                    </div>

                    <span
                      className={`ml-1 text-[14px] font-bold uppercase tracking-[0.08em] transition-opacity duration-200 ${
                        isSidebarExpanded ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        <main
          className={`flex min-w-0 flex-1 flex-col bg-transparent transition-all duration-300 ${
            isSidebarExpanded ? "xl:ml-[292px]" : "xl:ml-[102px]"
          }`}
        >
          <header className="sticky top-0 z-30 mx-4 w-auto rounded-[24px] border border-white/10 bg-[#172554]/95 text-white shadow-[inset_3px_0_0_rgba(34,211,238,0.75),0_16px_45px_rgba(2,8,23,0.28)] backdrop-blur-2xl">
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