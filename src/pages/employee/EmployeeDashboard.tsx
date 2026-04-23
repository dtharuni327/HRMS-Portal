

import TasksPage from "./modules/TasksPage";
import PayrollPage from "./modules/PayrollPage";
import DocumentsPage from "./modules/DocumentsPage";
import InternalJobsPage from "./modules/InternalJobsPage";
import ProfilePage from "./modules/ProfilePage";
import AnnouncementsPage from "./modules/AnnouncementsPage";
import SettingsPage from "./modules/SettingsPage";
import Login from "../auth/Login";




import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Briefcase,
  Cake,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  FileText,
  FileUp,
  Home,
  Info,
  LogIn,
  LogOut,
  LogOut as LogOutIcon,
  Megaphone,
  Menu,
  Plane,
  Search,
  Settings,
  Timer,
  User,
  Wallet,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type LeaveTab = "apply" | "history" | "requests";

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

const leaveBalanceCards = [
  {
    title: "Annual Leave",
    value: 8,
    color: "text-[#4b3f72]",
    bg: "bg-[#f3f0ff]",
  },
  {
    title: "Sick Leave",
    value: 3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Casual Leave",
    value: 2,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "Loss of Pay",
    value: 0,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const upcomingHolidays = [
  { title: "Independence Day", date: "15 Aug 2026" },
  { title: "Ganesh Chaturthi", date: "27 Aug 2026" },
  { title: "Gandhi Jayanti", date: "02 Oct 2026" },
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

const PlaceholderPage: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white">
        <h2 className="text-[30px] font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-[14px] text-white/80">{description}</p>
      </div>

      <div className="rounded-[22px] border border-[#dcd3ff] bg-white p-10 shadow-sm">
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
          <h3 className="text-[24px] font-semibold text-[#1e293b]">{title}</h3>
          <p className="mt-3 max-w-xl text-[14px] text-[#64748b]">
            This page is ready for your next component. You can now build the full{" "}
            {title} module here.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const LeaveManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaveTab>("apply");
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [submitted, setSubmitted] = useState(false);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const cardHover =
    "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">
              Leave Management
            </h2>
            <p className="mt-2 text-[14px] text-white/80">
              Apply for leave, track balances, and manage your requests from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(["apply", "history", "requests"] as LeaveTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2.5 text-[14px] font-semibold transition ${
                  activeTab === tab
                    ? "bg-white text-[#4b3f72]"
                    : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab === "apply"
                  ? "Apply Leave"
                  : tab === "history"
                  ? "History"
                  : "Requests"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {activeTab === "apply" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 ${cardHover}`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <Plane className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[24px] font-semibold text-[#1e293b]">
                  Apply for Leave
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Fill in your leave details and submit for approval.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Comp Off</option>
                    <option>Loss of Pay</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[#f8fafc] p-4 md:grid-cols-3">
                <div>
                  <p className="text-[13px] text-[#64748b]">Selected Type</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    {leaveType}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#64748b]">Duration</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    {totalDays > 0 ? `${totalDays} day(s)` : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#64748b]">Approval SLA</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    1–2 business days
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Reason
                </label>
                <textarea
                  rows={5}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for leave"
                  className="w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 py-3 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Upload Document <span className="text-[#64748b]">(optional)</span>
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-[#cdbdf9] bg-[#faf8ff] px-4 py-4 transition hover:border-[#4b3f72]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#f3f0ff] p-2">
                      <FileUp className="h-4 w-4 text-[#4b3f72]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#1e293b]">
                        {fileName || "Choose a file to upload"}
                      </p>
                      <p className="text-[12px] text-[#64748b]">
                        PDF, JPG, PNG up to 5 MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  />
                  <span className="rounded-xl bg-[#4b3f72] px-4 py-2 text-[13px] font-semibold text-white">
                    Browse
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#4b3f72] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
                >
                  Apply Leave
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-[#4b3f72] bg-white px-6 py-3 text-[14px] font-semibold text-[#4b3f72] transition hover:bg-[#f3f0ff]"
                >
                  Cancel
                </button>
              </div>

              {submitted && (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-[14px] font-medium text-emerald-700">
                  Your leave request has been submitted successfully.
                </div>
              )}
            </form>
          </motion.div>

          <div className="space-y-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#1e293b]">
                    Leave Balance
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Balance for {selectedMonth}
                  </p>
                </div>

                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-11 appearance-none rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72]"
                  >
                    <option>April 2026</option>
                    <option>May 2026</option>
                    <option>June 2026</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {leaveBalanceCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-2xl border border-[#ece7ff] p-5 ${card.bg}`}
                  >
                    <p className={`text-[16px] font-semibold ${card.color}`}>
                      {card.title}
                    </p>
                    <p className={`mt-3 text-[36px] font-semibold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-[#f3f0ff] p-3">
                  <Info className="h-5 w-5 text-[#4b3f72]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1e293b]">
                    Leave Process
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    How your request gets approved
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Select leave type and dates",
                  "Submit request with reason",
                  "Manager reviews your request",
                  "HR finalizes and updates balance",
                ].map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl bg-[#f8fafc] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4b3f72] text-[13px] font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-[14px] text-[#1e293b]">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-[#f3f0ff] p-3">
                  <WalletCards className="h-5 w-5 text-[#4b3f72]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1e293b]">
                    Policy Snapshot
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Quick reminders before applying
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-[14px] font-medium text-[#1e293b]">
                    Minimum notice for planned leave
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    Apply at least 2 working days in advance.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-[14px] font-medium text-[#1e293b]">
                    Medical proof for sick leave
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    Required if leave exceeds 2 consecutive days.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#4b3f72]" />
                    <p className="text-[14px] font-medium text-[#1e293b]">
                      Upcoming Holidays
                    </p>
                  </div>
                  <div className="space-y-2">
                    {upcomingHolidays.map((holiday) => (
                      <div
                        key={holiday.title}
                        className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                      >
                        <span className="text-[13px] text-[#1e293b]">
                          {holiday.title}
                        </span>
                        <span className="text-[12px] text-[#64748b]">
                          {holiday.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <h3 className="text-[22px] font-semibold text-[#1e293b]">
            Leave History
          </h3>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Previously applied leave records will appear here.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[#ece7ff] text-[13px] text-[#64748b]">
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">From</th>
                  <th className="px-3 py-3">To</th>
                  <th className="px-3 py-3">Days</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Annual Leave",
                    from: "04 Apr 2026",
                    to: "05 Apr 2026",
                    days: 2,
                    status: "Approved",
                  },
                  {
                    type: "Sick Leave",
                    from: "18 Mar 2026",
                    to: "18 Mar 2026",
                    days: 1,
                    status: "Approved",
                  },
                ].map((row) => (
                  <tr key={`${row.type}-${row.from}`} className="border-b border-[#f3f0ff]">
                    <td className="px-3 py-4 text-[14px] text-[#1e293b]">{row.type}</td>
                    <td className="px-3 py-4 text-[14px] text-[#64748b]">{row.from}</td>
                    <td className="px-3 py-4 text-[14px] text-[#64748b]">{row.to}</td>
                    <td className="px-3 py-4 text-[14px] text-[#1e293b]">{row.days}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "requests" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <h3 className="text-[22px] font-semibold text-[#1e293b]">
            Pending Requests
          </h3>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Requests awaiting manager or HR approval.
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                type: "Casual Leave",
                date: "22 Apr 2026 - 23 Apr 2026",
                status: "Under Review",
              },
              {
                type: "Comp Off",
                date: "29 Apr 2026",
                status: "Pending Manager Approval",
              },
            ].map((request) => (
              <div
                key={`${request.type}-${request.date}`}
                className="rounded-2xl border border-[#ece7ff] bg-[#faf8ff] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1e293b]">
                      {request.type}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      {request.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-700">
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
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
  return <LoginPage onLogin={() => setActivePage("home")} />;
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

      return (
        <motion.button
          key={item.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.04, duration: 0.28 }}
          type="button"
          onClick={() => setActivePage(item.page)}
          className={`flex h-[50px] w-full items-center text-left transition-all ${
            activePage === item.page && item.page !== "login"
              ? "bg-white/10 text-white"
              : item.page === "login"
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
  className={`flex min-w-0 flex-1 flex-col bg-[#f1f5f9] transition-[margin] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
    isSidebarExpanded ? "ml-[240px]" : "ml-[70px]"
  }`}
>
  <header className="sticky top-0 z-30 w-full bg-[#4b3f72] text-white shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
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
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="w-full space-y-6 px-4 py-6 sm:px-5 lg:px-7"
  >
    {/* Welcome */}
    <motion.section
      variants={itemVariants}
      className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white shadow-sm"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[14px] text-white/80">Welcome back</p>
          <h3 className="mt-1 text-[28px] font-semibold">Ramakrishna</h3>
          <p className="mt-2 max-w-2xl text-[14px] text-white/80">
            Your workspace is ready. Track attendance, manage leave,
            view your tasks, and stay updated with events and holidays.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
          <p className="text-[13px] text-white/70">Current Time</p>
          <p className="mt-1 text-[24px] font-semibold">{currentTime}</p>
        </div>
      </div>
    </motion.section>

    {/* Row 1 */}
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-4 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Work Session
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Track live work hours after check-in
            </p>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
              isCheckedIn
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isCheckedIn ? "Checked In" : "Checked Out"}
          </div>
        </div>

        <div className="rounded-2xl bg-[#f8fafc] p-5">
          <div className="flex items-center gap-2 text-[#64748b]">
            <Timer className="h-4 w-4" />
            <span className="text-[14px]">Running Timer</span>
          </div>
          <p className="mt-3 text-[32px] font-semibold tracking-tight text-[#4b3f72]">
            {formatDuration(elapsedSeconds)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] text-[#64748b]">
            <div>
              <p>Check In</p>
              <p className="mt-1 font-semibold text-[#1e293b]">
                {checkInTime
                  ? checkInTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>
            <div>
              <p>Check Out</p>
              <p className="mt-1 font-semibold text-[#1e293b]">
                {checkOutTime
                  ? checkOutTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={handleCheckIn}
            disabled={isCheckedIn}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#4b3f72] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            <LogIn className="h-4 w-4" />
            Check In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!isCheckedIn}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#dcd3ff] bg-[#f3f0ff] px-4 py-3 text-[14px] font-semibold text-[#4b3f72] transition hover:bg-[#ebe4ff] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
          >
            <LogOutIcon className="h-4 w-4" />
            Check Out
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-4 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[#1e293b]">
            Leave Balance
          </h3>
          <Plane className="h-5 w-5 text-[#4b3f72]" />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#64748b]">Annual Leave</span>
              <span className="text-[14px] font-semibold text-[#1e293b]">
                8 / 12 left
              </span>
            </div>
            <div className="mt-3">
              <ProgressBar value={67} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Pending</p>
              <p className="mt-2 text-[24px] font-semibold text-[#1e293b]">
                02
              </p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Approved</p>
              <p className="mt-2 text-[24px] font-semibold text-[#1e293b]">
                04
              </p>
            </div>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Sick</p>
              <p className="mt-2 text-[24px] font-semibold text-[#1e293b]">
                03
              </p>
            </div>
          </div>

          <button
            onClick={() => setActivePage("leave-apply")}
            className="w-full rounded-xl bg-[#4b3f72] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
            type="button"
          >
            Apply Leave
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-4 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#a78bfa] text-[22px] font-bold text-white">
            RK
          </div>
          <div>
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Ramakrishna
            </h3>
            <p className="text-[14px] text-[#64748b]">Software Engineer</p>
            <p className="mt-1 text-[12px] text-[#64748b]">
              EMP-2048 · Engineering
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-[13px] text-[#64748b]">Manager</p>
            <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
              Bhargav Ram
            </p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-[13px] text-[#64748b]">Location</p>
            <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
              Hyderabad
            </p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-[13px] text-[#64748b]">Shift</p>
            <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
              10:00 AM - 07:00 PM
            </p>
          </div>
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <p className="text-[13px] text-[#64748b]">Status</p>
            <p className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Active
            </p>
          </div>
        </div>
      </motion.div>
    </section>

    {/* Row 2 */}
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-4 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-[#1e293b]">
            Attendance Overview
          </h3>
          <span className="rounded-full bg-[#ebe4ff] px-3 py-1 text-[14px] font-medium text-[#4b3f72]">
            Present Today
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-2xl bg-[#f8fafc] p-4">
            <div className="flex items-center gap-2 text-[#64748b]">
              <Clock3 className="h-4 w-4" />
              <span className="text-[14px]">Today Check In</span>
            </div>
            <p className="mt-3 text-[28px] font-semibold text-[#1e293b]">
              {checkInTime
                ? checkInTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "09:06 AM"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-[#64748b]">
                <CalendarDays className="h-4 w-4" />
                <span className="text-[14px]">This Month</span>
              </div>
              <p className="mt-3 text-[28px] font-semibold text-[#1e293b]">
                21 / 22
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <div className="flex items-center gap-2 text-[#64748b]">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-[14px]">Late Marks</span>
              </div>
              <p className="mt-3 text-[28px] font-semibold text-[#1e293b]">
                02
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-8 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Attendance Graph
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Weekly working hours trend
            </p>
          </div>
          <span className="rounded-full bg-[#f3f0ff] px-3 py-1 text-[13px] font-medium text-[#4b3f72]">
            This Week
          </span>
        </div>

        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4b3f72" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#4b3f72" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9e2ff" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #dcd3ff",
                  background: "#ffffff",
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#4b3f72"
                strokeWidth={3}
                fill="url(#attendanceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>

    {/* Row 3 */}
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Calendar
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Leave and attendance overview
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#f3f0ff] px-3 py-2 text-[14px] font-medium text-[#4b3f72]">
            <CalendarRange className="h-4 w-4" />
            {monthName} {year}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-[13px] font-medium text-[#64748b]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}

          {calendarDays.map((item, index) => (
            <div
              key={index}
              className={`flex h-14 items-center justify-center rounded-xl border text-[14px] font-medium ${
                item.day === null
                  ? "border-transparent bg-transparent"
                  : item.type === "today"
                  ? "border-[#4b3f72] bg-[#f3f0ff] text-[#4b3f72]"
                  : item.type === "leave"
                  ? "border-[#f1d0d0] bg-red-50 text-red-700"
                  : item.type === "present"
                  ? "border-[#d6f3de] bg-emerald-50 text-emerald-700"
                  : "border-[#ece7ff] bg-[#faf8ff] text-[#1e293b]"
              }`}
            >
              {item.day}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            Present
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-300" />
            Leave
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#4b3f72]" />
            Today
          </div>
        </div>
      </motion.div>

      <div className="space-y-6 xl:col-span-5">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Upcoming Holidays
            </h3>
            <Cake className="h-5 w-5 text-[#4b3f72]" />
          </div>

          <div className="space-y-3">
            {holidays.map((holiday) => (
              <div key={holiday.title} className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[14px] font-semibold text-[#1e293b]">
                  {holiday.title}
                </p>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  {holiday.date}
                </p>
                <p className="mt-1 text-[12px] text-[#4b3f72]">
                  {holiday.type}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Upcoming Events
            </h3>
            <CalendarDays className="h-5 w-5 text-[#4b3f72]" />
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.title} className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[14px] font-semibold text-[#1e293b]">
                  {event.title}
                </p>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  {event.date}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="rounded-[20px] border border-[#dcd3ff] bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.22)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-[#1e293b]">
              Pending Tasks
            </h3>
            <ClipboardList className="h-5 w-5 text-[#4b3f72]" />
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.title} className="rounded-2xl bg-[#f8fafc] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      {task.title}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      Due: {task.due}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-medium text-amber-700">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  </motion.div>
)}

{activePage === "leave-apply" && (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="w-full px-4 py-6 sm:px-5 lg:px-7"
  >
    <LeaveManagementPage />
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