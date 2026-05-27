import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Shield,
  Edit,
  Trash2,
  RotateCcw,
  Search,
} from "lucide-react";
import UserDetailsModal from "../../../components/super-admin/UserDetailsModal";

type UserStatus = "Active" | "Inactive";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserStatus;
  salaryPackage: string;
  department: string;
  joiningDate: string;
  contactNumber: string;
  office: string;
  location: string;
};

const initialUsers: User[] = [
  {
    id: "CMP1",
    name: "D.Tharuni",
    email: "d.tharuni@example.com",
    role: "Super Admin",
    status: "Active",
    salaryPackage: "18 LPA",
    department: "Administration",
    joiningDate: "2021-11-15",
    contactNumber: "+91 98765 43210",
    office: "Bangalore HQ",
    location: "India",
  },
  {
    id: "CMP2",
    name: "HR Manager",
    email: "hr@example.com",
    role: "HR Manager",
    status: "Active",
    salaryPackage: "12 LPA",
    department: "Human Resources",
    joiningDate: "2022-06-03",
    contactNumber: "+91 91234 56780",
    office: "Chennai Office",
    location: "India",
  },
  {
    id: "CMP3",
    name: "Employee User",
    email: "employee@example.com",
    role: "Employee",
    status: "Inactive",
    salaryPackage: "8 LPA",
    department: "Operations",
    joiningDate: "2023-01-20",
    contactNumber: "+91 99876 54321",
    office: "Pune Office",
    location: "India",
  },
  {
    id: "CMP4",
    name: "Maya Singh",
    email: "maya.singh@example.com",
    role: "Manager",
    status: "Active",
    salaryPackage: "14 LPA",
    department: "Engineering",
    joiningDate: "2022-02-10",
    contactNumber: "+91 94455 11223",
    office: "Bangalore HQ",
    location: "India",
  },
  {
    id: "CMP5",
    name: "Arun Patel",
    email: "arun.patel@example.com",
    role: "Employee",
    status: "Active",
    salaryPackage: "9 LPA",
    department: "Finance",
    joiningDate: "2023-04-18",
    contactNumber: "+91 98811 22334",
    office: "Delhi Office",
    location: "India",
  },
  {
    id: "CMP6",
    name: "Neha Verma",
    email: "neha.verma@example.com",
    role: "Employee",
    status: "Inactive",
    salaryPackage: "7 LPA",
    department: "Operations",
    joiningDate: "2023-09-05",
    contactNumber: "+91 97722 33445",
    office: "Mumbai Office",
    location: "India",
  },
  {
    id: "CMP7",
    name: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    role: "HR Manager",
    status: "Active",
    salaryPackage: "13 LPA",
    department: "Human Resources",
    joiningDate: "2021-07-12",
    contactNumber: "+91 96633 44556",
    office: "Chennai Office",
    location: "India",
  },
  {
    id: "CMP8",
    name: "Priya Joshi",
    email: "priya.joshi@example.com",
    role: "Employee",
    status: "Active",
    salaryPackage: "10 LPA",
    department: "Engineering",
    joiningDate: "2022-10-01",
    contactNumber: "+91 95544 55667",
    office: "Bangalore HQ",
    location: "India",
  },
  {
    id: "CMP9",
    name: "Amit Shah",
    email: "amit.shah@example.com",
    role: "Manager",
    status: "Inactive",
    salaryPackage: "15 LPA",
    department: "Finance",
    joiningDate: "2020-12-22",
    contactNumber: "+91 94455 66778",
    office: "Mumbai Office",
    location: "India",
  },
  {
    id: "CMP10",
    name: "Sara Reddy",
    email: "sara.reddy@example.com",
    role: "Employee",
    status: "Active",
    salaryPackage: "11 LPA",
    department: "Administration",
    joiningDate: "2022-08-28",
    contactNumber: "+91 93366 77889",
    office: "Hyderabad Office",
    location: "India",
  },
];

const roles = ["Super Admin", "HR Manager", "Manager", "Employee"];

export default function UserRoleManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter((user) => {
    const keyword = search.trim().toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword) ||
      user.department.toLowerCase().includes(keyword)
    );
  });

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );

    setSelectedUser((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: prev.status === "Active" ? "Inactive" : "Active",
          }
        : prev
    );
  };

  const handleResetPassword = (email: string) => {
    alert(`Password reset link sent to ${email}`);
  };

  const handleDeleteUser = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers((prev) => prev.filter((user) => user.id !== id));

    setSelectedUser((prev) => (prev && prev.id === id ? null : prev));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );

    setSelectedUser(updatedUser);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          User & Role Management
        </h1>

        <p className="mt-2 text-sm text-slate-300">
          Manage users, assign roles, activate or deactivate accounts, reset
          passwords and invite new users.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <SummaryCard
          title="Total Users"
          value={users.length}
          icon={<Users size={22} />}
        />

        <SummaryCard
          title="Active Users"
          value={users.filter((user) => user.status === "Active").length}
          icon={<Shield size={22} />}
        />

        <SummaryCard
          title="Roles"
          value={roles.length}
          icon={<Edit size={22} />}
        />

        <div className="rounded-2xl bg-white p-5 shadow-xl shadow-black/20">
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Add New User
              </p>

              <h3 className="mt-3 text-2xl font-bold text-slate-900">
                Invite or create user
              </h3>

              <p className="mt-4 text-sm text-slate-500">
                Open the new user form to add a name, email, role and
                department.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/superadmin/new-user")}
              className="mt-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700"
            >
              New User
            </button>
          </div>
        </div>
      </div>

      <UserDetailsModal
        open={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleUpdateUser}
      />

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <Users size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                All User Accounts
              </h2>

              <p className="text-sm text-slate-500">
                Assign roles, manage account status and reset passwords.
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
              placeholder="Search users..."
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
                <th className="rounded-l-xl px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="rounded-r-xl px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 text-sm">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">{user.email}</td>

                  <td className="px-4 py-4 text-slate-700">
                    {user.department}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {user.role}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleUserStatus(user.id)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetPassword(user.email)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 hover:bg-indigo-100"
                        title="Reset Password"
                      >
                        <RotateCcw size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No users found.
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

type SummaryCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
};

function SummaryCard({ title, value, icon }: SummaryCardProps) {
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
