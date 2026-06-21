import { Menu } from "lucide-react";
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
    <div className="min-h-screen bg-[#081629] xl:flex xl:min-h-screen xl:items-stretch">
      <SuperAdminSidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
      />

      <main
        className={`min-h-screen flex-1 min-w-0 transition-all duration-300 ${
          isSidebarExpanded ? "ml-[292px]" : "ml-[140px]"
        }`}
      >
        <header className="mx-6 mt-4 w-auto rounded-[24px] border border-white/10 bg-[#172554]/95 text-white shadow-[inset_3px_0_0_rgba(34,211,238,0.75),0_16px_45px_rgba(2,8,23,0.28)] backdrop-blur-2xl sm:mx-8">
          <div className="flex items-center justify-between px-4 py-3 sm:px-5 lg:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/10 xl:hidden"
                type="button"
                onClick={() => setIsSidebarExpanded((prev) => !prev)}
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <h2 className="truncate text-[28px] font-bold leading-tight tracking-tight text-white">
                  Super Admin Dashboard
                </h2>

                <p className="truncate text-[15px] text-white/68">
                  Manage system configuration, users, roles, holidays and departments
                </p>
              </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/25 text-[14px] font-bold text-white">
                  {initials}
                </div>

                <div className="hidden sm:block">
                  <p className="text-[14px] font-semibold text-white">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-white/70">{currentUser.role}</p>
                </div>
              </div>

              <div className="ml-2 rounded-xl bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white">
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