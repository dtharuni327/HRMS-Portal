import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Archive,
  Users,
  GitBranch,
  Save,
  X,
  UserPlus,
  Trash2,
} from "lucide-react";
import { superAdminApi } from "../../services/superAdminApi";

type DepartmentStatus = "Active" | "Archived";

type Department = {
  id: number;
  name: string;
  code: string;
  manager: string;
  role: string;
  parentDepartment: string;
  employeeCount: number;
  location: string;
  status: DepartmentStatus;
};

type DepartmentEmployee = {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
};

type DepartmentUsers = {
  [departmentId: number]: DepartmentEmployee[];
};

const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Human Resources",
    code: "HR",
    manager: "Priya Sharma",
    role: "HR Manager",
    parentDepartment: "Administration",
    employeeCount: 6,
    location: "Hyderabad",
    status: "Active",
  },
  {
    id: 2,
    name: "Engineering",
    code: "ENG",
    manager: "Rahul Verma",
    role: "Engineering Head",
    parentDepartment: "Technology",
    employeeCount: 45,
    location: "Bangalore",
    status: "Active",
  },
  {
    id: 3,
    name: "Finance",
    code: "FIN",
    manager: "Anjali Rao",
    role: "Finance Head",
    parentDepartment: "Administration",
    employeeCount: 18,
    location: "Mumbai",
    status: "Active",
  },
];

const initialDepartmentUsers: DepartmentUsers = {
  1: [
    {
      userId: "CMP2",
      name: "HR Manager",
      email: "hr@example.com",
      role: "HR Manager",
      status: "Active",
    },
    {
      userId: "DPT1",
      name: "Nisha Kumar",
      email: "nisha.kumar@example.com",
      role: "Recruiter",
      status: "Active",
    },
    {
      userId: "DPT2",
      name: "Rajesh Patel",
      email: "rajesh.patel@example.com",
      role: "HR Executive",
      status: "Active",
    },
    {
      userId: "DPT3",
      name: "Priya Singh",
      email: "priya.singh@example.com",
      role: "Payroll Staff",
      status: "Active",
    },
    {
      userId: "DPT4",
      name: "Amit Verma",
      email: "amit.verma@example.com",
      role: "Employee Relations Staff",
      status: "Active",
    },
    {
      userId: "DPT5",
      name: "Zara Khan",
      email: "zara.khan@example.com",
      role: "HR Intern",
      status: "Active",
    },
  ],
  2: [
    {
      userId: "CMP4",
      name: "Maya Singh",
      email: "maya.singh@example.com",
      role: "Senior Engineer",
      status: "Active",
    },
  ],
  3: [
    {
      userId: "CMP5",
      name: "Arun Patel",
      email: "arun.patel@example.com",
      role: "Finance Analyst",
      status: "Active",
    },
  ],
};

const emptyForm: Omit<Department, "id" | "employeeCount" | "status"> = {
  name: "",
  code: "",
  manager: "",
  role: "",
  parentDepartment: "",
  location: "",
};

const mapApiDepartment = (department: Awaited<ReturnType<typeof superAdminApi.getDepartments>>[number]): Department => ({
  id: Number(department.id),
  name: department.name,
  code: department.name.slice(0, 3).toUpperCase(),
  manager: department.head,
  role: "",
  parentDepartment: "",
  employeeCount: department.employeesCount,
  location: "India",
  status: department.status === "inactive" ? "Archived" : "Active",
});

