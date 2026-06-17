
import {
  FolderKanban,
  Users,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Bell,
  CalendarDays,
  FileText,
} from "lucide-react";

export default function ClientHome() {
  const projects = [
    {
      name: "HRMS Portal",
      progress: 82,
    },
    {
      name: "Employee Mobile App",
      progress: 65,
    },
    {
      name: "Payroll Module",
      progress: 40,
    },
  ];

  const activities = [
    "UI Review completed successfully",
    "Invoice INV-2026-002 generated",
    "New requirements document uploaded",
    "Client review meeting scheduled",
  ];

  const actions = [
    "Invoice due in 9 days",
    "Review milestone approval",
    "Client review meeting tomorrow",
    "Feedback request pending",
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}

      <div className="rounded-[32px] bg-[#ECE6DA] p-10">
        <p className="mb-3 text-xs uppercase tracking-[4px] text-orange-500">
          Client Dashboard
        </p>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight text-slate-900">
          Welcome back, ABC Technologies.
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          Monitor project progress, team contribution,
          financial updates, and important activities
          from one place.
        </p>
      </div>

      {/* KPI Cards */}

      {/* palette: lavender,mint green,warm cream, ice blue,soft sage,soft pink,light beige,lilac frost,royal navy,ivory sand */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Active Projects"
          value="3"
          icon={<FolderKanban size={22} />}
          bg="#C3A6FF" /* lavender */
          iconBg="#8B63FF"
        />

        <DashboardCard
          title="Team Members"
          value="8"
          icon={<Users size={22} />}
          bg="#BFF3D4" /* mint green */
          iconBg="#4CD89A"
        />

        <DashboardCard
          title="Open Tasks"
          value="14"
          icon={<CheckCircle2 size={22} />}
          bg="#FFD6E8" /* soft pink */
          iconBg="#FF9CC7"
        />

        <DashboardCard
          title="Completion"
          value="78%"
          icon={<TrendingUp size={22} />}
          bg="#D7F0FF" /* ice blue */
          iconBg="#6EC8FF"
        />
      </div>

      {/* Main Grid */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Project Snapshot */}

        <div className="rounded-[28px] p-6 shadow-xl" style={{ backgroundColor: '#D7C8F2' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-sky-600">
                Projects
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Project Snapshot
              </h2>
            </div>

            <FolderKanban size={20} />
          </div>

          <div className="space-y-5">
            {projects.map((project) => (
              <div key={project.name}>
                <div className="mb-2 flex justify-between">
                  <span className="font-medium text-slate-700">
                    {project.name}
                  </span>

                  <span className="font-semibold text-slate-900">
                    {project.progress}%
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-indigo-600"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Snapshot */}

        <div className="rounded-[28px] p-6 shadow-xl" style={{ backgroundColor: '#F0E8D9' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-pink-500">
                Finance
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Financial Snapshot
              </h2>
            </div>

            <Wallet size={20} />
          </div>

          <div className="space-y-4">
            <FinancialCard
              title="Total Invoiced"
              value="₹3,19,500"
            />

            <FinancialCard
              title="Outstanding"
              value="₹1,94,500"
            />

            <FinancialCard
              title="Paid This Month"
              value="₹1,25,000"
            />

            <FinancialCard
              title="Pending Payments"
              value="₹18,500"
            />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Activity */}

        <div className="rounded-[28px] p-6 shadow-xl" style={{ backgroundColor: '#E9E1CC' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-green-600">
                Activity
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Recent Updates
              </h2>
            </div>

            <Bell size={20} />
          </div>

          <div className="space-y-4">
            {activities.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 p-4"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}

        <div className="rounded-[28px] p-6 shadow-xl" style={{ backgroundColor: '#E9DBC6' }}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-orange-500">
                Actions
              </p>

              <h2 className="text-2xl font-bold text-slate-900">
                Upcoming Actions
              </h2>
            </div>

            <CalendarDays size={20} />
          </div>

          <div className="space-y-4">
            {actions.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-orange-100 bg-orange-50 p-4"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents */}

      <div className="rounded-[28px] p-6 shadow-xl" style={{ backgroundColor: '#F7F7F8' }}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[4px] text-cyan-600">
              Documents
            </p>

            <h2 className="text-2xl font-bold text-slate-900">
              Latest Shared Documents
            </h2>
          </div>

          <FileText size={20} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DocumentCard
            name="SOW_V2.pdf"
            date="15 Jun 2026"
          />

          <DocumentCard
            name="Project_Plan.xlsx"
            date="13 Jun 2026"
          />

          <DocumentCard
            name="Sprint_Report.pdf"
            date="10 Jun 2026"
          />
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function DashboardCard({
  title,
  value,
  icon,
  bg,
  iconBg,
}: DashboardCardProps & { bg?: string; iconBg?: string }) {
  const textDark = (bg ?? '#FFFFFF') !== '#07123A';

  return (
    <div className="rounded-[24px] p-6 shadow-xl" style={{ backgroundColor: bg ?? '#FFFFFF' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${textDark ? 'text-slate-700' : 'text-white/90'}`}>
            {title}
          </p>

          <h3 className={`mt-2 text-4xl font-bold ${textDark ? 'text-slate-900' : 'text-white'}`}>
            {value}
          </h3>
        </div>

        <div className="rounded-xl p-3" style={{ backgroundColor: iconBg ?? '#EEF2FF', color: '#ffffff' }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function FinancialCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </h3>
    </div>
  );
}

function DocumentCard({
  name,
  date,
}: {
  name: string;
  date: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900">
        {name}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        Uploaded on {date}
      </p>
    </div>
  );
}