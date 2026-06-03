
import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  Users,
  TrendingUp,
  Building2,
  Search,
} from "lucide-react";

interface DepartmentAttendance {
  department: string;
  total: number;
  present: number;
  absent: number;
  percentage: number;
}

const AttendanceOverview: React.FC = () => {
  const [searchDept, setSearchDept] = useState("");

  const todayPunchIn = 245;
  const totalEmployees = 320;
  const lateCheckIns = 18;
  const employeesAbsent = 35;
  const attendancePercentage = 89.06;

  const departmentAttendance: DepartmentAttendance[] = [
    {
      department: "Engineering",
      total: 120,
      present: 110,
      absent: 8,
      percentage: 91.67,
    },
    {
      department: "HR",
      total: 45,
      present: 42,
      absent: 2,
      percentage: 93.33,
    },
    {
      department: "Sales",
      total: 85,
      present: 74,
      absent: 10,
      percentage: 87.06,
    },
    {
      department: "Marketing",
      total: 35,
      present: 30,
      absent: 4,
      percentage: 85.71,
    },
    {
      department: "Finance",
      total: 25,
      present: 23,
      absent: 2,
      percentage: 92.0,
    },
    {
      department: "Operations",
      total: 10,
      present: 8,
      absent: 2,
      percentage: 80.0,
    },
  ];

  const filteredDepartments = departmentAttendance.filter((dept) =>
    dept.department.toLowerCase().includes(searchDept.toLowerCase())
  );

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    cardColor,
    iconColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit?: string;
    cardColor: string;
    iconColor: string;
  }) => (
    <div
      style={{ backgroundColor: cardColor }}
      className="rounded-[28px] border border-black/5 p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-600">
          {label}
        </h3>

        <div
          style={{ backgroundColor: iconColor }}
          className="rounded-2xl p-3"
        >
          <Icon className="h-5 w-5 text-slate-900" />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <p className="text-4xl font-black text-slate-900">
          {value}
        </p>

        {unit && (
          <span className="mb-1 text-sm text-slate-600">
            {unit}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <h1 className="text-[36px] font-black text-white">
          Attendance Overview
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor daily attendance metrics and
          department-wise summary
        </p>
      </div>

      {/* METRICS */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Today's Punch-In Count"
          value={todayPunchIn}
          unit={`/ ${totalEmployees}`}
          cardColor="#E8E3F8"
          iconColor="#C4B5FD"
        />

        <StatCard
          icon={AlertCircle}
          label="Late Check-Ins"
          value={lateCheckIns}
          cardColor="#F5EDCF"
          iconColor="#FCD34D"
        />

        <StatCard
          icon={Users}
          label="Employees Absent Today"
          value={employeesAbsent}
          cardColor="#F3E3ED"
          iconColor="#F9A8D4"
        />

        <StatCard
          icon={TrendingUp}
          label="Attendance Percentage"
          value={attendancePercentage}
          unit="%"
          cardColor="#D8EFE0"
          iconColor="#86EFAC"
        />
      </div>

      {/* TABLE CONTAINER */}

      <div className="rounded-[30px] bg-[#FCFCFD] p-8 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Department-wise Attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Attendance summary by department
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search department..."
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                  Department
                </th>

                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-500">
                  Total
                </th>

                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-500">
                  Present
                </th>

                <th className="px-4 py-3 text-center text-xs font-bold uppercase text-slate-500">
                  Absent
                </th>

                <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">
                  Percentage
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((dept, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-100/50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F0FF] text-[#3B82F6]">
                        <Building2 className="h-4 w-4" />
                      </div>

                      <span className="font-semibold text-slate-900">
                        {dept.department}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-slate-700">
                    {dept.total}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="rounded-xl bg-[#DCFCE7] px-3 py-1 text-sm font-semibold text-[#15803D]">
                      {dept.present}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="rounded-xl bg-[#FCE7F3] px-3 py-1 text-sm font-semibold text-[#BE185D]">
                      {dept.absent}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-[#4F8EF7]"
                          style={{
                            width: `${dept.percentage}%`,
                          }}
                        />
                      </div>

                      <span className="w-12 text-right font-bold text-slate-900">
                        {dept.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500">
                Total Departments
              </p>

              <p className="mt-2 text-xl font-black text-slate-900">
                {departmentAttendance.length}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Employees
              </p>

              <p className="mt-2 text-xl font-black text-slate-900">
                {departmentAttendance.reduce(
                  (sum, d) => sum + d.total,
                  0
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Present
              </p>

              <p className="mt-2 text-xl font-black text-[#15803D]">
                {departmentAttendance.reduce(
                  (sum, d) => sum + d.present,
                  0
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Avg Percentage
              </p>

              <p className="mt-2 text-xl font-black text-[#2563EB]">
                {(
                  departmentAttendance.reduce(
                    (sum, d) => sum + d.percentage,
                    0
                  ) / departmentAttendance.length
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceOverview;

