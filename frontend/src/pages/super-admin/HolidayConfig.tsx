import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  MapPin,
  Lock,
  Globe2,
} from "lucide-react";
import { superAdminApi } from "../../services/superAdminApi";

type HolidayType = "Public" | "Restricted";
type HolidayStatus = "Active" | "Inactive";

type Holiday = {
  id: number;
  name: string;
  date: string;
  type: HolidayType;
  region: string;
  status: HolidayStatus;
  clientId?: number;
};

const initialHolidays: Holiday[] = [
  {
    id: 1,
    name: "Republic Day",
    date: "2025-01-26",
    type: "Public",
    region: "India",
    status: "Active",
  },
  {
    id: 2,
    name: "Ugadi",
    date: "2025-03-30",
    type: "Restricted",
    region: "Telangana",
    status: "Active",
  },
  {
    id: 3,
    name: "Independence Day",
    date: "2025-08-15",
    type: "Public",
    region: "India",
    status: "Active",
  },
];

type HolidayForm = {
  name: string;
  date: string;
  type: HolidayType;
  region: string;
};

const emptyForm: HolidayForm = {
  name: "",
  date: "",
  type: "Public",
  region: "",
};

export default function Holiday() {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHolidayId, setEditingHolidayId] = useState<number | null>(null);
  const [formData, setFormData] = useState<HolidayForm>(emptyForm);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const data = await superAdminApi.getHolidays();
        const mapped = data.map((holiday, index) => ({
          id: Number(holiday.id ?? index + 1),
          name: holiday.name,
          date: holiday.date,
          type: holiday.type === "restricted" ? "Restricted" : "Public",
          region: holiday.region,
          status: "Active" as HolidayStatus,
        }));

        if (mapped.length > 0) {
          setHolidays(mapped);
        }
      } catch (error) {
        console.warn("Unable to load holidays from backend, using local data.", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHolidays();
  }, []);

  const filteredHolidays = useMemo(() => {
    return holidays.filter((holiday) => {
      const keyword = search.toLowerCase();

      return (
        holiday.name.toLowerCase().includes(keyword) ||
        holiday.type.toLowerCase().includes(keyword) ||
        holiday.region.toLowerCase().includes(keyword)
      );
    });
  }, [holidays, search]);

  const publicHolidays = holidays.filter(
    (holiday) => holiday.type === "Public"
  ).length;

  const restrictedHolidays = holidays.filter(
    (holiday) => holiday.type === "Restricted"
  ).length;

  const regionsCount = new Set(holidays.map((holiday) => holiday.region)).size;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenCreateForm = () => {
    setFormData(emptyForm);
    setEditingHolidayId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setFormData({
      name: holiday.name,
      date: holiday.date,
      type: holiday.type,
      region: holiday.region,
    });

    setEditingHolidayId(holiday.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setHolidays((prev) => prev.filter((holiday) => holiday.id !== id));
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    alert(`CSV selected: ${file.name}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.region) {
      alert("Holiday name, date and region are required");
      return;
    }

    if (editingHolidayId) {
      setHolidays((prev) =>
        prev.map((holiday) =>
          holiday.id === editingHolidayId
            ? {
                ...holiday,
                ...formData,
              }
            : holiday
        )
      );
    } else {
      const newHoliday: Holiday = {
        id: Date.now(),
        ...formData,
        status: "Active",
      };

      try {
        await superAdminApi.createHoliday({
          name: formData.name,
          date: formData.date,
          region: formData.region,
          type: formData.type === "Restricted" ? "restricted" : "public",
        } as any);
      } catch (error) {
        console.warn("Holiday creation failed in backend, keeping local entry.", error);
      }

      setHolidays((prev) => [newHoliday, ...prev]);
    }

    setFormData(emptyForm);
    setEditingHolidayId(null);
    setIsFormOpen(false);
  };

  return (
    <div>
      {isLoading && (
        <div className="mb-4 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
          Loading holiday data from backend...
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Holiday Configuration
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Add public holidays, optional restricted holidays, region-wise rules
            and bulk import holiday data.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/20">
            <Upload size={18} />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvImport}
              className="hidden"
            />
          </label>

          <button
            onClick={handleOpenCreateForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700"
          >
            <Plus size={18} />
            Add Holiday
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          title="Total Holidays"
          value={holidays.length}
          icon={<CalendarDays size={22} />}
        />

        <StatCard
          title="Public Holidays"
          value={publicHolidays}
          icon={<Globe2 size={22} />}
        />

        <StatCard
          title="Restricted"
          value={restrictedHolidays}
          icon={<Lock size={22} />}
        />

        <StatCard
          title="Regions"
          value={regionsCount}
          icon={<MapPin size={22} />}
        />
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <CalendarDays size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingHolidayId ? "Edit Holiday" : "Create Holiday"}
                </h2>

                <p className="text-sm text-slate-500">
                  Add or update holiday configuration details.
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
              <FormInput
                label="Holiday Name"
                name="name"
                value={formData.name}
                placeholder="Example: Republic Day"
                onChange={handleChange}
              />

              <FormInput
                label="Holiday Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Holiday Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
                >
                  <option value="Public">Public Holiday</option>
                  <option value="Restricted">Restricted Holiday</option>
                </select>
              </div>

              <FormInput
                label="Region"
                name="region"
                value={formData.region}
                placeholder="Example: India / Telangana / Hyderabad"
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
                {editingHolidayId ? "Update Holiday" : "Create Holiday"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <CalendarDays size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Holiday List
              </h2>

              <p className="text-sm text-slate-500">
                View, edit and manage public or restricted holidays.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-3.5 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search holidays..."
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
                <th className="rounded-l-xl px-4 py-3 font-semibold">
                  Holiday
                </th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="rounded-r-xl px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredHolidays.map((holiday) => (
                <tr
                  key={holiday.id}
                  className="border-b border-slate-100 text-sm"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {holiday.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {holiday.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: #{holiday.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {holiday.date}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {holiday.type}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {holiday.region}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={holiday.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(holiday)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                        title="Edit Holiday"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(holiday.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Delete Holiday"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredHolidays.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No holidays found.
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

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

type FormInputProps = {
  label: string;
  name: keyof HolidayForm;
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

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

type StatusBadgeProps = {
  status: HolidayStatus;
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
