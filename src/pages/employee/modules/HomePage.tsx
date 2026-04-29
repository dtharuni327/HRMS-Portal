import React from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Cake,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LogIn,
  LogOut as LogOutIcon,
  Plane,
  Timer,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CalendarDay = {
  day: number | null;
  type?: "present" | "leave" | "today";
};

type HomePageProps = {
  currentTime: string;
  isCheckedIn: boolean;
  elapsedSeconds: number;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  handleCheckIn: () => void;
  handleCheckOut: () => void;
  setActivePage: (page: "leave-apply") => void;
  calendarDays: CalendarDay[];
  monthName: string;
  year: number;
  formatDuration: (seconds: number) => string;
  ProgressBar: React.FC<{ value: number }>;
  containerVariants: any;
  itemVariants: any;
  attendanceData: Array<{ day: string; hours: number }>;
  holidays: Array<{ title: string; date: string; type: string }>;
  events: Array<{ title: string; date: string }>;
  pendingTasks: Array<{ title: string; due: string }>;
};

const HomePage: React.FC<HomePageProps> = ({
  currentTime,
  isCheckedIn,
  elapsedSeconds,
  checkInTime,
  checkOutTime,
  handleCheckIn,
  handleCheckOut,
  setActivePage,
  calendarDays,
  monthName,
  year,
  formatDuration,
  ProgressBar,
  containerVariants,
  itemVariants,
  attendanceData,
  holidays,
  events,
  pendingTasks,
}) => {
  return (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="w-full space-y-6 px-4 py-6 sm:px-8 lg:px-7"
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
  );
};

export default HomePage;
