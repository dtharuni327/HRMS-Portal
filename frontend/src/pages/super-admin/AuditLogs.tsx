import AdminTable from "../../components/super-admin/AdminTable";
import PageHeader from "../../components/super-admin/PageHeader";
import type { AuditLog } from "../../types/superAdmin.types";

const logs: AuditLog[] = [
  {
    id: "1",
    user: "Super Admin",
    action: "Created department",
    module: "Department",
    date: "2026-04-01",
  },
  {
    id: "2",
    user: "HR Admin",
    action: "Updated holiday",
    module: "Holiday",
    date: "2026-04-02",
  },
];

const AuditLogs = () => {
  return (
    <>
      <PageHeader
        title="Audit Log Viewer"
        description="Track all system actions, filter by user/date/action and export audit trails."
        actionLabel="Export CSV"
        onAction={() => console.log("Export CSV")}
      />

      <AdminTable
        data={logs}
        columns={[
          { header: "User", accessor: "user" },
          { header: "Action", accessor: "action" },
          { header: "Module", accessor: "module" },
          { header: "Date", accessor: "date" },
        ]}
      />
    </>
  );
};

export default AuditLogs;