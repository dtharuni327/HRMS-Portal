import { useState } from "react";
import {
  Save,
  Settings,
  CalendarDays,
  Timer,
  ShieldCheck,
  RotateCcw,
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
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      console.log("System Configuration:", config);

      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      alert("Configuration saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          System Configuration
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Configure grace period, shift timing,
          week-off days, auto punch-out and overtime rate.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-2xl shadow-black/20"
      >
        <div className="mb-6 flex items-center gap-4 border-b border-slate-200 pb-5">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <Settings size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Attendance Settings
            </h2>

            <p className="text-sm text-slate-500">
              Manage HRMS attendance rules and timing settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ConfigInput
            label="Grace Period"
            name="gracePeriod"
            type="number"
            placeholder="Enter grace period in minutes"
            value={config.gracePeriod}
            onChange={handleChange}
            icon={<Timer size={18} />}
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
                className="w-full appearance-none rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
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
                className="pointer-events-none absolute right-4 top-3.5 text-slate-500"
              />
            </div>
          </div>

          <ConfigInput
            label="Overtime Rate"
            name="overtimeRate"
            type="number"
            placeholder="Enter overtime rate per hour"
            value={config.overtimeRate}
            onChange={handleChange}
            icon={<ShieldCheck size={18} />}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save size={17} />

            {isSaving
              ? "Saving..."
              : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}

type ConfigInputProps = {
  label: string;
  name: keyof SystemConfig;
  type: string;
  value: string;
  placeholder?: string;
  icon?: React.ReactNode;
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
          className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
        />

        {type !== "time" && icon && (
          <div className="absolute right-4 top-3.5 text-slate-500">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}