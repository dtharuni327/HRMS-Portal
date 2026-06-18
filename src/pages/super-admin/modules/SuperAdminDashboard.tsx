
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
  const [profileImage, setProfileImage] = useState<string>(
    () => localStorage.getItem('superAdminProfileImage') || '',
  );

  /* 
     DYNAMIC DASHBOARD DATA
   */

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      /* ignore */
    }
  }, []);

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
    panNumber: "ABCDE1234F",
    aadhaarNumber: "1234 5678 9012",
    address: "Mumbai, Maharashtra",
    gender: "Female",
    designation: "Chief System Administrator",
    reportingTo: "Board",
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/10 text-slate-900 transition hover:bg-slate-900/20"
              type="button"
            >
              <X size={18} />
            </button>

            <div className="mb-8 flex items-start gap-6">
              <div className="relative shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Admin Profile"
                    className="h-32 w-32 rounded-2xl border-4 border-slate-200 object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-slate-200 bg-slate-200 text-4xl font-black text-slate-400 shadow-md">
                    {adminDetails.avatar}
                  </div>
                )}

                <input
                  id="adminProfileUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setProfileImage(url);
                      localStorage.setItem('superAdminProfileImage', url);
                    }
                  }}
                />
                <label
                  htmlFor="adminProfileUpload"
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg transition hover:bg-cyan-600"
                >
                  <span className="text-xl font-black">+</span>
                </label>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900">
                  {adminDetails.name}
                </h2>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Employee Profile Details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 gap-y-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Employee ID
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.employeeId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Phone
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.phone}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    PAN Number
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.panNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Department
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.department}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Designation
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.designation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.location}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 break-all text-base font-bold text-slate-900">
                    {adminDetails.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Gender
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.gender}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Aadhaar Number
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.aadhaarNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Address
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.address}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Reporting Manager
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.reportingTo}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Joining Date
                  </p>
                  <p className="mt-2 text-base font-bold text-slate-900">
                    {adminDetails.joiningDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-start">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT */}

      <div className="space-y-10">
        {/* DYNAMIC STATS */}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
  <div className="rounded-3xl bg-[#DCD6F7] p-6 shadow-lg">
    <StatCard
      title="Employees"
      value={employeeCount}
      description="All user accounts"
    />
  </div>

  <div className="rounded-3xl bg-[#D5EBDD] p-6 shadow-lg">
    <StatCard
      title="Active Employees"
      value={activeEmployeeCount}
      description="Currently active employees"
    />
  </div>

  <div className="rounded-3xl bg-[#DCE7F7] p-6 shadow-lg">
    <StatCard
      title="Departments"
      value={departmentCount}
      description="Active departments"
    />
  </div>

  <div className="rounded-3xl bg-[#F2EBCB] p-6 shadow-lg">
    <StatCard
      title="Projects"
      value={projectCount}
      description="Total projects"
    />
  </div>

  <div className="rounded-3xl bg-[#E8D7E3] p-6 shadow-lg">
    <StatCard
      title="Clients"
      value={clientCount}
      description="Registered clients"
    />
  </div>

  <div className="rounded-3xl bg-[#E7DDD2] p-6 shadow-lg">
    <StatCard
      title="Holidays"
      value={holidayCount}
      description="Configured holidays"
    />
  </div>
</div>

{/* PREMIUM QUICK ACTIONS */}

<motion.div variants={itemVariants} className="mt-12">
  <QuickActionsSection />
</motion.div>

      </div>
    </motion.div>
  );
};

export default SuperAdminDashboard;