import React, { useMemo, useState } from 'react';
import {
  BadgeCheck,
  Briefcase,
  CalendarRange,
  FolderKanban,
  Menu,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import AssignedTeamMembers from './modules/AssignedTeamMembers';
import Attendance from './modules/Attendance';
import Chat from './modules/Chat';
import DocumentSharing from './modules/DocumentSharing';
import FeedbackSection from './modules/FeedbackSection';
import InvoiceSummary from './modules/InvoiceSummary';
import MeetingSchedule from './modules/MeetingSchedule';
import Notifications from './modules/Notifications';
import PaymentHistory from './modules/PaymentHistory';
import ProjectOverview from './modules/ProjectOverview';
import Support from './modules/Support';
import ProjectReport from './modules/ProjectReport';
import ClientDashboardModule from './modules/ClientDashboardHome';

const ClientDashboard: React.FC = () => {
  const [activePage] = useState<string>('home');

  const stats = useMemo(
    () => [
      { label: 'Active Projects', value: '6', hint: '2 due this week', icon: FolderKanban, tone: 'bg-[#edf7ff] border-cyan-100', text: 'text-cyan-700' },
      { label: 'Invoices Due', value: '3', hint: 'Rs. 4.8L pending', icon: Wallet, tone: 'bg-[#eefbf4] border-emerald-100', text: 'text-emerald-700' },
      { label: 'Team Members', value: '18', hint: '4 new updates', icon: ShieldCheck, tone: 'bg-[#fff2f7] border-pink-100', text: 'text-pink-700' },
      { label: 'Upcoming Milestones', value: '5', hint: 'Next review on Fri', icon: CalendarRange, tone: 'bg-[#fff9ea] border-amber-100', text: 'text-amber-700' },
    ],
    []
  );

  const projects = [
    { name: 'HRMS Portal', owner: 'Product Team', status: 'In Progress', progress: '78%' },
    { name: 'Payroll Sync', owner: 'Finance Ops', status: 'Review', progress: '54%' },
    { name: 'Client Reports', owner: 'Analytics', status: 'Ready', progress: '92%' },
  ];

  const isProjectOverview = activePage === 'projectoverview';
  const isTeamMembers = activePage === 'team-members';
  const isAttendance = activePage === 'attendance';
  // removed Task page
  const isProjectReport = activePage === 'projectreport';
  const isInvoiceSummary = activePage === 'invoicesummary';
  const isPaymentHistory = activePage === 'paymenthistory';
  const isDocumentSharing = activePage === 'documentsharing';
  const isMeetingSchedule = activePage === 'meetingschedule';
  const isNotifications = activePage === 'notifications';
  const isSupport = activePage === 'support';
  const isChat = activePage === 'chat';
  const isFeedbackSection = activePage === 'feedbacksection';

  const pageTitle = isProjectOverview
    ? 'Project Overview'
    : isTeamMembers
      ? 'Assigned Team Members'
      : isAttendance
        ? 'Attendance / Work Summary'
        : isProjectReport
          ? 'Project Reports'
          : isInvoiceSummary
            ? 'Invoice Summary'
            : isPaymentHistory
              ? 'Payment History'
              : isDocumentSharing
                ? 'Document Sharing'
                : isMeetingSchedule
                  ? 'Meeting Schedule'
                  : isNotifications
                    ? 'Notifications'
                    : isSupport
                      ? 'Support / Ticket Requests'
                      : isChat
                        ? 'Chat / Communication'
                        : isFeedbackSection
                          ? 'Feedback Section'
                          : 'Client Dashboard';

  const pageSubtitle = isProjectOverview
    ? 'Review active projects, timelines, delivery stage, and progress details.'
    : isTeamMembers
      ? 'Meet the project manager, developers, QA, and support contacts for this client project.'
      : isAttendance
        ? 'Optional client-facing effort and attendance summary for this project.'
        : isProjectReport
          ? 'Weekly progress, monthly reports, delivery status, blockers, and completed work summary.'
          : isInvoiceSummary
            ? 'Review invoice totals, payment status, due dates, and outstanding amounts.'
            : isPaymentHistory
              ? 'Review previous payments, receipts, payment dates, pending charges, and confirmations.'
              : isDocumentSharing
                ? 'Review contracts, project documents, reports, invoices, requirement documents, and deliverables.'
                : isMeetingSchedule
                  ? 'View upcoming client meetings, review calls, demo sessions, and meeting notes.'
                  : isNotifications
                    ? 'Project updates, invoice reminders, meeting alerts, ticket updates, and document alerts.'
                    : isSupport
                      ? 'Raise issues, track support tickets, view ticket status, and view escalation updates.'
                      : isChat
                        ? 'Chat with the project manager, HR/admin if required, and the assigned project team.'
                        : isFeedbackSection
                          ? 'Review client feedback, ratings, suggestions, and satisfaction notes.'
                          : 'Track projects, invoices, and client updates in one place.';

  return (
    <div className="h-screen overflow-hidden bg-[#0f1d36] text-slate-100 [font-family:Inter,-apple-system,system-ui,sans-serif]">
      <div className="relative flex h-screen w-full overflow-hidden bg-[#0f1d36]">
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-transparent transition-all duration-300 xl:pt-4">
          <header className="sticky top-0 z-30 mx-4 mt-1 shrink-0 rounded-[24px] border border-white/10 bg-[#172554]/95 text-white shadow-[inset_3px_0_0_rgba(34,211,238,0.75),0_16px_45px_rgba(2,8,23,0.28)] backdrop-blur-2xl">
            <div className="flex items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  className="rounded-xl border border-white/15 bg-white/5 p-2 transition hover:bg-white/10 xl:hidden"
                  type="button"
                >
                  <Menu className="h-4 w-4" />
                </button>

                <div className="min-w-0">
                  <h2 className="truncate text-[28px] font-bold leading-tight tracking-tight text-white">{pageTitle}</h2>
                  <p className="truncate text-[15px] text-white/68">{pageSubtitle}</p>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right text-[12px] text-slate-200 shadow-inner shadow-white/5">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-200/80">Client Portal</div>
                  <div className="text-sm font-semibold text-white">Welcome back</div>
                </div>
              </div>
            </div>
          </header>

          <section className="mx-4 mt-6 flex-1 space-y-6 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isProjectOverview ? (
              <ProjectOverview />
            ) : isTeamMembers ? (
              <AssignedTeamMembers />
            ) : isAttendance ? (
              <Attendance />
            ) : isProjectReport ? (
              <ProjectReport />
            ) : isInvoiceSummary ? (
              <InvoiceSummary />
            ) : isPaymentHistory ? (
              <PaymentHistory />
            ) : isDocumentSharing ? (
              <DocumentSharing />
            ) : isMeetingSchedule ? (
              <MeetingSchedule />
            ) : isNotifications ? (
              <Notifications />
            ) : isSupport ? (
              <Support />
            ) : isChat ? (
              <Chat />
            ) : isFeedbackSection ? (
              <FeedbackSection />
            ) : (
              <>
            <ClientDashboardModule />
            <div className="rounded-[30px] border border-[#dbeafe] bg-[#fff8ef] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-sky-700/90">Client overview</p>
                  <h3 className="text-[30px] font-black tracking-tight text-slate-900 lg:text-[34px]">Stay aligned with your delivery team and project health.</h3>
                  <p className="max-w-xl text-[15px] leading-6 text-slate-700">Monitor active workstreams, approval items, payments, and upcoming milestones from one polished dashboard.</p>
                </div>

                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
                  <div className="flex items-center gap-2 font-semibold"><BadgeCheck className="h-4 w-4" /> Delivery status: On track</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.label}
                    className={`rounded-[28px] border ${item.tone} p-5 shadow-[0_18px_40px_rgba(148,163,184,0.18)] transition hover:-translate-y-1 hover:border-cyan-200`}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[12px] uppercase tracking-[0.24em] text-slate-700/80">{item.label}</p>
                        <p className="mt-3 text-[30px] font-black text-slate-900">{item.value}</p>
                      </div>
                      <div className={`rounded-2xl border border-white/90 bg-white/90 p-3 ${item.text}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-[13px] text-slate-700/80">{item.hint}</p>
                  </article>
                );
              })}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[30px] border border-[#e5eefb] bg-[#f4faff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.26em] text-sky-700/90">Project progress</p>
                    <h4 className="text-[22px] font-bold text-slate-900">Current delivery overview</h4>
                  </div>
                  <Briefcase className="h-5 w-5 text-cyan-200" />
                </div>

                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.name} className="rounded-[24px] border border-cyan-100 bg-[#f8fcff] p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[15px] font-semibold text-slate-900">{project.name}</p>
                          <p className="text-[13px] text-slate-600">{project.owner}</p>
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-800">{project.status}</span>
                      </div>
                      <div className="mt-4">
                        <div className="mb-1 flex items-center justify-between text-[12px] text-slate-300/90">
                          <span className="text-slate-700">Completion</span>
                          <strong className="text-slate-900">{project.progress}</strong>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200/80">
                          <div className="h-2 rounded-full bg-cyan-400" style={{ width: project.progress }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[30px] border border-[#e5eefb] bg-[#f4faff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
                <p className="text-[12px] uppercase tracking-[0.26em] text-sky-700/90">Client notes</p>
                <h4 className="mt-2 text-[22px] font-bold text-slate-900">What to watch next</h4>

                <div className="mt-6 space-y-4">
                  {[
                    'Invoice approval for the current sprint is due on Thursday.',
                    'Two deliverables are ready for your review and sign-off.',
                    'The next leadership review call is scheduled for Friday 11:30 AM.',
                  ].map((note, index) => (
                    <div
                      key={note}
                      className={`rounded-[20px] border p-4 text-[14px] leading-6 text-slate-700 shadow-sm ${index % 2 === 0 ? 'border-emerald-100 bg-[#effbf5]' : 'border-pink-100 bg-[#fff4f8]'}`}
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </article>
            </div>
            </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;