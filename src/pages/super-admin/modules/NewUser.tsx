import { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = ["Super Admin", "HR Manager", "Manager", "Employee"];
const departments = ["Human Resources","Administration", "Finance", "Management", "Technology","Sales & Marketing", "Operations"];
const genders = ["Male", "Female", "Other"];
const statuses = ["Active", "Inactive"];

export default function NewUser() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[3]);
  const [department, setDepartment] = useState(departments[0]);
  const [gender, setGender] = useState(genders[0]);
  const [salaryPackage, setSalaryPackage] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [office, setOffice] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = "User name is required.";
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Email must be valid.";
    }

    if (!role) nextErrors.role = "Please choose a role.";
    if (!department) nextErrors.department = "Please choose a department.";
    if (!gender) nextErrors.gender = "Please choose a gender.";
    if (!salaryPackage.trim()) nextErrors.salaryPackage = "Package is required.";
    if (!joiningDate.trim()) nextErrors.joiningDate = "Joining date is required.";
    if (!contactNumber.trim()) nextErrors.contactNumber = "Contact number is required.";
    if (!office.trim()) nextErrors.office = "Office is required.";
    if (!location.trim()) nextErrors.location = "Location is required.";
    if (!status) nextErrors.status = "Please choose a status.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const newUser = {
      name,
      email,
      role,
      status,
      salaryPackage,
      department,
      gender,
      joiningDate,
      contactNumber,
      office,
      location,
    };

    const existingUsers = JSON.parse(
      localStorage.getItem("createdUsers") ?? "[]"
    );

    localStorage.setItem(
      "createdUsers",
      JSON.stringify([...existingUsers, newUser])
    );

    const emailMessage = `Your account has been created.\n\nName: ${name}\nEmail: ${email}\nRole: ${role}\nDepartment: ${department}\nGender: ${gender}\nStatus: ${status}\nJoining Date: ${joiningDate}\nContact Number: ${contactNumber}\nOffice: ${office}\nLocation: ${location}`;

    alert(`New user created and email sent to ${email}:\n\n${emailMessage}`);
    navigate("/superadmin/user-roles");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Add New User</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Create a new user account with email, role and department.
          All fields marked with * are required.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-2xl shadow-black/20">
          <h2 className="mb-6 text-xl font-semibold text-slate-900">
            Adding New User
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                User Name *
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                  errors.name
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300 bg-white"
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-slate-300 bg-white"
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.role
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-2 text-xs text-red-600">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.department
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {departments.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-2 text-xs text-red-600">{errors.department}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.gender
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {genders.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.gender && (
                  <p className="mt-2 text-xs text-red-600">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Package *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12 LPA"
                  value={salaryPackage}
                  onChange={(e) => setSalaryPackage(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.salaryPackage
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.salaryPackage && (
                  <p className="mt-2 text-xs text-red-600">{errors.salaryPackage}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.status
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                {errors.status && (
                  <p className="mt-2 text-xs text-red-600">{errors.status}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Joining Date *
                </label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.joiningDate
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.joiningDate && (
                  <p className="mt-2 text-xs text-red-600">{errors.joiningDate}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.contactNumber
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.contactNumber && (
                  <p className="mt-2 text-xs text-red-600">{errors.contactNumber}</p>
                )}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Office *
                </label>
                <input
                  type="text"
                  placeholder="Enter office location"
                  value={office}
                  onChange={(e) => setOffice(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.office
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.office && (
                  <p className="mt-2 text-xs text-red-600">{errors.office}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Enter city or country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-700 outline-none transition ${
                    errors.location
                      ? "border-red-400 bg-red-50"
                      : "border-slate-300 bg-white"
                  }`}
                />
                {errors.location && (
                  <p className="mt-2 text-xs text-red-600">{errors.location}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700"
              >
                Create User
              </button>

              <button
                type="button"
                onClick={() => navigate("/superadmin/user-roles")}
                className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Back to Users
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-black/20">
          <h2 className="mb-6 text-xl font-semibold">New User Summary</h2>
          <div className="space-y-4 text-sm">
              <div>
              <p className="text-slate-400">Name</p>
              <p className="mt-2 text-lg font-semibold text-white">{name || "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Email</p>
              <p className="mt-2 text-lg font-semibold text-white">{email || "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Role</p>
              <p className="mt-2 text-lg font-semibold text-white">{role}</p>
            </div>
            <div>
              <p className="text-slate-400">Department</p>
              <p className="mt-2 text-lg font-semibold text-white">{department}</p>
            </div>
            <div>
              <p className="text-slate-400">Gender</p>
              <p className="mt-2 text-lg font-semibold text-white">{gender}</p>
            </div>
            <div>
              <p className="text-slate-400">Package</p>
              <p className="mt-2 text-lg font-semibold text-white">{salaryPackage || "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <p className="mt-2 text-lg font-semibold text-white">{status}</p>
            </div>
            <div>
              <p className="text-slate-400">Joining Date</p>
              <p className="mt-2 text-lg font-semibold text-white">{joiningDate ? new Date(joiningDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Contact</p>
              <p className="mt-2 text-lg font-semibold text-white">{contactNumber || "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Office</p>
              <p className="mt-2 text-lg font-semibold text-white">{office || "Not set yet"}</p>
            </div>
            <div>
              <p className="text-slate-400">Location</p>
              <p className="mt-2 text-lg font-semibold text-white">{location || "Not set yet"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
