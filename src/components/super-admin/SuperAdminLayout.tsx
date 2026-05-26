import { Outlet } from "react-router-dom";
import { useState } from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // read current user from localStorage if available, otherwise use defaults
  const raw = localStorage.getItem("currentUser");
  const parsed = raw ? JSON.parse(raw) : null;
  const currentUser = parsed ?? {
    name: "D.Tharuni",
    role: "Super Administrator",
    initials: "D",
  };

  const initials =
    currentUser.initials ||
    (currentUser.name || "").split(" ").map((n: string) => n[0] || "").slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-[#081629]">
      <SuperAdminSidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          isSidebarExpanded ? "ml-[292px]" : "ml-[102px]"
        }`}
      >
        <header className="mx-0 rounded-bl-3xl border-b border-cyan-400/40 bg-[#1d2d63] px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-sm text-gray-200">
                Manage system configuration, users, roles, holidays and departments
              </p>
            </div>

            {/* Right-side user info (matches employee dashboard style) */}
            <div className="flex items-center gap-4">
              {/* vertical divider like employee header */}
              <div className="hidden sm:block h-8 w-px rounded bg-white/10" />

              <div className="hidden sm:flex sm:items-center sm:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563eb] text-sm font-semibold text-white shadow">
                  {initials}
                </div>

                <div className="hidden md:block">
                  <div className="text-sm font-semibold">{currentUser.name}</div>
                  <div className="text-xs text-white/60">{currentUser.role}</div>
                </div>
              </div>

              <div className="ml-2 rounded-md bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
                HRMS
              </div>
            </div>
          </div>
        </header>

        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
