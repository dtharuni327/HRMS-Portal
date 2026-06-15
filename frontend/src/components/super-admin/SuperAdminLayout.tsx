import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "./SuperAdminSidebar";

const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#081629]">
      <SuperAdminSidebar />

      <main className="ml-72 min-h-screen">
        <header className="mx-0 rounded-bl-3xl border-b border-cyan-400/40 bg-[#1d2d63] px-8 py-5 text-white">
          <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-200">
            Manage system configuration, users, roles, holidays and departments
          </p>
        </header>

        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default SuperAdminLayout;
