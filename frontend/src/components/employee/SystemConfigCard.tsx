import React, { useEffect, useState } from "react";
import {
  Clock3,
  Timer,
  LogOut,
  AlertCircle,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

type SystemConfig = {
  gracePeriod: string;
  shiftStartTime: string;
  shiftEndTime: string;
  weekOffDays: string;
  autoPunchOutTime: string;
  overtimeRate: string;
};

export default function SystemConfigCard() {
  const [config, setConfig] = useState<SystemConfig | null>(null);

  useEffect(() => {
    const savedConfig = localStorage.getItem("systemConfig");
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error("Failed to parse system config:", error);
      }
    }
  }, []);

  if (!config || !Object.values(config).some((value) => value)) {
    return (
      <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="mb-4">
          <h3 className="flex items-center gap-3 text-xl font-bold text-white">
            <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-2">
              <Clock3 className="h-5 w-5 text-white" />
            </div>
            System Configuration
          </h3>
          <p className="mt-2 text-sm text-white/60">
            Organization attendance and timing policies
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-sm text-white/70">
            <span className="font-semibold">No configuration available yet.</span> Super Admin will set up your organization timing policies soon.
          </p>
        </div>
      </div>
    );
  }

  const configItems = [
    {
      label: "Grace Period",
      value: config.gracePeriod ? `${config.gracePeriod} min` : "--",
      icon: <Timer className="h-5 w-5" />,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
    },
    {
      label: "Shift Start Time",
      value: config.shiftStartTime || "--:--",
      icon: <Clock3 className="h-5 w-5" />,
      color: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
    },
    {
      label: "Shift End Time",
      value: config.shiftEndTime || "--:--",
      icon: <LogOut className="h-5 w-5" />,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
    },
    {
      label: "Auto Punch-Out Time",
      value: config.autoPunchOutTime || "--:--",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "from-red-400 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
    },
    {
      label: "Week-Off Days",
      value: config.weekOffDays || "--",
      icon: <CalendarDays className="h-5 w-5" />,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Overtime Rate",
      value: config.overtimeRate ? `Rs.${config.overtimeRate}/hr` : "--",
      icon: <ShieldCheck className="h-5 w-5" />,
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
    },
  ];

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="mb-6">
        <h3 className="flex items-center gap-3 text-xl font-bold text-white">
          <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 p-2">
            <Clock3 className="h-5 w-5 text-white" />
          </div>
          System Configuration
        </h3>
        <p className="mt-2 text-sm text-white/60">
          Organization attendance and timing policies
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {configItems.map((item) => (
          <div
            key={item.label}
            className={`rounded-[16px] border border-white/10 p-4 transition hover:border-white/20 ${item.bgColor}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className={`text-xs font-semibold uppercase tracking-wider ${item.textColor}`}>
                {item.label}
              </p>
              <div className={`rounded-lg bg-gradient-to-br ${item.color} p-1.5`}>
                <div className="text-white">{item.icon}</div>
              </div>
            </div>
            <p className={`text-lg font-bold ${item.textColor}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
        <p>
          <span className="font-semibold">Note:</span> These settings are configured by your
          organization Super Admin. Please refer to your HR team for updates.
        </p>
      </div>
    </div>
  );
}
