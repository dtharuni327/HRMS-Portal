import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../../../components/super-admin/StatCard";
import QuickActionsSection from "../../../components/super-admin/QuickActionsSection";
import adminImage from "../../../images/image.png";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SuperAdminDashboard = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  /* =========================
     DYNAMIC DASHBOARD DATA
  ========================= */

  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [holidayCount, setHolidayCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] =
  useState(0);

const [projectCount, setProjectCount] = useState(0);

const [clientCount, setClientCount] = useState(0);

 useEffect(() => {
  const employees = JSON.parse(
    localStorage.getItem("employees") || "[]"
  );

  const departments = JSON.parse(
    localStorage.getItem("departments") || "[]"
  );

  const holidays = JSON.parse(
    localStorage.getItem("holidays") || "[]"
  );

  const projects = JSON.parse(
    localStorage.getItem("projects") || "[]"
  );

  const clients = JSON.parse(
    localStorage.getItem("clients") || "[]"
  );

  setEmployeeCount(employees.length);

  const activeEmployees = employees.filter(
    (employee: any) =>
      employee.status === "Active"
  );

  setActiveEmployeeCount(activeEmployees.length);

  const activeDepartments = departments.filter(
    (dept: any) => dept.status === "Active"
  );

  setDepartmentCount(activeDepartments.length);

  setHolidayCount(holidays.length);

  setProjectCount(projects.length);

  setClientCount(clients.length);
}, []);

  const adminDetails = {
    name: "D.Tharuni",
    role: "Super Administrator",
    email: "d.tharuni@company.com",
    phone: "+91 98765 43210",
    experience: "10+ Years",
    department: "Administration",
    avatar: "D",
    employeeId: "ADMIN-001",
    office: "Head Office",
    joiningDate: "01 Jan 2015",
    manager: "System",
    shift: "Full-time",
    location: "India",
    accessLevel: "Full System Access",
    status: "Active",
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-10 text-white"
    >
      {/* SUPER ADMIN WELCOME CARD */}

      <motion.div
        variants={itemVariants}
        className="relative mt-14 min-h-[195px] overflow-visible rounded-[34px] border border-white/10 bg-[#1e3350] px-7 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)]"
      >
        <div className="absolute right-[-80px] top-[-80px] h-[260px] w-[260px] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex h-full items-center justify-between">
          <div className="max-w-[55%]">
            <div className="flex items-start gap-4">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-[#2563eb] text-lg font-black text-white shadow-lg">
                {adminDetails.avatar}
              </div>

              <div>
                <h2 className="text-[22px] font-black leading-tight text-white">
                  Welcome back, {adminDetails.name}!
                </h2>

                <p className="mt-1 text-[15px] font-black text-emerald-400">
                  {adminDetails.role}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-16 gap-y-4">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
                  Email Address
                </p>

                <p className="mt-1 text-[13px] font-bold text-white">
                  {adminDetails.email}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
                  Contact Number
                </p>

                <p className="mt-1 text-[13px] font-bold text-white">
                  {adminDetails.phone}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
                  Experience
                </p>

                <p className="mt-1 text-[14px] font-black text-white">
                  {adminDetails.experience}
                </p>
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[2px] text-slate-500">
                  Department
                </p>

                <p className="mt-1 text-[14px] font-black text-white">
                  {adminDetails.department}
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

          {/* RIGHT IMAGE */}

          <div className="pointer-events-none absolute -top-[82px] right-[55px] hidden lg:block">
            <img
              src={adminImage}
              alt="Admin"
              className="h-[330px] w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>

      {/* PROFILE MODAL */}

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
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#2563eb] text-3xl font-black text-white shadow-lg">
                {adminDetails.avatar}
              </div>

              <div>
                <h2 className="text-3xl font-black text-white">
                  {adminDetails.name}
                </h2>

                <p className="mt-1 text-base font-bold text-cyan-400">
                  {adminDetails.role}
                </p>

                <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-500">
                  {adminDetails.employeeId}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Email", value: adminDetails.email },
                { label: "Phone", value: adminDetails.phone },
                { label: "Department", value: adminDetails.department },
                { label: "Experience", value: adminDetails.experience },
                { label: "Employee ID", value: adminDetails.employeeId },
                { label: "Office", value: adminDetails.office },
                { label: "Joining Date", value: adminDetails.joiningDate },
                { label: "Manager", value: adminDetails.manager },
                { label: "Shift", value: adminDetails.shift },
                { label: "Location", value: adminDetails.location },
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
                  {adminDetails.accessLevel}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Status
                </p>

                <div className="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-green-400">
                  {adminDetails.status}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT */}

      <div className="space-y-10">
        {/* DYNAMIC STATS */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
  <StatCard
    title="Employees"
    value={employeeCount}
    description="All user accounts"
  />

  <StatCard
    title="Active Employees"
    value={activeEmployeeCount}
    description="Currently active employees"
  />

  <StatCard
    title="Departments"
    value={departmentCount}
    description="Active departments"
  />

  <StatCard
    title="Projects"
    value={projectCount}
    description="Total projects"
  />

  <StatCard
    title="Clients"
    value={clientCount}
    description="Registered clients"
  />

  <StatCard
    title="Holidays"
    value={holidayCount}
    description="Configured holidays"
  />
</div>

        {/* PREMIUM QUICK ACTIONS */}

        <motion.div variants={itemVariants} className="mt-10">
          <QuickActionsSection />
        </motion.div>

      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;