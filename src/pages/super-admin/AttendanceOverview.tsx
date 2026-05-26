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

  // Mock data
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
    bgColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit?: string;
    bgColor: string;
  }) => (
    <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">{label}</h3>
        <div className={`rounded-lg p-2.5 ${bgColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {unit && <span className="text-sm text-white/50">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance Overview</h1>
        <p className="mt-2 text-white/60">
          Monitor daily attendance metrics and department-wise summary
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Today's Punch-In Count"
          value={todayPunchIn}
          unit={`/ ${totalEmployees}`}
          bgColor="bg-blue-500/20 text-blue-300"
        />
        <StatCard
          icon={AlertCircle}
          label="Late Check-Ins"
          value={lateCheckIns}
          bgColor="bg-orange-500/20 text-orange-300"
        />
        <StatCard
          icon={Users}
          label="Employees Absent Today"
          value={employeesAbsent}
          bgColor="bg-red-500/20 text-red-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Attendance Percentage"
          value={attendancePercentage}
          unit="%"
          bgColor="bg-green-500/20 text-green-300"
        />
      </div>

      {/* Department Attendance Summary */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">
              Department-wise Attendance
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Attendance summary by department
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search department..."
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/40 transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Department Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                  Total
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                  Present
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                  Absent
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.length > 0 ? (
                filteredDepartments.map((dept, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-white/5 transition hover:bg-white/5"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-white">
                          {dept.department}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-white/80">
                      {dept.total}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="rounded-lg bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-300">
                        {dept.present}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="rounded-lg bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-300">
                        {dept.absent}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                            style={{ width: `${dept.percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-semibold text-white">
                          {dept.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-white/60">
                    No departments found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <p className="text-xs text-white/60">Total Departments</p>
              <p className="mt-1 text-lg font-bold text-white">
                {departmentAttendance.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Employees</p>
              <p className="mt-1 text-lg font-bold text-white">
                {departmentAttendance.reduce((sum, d) => sum + d.total, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60">Total Present</p>
              <p className="mt-1 text-lg font-bold text-green-300">
                {departmentAttendance.reduce((sum, d) => sum + d.present, 0)}
              </p>
            </div>
            <div>

              <p className="text-xs text-white/60">Avg Percentage</p>
              <p className="mt-1 text-lg font-bold text-blue-300">
                {(
                  departmentAttendance.reduce((sum, d) => sum + d.percentage, 0) /
                  departmentAttendance.length
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
