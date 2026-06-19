import { useState } from "react";
import type { Department } from "../../types/superAdmin.types";

type Props = {
  initialData?: Partial<Department>;
  onSubmit: (data: Partial<Department>) => void;
};

const DepartmentForm = ({ initialData, onSubmit }: Props) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    head: initialData?.head || "",
    status: initialData?.status || "active",
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData as Partial<Department>);
      }}
      className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm"
    >
      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Department name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        className="rounded-lg border px-3 py-2"
        placeholder="Department head"
        value={formData.head}
        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
      />

      <select
        className="rounded-lg border px-3 py-2"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
        Save Department
      </button>
    </form>
  );
};

export default DepartmentForm;