export default function Department() {
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);

  const [departmentUsers, setDepartmentUsers] = useState<DepartmentUsers>(
    initialDepartmentUsers
  );

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(
    null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(
    null
  );

  const selectedDepartment = selectedDepartmentId
    ? departments.find((d) => d.id === selectedDepartmentId)
    : null;

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const rows = await superAdminApi.getDepartments();

        if (rows.length > 0) {
          setDepartments(rows.map(mapApiDepartment));
        }
      } catch (error) {
        console.warn("Unable to load departments from backend, using local data.", error);
      }
    };

    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const keyword = search.toLowerCase();

      return (
        dept.name.toLowerCase().includes(keyword) ||
        dept.code.toLowerCase().includes(keyword) ||
        dept.manager.toLowerCase().includes(keyword) ||
        dept.location.toLowerCase().includes(keyword)
      );
    });
  }, [departments, search]);

  const activeDepartments = departments.filter(
    (dept) => dept.status === "Active"
  ).length;

  const archivedDepartments = departments.filter(
    (dept) => dept.status === "Archived"
  ).length;

  const totalEmployees = departments.reduce(
    (total, dept) => total + dept.employeeCount,
    0
  );

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
    setEditingDepartmentId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (department: Department) => {
    setFormData({
      name: department.name,
      code: department.code,
      manager: department.manager,
      role: department.role,
      parentDepartment: department.parentDepartment,
      location: department.location,
    });

    setEditingDepartmentId(department.id);
    setIsFormOpen(true);
  };

  const handleArchive = async (id: number) => {
    const current = departments.find((dept) => dept.id === id);
    if (!current) return;

    try {
      await superAdminApi.updateDepartment(String(id), {
        name: current.name,
        head: current.manager,
        status: "inactive",
      });
    } catch (error) {
      console.warn("Unable to archive department in backend, keeping UI update local.", error);
    }

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, status: "Archived" } : dept
      )
    );
  };

  const handleActivate = async (id: number) => {
    const current = departments.find((dept) => dept.id === id);
    if (!current) return;

    try {
      await superAdminApi.updateDepartment(String(id), {
        name: current.name,
        head: current.manager,
        status: "active",
      });
    } catch (error) {
      console.warn("Unable to activate department in backend, keeping UI update local.", error);
    }

    setDepartments((prev) =>
      prev.map((dept) =>
        dept.id === id ? { ...dept, status: "Active" } : dept
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.manager) {
      alert("Department name, code and manager are required");
      return;
    }

    if (editingDepartmentId) {
      try {
        await superAdminApi.updateDepartment(String(editingDepartmentId), {
          name: formData.name,
          head: formData.manager,
          status: "active",
        });
      } catch (error) {
        console.warn("Unable to update department in backend, keeping UI update local.", error);
      }

      setDepartments((prev) =>
        prev.map((dept) =>
          dept.id === editingDepartmentId
            ? {
                ...dept,
                ...formData,
              }
            : dept
        )
      );
    } else {
      let createdDepartmentId = Date.now();

      try {
        const created = await superAdminApi.createDepartment({
          name: formData.name,
          head: formData.manager,
          status: "active",
        });
        createdDepartmentId = Number(created.id);
      } catch (error) {
        console.warn("Unable to create department in backend, keeping UI update local.", error);
      }

      const newDepartment: Department = {
        id: createdDepartmentId,
        ...formData,
        employeeCount: 0,
        status: "Active",
      };

      setDepartments((prev) => [newDepartment, ...prev]);
    }

    setFormData(emptyForm);
    setEditingDepartmentId(null);
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Department Management
          </h1>

          <p className="mt-2 text-sm text-slate-300">
            Create departments, assign department heads, view hierarchy and
            archive departments.
          </p>
        </div>

        <button
          onClick={handleOpenCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          title="Total Departments"
          value={departments.length}
          icon={<Building2 size={22} />}
        />

        <StatCard
          title="Active"
          value={activeDepartments}
          icon={<GitBranch size={22} />}
        />

        <StatCard
          title="Archived"
          value={archivedDepartments}
          icon={<Archive size={22} />}
        />

        <StatCard
          title="Employees"
          value={totalEmployees}
          icon={<Users size={22} />}
        />
      </div>

      {isFormOpen && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
                <Building2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingDepartmentId ? "Edit Department" : "Create Department"}
                </h2>

                <p className="text-sm text-slate-500">
                  Add or update department details.
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
                label="Department Name"
                name="name"
                value={formData.name}
                placeholder="Example: Human Resources"
                onChange={handleChange}
              />

              <FormInput
                label="Department Code"
                name="code"
                value={formData.code}
                placeholder="Example: HR"
                onChange={handleChange}
              />

              <FormInput
                label="Department Head"
                name="manager"
                value={formData.manager}
                placeholder="Enter manager name"
                onChange={handleChange}
              />

              <FormInput
                label="Role"
                name="role"
                value={formData.role}
                placeholder="Example: HR Manager"
                onChange={handleChange}
              />

              <FormInput
                label="Location"
                name="location"
                value={formData.location}
                placeholder="Example: Hyderabad"
                onChange={handleChange}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Parent Department
                </label>

                <select
                  name="parentDepartment"
                  value={formData.parentDepartment}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
                >
                  <option value="">Select parent department</option>
                  <option value="Administration">Administration</option>
                  <option value="Technology">Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="Management">Management</option>
                  <option value="Sales & Marketing">Sales & Marketing</option>
                </select>
              </div>
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
                {editingDepartmentId ? "Update Department" : "Create Department"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
              <Building2 size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Departments List
              </h2>

              <p className="text-sm text-slate-500">
                View, edit, archive and manage organization departments.
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
              placeholder="Search departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-slate-100 text-left text-sm text-slate-700">
                <th className="rounded-l-xl px-4 py-3 font-semibold">
                  Department
                </th>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Department Head</th>
                <th className="px-4 py-3 font-semibold">Parent</th>
                <th className="px-4 py-3 font-semibold">Employees</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="rounded-r-xl px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="border-b border-slate-100 text-sm"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {department.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {department.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          ID: #{department.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {department.code}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {department.manager}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {department.parentDepartment || "-"}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {department.employeeCount}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {department.location || "-"}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={department.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedDepartmentId(department.id)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        title="View Details"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => handleEdit(department)}
                        className="rounded-lg bg-indigo-50 p-2 text-indigo-600 transition hover:bg-indigo-100"
                        title="Edit Department"
                      >
                        <Edit size={16} />
                      </button>

                      {department.status === "Active" ? (
                        <button
                          onClick={() => handleArchive(department.id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                          title="Archive Department"
                        >
                          <Archive size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(department.id)}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDepartments.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No departments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDepartment && (
        <DepartmentDetailsModal
          department={selectedDepartment}
          employees={departmentUsers[selectedDepartment.id] || []}
          onClose={() => setSelectedDepartmentId(null)}
          onAddEmployee={(employee) => {
            setDepartmentUsers((prev) => ({
              ...prev,
              [selectedDepartment.id]: [
                ...(prev[selectedDepartment.id] || []),
                employee,
              ],
            }));
          }}
          onRemoveEmployee={(userId) => {
            setDepartmentUsers((prev) => ({
              ...prev,
              [selectedDepartment.id]: (prev[selectedDepartment.id] || []).filter(
                (emp) => emp.userId !== userId
              ),
            }));
          }}
        />
      )}
    </div>
  );
}

function DepartmentDetailsModal({
  department,
  employees,
  onClose,
  onAddEmployee,
  onRemoveEmployee,
}: {
  department: Department;
  employees: DepartmentEmployee[];
  onClose: () => void;
  onAddEmployee: (employee: DepartmentEmployee) => void;
  onRemoveEmployee: (userId: string) => void;
}) {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    userId: "",
    name: "",
    email: "",
    role: "",
    status: "Active" as const,
  });

  const hrRoles = [
    "HR Manager",
    "Recruiter",
    "HR Executive",
    "Payroll Staff",
    "Employee Relations Staff",
    "HR Intern",
  ];

  const handleAddEmployee = () => {
    if (
      newEmployee.userId &&
      newEmployee.name &&
      newEmployee.email &&
      newEmployee.role
    ) {
      onAddEmployee({
        userId: newEmployee.userId,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role,
        status: newEmployee.status,
      });
      setNewEmployee({
        userId: "",
        name: "",
        email: "",
        role: "",
        status: "Active",
      });
      setIsAddingEmployee(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl bg-white p-6 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            {department.name}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Employees in {department.name} department
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          Close
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Department
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.name}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Code
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.code}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Head
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.manager}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Total Employees
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.employeeCount}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Location
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.location}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Status
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {department.status}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            Employees ({employees.length})
          </h3>
          <button
            onClick={() => setIsAddingEmployee(!isAddingEmployee)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>

        {isAddingEmployee && (
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <h4 className="mb-4 font-semibold text-slate-900">
              Add New Employee to {department.name}
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={newEmployee.userId}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, userId: e.target.value })
                  }
                  placeholder="e.g., CMP1, DPT1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <select
                  value={newEmployee.role}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="">Select role</option>
                  {hrRoles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleAddEmployee}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <Save size={16} />
                Save Employee
              </button>
              <button
                onClick={() => setIsAddingEmployee(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white text-left text-sm font-semibold text-slate-700">
                <th className="rounded-l-lg px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="rounded-r-lg px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    No employees assigned yet
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.userId}
                    className="border-t border-slate-200 text-sm"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-600">
                      {employee.userId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {employee.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {employee.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onRemoveEmployee(employee.userId)}
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                        title="Remove Employee"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
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
  icon: ReactNode;
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
  name: keyof typeof emptyForm;
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FormInput({
  label,
  name,
  value,
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
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100/60"
      />
    </div>
  );
}

type StatusBadgeProps = {
  status: DepartmentStatus;
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
