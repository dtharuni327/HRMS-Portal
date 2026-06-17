import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  salaryPackage: string;
  department: string;
  joiningDate: string;
  contactNumber: string;
  office: string;
  location: string;
};

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
};

const getExperience = (joiningDate: string) => {
  const joinDate = new Date(joiningDate);
  const now = new Date();

  let totalMonths =
    (now.getFullYear() - joinDate.getFullYear()) * 12 +
    now.getMonth() -
    joinDate.getMonth();

  if (now.getDate() < joinDate.getDate()) {
    totalMonths -= 1;
  }

  if (totalMonths < 0) {
    totalMonths = 0;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years} year(s) ${months} month(s)`;
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, y: -24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400";

const valueClass = "mt-3 text-lg font-semibold text-slate-900";

export default function UserDetailsModal({ open, user, onClose, onSave }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState<User | null>(null);

  useEffect(() => {
    setEditMode(false);
    setFormState(user);
  }, [user]);

  const updateField = (key: keyof User, value: string) => {
    setFormState((prev) =>
      prev ? { ...prev, [key]: value } : prev
    );
  };

  const handleSave = () => {
    if (formState) {
      onSave(formState);
      setEditMode(false);
    }
  };

  return (
    <AnimatePresence>
      {open && user ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.22 }}
          >
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-100 text-2xl font-black text-indigo-700">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {user.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {formState?.role ?? user.role}
                    </p>
                    {editMode ? (
                      <input
                        type="email"
                        value={formState?.email ?? user.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="mt-2 w-full max-w-[320px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">{user.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {editMode ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setFormState(user);
                        }}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSave}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-700">
                  {user.status}
                </span>
                <span className="rounded-full bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-700">
                  {formState?.salaryPackage ?? user.salaryPackage}
                </span>
                <span className="rounded-full bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700">
                  {formState?.department ?? user.department}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
                  {getExperience(formState?.joiningDate ?? user.joiningDate)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>Date of Joining</p>
                {editMode ? (
                  <input
                    type="date"
                    value={formState?.joiningDate ?? ""}
                    onChange={(e) => updateField("joiningDate", e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className={valueClass}>
                    {new Date(user.joiningDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>Contact Number</p>
                {editMode ? (
                  <input
                    type="tel"
                    value={formState?.contactNumber ?? ""}
                    onChange={(e) => updateField("contactNumber", e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className={valueClass}>{user.contactNumber}</p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>Office</p>
                {editMode ? (
                  <input
                    type="text"
                    value={formState?.office ?? ""}
                    onChange={(e) => updateField("office", e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className={valueClass}>{user.office}</p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>Location</p>
                {editMode ? (
                  <input
                    type="text"
                    value={formState?.location ?? ""}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <p className={valueClass}>{user.location}</p>
                )}
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>User ID</p>
                <p className={valueClass}>#{user.id}</p>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className={labelClass}>Profile Summary</p>
                <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Role
                    </p>
                    {editMode ? (
                      <select
                        value={formState?.role ?? user.role}
                        onChange={(e) => updateField("role", e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      >
                        <option>Super Admin</option>
                        <option>HR Manager</option>
                        <option>Manager</option>
                        <option>Employee</option>
                      </select>
                    ) : (
                      <p className="mt-2 font-semibold text-slate-900">{user.role}</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Department
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        value={formState?.department ?? user.department}
                        onChange={(e) => updateField("department", e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-900">{user.department}</p>
                    )}
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Package
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        value={formState?.salaryPackage ?? user.salaryPackage}
                        onChange={(e) => updateField("salaryPackage", e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-900">{user.salaryPackage}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
