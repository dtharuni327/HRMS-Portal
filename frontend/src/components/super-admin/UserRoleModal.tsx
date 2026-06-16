import { useState } from "react";
import type { EmployeeUser } from "../../types/superAdmin.types";

type Props = {
  open: boolean;
  user: EmployeeUser | null;
  onClose: () => void;
  onSave: (data: Partial<EmployeeUser>) => void;
};

const UserRoleModal = ({ open, user, onClose, onSave }: Props) => {
  const [role, setRole] = useState<EmployeeUser["role"]>(user?.role || "Employee");
  const [status, setStatus] = useState<EmployeeUser["status"]>(user?.status || "active");

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold">Manage User Role</h2>
        <p className="mt-1 text-sm text-gray-500">{user.name}</p>

        <div className="mt-5 grid gap-4">
          <select
            className="rounded-lg border px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value as EmployeeUser["role"])}
          >
            <option>Employee</option>
            <option>HR</option>
            <option>Manager</option>
            <option>Finance</option>
            <option>Super Admin</option>
          </select>

          <select
            className="rounded-lg border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as EmployeeUser["status"])}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={() => onSave({ role, status })}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRoleModal;