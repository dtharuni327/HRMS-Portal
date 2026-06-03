import { useState } from "react";
import {
  Save,
  Settings,
  CalendarDays,
  Timer,
  ShieldCheck,
  RotateCcw,
  Clock3,
} from "lucide-react";

type SystemConfig = {
  gracePeriod: string;
  shiftStartTime: string;
  shiftEndTime: string;
  weekOffDays: string;
  autoPunchOutTime: string;
  overtimeRate: string;
};

const initialConfig: SystemConfig = {
  gracePeriod: "",
  shiftStartTime: "",
  shiftEndTime: "",
  weekOffDays: "",
  autoPunchOutTime: "",
  overtimeRate: "",
};

export default function SystemConfiguration() {
  const [config, setConfig] =
    useState<SystemConfig>(initialConfig);

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setConfig(initialConfig);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (Number(config.gracePeriod) > 60) {
      alert("Grace period cannot exceed 60 minutes");
      return;
    }

    if (
      config.overtimeRate &&
      Number(config.overtimeRate) <= 0
    ) {
      alert("Overtime rate must be greater than 0");
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      localStorage.setItem("systemConfig", JSON.stringify(config));
      console.log(config);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      alert("Configuration saved successfully");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[36px] font-black text-white">
          System Configuration
        </h1>

        <p className="mt-2 text-slate-400">
          Configure grace period, shift timing,
          week-off days, auto punch-out and overtime rate.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] bg-[#FCFCFD] p-8 shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
      >
        <div className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="rounded-2xl bg-[#E8E3F8] p-4">
            <Settings
              size={22}
              className="text-[#7C3AED]"
            />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">
              Attendance Settings
            </h2>

            <p className="text-sm text-slate-500">
              Manage HRMS attendance rules and timing
              settings
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ConfigInput
            label="Grace Period"
            name="gracePeriod"
            type="number"
            value={config.gracePeriod}
            placeholder="Enter grace period in minutes"
            icon={<Timer size={18} />}
            iconBg="bg-[#E8E3F8]"
            iconColor="text-[#7C3AED]"
            onChange={handleChange}
          />

          <ConfigInput
            label="Shift Start Time"
            name="shiftStartTime"
            type="time"
            value={config.shiftStartTime}
            onChange={handleChange}
          />

          <ConfigInput
            label="Shift End Time"
            name="shiftEndTime"
            type="time"
            value={config.shiftEndTime}
            onChange={handleChange}
          />

          <ConfigInput
            label="Auto Punch-Out Time"
            name="autoPunchOutTime"
            type="time"
            value={config.autoPunchOutTime}
            onChange={handleChange}
          />

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Week-Off Days
            </label>

            <div className="relative">
              <select
                name="weekOffDays"
                value={config.weekOffDays}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-slate-300"
              >
                <option value="">
                  Select week-off day
                </option>

                <option value="Saturday">
                  Saturday
                </option>

                <option value="Sunday">
                  Sunday
                </option>

                <option value="Saturday, Sunday">
                  Saturday & Sunday
                </option>

                <option value="Friday">
                  Friday
                </option>
              </select>

              <CalendarDays
                size={18}
                className="absolute right-4 top-3 text-slate-500"
              />
            </div>
          </div>

          <ConfigInput
            label="Overtime Rate"
            name="overtimeRate"
            type="number"
            value={config.overtimeRate}
            placeholder="Enter overtime rate per hour"
            icon={<ShieldCheck size={18} />}
            iconBg="bg-[#D8EFE0]"
            iconColor="text-[#059669]"
            onChange={handleChange}
          />
        </div>

        <div className="mt-10 flex justify-end gap-3">
          <ActionButton
            variant="secondary"
            icon={<RotateCcw size={16} />}
            label="Reset"
            onClick={handleReset}
          />

          <ActionButton
            variant="primary"
            icon={<Save size={16} />}
            label={isSaving ? "Saving..." : "Save Configuration"}
            type="submit"
            disabled={isSaving}
          />
        </div>
      </form>
    </div>
  );
}

type ActionButtonProps = {
  variant: "primary" | "secondary";
  icon: React.ReactNode;
  label: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

function ActionButton({
  variant,
  icon,
  label,
  type = "button",
  disabled = false,
  onClick,
}: ActionButtonProps) {
  const baseClass = "rounded-2xl px-5 py-3 font-medium transition flex items-center gap-2";
  const primaryClass = "bg-[#122033] text-white hover:opacity-90 disabled:opacity-70";
  const secondaryClass = "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClass} ${variant === "primary" ? primaryClass : secondaryClass}`}
    >
      {icon}
      {label}
    </button>
  );
}

type ConfigInputProps = {
  label: string;
  name: keyof SystemConfig;
  type: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

function ConfigInput({
  label,
  name,
  type,
  value,
  placeholder,
  icon,
  iconBg = "bg-white",
  iconColor = "text-slate-700",
  onChange,
}: ConfigInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-800 outline-none transition focus:border-slate-300"
        />

        {icon && (
          <div
            className={`absolute right-3 top-3 rounded-xl p-2 ${iconBg}`}
          >
            <span className={iconColor}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}