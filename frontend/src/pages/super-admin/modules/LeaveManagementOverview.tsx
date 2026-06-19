import React, { useState } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  Users,
  MessageSquare,
  Search,
  Plane,
} from "lucide-react";
import { cardPalette, getPaletteFor } from "../../../utils/colorPalette";

interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: string;
  status: "pending" | "approved" | "rejected";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  appliedDate: string;
}

interface EmployeeOnLeave {
  id: number;
  name: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
}

interface DepartmentLeave {
  department: string;
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  approvalRate: number;
}

const LeaveManagementOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Mock data
  const pendingRequests = 12;
  const approvedLeaves = 145;
  const rejectedLeaves = 8;
  const employeesOnLeave = 24;

  const leaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employeeName: "John Doe",
      leaveType: "Annual Leave",
      status: "pending",
      fromDate: "2026-06-01",
      toDate: "2026-06-05",
      days: 5,
      reason: "Personal vacation",
      appliedDate: "2026-05-20",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      leaveType: "Sick Leave",
      status: "approved",
      fromDate: "2026-05-26",
      toDate: "2026-05-27",
      days: 2,
      reason: "Medical appointment",
      appliedDate: "2026-05-25",
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      leaveType: "Casual Leave",
      status: "pending",
      fromDate: "2026-05-28",
      toDate: "2026-05-28",
      days: 1,
      reason: "Family work",
      appliedDate: "2026-05-26",
    },
    {
      id: 4,
      employeeName: "Sarah Williams",
      leaveType: "Annual Leave",
      status: "approved",
      fromDate: "2026-06-10",
      toDate: "2026-06-15",
      days: 6,
      reason: "Summer vacation",
      appliedDate: "2026-05-15",
    },
    {
      id: 5,
      employeeName: "Tom Brown",
      leaveType: "Medical Leave",
      status: "rejected",
      fromDate: "2026-05-30",
      toDate: "2026-05-31",
      days: 2,
      reason: "Surgery recovery",
      appliedDate: "2026-05-22",
    },
  ];

  const employeesCurrentlyOnLeave: EmployeeOnLeave[] = [
    {
      id: 1,
      name: "Alice Cooper",
      department: "Engineering",
      leaveType: "Annual Leave",
      startDate: "2026-05-24",
      endDate: "2026-05-29",
      remainingDays: 4,
    },
    {
      id: 2,
      name: "Bob Davis",
      department: "Sales",
      leaveType: "Casual Leave",
      startDate: "2026-05-26",
      endDate: "2026-05-26",
      remainingDays: 0,
    },
    {
      id: 3,
      name: "Carol White",
      department: "HR",
      leaveType: "Sick Leave",
      startDate: "2026-05-25",
      endDate: "2026-05-28",
      remainingDays: 2,
    },
    {
      id: 4,
      name: "David Lee",
      department: "Marketing",
      leaveType: "Annual Leave",
      startDate: "2026-05-20",
      endDate: "2026-05-30",
      remainingDays: 3,
    },
  ];

  const departmentLeaveTrends: DepartmentLeave[] = [
    {
      department: "Engineering",
      total: 24,
      approved: 22,
      pending: 2,
      rejected: 0,
      approvalRate: 91.67,
    },
    {
      department: "Sales",
      total: 18,
      approved: 16,
      pending: 1,
      rejected: 1,
      approvalRate: 88.89,
    },
    {
      department: "HR",
      total: 12,
      approved: 11,
      pending: 1,
      rejected: 0,
      approvalRate: 91.67,
    },
    {
      department: "Marketing",
      total: 15,
      approved: 14,
      pending: 0,
      rejected: 1,
      approvalRate: 93.33,
    },
    {
      department: "Finance",
      total: 10,
      approved: 9,
      pending: 1,
      rejected: 0,
      approvalRate: 90.0,
    },
    {
      department: "Operations",
      total: 8,
      approved: 7,
      pending: 0,
      rejected: 1,
      approvalRate: 87.5,
    },
  ];

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({
    icon: Icon,
    label,
    value,
    paletteIndex = 0,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    paletteIndex?: number;
  }) => {
    const pal = cardPalette[paletteIndex % cardPalette.length];
    return (
      <div
        className="rounded-[20px] border border-white/10 p-6"
        style={{ backgroundColor: pal.bg }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold" style={{ color: pal.text }}>
            {label}
          </h3>
          <div
            className="rounded-lg p-2.5"
            style={{ backgroundColor: pal.text, color: pal.bg }}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-3xl font-bold" style={{ color: pal.text }}>
          {value}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Leave Management Overview</h1>
        <p className="mt-2 text-white/60">
          Monitor leave requests and track employee absences
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Pending Leave Requests"
          value={pendingRequests}
          paletteIndex={0}
        />
        <StatCard
          icon={CheckCircle}
          label="Approved Leaves"
          value={approvedLeaves}
          paletteIndex={1}
        />
        <StatCard
          icon={XCircle}
          label="Rejected Leaves"
          value={rejectedLeaves}
          paletteIndex={2}
        />
        <StatCard
          icon={Users}
          label="Employees On Leave"
          value={employeesOnLeave}
          paletteIndex={3}
        />
      </div>

      {/* Pending Leave Requests */}
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Pending Leave Requests</h2>
            <p className="mt-1 text-sm text-white/60">
              Approve or reject pending leave requests
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by employee or leave type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/40 transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase transition ${
                    statusFilter === status
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-3">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">{req.employeeName}</h3>
                      {(() => {
                        const pal = getPaletteFor(req.leaveType);
                        return (
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                            style={{ backgroundColor: pal.bg, color: pal.text }}
                          >
                            {req.leaveType}
                          </span>
                        );
                      })()}
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          req.status === "pending"
                            ? ""
                            : ""
                        }`}
                      style={
                        req.status === "pending"
                          ? { backgroundColor: "#FFF4D6", color: "#7A5C00" }
                          : req.status === "approved"
                          ? { backgroundColor: "#D1FAE5", color: "#064E3B" }
                          : { backgroundColor: "#FEE2E2", color: "#7F1D1D" }
                      }
                      >
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-white/60">
                      {req.fromDate} to {req.toDate} ({req.days} days)
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/50">
                      <MessageSquare className="h-3 w-3" />
                      {req.reason}
                    </div>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <button className="rounded-lg bg-green-500/20 px-4 py-2 text-xs font-semibold text-green-300 transition hover:bg-green-500/30">
                        Approve
                      </button>
                      <button className="rounded-lg bg-red-500/20 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/30">
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-white/60">No leave requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Employees Currently on Leave */}
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Employees Currently On Leave</h2>
          <p className="mt-1 text-sm text-white/60">
            Employees absent from office today
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Period
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                  Remaining Days
                </th>
              </tr>
            </thead>
            <tbody>
              {employeesCurrentlyOnLeave.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-4 py-4 font-medium text-white">{emp.name}</td>
                  <td className="px-4 py-4 text-white/80">{emp.department}</td>
                  <td className="px-4 py-4">
                    {(() => {
                      const pal = getPaletteFor(emp.leaveType);
                      return (
                        <span
                          className="rounded-lg px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: pal.bg, color: pal.text }}
                        >
                          {emp.leaveType}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-4 py-4 text-sm text-white/70">
                    {emp.startDate} to {emp.endDate}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="rounded-lg px-3 py-1 text-xs font-bold"
                      style={
                        emp.remainingDays === 0
                          ? { backgroundColor: "#FEE2E2", color: "#7F1D1D" }
                          : { backgroundColor: "#E0F2FE", color: "#075985" }
                      }
                    >
                      {emp.remainingDays}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Trends by Department */}
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Leave Trends by Department</h2>
          <p className="mt-1 text-sm text-white/60">
            Department-wise leave statistics and approval rates
          </p>
        </div>

        <div className="space-y-4">
          {departmentLeaveTrends.map((dept, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Plane className="h-5 w-5 text-sky-300" />
                  <h3 className="font-semibold text-white">{dept.department}</h3>
                </div>
                <span className="text-sm font-bold text-white">
                  {dept.approvalRate.toFixed(1)}% Approval Rate
                </span>
              </div>

              <div className="mb-3 grid grid-cols-4 gap-2 text-xs">
                {(() => {
                  const palTotal = getPaletteFor(dept.department + "total");
                  const palApproved = getPaletteFor(dept.department + "approved");
                  const palPending = getPaletteFor(dept.department + "pending");
                  const palRejected = getPaletteFor(dept.department + "rejected");
                  return (
                    <>
                      <div className="rounded-lg p-2 text-center" style={{ backgroundColor: palTotal.bg }}>
                        <p className="mb-1 text-sm font-semibold" style={{ color: palTotal.text, opacity: 0.95 }}>Total</p>
                        <p className="text-lg font-bold" style={{ color: palTotal.text }}>{dept.total}</p>
                      </div>
                      <div className="rounded-lg p-2 text-center" style={{ backgroundColor: palApproved.bg }}>
                        <p className="mb-1 text-sm font-semibold" style={{ color: palApproved.text, opacity: 0.95 }}>Approved</p>
                        <p className="text-lg font-bold" style={{ color: palApproved.text }}>{dept.approved}</p>
                      </div>
                      <div className="rounded-lg p-2 text-center" style={{ backgroundColor: palPending.bg }}>
                        <p className="mb-1 text-sm font-semibold" style={{ color: palPending.text, opacity: 0.95 }}>Pending</p>
                        <p className="text-lg font-bold" style={{ color: palPending.text }}>{dept.pending}</p>
                      </div>
                      <div className="rounded-lg p-2 text-center" style={{ backgroundColor: palRejected.bg }}>
                        <p className="mb-1 text-sm font-semibold" style={{ color: palRejected.text, opacity: 0.95 }}>Rejected</p>
                        <p className="text-lg font-bold" style={{ color: palRejected.text }}>{dept.rejected}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full"
                  style={{
                    width: `${dept.approvalRate}%`,
                    backgroundColor: "#10B981",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementOverview;
