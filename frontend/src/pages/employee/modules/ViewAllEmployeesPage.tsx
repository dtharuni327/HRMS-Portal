import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Mail,
  MapPin,
  Briefcase,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

type Employee = {
  id: number;
  name: string;
  role: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  employeeId: string;
  location: string;
  status: "Active" | "Inactive";
  birthday: string;
  avatar: string;
};

const employees: Employee[] = [
  {
    id: 1,
    name: "D Tharuni",
    role: "Admin",
    designation: "HR Manager",
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
    designation: "Finance Executive",
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
    designation: "Software Engineer",
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
    designation: "QA Engineer",
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

const departmentColors: Record<
  string,
  { bg: string; border: string; text: string; icon: string; avatar: string }
> = {
  "Human Resources": {
    bg: "bg-[#efe7ff]",
    border: "border-[#d9c8ff]",
    text: "text-[#5b3fc4]",
    icon: "text-[#6d5dd3]",
    avatar: "bg-[#6d5dd3]",
  },
  Finance: {
    bg: "bg-[#dff7ed]",
    border: "border-[#aee8cf]",
    text: "text-[#0f7f5d]",
    icon: "text-[#15936b]",
    avatar: "bg-[#15936b]",
  },
  Engineering: {
    bg: "bg-[#dff1ff]",
    border: "border-[#b8ddff]",
    text: "text-[#0d6db8]",
    icon: "text-[#2563eb]",
    avatar: "bg-[#2563eb]",
  },
};

const cardThemes = [
  "bg-[#eee8ff]", // lavender
  "bg-[#ddf3ea]", // mint
  "bg-[#f7ecd6]", // cream
  "bg-[#e3f1ff]", // ice blue
  "bg-[#f6e5ec]", // soft pink
  "bg-[#f4ead7]", // warm beige
  "bg-[#ebe7fb]", // soft violet
];

const ViewAllEmployeesPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const departments = useMemo(() => {
    return ["All", ...Array.from(new Set(employees.map((emp) => emp.department)))];
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const normalizedSearch = search.toLowerCase();

      const matchesSearch =
        emp.name.toLowerCase().includes(normalizedSearch) ||
        emp.email.toLowerCase().includes(normalizedSearch) ||
        emp.employeeId.toLowerCase().includes(normalizedSearch) ||
        emp.department.toLowerCase().includes(normalizedSearch);

      const matchesDepartment =
        departmentFilter === "All" || emp.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [search, departmentFilter]);

  const getDepartmentColor = (department: string) => {
    return (
      departmentColors[department] || {
        bg: "bg-[#eef2f7]",
        border: "border-[#d7dee8]",
        text: "text-[#475569]",
        icon: "text-[#64748b]",
        avatar: "bg-[#64748b]",
      }
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#0b1830] px-4 py-6 text-[#071832] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1500px] space-y-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden rounded-[34px] border border-white/10 bg-[#132844] p-6 text-white shadow-[0_24px_60px_rgba(0,0,0,0.26)]"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-[12px] font-black uppercase tracking-[0.2em] text-[#9bd7ff]">
                Company Directory
              </p>

              <h2 className="text-[34px] font-black tracking-tight text-white">
                All Employees
              </h2>

              <p className="mt-2 max-w-[760px] text-[15px] leading-6 text-white/72">
                Browse, search, and filter employees across departments.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-[26px] border border-white/10 bg-white/10 px-6 py-5">
              <div className="grid h-13 w-13 place-items-center rounded-2xl bg-white/12 p-3 text-[#9bd7ff]">
                <Users className="h-6 w-6" />
              </div>

              <div>
                <p className="text-[13px] font-semibold text-white/65">
                  Total Employees
                </p>

                <h3 className="mt-1 text-[32px] font-black text-white">
                  {employees.length}
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-[34px] border border-white/70 bg-[#fbfcff] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[27px] font-black tracking-tight text-[#071832]">
                Employee Directory
              </h3>

              <p className="mt-1 text-[14px] text-[#52637a]">
                Search by name, email, ID, or department.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52637a]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employees..."
                  className="h-12 w-full rounded-[18px] border border-[#dce3ec] bg-white py-2 pl-11 pr-4 text-[14px] font-medium text-[#071832] outline-none placeholder:text-[#7b8aa0] transition-colors duration-150 focus:border-[#6d5dd3] focus:ring-2 focus:ring-[#6d5dd3]/10 sm:w-[300px]"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52637a]" />

                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="h-12 w-full appearance-none rounded-[18px] border border-[#dce3ec] bg-white py-2 pl-11 pr-10 text-[14px] font-medium text-[#071832] outline-none transition-colors duration-150 focus:border-[#6d5dd3] focus:ring-2 focus:ring-[#6d5dd3]/10 sm:w-[210px]"
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === "All" ? "All Departments" : dept}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52637a]">
                  ▾
                </div>
              </div>
            </div>
          </div>

          {/* Employee Grid */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEmployees.map((employee, index) => {
              const deptColor = getDepartmentColor(employee.department);
              const cardBg = cardThemes[index % cardThemes.length];

              return (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.03, ease: "easeOut" }}
                  className={`relative rounded-[28px] border border-[#dbe4ef] ${cardBg} p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] transition-shadow duration-150 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]`}
                >
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-14 w-14 items-center justify-center rounded-2xl ${deptColor.avatar} text-sm font-black text-white shadow-[0_10px_22px_rgba(15,23,42,0.14)]`}
                        >
                          {employee.avatar}
                        </div>

                        <div>
                          <h4 className="text-[19px] font-black text-[#071832]">
                            {employee.name}
                          </h4>
                          <p className={`mt-0.5 text-[13px] font-bold ${deptColor.text}`}>
                            {employee.role}
                          </p>
                          <p className="mt-1 text-[12px] text-[#52637a]">
                            {employee.designation}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${
                          employee.status === "Active"
                            ? "border-[#8ee5bd] bg-[#cdf8e3] text-[#00875f]"
                            : "border-slate-200 bg-slate-100 text-slate-700"
                        }`}
                      >
                        {employee.status}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/62 p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                        <Mail className={`h-4 w-4 ${deptColor.icon}`} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                            Email
                          </p>
                          <p className="text-[12px] font-bold text-[#071832]">
                            {employee.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/62 p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                        <Phone className={`h-4 w-4 ${deptColor.icon}`} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                            Phone
                          </p>
                          <p className="text-[12px] font-bold text-[#071832]">
                            {employee.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/62 p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                        <Briefcase className={`h-4 w-4 ${deptColor.icon}`} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                            Department
                          </p>
                          <p className="text-[12px] font-bold text-[#071832]">
                            {employee.department}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-[18px] border border-white/80 bg-white/62 p-3 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                        <MapPin className={`h-4 w-4 ${deptColor.icon}`} />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                            Location
                          </p>
                          <p className="text-[12px] font-bold text-[#071832]">
                            {employee.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 flex items-center justify-between border-t border-white/70 pt-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#64748b]">
                          ID
                        </p>
                        <p className="mt-1 text-[12px] font-black text-[#071832]">
                          {employee.employeeId}
                        </p>
                      </div>

                      <span
                        className={`rounded-[14px] border px-3 py-2 text-[11px] font-black ${deptColor.bg} ${deptColor.border} ${deptColor.text}`}
                      >
                        {employee.department}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="mt-8 rounded-[24px] border border-dashed border-[#dce3ec] bg-[#f8fafc] p-10 text-center">
              <p className="text-[18px] font-black text-[#071832]">
                No employees found
              </p>

              <p className="mt-2 text-[14px] text-[#52637a]">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default ViewAllEmployeesPage;
