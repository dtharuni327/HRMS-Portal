import PageHeader from "../../components/super-admin/PageHeader";
import StatCard from "../../components/super-admin/StatCard";

const SystemHealth = () => {
  return (
    <>
      <PageHeader
        title="System Health Panel"
        description="Monitor backend uptime, database status, active sessions, error rate and backups."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Backend API" value="Online" description="API uptime status" />
        <StatCard title="Database" value="Connected" description="Database connection health" />
        <StatCard title="Active Sessions" value="42" description="Currently logged-in users" />
        <StatCard title="Error Rate" value="0.5%" description="Current system error rate" />
        <StatCard title="Last Backup" value="Today" description="Latest backup timestamp" />
      </div>
    </>
  );
};

export default SystemHealth;