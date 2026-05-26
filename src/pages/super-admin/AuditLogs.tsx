import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  LogIn,
  Users,
  IndianRupee,
  Lock,
  ShieldAlert,
  Calendar,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type ActivityType = "all" | "login" | "employee" | "payroll" | "role" | "admin";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  activityType: "login" | "employee" | "payroll" | "role" | "admin";
  action: string;
  module: string;
  details: string;
  status: "success" | "failed";
  ipAddress: string;
}

const AuditLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityType>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");

  // Mock data - all activity types
  const auditLogs: AuditLog[] = [
    // Login Activities
    {
      id: "1",
      timestamp: "2026-05-26 10:30:15",
      user: "john.doe@company.com",
      activityType: "login",
      action: "User Login",
      module: "Authentication",
      details: "Successful login from web portal",
      status: "success",
      ipAddress: "192.168.1.100",
    },
    {
      id: "2",
      timestamp: "2026-05-26 09:15:42",
      user: "admin@company.com",
      activityType: "login",
      action: "User Login",
      module: "Authentication",
      details: "Successful login from web portal",
      status: "success",
      ipAddress: "192.168.1.50",
    },
    {
      id: "3",
      timestamp: "2026-05-25 18:45:20",
      user: "jane.smith@company.com",
      activityType: "login",
      action: "Failed Login Attempt",
      module: "Authentication",
      details: "Invalid credentials provided",
      status: "failed",
      ipAddress: "192.168.1.150",
    },
    {
      id: "4",
      timestamp: "2026-05-25 14:22:10",
      user: "mike@company.com",
      activityType: "login",
      action: "User Logout",
      module: "Authentication",
      details: "User logged out successfully",
      status: "success",
      ipAddress: "192.168.1.75",
    },
    // Employee Data Changes
    {
      id: "5",
      timestamp: "2026-05-26 11:00:30",
      user: "hr@company.com",
      activityType: "employee",
      action: "Employee Created",
      module: "Employee Management",
      details: "New employee Alice Johnson (EMP001) added to system",
      status: "success",
      ipAddress: "192.168.1.40",
    },
    {
      id: "6",
      timestamp: "2026-05-26 10:45:15",
      user: "hr@company.com",
      activityType: "employee",
      action: "Employee Updated",
      module: "Employee Management",
      details: "Employee Bob Davis - updated department to Sales",
      status: "success",
      ipAddress: "192.168.1.40",
    },
    {
      id: "7",
      timestamp: "2026-05-25 16:30:45",
      user: "hr_manager@company.com",
      activityType: "employee",
      action: "Employee Deleted",
      module: "Employee Management",
      details: "Employee Carol White (EMP015) marked as inactive",
      status: "success",
      ipAddress: "192.168.1.60",
    },
    {
      id: "8",
      timestamp: "2026-05-25 15:20:00",
      user: "hr@company.com",
      activityType: "employee",
      action: "Bulk Employee Import",
      module: "Employee Management",
      details: "Imported 50 employees from HR data dump",
      status: "success",
      ipAddress: "192.168.1.40",
    },
    // Payroll Changes
    {
      id: "9",
      timestamp: "2026-05-26 12:00:00",
      user: "payroll@company.com",
      activityType: "payroll",
      action: "Payroll Processed",
      module: "Payroll Management",
      details: "May 2026 payroll processed for 280 employees, Total: ₹28.5L",
      status: "success",
      ipAddress: "192.168.1.30",
    },
    {
      id: "10",
      timestamp: "2026-05-25 14:15:30",
      user: "payroll@company.com",
      activityType: "payroll",
      action: "Salary Adjustment",
      module: "Payroll Management",
      details: "Annual increment applied to 45 employees",
      status: "success",
      ipAddress: "192.168.1.30",
    },
    {
      id: "11",
      timestamp: "2026-05-24 10:30:45",
      user: "payroll_admin@company.com",
      activityType: "payroll",
      action: "Deduction Updated",
      module: "Payroll Management",
      details: "Professional tax updated from 2.5% to 3%",
      status: "success",
      ipAddress: "192.168.1.55",
    },
    {
      id: "12",
      timestamp: "2026-05-24 09:00:00",
      user: "payroll@company.com",
      activityType: "payroll",
      action: "Allowance Added",
      module: "Payroll Management",
      details: "New allowance: Remote Work Bonus added for eligible employees",
      status: "success",
      ipAddress: "192.168.1.30",
    },
    // Role/Permission Changes
    {
      id: "13",
      timestamp: "2026-05-26 08:30:00",
      user: "admin@company.com",
      activityType: "role",
      action: "Role Created",
      module: "Role & Permissions",
      details: "New role 'Department Manager' created with 12 permissions",
      status: "success",
      ipAddress: "192.168.1.50",
    },
    {
      id: "14",
      timestamp: "2026-05-25 17:45:20",
      user: "admin@company.com",
      activityType: "role",
      action: "Permission Updated",
      module: "Role & Permissions",
      details: "Role 'HR Admin' - added permission to manage payroll",
      status: "success",
      ipAddress: "192.168.1.50",
    },
    {
      id: "15",
      timestamp: "2026-05-25 13:20:30",
      user: "super_admin@company.com",
      activityType: "role",
      action: "User Role Assigned",
      module: "Role & Permissions",
      details: "User priya@company.com assigned role 'Department Manager'",
      status: "success",
      ipAddress: "192.168.1.20",
    },
    {
      id: "16",
      timestamp: "2026-05-24 11:00:15",
      user: "admin@company.com",
      activityType: "role",
      action: "Permission Revoked",
      module: "Role & Permissions",
      details: "Role 'Intern' - removed permission to delete employee records",
      status: "success",
      ipAddress: "192.168.1.50",
    },
    // Admin Activity Tracking
    {
      id: "17",
      timestamp: "2026-05-26 13:45:00",
      user: "super_admin@company.com",
      activityType: "admin",
      action: "System Configuration Updated",
      module: "System Configuration",
      details: "Updated office timings: 9 AM - 6 PM",
      status: "success",
      ipAddress: "192.168.1.20",
    },
    {
      id: "18",
      timestamp: "2026-05-26 11:30:45",
      user: "admin@company.com",
      activityType: "admin",
      action: "Holiday Added",
      module: "Holiday Configuration",
      details: "Added holiday: Independence Day - 2026-08-15",
      status: "success",
      ipAddress: "192.168.1.50",
    },
    {
      id: "19",
      timestamp: "2026-05-25 16:00:30",
      user: "super_admin@company.com",
      activityType: "admin",
      action: "Department Created",
      module: "Department Management",
      details: "New department 'Quality Assurance' created",
      status: "success",
      ipAddress: "192.168.1.20",
    },
    {
      id: "20",
      timestamp: "2026-05-24 14:30:15",
      user: "admin@company.com",
      activityType: "admin",
      action: "Leave Type Created",
      module: "Leave Management",
      details: "New leave type: Sabbatical Leave (30 days annually) created",
      status: "success",
      ipAddress: "192.168.1.50",
    },
  ];

  // Dynamic filtering
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesActivity = activityFilter === "all" || log.activityType === activityFilter;
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      const matchesDate = !dateFilter || log.timestamp.includes(dateFilter);

      return matchesSearch && matchesActivity && matchesStatus && matchesDate;
    });
  }, [searchQuery, activityFilter, statusFilter, dateFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalLogs: auditLogs.length,
      loginActivity: auditLogs.filter((l) => l.activityType === "login").length,
      employeeChanges: auditLogs.filter((l) => l.activityType === "employee").length,
      payrollChanges: auditLogs.filter((l) => l.activityType === "payroll").length,
      roleChanges: auditLogs.filter((l) => l.activityType === "role").length,
      adminActivity: auditLogs.filter((l) => l.activityType === "admin").length,
      successCount: auditLogs.filter((l) => l.status === "success").length,
      failedCount: auditLogs.filter((l) => l.status === "failed").length,
    };
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return LogIn;
      case "employee":
        return Users;
      case "payroll":
        return IndianRupee;
      case "role":
        return Lock;
      case "admin":
        return ShieldAlert;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "login":
        return "bg-blue-500/20 text-blue-300";
      case "employee":
        return "bg-purple-500/20 text-purple-300";
      case "payroll":
        return "bg-green-500/20 text-green-300";
      case "role":
        return "bg-orange-500/20 text-orange-300";
      case "admin":
        return "bg-red-500/20 text-red-300";
      default:
        return "bg-gray-500/20 text-gray-300";
    }
  };

  const exportCSV = () => {
    const headers = ["Timestamp", "User", "Activity Type", "Action", "Module", "Status", "IP Address"];
    const rows = filteredLogs.map((log) => [
      log.timestamp,
      log.user,
      log.activityType,
      log.action,
      log.module,
      log.status,
      log.ipAddress,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    bgColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: number;
    bgColor: string;
  }) => (
    <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">{label}</h3>
        <div className={`rounded-lg p-2.5 ${bgColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
          <p className="mt-2 text-white/60">
            Track all system actions, user activities, and configuration changes
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-lg bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/30"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Total Activities"
          value={stats.totalLogs}
          bgColor="bg-blue-500/20 text-blue-300"
        />
        <StatCard
          icon={LogIn}
          label="Login Activities"
          value={stats.loginActivity}
          bgColor="bg-blue-500/20 text-blue-300"
        />
        <StatCard
          icon={Users}
          label="Employee Changes"
          value={stats.employeeChanges}
          bgColor="bg-purple-500/20 text-purple-300"
        />
        <StatCard
          icon={IndianRupee}
          label="Payroll Changes"
          value={stats.payrollChanges}
          bgColor="bg-green-500/20 text-green-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Lock}
          label="Role Changes"
          value={stats.roleChanges}
          bgColor="bg-orange-500/20 text-orange-300"
        />
        <StatCard
          icon={ShieldAlert}
          label="Admin Activities"
          value={stats.adminActivity}
          bgColor="bg-red-500/20 text-red-300"
        />
        <StatCard
          icon={CheckCircle2}
          label="Successful"
          value={stats.successCount}
          bgColor="bg-green-500/20 text-green-300"
        />
        <StatCard
          icon={AlertCircle}
          label="Failed"
          value={stats.failedCount}
          bgColor="bg-red-500/20 text-red-300"
        />
      </div>

      {/* Filters and Search */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className="mb-4 flex items-center gap-2 text-white/70">
          <Filter className="h-4 w-4" />
          <h2 className="font-semibold">Filter & Search</h2>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by user, action, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/40 transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {/* Activity Type Filter */}
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as ActivityType)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
            >
              <option value="all">All Activities</option>
              <option value="login">Login Activities</option>
              <option value="employee">Employee Changes</option>
              <option value="payroll">Payroll Changes</option>
              <option value="role">Role Changes</option>
              <option value="admin">Admin Activities</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
            />

            {/* Results Count */}
            <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white">
              {filteredLogs.length} results
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs List */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => {
            const IconComponent = getActivityIcon(log.activityType);
            const colorClass = getActivityColor(log.activityType);

            return (
              <div
                key={log.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className={`rounded-lg p-2.5 ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{log.action}</h3>
                        <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                          {log.module}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            log.status === "success"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-red-500/20 text-red-300"
                          }`}
                        >
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-white/80">{log.details}</p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-white/60">
                        <span>User: {log.user}</span>
                        <span>IP: {log.ipAddress}</span>
                        <span>{log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
            <p className="text-white/60">No audit logs found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;