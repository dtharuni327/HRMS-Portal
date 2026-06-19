import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";
import DashboardNavbar from "../DashboardNavbar";

const ClientLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#081629]">
      <ClientSidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <main className={`min-h-screen transition-all duration-300 ${isSidebarExpanded ? 'ml-[292px]' : 'ml-[102px]'}`}>
        <section className="p-8">
          <DashboardNavbar
            title="Client Dashboard"
            subtitle="Manage client projects, invoices, and team interactions"
            roleLabel="Client"
            productLabel="HRMS"
          />

          <div className="text-slate-900">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClientLayout;
