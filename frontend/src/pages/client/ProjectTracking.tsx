import React from "react";
import {
  AssignedTeamMembers,
  InvoiceSummary,
  MeetingSchedule,
  ProjectOverview,
  ProjectReport,
} from "./modules";

const ProjectTracking = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[28px] border border-cyan-500/20 bg-slate-900/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Client Project Tracking</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Project delivery, reporting, and billing in one view</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            This route brings together the branch-delivered client modules so project owners can review progress,
            assigned teams, upcoming meetings, reports, and invoice status without falling back to placeholder screens.
          </p>
        </section>

        <ProjectOverview />
        <div className="grid gap-6 xl:grid-cols-2">
          <ProjectReport />
          <InvoiceSummary />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <AssignedTeamMembers />
          <MeetingSchedule />
        </div>
      </div>
    </div>
  );
};

export default ProjectTracking;
