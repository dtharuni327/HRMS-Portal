import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/superadmin" },
  { label: "System Config", path: "/superadmin/system-config" },
  { label: "Users & Roles", path: "/superadmin/users" },
  { label: "New User", path: "/superadmin/users/new" },
  { label: "Departments", path: "/superadmin/departments" },
  { label: "Holidays", path: "/superadmin/holidays" },
  { label: "Leave Types", path: "/superadmin/leave-types" },
  { label: "Audit Logs", path: "/superadmin/audit-logs" },
  { label: "System Health", path: "/superadmin/system-health" },
];

const SuperAdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0f213a] p-4 text-white">
      <div className="flex h-full flex-col rounded-3xl border border-white/40 p-4">
        <h2 className="mb-8 text-xl font-bold">HRMS</h2>

        <nav className="flex flex-1 flex-col gap-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/superadmin"}
              className={({ isActive }) =>
                `rounded-2xl px-5 py-4 text-sm font-bold uppercase tracking-wide transition ${
                  isActive
                    ? "bg-[#443985] text-white shadow-lg"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => navigate("/login")}
          className="rounded-2xl px-5 py-4 text-left text-sm font-bold uppercase tracking-wide text-cyan-300 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;
