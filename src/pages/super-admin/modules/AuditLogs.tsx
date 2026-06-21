import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  LogIn,
  Users,
  IndianRupee,
  Lock,
  ShieldAlert,
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

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  bgColor: string;
}

const cardText = "#071827";

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, bgColor }) => (
  <div className="rounded-[20px] p-6" style={{ backgroundColor: bgColor, color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>{label}</h3>
      <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold" style={{ color: cardText }}>{value}</p>
  </div>
);

const AuditLogs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState<ActivityType>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");

  // Pastel accent colors and card text color
  const accentColors = [
    "#E6E6FA", // lavender
    "#D4F1DC", // mint
    "#FFF5D6", // cream
    "#DCEEFB", // ice blue
    "#FADADD", // soft pink
    "#F5E0C3", // warm beige
    "#E9D5FF", // soft violet
  ];
  const cardText = "#071827";

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

  const getActivityAccentColor = (type: string) => {
    switch (type) {
      case "login":
        return accentColors[0];
      case "employee":
        return accentColors[6];
      case "payroll":
        return accentColors[5];
      case "role":
        return accentColors[2];
      case "admin":
        return accentColors[4];
      default:
        return accentColors[3];
    }
  };

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
          bgColor={accentColors[0]}
        />
        <StatCard
          icon={LogIn}
          label="Login Activities"
          value={stats.loginActivity}
          bgColor={accentColors[1]}
        />
        <StatCard
          icon={Users}
          label="Employee Changes"
          value={stats.employeeChanges}
          bgColor={accentColors[6]}
        />
        <StatCard
          icon={IndianRupee}
          label="Payroll Changes"
          value={stats.payrollChanges}
          bgColor={accentColors[5]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Lock}
          label="Role Changes"
          value={stats.roleChanges}
          bgColor={accentColors[2]}
        />
        <StatCard
          icon={ShieldAlert}
          label="Admin Activities"
          value={stats.adminActivity}
          bgColor={accentColors[4]}
        />
        <StatCard
          icon={CheckCircle2}
          label="Successful"
          value={stats.successCount}
          bgColor={accentColors[3]}
        />
        <StatCard
          icon={AlertCircle}
          label="Failed"
          value={stats.failedCount}
          bgColor={accentColors[2]}
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

            return (
                    <div
                      key={log.id}
                      className="rounded-lg p-4 transition"
                      style={{ backgroundColor: getActivityAccentColor(log.activityType), color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}
                    >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-1 gap-4">
                    <div className={`rounded-lg p-2.5`} style={{ backgroundColor: "#071827" }}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold" style={{ color: cardText }}>{log.action}</h3>
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#E6F4FF", color: "#075985" }}>
                          {log.module}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                          style={
                            log.status === "success"
                              ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                              : { backgroundColor: "#FEE2E2", color: "#991B1B" }
                          }
                        >
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm" style={{ color: "rgba(7,24,39,0.7)" }}>{log.details}</p>

                      <div className="mt-2 flex flex-wrap gap-4 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>
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
          <div className="rounded-lg p-8 text-center" style={{ backgroundColor: accentColors[2], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
            <p style={{ color: "rgba(7,24,39,0.7)" }}>No audit logs found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;