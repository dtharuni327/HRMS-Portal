

import TasksPage from "./modules/TasksPage";
import PayrollPage from "./modules/PayrollPage";
import DocumentsPage from "./modules/DocumentsPage";
import InternalJobsPage from "./modules/InternalJobsPage";
import ProfilePage from "./modules/ProfilePage";
import AnnouncementsPage from "./modules/AnnouncementsPage";
import SettingsPage from "./modules/SettingsPage";
import HomePage from "./modules/HomePage";
import LeaveApplyPage from "./modules/LeaveApplyPage";
import Login from "../auth/Login";




import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Megaphone,
  Menu,
  Plane,
  Search,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

type ActivePage =
  | "home"
  | "leave-apply"
  | "tasks"
  | "payroll"
  | "documents"
  | "internal-jobs"
  | "profile"
  | "announcements"
  | "settings"
  | "login";

const sidebarItems = [
  { label: "Home", icon: Home, page: "home" as ActivePage },
  { label: "Leave Apply", icon: Plane, page: "leave-apply" as ActivePage },
  { label: "Tasks", icon: ClipboardList, page: "tasks" as ActivePage },
  { label: "Payroll", icon: Wallet, page: "payroll" as ActivePage },
  { label: "Documents", icon: FileText, page: "documents" as ActivePage },
  { label: "Internal Jobs", icon: Briefcase, page: "internal-jobs" as ActivePage },
  { label: "Profile", icon: User, page: "profile" as ActivePage },
  { label: "Announcements", icon: Megaphone, page: "announcements" as ActivePage },
  { label: "Settings", icon: Settings, page: "settings" as ActivePage },
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
    <div className="h-2 w-full rounded-full bg-slate-200">
      <div
        className="h-2 rounded-full bg-[#4b3f72] transition-all duration-500"
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
  const days: Array<{ day: number | null; type?: "present" | "leave" | "today" }> = [];

  for (let i = 0; i < startDay; i++) days.push({ day: null });

  for (let d = 1; d <= lastDate; d++) {
    let type: "present" | "leave" | "today" | undefined;
    if ([3, 5, 8, 10, 11, 15, 16, 17, 18, 22].includes(d)) type = "present";
    if ([12, 25].includes(d)) type = "leave";

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
    <div className="min-h-screen w-full bg-[#f8fafc] text-[#1e293b] [font-family:Inter,-apple-system,system-ui,sans-serif]">
      <div className="flex min-h-screen w-full">
        <aside
          onMouseEnter={() => setIsSidebarExpanded(true)}
          onMouseLeave={() => setIsSidebarExpanded(false)}
          className={`fixed left-0 top-0 z-40 hidden h-screen overflow-x-hidden whitespace-nowrap bg-[#352d52] text-[#d1d5db] transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] xl:flex xl:flex-col ${
            isSidebarExpanded ? "w-[240px]" : "w-[70px]"
          }`}
        >
          <div className="flex-1 overflow-y-auto py-5">
  <nav className="space-y-1.5">
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
          className={`flex h-[50px] w-full items-center text-left transition-all ${
            isActive && !isLoginItem
              ? "bg-white/10 text-white"
              : isLoginItem
              ? "text-[#a78bfa] hover:bg-white/10 hover:text-[#c7b3ff]"
              : "text-[#d1d5db] hover:bg-white/10 hover:text-[#a78bfa]"
          }`}
        >
                    <div className="flex w-[70px] min-w-[70px] justify-center">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span
                      className={`ml-[5px] text-[14px] font-medium transition-opacity duration-200 ease-in-out ${
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
  className={`flex min-w-0 flex-1 flex-col bg-[#f1f5f9] transition-all duration-300 ${
  isSidebarExpanded ? "xl:ml-[260px]" : "xl:ml-[90px]"
}`}
>
  <header className="sticky top-0 z-30 mx-4 mt-4 w-auto rounded-2xl bg-[#4b3f72] text-white shadow-lg">
    <div className="flex items-center justify-between px-4 py-3 sm:px-5 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="rounded-lg border border-white/20 p-2 xl:hidden"
          type="button"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-[28px] font-semibold leading-tight tracking-tight text-white">
            {activePage === "home"
              ? "Employee Dashboard"
              : activePage === "leave-apply"
              ? "Leave Management"
              : activePage === "tasks"
              ? "Tasks"
              : activePage === "payroll"
              ? "Payroll"
              : activePage === "documents"
              ? "Documents"
              : activePage === "internal-jobs"
              ? "Internal Jobs"
              : activePage === "profile"
              ? "Profile"
              : activePage === "announcements"
              ? "Announcements"
              : "Settings"}
          </h2>
          <p className="truncate text-[16px] text-white/80">
            {activePage === "home"
              ? "Monitor attendance, tasks, payroll, and updates"
              : activePage === "leave-apply"
              ? "Apply for leave, track balances, and manage your requests"
              : "Manage your employee workspace"}
          </p>
        </div>
      </div>

      <div className="ml-4 flex shrink-0 items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
          <input
            placeholder="Search..."
            className="h-10 w-64 rounded-xl border border-white/20 bg-white/10 py-2 pl-10 pr-4 text-[14px] text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-[#a78bfa]"
          />
        </div>

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10"
          type="button"
        >
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#a78bfa]" />
        </button>

        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#a78bfa] text-[14px] font-bold text-white">
            Rk
          </div>
          <div className="hidden sm:block">
            <p className="text-[14px] font-semibold text-white">Ramakrishna</p>
            <p className="text-[11px] text-white/80">Employee</p>
          </div>
        </div>

        <div className="ml-2 rounded-lg bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
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

{activePage === "documents" && (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="w-full px-4 py-6 sm:px-5 lg:px-7"
  >
    <DocumentsPage />
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

{activePage === "settings" && (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="w-full px-4 py-6 sm:px-5 lg:px-7"
  >
    <SettingsPage />
  </motion.div>
)}
</main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;