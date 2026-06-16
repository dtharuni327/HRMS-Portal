import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ClientSidebar from "./ClientSidebar";

const ClientLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#081629]">
      <ClientSidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      <main className={`min-h-screen transition-all duration-300 ${isSidebarExpanded ? 'ml-[292px]' : 'ml-[102px]'}`}>
        <section className="p-8 text-slate-900">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default ClientLayout;
