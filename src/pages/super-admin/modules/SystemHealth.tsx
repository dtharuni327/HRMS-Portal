import { useState, useMemo } from "react";
import type { FC, ElementType } from "react";
import {
  Server,
  Database,
  Users,
  AlertCircle,
  HardDrive,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Wifi,
  Activity,
} from "lucide-react";
import PageHeader from "../../../components/super-admin/PageHeader";

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

const SystemHealth: FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Pastel accent colors and card text for contrast on pastel fills
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

  const getStatusAccentColor = (status: string) => {
    switch (status) {
      case "healthy":
        return accentColors[1]; // mint
      case "warning":
        return accentColors[5]; // warm beige
      case "critical":
        return accentColors[4]; // soft pink
      default:
        return accentColors[3]; // ice blue
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
        return CheckCircle;
    }
  };

  

  const getAlertAccentColor = (level: string) => {
    switch (level) {
      case "critical":
        return accentColors[4]; // soft pink
      case "warning":
        return accentColors[5]; // warm beige
      default:
        return accentColors[3]; // ice blue
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    unit,
    bgColor,
    onClick,
    selected,
  }: {
    icon: ElementType;
    label: string;
    value: string | number;
    unit: string;
    bgColor: string;
    onClick?: () => void;
    selected?: boolean;
  }) => (
  <div onClick={onClick} className="rounded-[20px] p-6 cursor-pointer transition" style={{ backgroundColor: bgColor, color: cardText, border: selected ? "2px solid rgba(7,24,39,0.12)" : "1px solid rgba(7,24,39,0.06)" }}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>{label}</h3>
        <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold" style={{ color: cardText }}>{value}</p>
        {unit && <p className="text-sm" style={{ color: "rgba(7,24,39,0.6)" }}>{unit}</p>}
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
        <div className="rounded-[20px] p-6" style={{ backgroundColor: accentColors[1], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>Healthy Services</h3>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: cardText }}>{serviceStatus.healthy}</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>out of {serviceStatus.totalServices}</p>
        </div>

        <div className="rounded-[20px] p-6" style={{ backgroundColor: accentColors[5], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>Warning Status</h3>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: cardText }}>{serviceStatus.warning}</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>services to monitor</p>
        </div>

        <div className="rounded-[20px] p-6" style={{ backgroundColor: accentColors[4], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>Critical Status</h3>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: cardText }}>{serviceStatus.critical}</p>
          <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>requires attention</p>
        </div>

        <div className="rounded-[20px] p-6" style={{ backgroundColor: accentColors[3], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold" style={{ color: "rgba(7,24,39,0.6)" }}>System Health</h3>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: "#071827" }}>
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold" style={{ color: cardText }}>
            {Math.round(((serviceStatus.healthy / serviceStatus.totalServices) * 100))}%
          </p>
          <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>overall health</p>
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
                bgColor={getStatusAccentColor(metric.status)}
                onClick={() => setSelectedMetric(metric.id)}
                selected={selectedMetric === metric.id}
              />
            );
          })}
        </div>
        {selectedMetric && (
          <div className="mt-4 rounded p-4" style={{ backgroundColor: accentColors[0], color: cardText }}>
            <h3 className="font-semibold">Selected Metric</h3>
            <p className="mt-1">{metrics.find((m) => m.id === selectedMetric)?.name}</p>
            <p className="text-sm mt-1" style={{ color: "rgba(7,24,39,0.6)" }}>{metrics.find((m) => m.id === selectedMetric)?.description}</p>
          </div>
        )}
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
                className="rounded-lg p-4 transition"
                style={{ backgroundColor: getAlertAccentColor(alert.level), color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 pt-0.5">
                    <div style={{ backgroundColor: "#071827" }} className="rounded-lg p-2">
                      <AlertIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold" style={{ color: cardText }}>{alert.message}</h3>
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#E6F4FF", color: "#075985" }}>
                        {alert.service}
                      </span>
                    </div>
                    <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>{alert.timestamp}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Information */}
      <div className="rounded-[20px] p-6" style={{ backgroundColor: accentColors[6], color: cardText, border: "1px solid rgba(7,24,39,0.06)" }}>
        <h3 className="mb-4 font-semibold" style={{ color: "rgba(7,24,39,0.8)" }}>System Information</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm" style={{ color: "rgba(7,24,39,0.6)" }}>Last Backup</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: cardText }}>Today, 08:00 AM</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Size: 150 GB</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "rgba(7,24,39,0.6)" }}>Uptime</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: cardText }}>45 days, 12 hrs</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Since 2026-04-11</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "rgba(7,24,39,0.6)" }}>Total Users</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: cardText }}>320 active</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>42 currently online</p>
          </div>
          <div>
            <p className="text-sm" style={{ color: "rgba(7,24,39,0.6)" }}>Database Size</p>
            <p className="mt-1 text-lg font-semibold" style={{ color: cardText }}>45.2 GB</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Last optimized: Yesterday</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;