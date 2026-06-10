import { useState } from "react";
import type { Holiday } from "../../types/superAdmin.types";

type Props = {
  onSubmit: (data: Partial<Holiday>) => void;
};

const HolidayForm = ({ onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    region: "",
    type: "public",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData as Partial<Holiday>);
      }}
      className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm"
    >
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Holiday name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="date"
        className="rounded-lg border px-3 py-2"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Region"
        value={formData.region}
        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
      />

      <select
        className="rounded-lg border px-3 py-2"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option value="public">Public</option>
        <option value="optional">Optional</option>
        <option value="restricted">Restricted</option>
      </select>

      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
        Save Holiday
      </button>
    </form>
  );
};

export default HolidayForm;