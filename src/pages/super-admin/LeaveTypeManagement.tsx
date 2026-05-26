import { useMemo, useState } from "react";
import {
  CalendarCheck,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  RotateCcw,
  CheckCircle2,
  Archive,
} from "lucide-react";

type LeaveStatus = "Active" | "Inactive";

type LeaveType = {
  id: number;
  name: string;
  maxDays: number;
  carryForward: boolean;
  encashable: boolean;
  status: LeaveStatus;
};

type LeaveTypeForm = {
  name: string;
  maxDays: string;
  carryForward: boolean;
  encashable: boolean;
};

const initialLeaveTypes: LeaveType[] = [
  {
    id: 1,
    name: "Casual Leave",
    maxDays: 12,
    carryForward: false,
    encashable: false,
    status: "Active",
  },
  {
    id: 2,
    name: "Sick Leave",
    maxDays: 10,
    carryForward: false,
    encashable: false,
    status: "Active",
  },
  {
    id: 3,
    name: "Earned Leave",
    maxDays: 18,
    carryForward: true,
    encashable: true,
    status: "Active",
  },
];

const emptyForm: LeaveTypeForm = {
  name: "",
  maxDays: "",
  carryForward: false,
  encashable: false,
};

export default function LeaveTypePage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(initialLeaveTypes);
  const [formData, setFormData] = useState<LeaveTypeForm>(emptyForm);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredLeaveTypes = useMemo(() => {
    return leaveTypes.filter((leave) =>
      leave.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [leaveTypes, search]);

  const activeCount = leaveTypes.filter((leave) => leave.status === "Active").length;
  const inactiveCount = leaveTypes.filter((leave) => leave.status === "Inactive").length;
  const carryForwardCount = leaveTypes.filter((leave) => leave.carryForward).length;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreateForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (leave: LeaveType) => {
    setFormData({
      name: leave.name,
      maxDays: String(leave.maxDays),
      carryForward: leave.carryForward,
      encashable: leave.encashable,
    });

    setEditingId(leave.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setLeaveTypes((prev) => prev.filter((leave) => leave.id !== id));
  };

  const toggleStatus = (id: number) => {
    setLeaveTypes((prev) =>
      prev.map((leave) =>
        leave.id === id
          ? {
              ...leave,
              status: leave.status === "Active" ? "Inactive" : "Active",
            }
          : leave
      )
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Leave type name is required");
      return;
    }

    if (!formData.maxDays || Number(formData.maxDays) <= 0) {
      alert("Max days must be greater than 0");
      return;
    }

    if (editingId) {
      setLeaveTypes((prev) =>
        prev.map((leave) =>
          leave.id === editingId
            ? {
                ...leave,
                name: formData.name,
                maxDays: Number(formData.maxDays),
                carryForward: formData.carryForward,
                encashable: formData.encashable,
              }
            : leave
        )
      );
    } else {
      const newLeaveType: LeaveType = {
        id: Date.now(),
        name: formData.name,
        maxDays: Number(formData.maxDays),
        carryForward: formData.carryForward,
        encashable: formData.encashable,
        status: "Active",
      };

      setLeaveTypes((prev) => [newLeaveType, ...prev]);
    }

    setFormData(emptyForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Leave Type Management</h1>
          <p className="mt-2 text-sm text-slate-300">
            Create and manage leave rules, max days, carry forward and encashment settings.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700"
        >
          <Plus size={18} />
          Add Leave Type
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard title="Total Leave Types" value={leaveTypes.length} icon={<CalendarCheck size={22} />} />
        <StatCard title="Active" value={activeCount} icon={<CheckCircle2 size={22} />} />
        <StatCard title="Inactive" value={inactiveCount} icon={<Archive size={22} />} />
        <StatCard title="Carry Forward" value={carryForwardCount} icon={<RotateCcw size={22} />} />
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <CalendarCheck size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? "Edit Leave Type" : "Create Leave Type"}
                </h2>
                <p className="text-sm text-slate-500">
                  Add or update leave policy rules for employees.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsFormOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Leave Type Name
  </label>

  <select
    name="name"
    value={formData.name}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        name: e.target.value,
      }))
    }
    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
  >
    <option value="">Select Leave Type</option>

    <option value="Casual Leave">
      Casual Leave
    </option>

    <option value="Sick Leave">
      Sick Leave
    </option>

    <option value="Loss of Pay (LOP)">
      Loss of Pay (LOP)
    </option>

    <option value="Earned Leave">
      Earned Leave
    </option>
  </select>
</div>

              <FormInput
                label="Max Days"
                name="maxDays"
                type="number"
                value={formData.maxDays}
                placeholder="Example: 12"
                onChange={handleChange}
              />

              <CheckboxField
                label="Allow Carry Forward"
                name="carryForward"
                checked={formData.carryForward}
                onChange={handleChange}
              />

              <CheckboxField
                label="Allow Leave Encashment"
                name="encashable"
                checked={formData.encashable}
                onChange={handleChange}
              />
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700"
              >
                <Save size={17} />
                {editingId ? "Update Leave Type" : "Create Leave Type"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <CalendarCheck size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">Leave Types List</h2>
              <p className="text-sm text-slate-500">
                View, edit and manage employee leave policies.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search leave types..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-sm text-slate-700">
                <th className="rounded-l-xl px-4 py-3 font-semibold">Leave Type</th>
                <th className="px-4 py-3 font-semibold">Max Days</th>
                <th className="px-4 py-3 font-semibold">Carry Forward</th>
                <th className="px-4 py-3 font-semibold">Encashable</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="rounded-r-xl px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaveTypes.map((leave) => (
                <tr key={leave.id} className="border-b border-slate-100 text-sm">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {leave.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">{leave.name}</p>
                        <p className="text-xs text-slate-500">ID: #{leave.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">{leave.maxDays}</td>
                  <td className="px-4 py-4 text-slate-700">{leave.carryForward ? "Yes" : "No"}</td>
                  <td className="px-4 py-4 text-slate-700">{leave.encashable ? "Yes" : "No"}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={leave.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(leave)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => toggleStatus(leave.id)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        {leave.status === "Active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleDelete(leave.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLeaveTypes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No leave types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
};

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">{icon}</div>
      </div>
    </div>
  );
}

type FormInputProps = {
  label: string;
  name: keyof LeaveTypeForm;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function FormInput({
  label,
  name,
  value,
  type = "text",
  placeholder,
  onChange,
}: FormInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>

      <input
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
      />
    </div>
  );
}

type CheckboxFieldProps = {
  label: string;
  name: keyof LeaveTypeForm;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function CheckboxField({ label, name, checked, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      {label}
    </label>
  );
}

type StatusBadgeProps = {
  status: LeaveStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Active";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}