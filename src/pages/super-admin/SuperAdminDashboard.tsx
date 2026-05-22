import PageHeader from "../../components/super-admin/PageHeader";
import StatCard from "../../components/super-admin/StatCard";

const SuperAdminDashboard = () => {
  return (
    <>
      <PageHeader
        title="Super Admin Dashboard"
        description="System-level configuration and control panel for company policies, users, holidays, departments and system health."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Employees" value="120" description="All user accounts" />
        <StatCard title="Departments" value="8" description="Active departments" />
        <StatCard title="Holidays" value="14" description="Configured holidays" />
        <StatCard title="System" value="Healthy" description="Backend and DB online" />
      </div>
    </>
  );
};

export default SuperAdminDashboard;