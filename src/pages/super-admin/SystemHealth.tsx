import React, { useState, useMemo } from "react";
import {
  Server,
  Database,
  Users,
  AlertCircle,
  HardDrive,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Activity,
} from "lucide-react";
import PageHeader from "../../components/super-admin/PageHeader";

interface SystemMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  description: string;
}

interface Alert {
  id: string;
  level: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  service: string;
}

const SystemHealth: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // System metrics data
  const metrics: SystemMetric[] = [
    {
      id: "1",
      name: "Backend API",
      value: "Online",
      unit: "",
      status: "healthy",
      description: "API uptime status",
    },
    {
      id: "2",
      name: "Database",
      value: "Connected",
      unit: "",
      status: "healthy",
      description: "Database connection health",
    },
    {
      id: "3",
      name: "Active Sessions",
      value: 42,
      unit: "users",
      status: "healthy",
      description: "Currently logged-in users",
    },
    {
      id: "4",
      name: "Error Rate",
      value: 0.5,
      unit: "%",
      status: "healthy",
      description: "Current system error rate",
    },
    {
      id: "5",
      name: "CPU Usage",
      value: 35,
      unit: "%",
      status: "healthy",
      description: "Server CPU performance",
    },
    {
      id: "6",
      name: "Memory Usage",
      value: 62,
      unit: "%",
      status: "warning",
      description: "RAM utilization",
    },
    {
      id: "7",
      name: "Disk Space",
      value: 78,
      unit: "%",
      status: "warning",
      description: "Storage capacity used",
    },
    {
      id: "8",
      name: "Avg Response Time",
      value: 145,
      unit: "ms",
      status: "healthy",
      description: "API response time",
    },
  ];

  // System alerts
  const alerts: Alert[] = [
    {
      id: "1",
      level: "info",
      message: "Scheduled maintenance window scheduled for 2026-06-15 02:00 AM",
      timestamp: "2026-05-26 10:30",
      service: "System",
    },
    {
      id: "2",
      level: "warning",
      message: "Memory usage approaching 65% threshold",
      timestamp: "2026-05-26 09:15",
      service: "Infrastructure",
    },
    {
      id: "3",
      level: "info",
      message: "Backup completed successfully (150 GB)",
      timestamp: "2026-05-26 08:00",
      service: "Backup",
    },
    {
      id: "4",
      level: "info",
      message: "Database optimization completed",
      timestamp: "2026-05-25 23:45",
      service: "Database",
    },
    {
      id: "5",
      level: "warning",
      message: "Disk space usage at 78% - consider cleanup",
      timestamp: "2026-05-25 18:30",
      service: "Storage",
    },
  ];

  // Service status data
  const serviceStatus = useMemo(
    () => ({
      healthy: metrics.filter((m) => m.status === "healthy").length,
      warning: metrics.filter((m) => m.status === "warning").length,
      critical: metrics.filter((m) => m.status === "critical").length,
      totalServices: metrics.length,
    }),
    []
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return CheckCircle2;
      case "warning":
        return AlertTriangle;
      case "critical":
        return AlertCircle;
      default:
        return Activity;
    }
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case "Backend API":
        return Server;
      case "Database":
        return Database;
      case "Active Sessions":
        return Users;
      case "Error Rate":
        return AlertCircle;
      case "CPU Usage":
        return Zap;
      case "Memory Usage":
        return Activity;
      case "Disk Space":
        return HardDrive;
      case "Avg Response Time":
        return Clock;
      default:
        return Wifi;
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case "critical":
        return AlertCircle;
      case "warning":
        return AlertTriangle;
      default:
        return CheckCircle2;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      default:
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    status,
    bgColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    unit: string;
    status: string;
    bgColor: string;
  }) => (
    <div className={`rounded-[20px] border ${getStatusColor(status)} bg-gradient-to-br from-white/5 to-transparent p-6 cursor-pointer transition hover:from-white/10`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">{label}</h3>
        <div className="rounded-lg bg-white/10 p-2.5">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white">{value}</p>
        {unit && <p className="text-sm text-white/60">{unit}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="System Health Panel"
        description="Monitor backend uptime, database status, active sessions, error rate, performance metrics and system alerts."
      />

      {/* Status Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Healthy Services</h3>
            <div className="rounded-lg bg-green-500/20 p-2.5">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{serviceStatus.healthy}</p>
          <p className="mt-1 text-xs text-white/60">out of {serviceStatus.totalServices}</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Warning Status</h3>
            <div className="rounded-lg bg-yellow-500/20 p-2.5">
              <AlertTriangle className="h-5 w-5 text-yellow-300" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{serviceStatus.warning}</p>
          <p className="mt-1 text-xs text-white/60">services to monitor</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">Critical Status</h3>
            <div className="rounded-lg bg-red-500/20 p-2.5">
              <AlertCircle className="h-5 w-5 text-red-300" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{serviceStatus.critical}</p>
          <p className="mt-1 text-xs text-white/60">requires attention</p>
        </div>

        <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white/70">System Health</h3>
            <div className="rounded-lg bg-cyan-500/20 p-2.5">
              <TrendingUp className="h-5 w-5 text-cyan-300" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {Math.round(((serviceStatus.healthy / serviceStatus.totalServices) * 100))}%
          </p>
          <p className="mt-1 text-xs text-white/60">overall health</p>
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">System Metrics</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = getMetricIcon(metric.name);
            return (
              <StatCard
                key={metric.id}
                icon={Icon}
                label={metric.name}
                value={metric.value}
                unit={metric.unit}
                status={metric.status}
                bgColor={getStatusColor(metric.status)}
              />
            );
          })}
        </div>
      </div>

      {/* System Alerts */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">Recent Alerts & Logs</h2>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const AlertIcon = getAlertIcon(alert.level);
            return (
              <div
                key={alert.id}
                className={`rounded-lg border ${getAlertColor(alert.level)} bg-gradient-to-br from-white/5 to-transparent p-4 transition hover:from-white/10`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-0.5">
                    <AlertIcon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-white">{alert.message}</h3>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white/70">
                        {alert.service}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/60">{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Information */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <h3 className="mb-4 font-semibold text-white">System Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm text-white/60">Last Backup</p>
            <p className="mt-1 text-lg font-semibold text-white">Today, 08:00 AM</p>
            <p className="mt-1 text-xs text-white/60">Size: 150 GB</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Uptime</p>
            <p className="mt-1 text-lg font-semibold text-white">45 days, 12 hrs</p>
            <p className="mt-1 text-xs text-white/60">Since 2026-04-11</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Total Users</p>
            <p className="mt-1 text-lg font-semibold text-white">320 active</p>
            <p className="mt-1 text-xs text-white/60">42 currently online</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Database Size</p>
            <p className="mt-1 text-lg font-semibold text-white">45.2 GB</p>
            <p className="mt-1 text-xs text-white/60">Last optimized: Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;