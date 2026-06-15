import { useState } from "react";
import type { SystemConfig } from "../../types/superAdmin.types";

type Props = {
  onSubmit: (data: SystemConfig) => void;
};

const ConfigForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState<SystemConfig>({
    gracePeriodMinutes: 10,
    shiftStartTime: "09:00",
    shiftEndTime: "18:00",
    weekOffDays: ["Saturday", "Sunday"],
    autoPunchOutTime: "19:00",
    overtimeRate: 1.5,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm md:grid-cols-2"
    >
      <input
        type="number"
        className="rounded-lg border px-3 py-2"
        placeholder="Grace period minutes"
        value={formData.gracePeriodMinutes}
        onChange={(e) =>
          setFormData({ ...formData, gracePeriodMinutes: Number(e.target.value) })
        }
      />

      <input
        type="time"
        className="rounded-lg border px-3 py-2"
        value={formData.shiftStartTime}
        onChange={(e) => setFormData({ ...formData, shiftStartTime: e.target.value })}
      />

      <input
        type="time"
        className="rounded-lg border px-3 py-2"
        value={formData.shiftEndTime}
        onChange={(e) => setFormData({ ...formData, shiftEndTime: e.target.value })}
      />

      <input
        type="time"
        className="rounded-lg border px-3 py-2"
        value={formData.autoPunchOutTime}
        onChange={(e) => setFormData({ ...formData, autoPunchOutTime: e.target.value })}
      />

      <input
        type="number"
        step="0.1"
        className="rounded-lg border px-3 py-2"
        value={formData.overtimeRate}
        onChange={(e) => setFormData({ ...formData, overtimeRate: Number(e.target.value) })}
      />

      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white md:col-span-2">
        Save Configuration
      </button>
    </form>
  );
};

export default ConfigForm;