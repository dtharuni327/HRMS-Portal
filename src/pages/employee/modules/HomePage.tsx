import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import employeeImage from "../../../images/image.png";
import SystemConfigCard from "../../../components/employee/SystemConfigCard";
import {
  BadgeCheck,
  Cake,
  CalendarDays,
  CalendarRange,
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut as LogOutIcon,
  Plane,
  Users,
  X,
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
  setActivePage: (page: "leave-apply" | "tasks" | "view-all-employees") => void;
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
}) => {
  const [profileImage, setProfileImage] = useState<string>(
    () => localStorage.getItem("employeeProfileImage") || "",
  );

  const [showProfileModal, setShowProfileModal] = useState(false);

  const employees = [
    {
      id: 1,
      name: "D Tharuni",
      role: "Admin",
      department: "Human Resources",
      email: "d.tharuni@company.com",
      phone: "+91 98765 43210",
      employeeId: "CMP0001",
      location: "Hyderabad",
      status: "Active",
      birthday: "May 18",
      avatar: "AS",
    },
    {
      id: 2,
      name: "Divya Nair",
      role: "Employee",
      department: "Finance",
      email: "divya.nair@company.com",
      phone: "+91 91234 56789",
      employeeId: "CMP00101",
      location: "Bangalore",
      status: "Active",
      birthday: "May 18",
      avatar: "DN",
    },
    {
      id: 3,
      name: "Karan Mehta",
      role: "Employee",
      department: "Engineering",
      email: "karan.mehta@company.com",
      phone: "+91 99876 54321",
      employeeId: "CMP00120",
      location: "Remote",
      status: "Active",
      birthday: "Aug 25",
      avatar: "KM",
    },
    {
      id: 4,
      name: "Maya Singh",
      role: "Employee",
      department: "Engineering",
      email: "maya.singh@company.com",
      phone: "+91 98123 45678",
      employeeId: "CMP00130",
      location: "Mumbai",
      status: "Active",
      birthday: "Dec 12",
      avatar: "MS",
    },
  ];

  const todaysBirthdays = employees.filter(
    (employee) => employee.birthday === "May 18",
  );

  const totalEmployees = employees.length;

  const employeeDetails = {
    name: "Ramakrishna",
    avatar: "Rk",
    role: "Software Engineer",
    email: "ramakrishna@company.com",
    phone: "+91 98765 43210",
    department: "Engineering",
    experience: "1 Years",
    employeeId: "EMP-2048",
    office: "Hyderabad HQ",
    joiningDate: "15 Jan 2024",
    accessLevel: "Employee",
    manager: "Bhargav Ram",
    location: "Hyderabad",
    shift: "10:00 AM - 07:00 PM",
    status: "Active",
    taskStatus: "On Track",
  };

  useEffect(() => {
    const syncProfileImage = () => {
      setProfileImage(localStorage.getItem("employeeProfileImage") || "");
    };

    window.addEventListener("storage", syncProfileImage);
    window.addEventListener("employeeProfileImageUpdated", syncProfileImage);

    return () => {
      window.removeEventListener("storage", syncProfileImage);
      window.removeEventListener("employeeProfileImageUpdated", syncProfileImage);
    };
  }, []);

  return (
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="w-full space-y-7 px-4 py-7 text-[#0f172a] sm:px-6 lg:px-8"
>
  {/* Employee Welcome Card */}
  <motion.div
    variants={itemVariants}
   className="relative mt-14 min-h-[195px] overflow-visible rounded-[34px] border border-white/10 bg-[#1e3350] px-7 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
  >
    <div className="absolute right-[-80px] top-[-80px] h-[260px] w-[260px] rounded-full bg-cyan-400/10 blur-3xl" />

    <div className="relative z-10 flex h-full items-center justify-between">
      <div className="max-w-[55%]">
        <div className="flex items-start gap-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Employee Profile"
              className="h-[50px] w-[50px] rounded-2xl border border-cyan-400 object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-[#2563eb] text-lg font-black text-white shadow-lg">
              {employeeDetails.avatar}
            </div>
          )}

          <div>
            <h2 className="text-[22px] font-black leading-tight text-white">
              Welcome back, {employeeDetails.name}!
            </h2>

            <p className="mt-1 text-[15px] font-black text-emerald-400">
              {employeeDetails.role}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-16 gap-y-4">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
              Email Address
            </p>
            <p className="mt-1 text-[13px] font-bold text-white">
              {employeeDetails.email}
            </p>
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
              Contact Number
            </p>
            <p className="mt-1 text-[13px] font-bold text-white">
              {employeeDetails.phone}
            </p>
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
              Experience
            </p>
            <p className="mt-1 text-[14px] font-black text-white">
              {employeeDetails.experience}
            </p>
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
              Department
            </p>
            <p className="mt-1 text-[14px] font-black text-white">
              {employeeDetails.department}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowProfileModal(true)}
          className="mt-5 rounded-[18px] bg-cyan-500 px-7 py-3 text-[12px] font-black uppercase tracking-[2px] text-black transition-all duration-300 hover:bg-cyan-400"
          type="button"
        >
          View Profile
        </button>
      </div>

     {/* RIGHT SIDE IMAGE */}
