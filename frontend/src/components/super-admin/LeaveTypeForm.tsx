import { useState } from "react";
import type { LeaveType } from "../../types/superAdmin.types";

type Props = {
  onSubmit: (data: Partial<LeaveType>) => void;
};

const LeaveTypeForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    maxDays: 0,
    carryForward: false,
    status: "active",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData as Partial<LeaveType>);
      }}
      className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm"
    >
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Leave type name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="number"
        className="rounded-lg border px-3 py-2"
        placeholder="Maximum days"
        value={formData.maxDays}
        onChange={(e) => setFormData({ ...formData, maxDays: Number(e.target.value) })}
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={formData.carryForward}
          onChange={(e) => setFormData({ ...formData, carryForward: e.target.checked })}
        />
        Carry forward allowed
      </label>

      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
        Save Leave Type
      </button>
    </form>
  );
};

export default LeaveTypeForm;