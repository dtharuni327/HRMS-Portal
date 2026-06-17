import React from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import {
  Clock3,
  Users,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import useProjectStore from '../../../store/projectStore';

// work log type removed — not used in this view

// Sample project-level data for client view (replace with real data/store when available)
const projects = [
  { name: 'CRM Modernization', hours: 148, progress: 85, lastUpdate: 'Yesterday', teamMembers: 8, completedMilestones: 6, pendingMilestones: 1, openTasks: 3, lastDelivery: '15 Jun 2026' },
  { name: 'Mobile App Development', hours: 96, progress: 62, lastUpdate: '2 days ago', teamMembers: 10, completedMilestones: 4, pendingMilestones: 2, openTasks: 3, lastDelivery: '10 Jun 2026' },
  { name: 'HRMS Integration', hours: 44, progress: 35, lastUpdate: 'Today', teamMembers: 6, completedMilestones: 2, pendingMilestones: 1, openTasks: 2, lastDelivery: '14 Jun 2026' },
];

type AttendanceProps = {
  projectsProp?: Array<{ name: string; hours: number; progress: number; lastUpdate?: string; teamMembers?: number; completedMilestones?: number; pendingMilestones?: number; openTasks?: number; lastDelivery?: string }>;
};

export default function AttendanceWorkSummary({ projectsProp }: AttendanceProps) {
  // Derived totals for top cards (project-focused)
  const [selectedProject, setSelectedProject] = React.useState<string>('All projects');

  // load from store if props not provided
  const storeProjects = useProjectStore((s) => s.projects);
  const storeAssignments = useProjectStore((s) => s.assignments);

  const mappedStoreProjects = (storeProjects || []).map((p) => ({
    name: p.name,
    hours: 0,
    progress: Number(String(p.progress ?? '').replace('%','')) || 0,
    lastUpdate: p.endDate || p.startDate || '-',
    teamMembers: (storeAssignments[p.name] || []).length,
    completedMilestones: 0,
    pendingMilestones: 0,
    openTasks: 0,
    lastDelivery: p.endDate || '-',
  }));

  const sourceProjects = projectsProp && projectsProp.length ? projectsProp : (mappedStoreProjects.length ? mappedStoreProjects : projects);

  const displayedProjects = selectedProject === 'All projects' ? sourceProjects : sourceProjects.filter((p) => p.name === selectedProject);

  const totalHours = displayedProjects.reduce((s, p) => s + p.hours, 0);
  const activeProjects = displayedProjects.length;
  const teamMembers = displayedProjects.reduce((s, p) => s + (p.teamMembers || 0), 0);
  const avgUtil = Math.round(displayedProjects.reduce((s, p) => s + p.progress, 0) / Math.max(1, displayedProjects.length));

  // prefer workLogsProp when provided (not used in this view currently)

  return (
    <div className="space-y-6">
      {/* Hero Section */}

      <div className="rounded-3xl p-8" style={{ backgroundColor: clientPalette.warmCream, boxShadow: '0 20px 30px rgba(0,0,0,0.06)'}}>
        <p className="mb-2 text-xs uppercase tracking-[4px] text-orange-600">
          Attendance / Work Summary
        </p>

        <h1 className="max-w-3xl text-4xl font-bold text-slate-900">
          Track team effort, project hours,
          and work contributions shared
          with your organization.
        </h1>

        <p className="mt-4 max-w-2xl text-slate-600">
          This section provides a transparent
          overview of team activities and effort
          spent on your project.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatCard
          title="Total Hours Logged"
          value={`${totalHours} hrs`}
          icon={<Clock3 size={22} />}
        />

        <StatCard
          title="Team Members"
          value={`${teamMembers}`}
          icon={<Users size={22} />}
        />

        <StatCard
          title="Avg Utilization"
          value={`${avgUtil}%`}
          icon={<TrendingUp size={22} />}
        />
      </div>

      {/* Main Layout */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Project Work Summary (left) */}
        <div className="xl:col-span-2 rounded-3xl p-6" style={{ backgroundColor: clientPalette.lilacFrost, boxShadow: '0 20px 30px rgba(0,0,0,0.06)'}}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[4px] text-sky-600">Project Work Summary</p>
              <h2 className="text-2xl font-bold text-slate-900">Where effort is being invested</h2>
            </div>

            <div className="flex items-center gap-3">
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none">
                <option>All projects</option>
                {sourceProjects.map((p) => <option key={p.name}>{p.name}</option>)}
              </select>
              <CalendarDays size={22} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-slate-500">
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Hours</th>
                  <th className="pb-3">Progress</th>
                  <th className="pb-3">Last update</th>
                </tr>
              </thead>

              <tbody>
                {displayedProjects.map((p) => (
                  <tr key={p.name} className="border-b border-slate-100">
                    <td className="py-4">
                      <div className="text-lg font-semibold text-slate-900">{p.name}</div>
                    </td>
                    <td className="py-4 text-slate-700">{p.hours}h</td>
                    <td className="py-4">
                      <div className="w-full max-w-sm">
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${p.progress}%` }} />
                        </div>
                        <div className="mt-1 text-xs text-slate-500">{p.progress}%</div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-700">{p.lastUpdate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delivery Overview (right) */}
        <div className="space-y-4">
          <SummaryCard title="Total Hours" value={`${totalHours} hrs`} description="Total effort across projects." accent="emerald" />
          <SummaryCard title="Active Projects" value={`${activeProjects}`} description="Projects currently active for this client." accent="cyan" />
          <SummaryCard title="Team Members" value={`${teamMembers}`} description="People working across projects." accent="slate" />
          <SummaryCard title="Avg Utilization" value={`${avgUtil}%`} description="Average progress/utilization across projects." accent="amber" />

          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[3px] text-slate-500">Delivery Overview</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {(() => {
                  const completed = displayedProjects.reduce((s, p) => s + (p.completedMilestones || 0), 0);
                  const pending = displayedProjects.reduce((s, p) => s + (p.pendingMilestones || 0), 0);
                  const open = displayedProjects.reduce((s, p) => s + (p.openTasks || 0), 0);
                  const last = (() => {
                    const dates = displayedProjects
                      .map((p) => p.lastDelivery)
                      .filter(Boolean)
                      .map((d) => new Date(d as string));
                    if (!dates.length) return '-';
                    const max = new Date(Math.max(...dates.map((d) => d.getTime())));
                    return max.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                  })();

                  return (
                    <>
                      <div className="flex items-center justify-between"><span>Completed Milestones</span><span className="font-semibold text-slate-900">{completed}</span></div>
                      <div className="flex items-center justify-between"><span>Pending Milestones</span><span className="font-semibold text-slate-900">{pending}</span></div>
                      <div className="flex items-center justify-between"><span>Open Tasks</span><span className="font-semibold text-slate-900">{open}</span></div>
                      <div className="flex items-center justify-between"><span>Last Delivery</span><span className="font-semibold text-slate-900">{last}</span></div>
                    </>
                  );
                })()}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-extrabold text-slate-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
};

function SummaryCard({
  title,
  value,
  description,
}: SummaryCardProps & { accent?: 'emerald'|'amber'|'cyan'|'slate' }) {
  const accents: Record<string, string> = {
    emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-100 bg-amber-50 text-amber-700',
    cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
    slate: 'border-slate-200 bg-white text-slate-700',
  };
  // @ts-ignore - arguments usage for simple mapping
  const acc = accents[arguments[0]?.accent as any] || 'border-slate-200 bg-white text-slate-700';

  return (
    <div className={`rounded-2xl border ${acc} p-5 shadow-xl`}>
      <p className="text-xs uppercase tracking-[3px] text-slate-500">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}