<div className="pointer-events-none absolute -top-[82px] right-[55px] hidden lg:block">
  <img
    src={employeeImage}
    alt="Employee"
    className="h-[330px] w-auto object-contain"
  />
</div>
    </div>
  </motion.div>

  {/* Profile Modal */}
  {showProfileModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0b1020] p-6 shadow-2xl">
        <button
          onClick={() => setShowProfileModal(false)}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition hover:bg-red-500"
          type="button"
        >
          <X size={18} className="text-white" />
        </button>

        <div className="flex items-center gap-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Employee Profile"
              className="h-20 w-20 rounded-2xl border-2 border-cyan-400 object-cover shadow-lg"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2563eb] text-3xl font-black text-white shadow-lg">
              {employeeDetails.avatar}
            </div>
          )}

          <div>
            <h2 className="text-3xl font-black text-white">
              {employeeDetails.name}
            </h2>
            <p className="mt-1 text-base font-bold text-cyan-400">
              {employeeDetails.role}
            </p>
            <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-500">
              {employeeDetails.employeeId}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "Email", value: employeeDetails.email },
            { label: "Phone", value: employeeDetails.phone },
            { label: "Department", value: employeeDetails.department },
            { label: "Experience", value: employeeDetails.experience },
            { label: "Employee ID", value: employeeDetails.employeeId },
            { label: "Office", value: employeeDetails.office },
            { label: "Joining Date", value: employeeDetails.joiningDate },
            { label: "Manager", value: employeeDetails.manager },
            { label: "Shift", value: employeeDetails.shift },
            { label: "Location", value: employeeDetails.location },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                {item.label}
              </p>
              <h3 className="break-all text-sm font-bold text-white">
                {item.value}
              </h3>
            </div>
          ))}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Access Level
            </p>
            <div className="inline-flex rounded-full bg-purple-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-purple-400">
              {employeeDetails.accessLevel}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Status
            </p>
            <div className="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-400">
              {employeeDetails.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Row 1 */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
{/* Work Session */}
<motion.div
  variants={itemVariants}
  className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#e3dcf4] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-4"
>
  <div className="mb-5 flex items-center justify-between">
    <div>
      <h3 className="text-[19px] font-semibold text-[#151936]">
        Work Session
      </h3>
      <p className="mt-1 text-[14px] text-[#475569]">
        Track live work hours after check-in
      </p>
    </div>

    <div
      className={`rounded-full border border-[#0f172a]/10 px-3 py-1 text-[12px] font-semibold ${
        isCheckedIn
          ? "bg-violet-100 text-violet-700"
          : "bg-white/70 text-[#64748b]"
      }`}
    >
      {isCheckedIn ? "Checked In" : "Checked Out"}
    </div>
  </div>

  <div className="flex justify-center">
    <div className="relative flex h-[230px] w-[230px] items-center justify-center">
      <div
        className="absolute inset-0 rounded-full opacity-25"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(109,96,209,0.42) 0deg 1deg, transparent 1deg 7deg)",
        }}
      />

      <div className="absolute inset-[12px] rounded-full bg-[#cfc6f0]" />
      <div className="absolute inset-[20px] rounded-full border-[12px] border-[#b4a8ec]" />

      <div className="absolute inset-[40px] overflow-hidden rounded-full bg-white shadow-[inset_0_8px_20px_rgba(79,70,229,0.08)]">
        <div className="flex h-full w-full items-center justify-center px-3">
          <div className="w-full text-center">
            <p className="text-[28px] font-semibold tracking-tight text-[#111827]">
              {formatDuration(elapsedSeconds)}
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#64748b]">
              Running Timer
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#f4f1ff] px-2 py-2">
                <p className="text-[9px] font-semibold text-[#64748b]">
                  Check In
                </p>
                <p className="mt-1 whitespace-nowrap text-[11px] font-bold text-[#111827]">
                  {checkInTime
                    ? checkInTime.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>
              </div>

              <div className="rounded-xl bg-[#f4f1ff] px-2 py-2">
                <p className="text-[9px] font-semibold text-[#64748b]">
                  Check Out
                </p>
                <p className="mt-1 whitespace-nowrap text-[11px] font-bold text-[#111827]">
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
        </div>
      </div>
    </div>
  </div>

  <div className="mt-6 flex gap-3">
    <button
      onClick={handleCheckIn}
      disabled={isCheckedIn}
      className="flex flex-1 items-center justify-center gap-2 rounded-[16px] border border-[#0f172a]/10 bg-[#6356d8] px-4 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#5447ca] hover:shadow-[0_10px_20px_rgba(99,86,216,0.25)] disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
    >
      <LogIn className="h-4 w-4" />
      Check In
    </button>

    <button
      onClick={handleCheckOut}
      disabled={!isCheckedIn}
      className="flex flex-1 items-center justify-center gap-2 rounded-[16px] border border-[#0f172a]/10 bg-[#d7d1f3] px-4 py-3 text-[14px] font-semibold text-[#25315b] transition-all duration-200 hover:bg-[#ccc4ee] disabled:cursor-not-allowed disabled:opacity-50"
      type="button"
    >
      <LogOutIcon className="h-4 w-4" />
      Check Out
    </button>
  </div>
</motion.div>

        {/* Leave Balance */}
        <motion.div
          variants={itemVariants}
          className="relative min-h-[330px] overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#dcefe8] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[19px] font-semibold text-[#10223d]">
              Leave Balance
            </h3>
            <Plane className="h-5 w-5 text-[#0f766e]" />
          </div>

          <div className="flex flex-col space-y-12">
            <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/72 p-4 shadow-[0_8px_20px_rgba(15,118,110,0.06)]">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#475569]">
                  Annual Leave
                </span>
                <span className="text-[14px] font-semibold text-[#0f172a]">
                  8 / 12 left
                </span>
              </div>
              <div className="mt-3">
                <ProgressBar value={67} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pending", value: "02" },
                { label: "Approved", value: "04" },
                { label: "Sick", value: "03" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-[#0f172a]/10 bg-white/68 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85"
                >
                  <p className="text-[13px] text-[#64748b]">{item.label}</p>
                  <p className="mt-2 text-[24px] font-semibold text-[#0f172a]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActivePage("leave-apply")}
              className="mt-auto w-full rounded-[16px] border border-[#0f172a]/10 bg-[#15936b] px-4 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f7f5d] hover:shadow-[0_10px_20px_rgba(21,147,107,0.22)]"
              type="button"
            >
              Apply Leave
            </button>
          </div>
        </motion.div>

        {/* Tasks Card */}
        <motion.div
          variants={itemVariants}
          className="relative min-h-[340px] overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#ebe5d8] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[27px] font-bold tracking-tight text-[#111827]">
                My Tasks
              </h3>
              <p className="mt-1 text-[15px] text-[#475569]">
                Track your daily work progress
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d8ccba] text-[24px] font-bold text-[#0f172a]">
              📋
            </div>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3">
            {[
              { label: "Pending", value: "08 Tasks" },
              { label: "Completed", value: "14 Tasks" },
              { label: "In Progress", value: "03 Tasks" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[#0f172a]/10 bg-white/48 p-4"
              >
                <p className="text-[13px] text-[#64748b]">{item.label}</p>
                <p className="mt-2 text-[18px] font-semibold leading-6 text-[#0f172a]">
                  {item.value}
                </p>
              </div>
            ))}

            <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/48 p-4">
              <p className="text-[13px] text-[#64748b]">Today's Status</p>

              <div className="mt-2 flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-[#10b981]" />
                <span className="text-[18px] font-semibold text-[#10b981]">
                  On Track
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setActivePage("tasks")}
              className="w-full rounded-[18px] bg-[#0f172a] px-5 py-3 text-[15px] font-semibold text-white transition-all duration-300 hover:bg-[#1e293b]"
              type="button"
            >
              View All Tasks
            </button>
          </div>
        </motion.div>
      </section>

      {/* Row 2 */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Attendance Overview */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#dde9f5] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[19px] font-semibold text-[#10223d]">
              Attendance Overview
            </h3>
            <span className="rounded-full border border-[#0f172a]/10 bg-[#d0e4f4] px-3 py-1 text-[13px] font-medium text-[#0d6db8]">
              Present Today
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/58 p-4">
              <div className="flex items-center gap-2 text-[#475569]">
                <Clock3 className="h-4 w-4" />
                <span className="text-[14px]">Today Check In</span>
              </div>
              <p className="mt-3 text-[34px] font-bold tracking-tight text-[#0f172a]">
                {checkInTime
                  ? checkInTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>

            <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/58 p-4">
              <div className="flex items-center gap-2 text-[#475569]">
                <LogOutIcon className="h-4 w-4" />
                <span className="text-[14px]">Today Check Out</span>
              </div>
              <p className="mt-3 text-[34px] font-bold tracking-tight text-[#0f172a]">
                {checkOutTime
                  ? checkOutTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/58 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/75">
                <div className="flex items-center gap-2 text-[#475569]">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-[14px]">This Month</span>
                </div>
                <p className="mt-3 text-[31px] font-bold text-[#0f172a]">
                  21 / 22
                </p>
              </div>

              <div className="rounded-[20px] border border-[#0f172a]/10 bg-white/58 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/75">
                <div className="flex items-center gap-2 text-[#475569]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-[14px]">Late Marks</span>
                </div>
                <p className="mt-3 text-[31px] font-bold text-[#0f172a]">
                  02
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attendance Graph */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#e3efe8] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[19px] font-semibold text-[#10223d]">
                Attendance Graph
              </h3>
              <p className="mt-1 text-[14px] text-[#64748b]">
                Weekly working hours trend
              </p>
            </div>
            <span className="rounded-full border border-[#0f172a]/10 bg-emerald-100 px-3 py-1 text-[13px] font-medium text-[#15936b]">
              This Week
            </span>
          </div>

          <div className="h-[300px] w-full min-w-0 rounded-[20px] border border-[#0f172a]/10 bg-white/58 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient
                    id="attendanceFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(15,23,42,0.10)"
                />
                <XAxis dataKey="day" stroke="rgba(15,23,42,0.62)" />
                <YAxis stroke="rgba(15,23,42,0.62)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(15,23,42,0.10)",
                    background: "#ffffff",
                    color: "#0f172a",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#10b981"
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
        {/* Attendance Calendar */}
        <motion.div
          variants={itemVariants}
          className="rounded-[30px] border border-[#0f172a]/10 bg-[#eee3e8] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)] xl:col-span-7"
        >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-[21px] font-semibold tracking-tight text-[#10223d]">
                Attendance Calendar
              </h3>

              <p className="mt-1 text-[14px] text-[#64748b]">
                Leave and attendance overview
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-[16px] border border-[#0f172a]/10 bg-white/58 px-4 py-2 text-[14px] font-semibold text-[#be123c]">
              <CalendarRange className="h-4 w-4" />
              {monthName} {year}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-semibold uppercase tracking-wider text-[#64748b]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-3">
            {calendarDays.map((item, index) => {
              const dayIndex = index % 7;
              const isWeekoff =
                item.day !== null && (dayIndex === 0 || dayIndex === 6);
              const todayDay =
                calendarDays.find((d) => d.type === "today")?.day ?? 0;

              const isPresent =
                item.day !== null &&
                item.day < todayDay &&
                item.type !== "leave" &&
                item.type !== "today" &&
                !isWeekoff;

              return (
                <button
                  key={index}
                  disabled={item.day === null}
                  type="button"
                  className={`relative flex h-[64px] flex-col items-center justify-center rounded-[16px] border text-[15px] font-semibold transition-all duration-200 ${
                    item.day === null
                      ? "cursor-default border-transparent bg-transparent"
                      : item.type === "today"
                        ? "border-amber-300 bg-amber-100 text-[#92400e]"
                        : item.type === "leave"
                          ? "border-red-300 bg-red-100 text-red-700"
                          : isPresent
                            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : isWeekoff
                              ? "border-sky-200 bg-sky-50 text-[#334155]"
                              : "border-[#0f172a]/8 bg-white/50 text-[#0f172a] hover:bg-white/68"
                  }`}
                >
                  <span>{item.day}</span>

                  {isWeekoff && (
                    <span className="mt-1 rounded-md border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">
                      H
                    </span>
                  )}

                  {item.type === "today" && (
                    <span className="absolute bottom-2 h-2.5 w-2.5 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-6 text-[13px] font-medium text-[#475569]">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]" />
              <span className="text-[#334155]">Present</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.35)]" />
              <span className="text-[#334155]">Leave</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.35)]" />
              <span className="text-[#334155]">Today</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-md border border-sky-200 bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700 shadow-sm">
                H
              </span>

              <span className="text-[#334155]">Weekoff</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 xl:col-span-5">
          {/* Upcoming Holidays */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#efe7cf] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[21px] font-semibold tracking-tight text-[#10223d]">
                  Upcoming Holidays
                </h3>

                <p className="mt-1 text-[14px] text-[#64748b]">
                  Company holidays and festivals
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-[20px] border border-[#0f172a]/10 bg-amber-100 text-[#c87d16]">
                <Cake className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-4">
              {holidays.map((holiday, index) => (
                <div
                  key={holiday.title}
                  className="relative overflow-hidden rounded-[20px] border-2 border-black bg-white/46 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/65"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#c87d16]" />

                  <div className="flex items-start justify-between gap-4 pl-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#10223d]">
                        {holiday.title}
                      </p>

                      <p className="mt-1 text-[13px] text-[#64748b]">
                        {holiday.date}
                      </p>

                      <span className="mt-3 inline-flex rounded-full border-2 border-black bg-emerald-100 px-3 py-1 text-[12px] font-medium text-[#15936b]">
                        {holiday.type}
                      </span>
                    </div>

                    <div className="rounded-[16px] border-2 border-black bg-amber-100 px-3 py-2 text-center text-[#7c4a03]">
                      <p className="text-[18px] font-bold">{index + 1}</p>

                      <p className="text-[10px] uppercase tracking-wide">
                        Event
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[30px] border border-[#0f172a]/10 bg-[#e7e4f7] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)]"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-[21px] font-semibold tracking-tight text-[#10223d]">
                  Upcoming Events
                </h3>

                <p className="mt-1 text-[14px] text-[#64748b]">
                  Meetings, activities and company sessions
                </p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-[20px] border border-[#0f172a]/8 bg-violet-100 text-[#6356d8]">
                <CalendarDays className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={event.title}
                  className="relative overflow-hidden rounded-[20px] border-2 border-black bg-white/48 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/68"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-[#6356d8]" />

                  <div className="flex items-center justify-between gap-4 pl-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#10223d]">
                        {event.title}
                      </p>

                      <p className="mt-1 text-[13px] text-[#64748b]">
                        {event.date}
                      </p>
                    </div>

                    <div className="rounded-[16px] border-2 border-black bg-violet-100 px-3 py-2 text-center text-[#3730a3]">
                      <p className="text-[18px] font-bold">{index + 1}</p>

                      <p className="text-[10px] uppercase tracking-wide">
                        Event
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Row 4 - System Configuration */}
      <motion.div variants={itemVariants}>
        <SystemConfigCard />
      </motion.div>

      {/* Employee Summary Cards */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <motion.div
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          className="relative rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#475569]">
                Total Employees
              </p>
              <p className="mt-4 text-[42px] font-black text-[#10223d]">
                {totalEmployees}
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[#0f172a] text-white shadow-lg">
              <Users className="h-7 w-7" />
            </div>
          </div>

          <button
            onClick={() => setActivePage("view-all-employees")}
            className="mt-7 inline-flex items-center justify-center rounded-[18px] bg-[#0f172a] px-5 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#374151]"
            type="button"
          >
            View All Employees
          </button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileTap={{ scale: 0.98 }}
          className="relative rounded-[30px] border border-black/10 bg-[#fff7ed] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.12)] cursor-pointer"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#475569]">
                Today's Birthdays
              </p>
              <p className="mt-4 text-[42px] font-black text-[#10223d]">
                {todaysBirthdays.length}
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[#fef3c7] text-[#c87d16] shadow-lg">
              <Cake className="h-7 w-7" />
            </div>
          </div>

          {todaysBirthdays.length > 0 ? (
            <div className="mt-7 space-y-3">
              {todaysBirthdays.map((employee) => (
                <motion.div
                  key={employee.id}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-[20px] border border-black/20 bg-white p-4 text-sm font-semibold text-[#10223d] transition-all duration-200"
                >
                  {employee.name} • <span className="text-emerald-500">{employee.role}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="mt-7 text-sm text-[#64748b]">No birthdays today</p>
          )}
        </motion.div>
      </section>


    </motion.div>
  );
};

export default HomePage;
