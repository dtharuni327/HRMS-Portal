import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, Briefcase, ChevronLeft, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';

import Sidebar from './modules/Sidebar';

// ─── Attendance Data (keyed "YYYY-MM-DD") ────────────────────────────────────
const ATTENDANCE_DATA: Record<string, 'present' | 'leave'> = {
  '2026-05-01': 'leave',
  '2026-05-04': 'present',
  '2026-05-05': 'present',
  '2026-05-06': 'present',
  '2026-05-07': 'present',
  '2026-05-08': 'present',
  '2026-05-11': 'present',
  '2026-05-12': 'present',
  '2026-05-13': 'present',
  '2026-04-01': 'present',
  '2026-04-02': 'present',
  '2026-04-03': 'present',
  '2026-04-07': 'leave',
  '2026-04-08': 'present',
  '2026-04-09': 'present',
  '2026-04-10': 'present',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ─── Reusable Calendar Component ─────────────────────────────────────────────
interface CalendarDay {
  day: number | null;
  dateKey: string;
  status: 'today' | 'present' | 'leave' | 'weekend' | 'pending' | 'empty';
}

interface AttendanceCalendarProps {
  compact?: boolean; // compact=true for Overview inline card
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ compact = false }) => {
  const today = useMemo(() => new Date(), []);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const goToPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const goToNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const calendarDays: CalendarDay[] = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const days: CalendarDay[] = [];

    // Leading empty cells
    for (let i = 0; i < firstWeekday; i++) {
      days.push({ day: null, dateKey: '', status: 'empty' });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`;
      const weekday = new Date(viewYear, viewMonth, d).getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      const isToday =
        d === today.getDate() &&
        viewMonth === today.getMonth() &&
        viewYear === today.getFullYear();

      let status: CalendarDay['status'];
      if (isToday) status = 'today';
      else if (isWeekend) status = 'weekend';
      else if (ATTENDANCE_DATA[dateKey]) status = ATTENDANCE_DATA[dateKey];
      else status = 'pending';

      days.push({ day: d, dateKey, status });
    }

    return days;
  }, [viewYear, viewMonth, today]);

  const statusStyle: Record<CalendarDay['status'], string> = {
    today: 'bg-cyan-100 text-cyan-700 ring-2 ring-cyan-400 font-bold',
    present: 'bg-emerald-100 text-emerald-700 font-semibold',
    leave: 'bg-rose-100 text-rose-600 font-semibold',
    weekend: 'bg-amber-50 text-amber-500 border border-amber-200',
    pending: 'bg-slate-100 text-slate-400',
    empty: 'invisible pointer-events-none',
  };

  const cellHeight = compact ? 'h-9' : 'h-11';

  return (
    <div className="flex flex-col gap-4">
      {/* ── Nav Row ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={goToPrev}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow hover:bg-slate-50 transition text-slate-700"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="rounded-xl bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-900 shadow min-w-[130px] text-center">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </div>
          <button
            onClick={goToNext}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow hover:bg-slate-50 transition text-slate-700"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {!isCurrentMonth && (
          <button
            onClick={goToToday}
            className="rounded-xl bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1.5 hover:bg-cyan-200 transition"
          >
            Today
          </button>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="rounded-xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        {/* Day header */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-[10px] font-bold uppercase tracking-widest py-1 ${
                i === 0 || i === 6 ? 'text-amber-500' : 'text-slate-400'
              }`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, idx) => (
            <button
              key={idx}
              disabled={!item.day}
              className={`
                flex w-full items-center justify-center rounded-xl text-xs
                transition-all duration-150 hover:scale-105 active:scale-95
                ${cellHeight}
                ${statusStyle[item.status]}
              `}
            >
              {item.day ?? ''}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-slate-500">
          {[
            { color: 'bg-emerald-200 border-emerald-300', label: 'Present' },
            { color: 'bg-rose-200 border-rose-300', label: 'Leave' },
            { color: 'bg-cyan-100 border-2 border-cyan-400', label: 'Today' },
            { color: 'bg-amber-50 border-amber-300', label: 'Weekend' },
            { color: 'bg-slate-100 border-slate-300', label: 'Pending' },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full border ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const ManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (checkedIn && !checkedOut) {
      interval = window.setInterval(() => setSeconds((prev) => prev + 1), 1000);
    }
    return () => { if (interval) window.clearInterval(interval); };
  }, [checkedIn, checkedOut]);

  const formatTime = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const secs = value % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
  };

  const handleCheckIn = () => { setCheckedIn(true); setCheckedOut(false); setSeconds(0); };
  const handleCheckOut = () => { if (checkedIn) { setCheckedOut(true); setCheckedIn(false); } };

  const activeTabInfo = useMemo(() => ({
    Overview:    { title: 'Manager Dashboard Overview',  description: 'Quick access to team attendance, leave, and approvals.' },
    Attendance:  { title: 'Team Attendance',             description: 'Review attendance, check-ins, and missing members.' },
    Approvals:   { title: 'Pending Approvals',           description: 'Manage leave and request approvals for your team.' },
    Performance: { title: 'Performance Analytics',       description: 'See team productivity, trends, and attendance insights.' },
    Calendar:    { title: 'Team Calendar',               description: 'View upcoming events, leaves, and important dates.' },
    Directory:   { title: 'Team Directory',              description: 'Access direct reports, departments, and contact details.' },
    Reports:     { title: 'Reports',                     description: 'Generate payroll, attendance, and team performance reports.' },
  }), []);

  const activeTabDetails = activeTabInfo[activeTab as keyof typeof activeTabInfo] || activeTabInfo.Overview;

  const weeklyHours = useMemo(() => [9, 10.5, 8, 9.5, 11, 7.5, 0], []);

  const attendanceSummary = useMemo(() => [
    { label: 'Today Check In', value: '09:06 AM' },
    { label: 'This Month',     value: '21 / 22' },
    { label: 'Late Marks',     value: '02' },
  ], []);

  const holidays = useMemo(() => [
    { title: 'Independence Day',  date: '15 Aug 2026', type: 'National Holiday' },
    { title: 'Ganesh Chaturthi', date: '27 Aug 2026', type: 'Festival Holiday' },
    { title: 'Gandhi Jayanti',   date: '02 Oct 2026', type: 'National Holiday' },
  ], []);

  const events = useMemo(() => [
    { title: 'Quarterly Town Hall',       date: '24 Apr, 10:30 AM' },
    { title: 'Team Engagement Activity',  date: '26 Apr, 04:00 PM' },
    { title: 'Leadership Connect',        date: '29 Apr, 11:00 AM' },
  ], []);

  // ── Bar chart helper ────────────────────────────────────────────────────────
  const WeeklyBarChart = useCallback(() => (
    <div className="h-56 rounded-xl bg-gradient-to-b from-[#d7f8e3] to-white p-4">
      <div className="relative h-full w-full">
        <div className="absolute inset-x-0 top-3 h-px bg-slate-200" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
        <div className="absolute inset-x-0 bottom-3 h-px bg-slate-200" />
        <div className="absolute inset-y-0 left-0 grid h-full w-full grid-cols-7 gap-3 px-2">
          {weeklyHours.map((hours, index) => (
            <div key={index} className="flex flex-col items-center justify-end gap-3">
              <div className="relative flex h-full w-full items-end justify-center">
                <span className="absolute bottom-0 inline-block h-full w-full rounded-full bg-slate-200/70" />
                <span
                  style={{ height: `${Math.max((hours / 11) * 100, 8)}%` }}
                  className="relative z-10 inline-block w-full rounded-full bg-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-500">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [weeklyHours]);

  // ── Tab content ─────────────────────────────────────────────────────────────
  const renderMainContent = () => {
    switch (activeTab) {

      // ── ATTENDANCE ──────────────────────────────────────────────────────────
      case 'Attendance':
        return (
          <section className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
            <article className="rounded-xl border border-white/10 bg-[#e6f6ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Team Attendance</h2>
                  <p className="mt-1 text-sm text-slate-700">Live attendance and check-in status for your team.</p>
                </div>
                <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">Today</div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {attendanceSummary.map((item) => (
                  <div key={item.label} className="rounded-lg bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                {[['Present', '18'], ['Late', '2'], ['On Leave', '3']].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between text-sm text-slate-600">
                    <span>{label}</span>
                    <span className="font-semibold text-slate-950">{val}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-white/10 bg-[#e9fff2] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Attendance Graph</h2>
                  <p className="mt-1 text-sm text-slate-700">Weekly working hours across the team.</p>
                </div>
                <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">Weekly</div>
              </div>
              <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <WeeklyBarChart />
              </div>
            </article>
          </section>
        );

      // ── APPROVALS ───────────────────────────────────────────────────────────
      case 'Approvals':
        return (
          <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <article className="rounded-xl border border-white/10 bg-[#fff7e3] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Pending Approvals</h2>
                  <p className="mt-1 text-sm text-slate-700">Approve leave requests and team actions.</p>
                </div>
                <span className="rounded-3xl bg-slate-950/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">3 pending</span>
              </div>
              <div className="mt-6 space-y-4">
                {['Leave Request - Anjali', 'Expense Approval - Raj', 'Shift Change - Priya'].map((item, index) => (
                  <div key={index} className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{item}</p>
                        <p className="text-sm text-slate-500">Requested 2 hours ago</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">New</span>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Approve</button>
                      <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#eef6ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <h2 className="text-xl font-semibold">Approval Summary</h2>
              <p className="mt-2 text-sm text-slate-700">Fast actions for your team's pending items.</p>
              <div className="mt-6 space-y-3">
                {[['Leave requests', '2'], ['Expenses', '1']].map(([label, val]) => (
                  <div key={label} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{val}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        );

      // ── PERFORMANCE ─────────────────────────────────────────────────────────
      case 'Performance':
        return (
          <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <article className="rounded-xl border border-white/10 bg-[#f2e8ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Performance Analytics</h2>
                  <p className="mt-1 text-sm text-slate-700">Team productivity and attendance insights.</p>
                </div>
                <span className="rounded-3xl bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">Live</span>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[{ label: 'Productivity', value: '92%' }, { label: 'On-Time', value: '95%' }, { label: 'Utilization', value: '88%' }].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-white p-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-3xl font-bold text-slate-950">{metric.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="h-56 rounded-lg bg-gradient-to-b from-[#f6ecff] to-white" />
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#fff0d8] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <h2 className="text-xl font-semibold">Team Health</h2>
              <p className="mt-1 text-sm text-slate-700">A concise view of your team's recent performance.</p>
              <div className="mt-6 space-y-4">
                {['Top performer: Anjali', 'Low attendance risk: Raj', 'High engagement: Priya'].map((item, index) => (
                  <div key={index} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        );

      // ── CALENDAR ────────────────────────────────────────────────────────────
      case 'Calendar':
        return (
          <section className="grid gap-5 xl:grid-cols-[1.1fr_0.8fr]">
            <article className="rounded-xl border border-white/10 bg-[#ffe6ea] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="mb-5">
                <h2 className="text-xl font-semibold">Attendance Calendar</h2>
                <p className="mt-1 text-sm text-slate-700">Leave and attendance overview.</p>
              </div>
              <AttendanceCalendar />
            </article>

            <article className="rounded-xl border border-white/10 bg-[#fff9dc] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <h2 className="text-xl font-semibold">Upcoming Holidays</h2>
              <p className="mt-1 text-sm text-slate-700">Company holidays and festivals.</p>
              <div className="mt-6 space-y-4">
                {holidays.map((holiday) => (
                  <div key={holiday.title} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-sm text-slate-500">{holiday.date}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950">{holiday.title}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{holiday.type}</p>
                      </div>
                      <span className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Holiday</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        );

      // ── DIRECTORY ───────────────────────────────────────────────────────────
      case 'Directory':
        return (
          <section className="grid gap-5 xl:grid-cols-[1.5fr_0.9fr]">
            <article className="rounded-xl border border-white/10 bg-[#eef9ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Team Directory</h2>
                  <p className="mt-1 text-sm text-slate-700">Quick access to your direct reports.</p>
                </div>
                <span className="rounded-3xl bg-white px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">18 people</span>
              </div>
              <div className="mt-6 space-y-3">
                {['Anjali', 'Raj', 'Priya', 'Sakshi'].map((employee) => (
                  <div key={employee} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950 text-white">{employee[0]}</div>
                        <div>
                          <p className="font-semibold text-slate-950">{employee}</p>
                          <p className="text-sm text-slate-500">Software Engineer</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Online</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-[#f8f5ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
              <h2 className="text-xl font-semibold">Directory Summary</h2>
              <p className="mt-1 text-sm text-slate-700">Your team structure at a glance.</p>
              <div className="mt-6 grid gap-3">
                {[['Total direct reports', '18'], ['Active today', '15']].map(([label, val]) => (
                  <div key={label} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">{val}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
        );

      // ── REPORTS ─────────────────────────────────────────────────────────────
      case 'Reports':
        return (
          <section className="grid gap-5 lg:grid-cols-3">
            {[
              { title: 'Payroll Report',     subtitle: 'Monthly summary',  color: '#f5f1ff' },
              { title: 'Attendance Report',  subtitle: 'Weekly trends',    color: '#e8fff2' },
              { title: 'Performance Report', subtitle: 'Team scorecard',   color: '#fff4e5' },
            ].map((report) => (
              <article key={report.title} className="rounded-xl border border-white/10 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)]" style={{ backgroundColor: report.color }}>
                <h2 className="text-xl font-semibold text-slate-950">{report.title}</h2>
                <p className="mt-2 text-sm text-slate-700">{report.subtitle}</p>
                <button className="mt-6 rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Open</button>
              </article>
            ))}
          </section>
        );

      // ── OVERVIEW (default) ──────────────────────────────────────────────────
      default:
        return (
          <>
            {/* Row 1 */}
            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.95fr]">
              <div className="grid gap-5 md:grid-cols-2">
                {/* Work Session */}
                {/* Work Session */}
<article className="rounded-[18px] border border-white/10 bg-[#e7e0f7] p-7 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">

  {/* HEADER */}
  <div className="flex items-start justify-between gap-4">

    <div>
      <h2 className="text-[22px] font-bold leading-tight text-[#151936]">
        Work Session
      </h2>

      <p className="mt-2 max-w-[220px] text-[15px] leading-7 text-[#475569]">
        Track live work hours after check-in
      </p>
    </div>

    <div
      className={`
        rounded-full
        px-4 py-2
        text-[12px]
        font-semibold
        ${
          checkedIn && !checkedOut
            ? "bg-violet-100 text-violet-700"
            : "bg-white/80 text-[#64748b]"
        }
      `}
    >
      {checkedIn && !checkedOut
        ? "Checked In"
        : checkedOut
        ? "Checked Out"
        : "Not Checked"}
    </div>

  </div>

  {/* TIMER SECTION */}
  <div className="mt-8 flex justify-center">

    <div className="relative flex h-[225px] w-[225px] items-center justify-center">

      {/* OUTER DASHES */}
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, rgba(109,96,209,0.35) 0deg 1deg, transparent 1deg 7deg)",
        }}
      />

      {/* SOFT RING */}
      <div className="absolute inset-[14px] rounded-full bg-[#d8cff7]" />

      {/* PURPLE RING */}
      <div className="absolute inset-[24px] rounded-full border-[12px] border-[#b8acf3]" />

      {/* INNER WHITE */}
      <div className="absolute inset-[42px] rounded-full bg-white shadow-[inset_0_8px_20px_rgba(79,70,229,0.08)]">

        <div className="flex h-full w-full flex-col items-center justify-center text-center">

          {/* TIME */}
          <p className="text-[12px] font-bold tracking-tight text-[#111827]">
            {checkedIn && !checkedOut
              ? formatTime(seconds)
              : "00:00:00"}
          </p>

          {/* STATUS */}
          <p className="mt-2 text-[11px] text-[#64748b]">
            {checkedOut
              ? "Checked Out"
              : checkedIn
              ? "Running Timer"
              : "Ready to Check In"}
          </p>

          {/* CHECK IN / OUT */}
          <div className="mt-5 flex items-center gap-8">

            {/* CHECK IN */}
            <div className="text-center">
              <p className="text-[11px] text-[#64748b]">
                Check In
              </p>

              <p className="mt-1 text-[12px] font-semibold text-[#111827]">
                {checkedIn
                  ? new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>

            {/* DIVIDER */}
            <div className="h-7 w-px bg-[#d7d1f3]" />

            {/* CHECK OUT */}
            <div className="text-center">
              <p className="text-[11px] text-[#64748b]">
                Check Out
              </p>

              <p className="mt-1 text-[12px] font-semibold text-[#111827]">
                {checkedOut
                  ? new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

  {/* BUTTONS */}
  <div className="mt-8 grid grid-cols-2 gap-4">

    <button
      onClick={handleCheckIn}
      disabled={checkedIn && !checkedOut}
      className="
        rounded-[18px]
        bg-[#6356d8]
        px-5 py-3
        text-[15px]
        font-semibold
        text-white
        transition-all duration-200
        hover:bg-[#5547d0]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Check In
    </button>

    <button
      onClick={handleCheckOut}
      disabled={!checkedIn || checkedOut}
      className="
        rounded-[18px]
        bg-[#ddd6f7]
        px-5 py-4
        text-[15px]
        font-semibold
        text-[#5b5b6d]
        transition-all duration-200
        hover:bg-[#d2caf4]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      Check Out
    </button>

  </div>

</article>

                {/* Team Snapshot */}
                <article className="rounded-xl border border-white/10 bg-gradient-to-br from-[#f4f7ff] via-[#dce8ff] to-[#c7d9ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Team Snapshot</h2>
                      <p className="mt-1 text-sm text-slate-700">Quick view of approvals and team availability.</p>
                    </div>
                    <span className="rounded-full bg-slate-950/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">Updated</span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[['18', 'Present'], ['3', 'On Leave'], ['2', 'Late']].map(([val, label]) => (
                      <div key={label} className="rounded-2xl bg-white p-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                        <p className="text-3xl font-bold">{val}</p>
                        <p className="mt-2 text-sm text-slate-700">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-3xl bg-slate-950/5 p-4">
                    <div className="flex items-center justify-between text-sm font-medium text-slate-900">
                      <span>Approval progress</span><span>75%</span>
                    </div>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full w-3/4 rounded-full bg-cyan-500" />
                    </div>
                  </div>
                </article>
              </div>

              {/* Profile */}
              <article className="rounded-xl border border-white/10 bg-[#fff0d8] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Profile</h2>
                    <p className="mt-1 text-sm text-slate-700">Manager profile and shift status</p>
                  </div>
                  <div className="rounded-3xl bg-slate-950/10 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-950">Active</div>
                </div>
                <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white">RK</div>
                    <div>
                      <p className="text-sm text-slate-500">Manager</p>
                      <p className="text-2xl font-bold text-slate-950">Bhargav </p>
                      <p className="text-sm text-slate-400">Engineering Team</p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-3 text-sm text-slate-700"><Briefcase size={18} /><span>Senior Manager</span></div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><MapPin size={18} /><span>Hyderabad</span></div>
                    <div className="flex items-center gap-3 text-sm text-slate-700"><ShieldCheck size={18} /><span>Team size: 18</span></div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-[#fff7e3] p-4 text-sm text-slate-700">
                      <p className="font-semibold">Shift</p>
                      <p className="mt-2 text-base text-slate-950">10:00 AM - 07:00 PM</p>
                    </div>
                    <div className="rounded-lg bg-[#ebf7e9] p-4 text-sm text-slate-700">
                      <p className="font-semibold">Status</p>
                      <p className="mt-2 text-base text-emerald-700">Active</p>
                    </div>
                  </div>
                </div>
              </article>
            </section>

            {/* Row 2 */}
            <section className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
              <article className="rounded-xl border border-white/10 bg-[#e6f6ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Attendance Overview</h2>
                    <p className="mt-1 text-sm text-slate-700">Present today, this month and late marks</p>
                  </div>
                  <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">Present Today</div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {attendanceSummary.map((item) => (
                    <div key={item.label} className="rounded-lg bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                      <p className="text-sm text-slate-500">{item.label}</p>
                      <p className="mt-3 text-2xl font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#e9fff2] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Attendance Graph</h2>
                    <p className="mt-1 text-sm text-slate-700">Weekly working hours trend</p>
                  </div>
                  <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">This Week</div>
                </div>
                <div className="mt-6 rounded-xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                  <WeeklyBarChart />
                </div>
              </article>
            </section>

            {/* Row 3 — Calendar + Holidays + Events */}
            <section className="grid gap-5 xl:grid-cols-[1.1fr_0.8fr_0.8fr]">
              
              {/* Calendar card */}
              <article className="rounded-xl border border-white/10 bg-[#ffe6ea] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="mb-5">
                  <h2 className="text-xl font-semibold">Attendance Calendar</h2>
                  <p className="mt-1 text-sm text-slate-700">Leave and attendance overview</p>
                </div>
                <AttendanceCalendar compact />
              </article>

              {/* Holidays */}
              <article className="rounded-xl border border-white/10 bg-[#fff9dc] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Upcoming Holidays</h2>
                    <p className="mt-1 text-sm text-slate-700">Company holidays and festivals</p>
                  </div>
                  <Bell className="text-slate-950" />
                </div>
                <div className="mt-6 space-y-4">
                  {holidays.map((holiday) => (
                    <div key={holiday.title} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                      <p className="text-sm text-slate-500">{holiday.date}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-950">{holiday.title}</p>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{holiday.type}</p>
                        </div>
                        <span className="rounded-2xl bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Holiday</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              {/* Events */}
              <article className="rounded-xl border border-white/10 bg-[#f2e8ff] p-6 shadow-[0_16px_45px_rgba(0,0,0,0.12)] text-slate-950">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Upcoming Events</h2>
                    <p className="mt-1 text-sm text-slate-700">Meetings, activities and company sessions</p>
                  </div>
                  <div className="rounded-3xl bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-950">3 events</div>
                </div>
                <div className="mt-6 space-y-4">
                  {events.map((event) => (
                    <div key={event.title} className="rounded-3xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                      <p className="font-semibold text-slate-950">{event.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{event.date}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081a4a] via-[#11286d] to-[#05112b] text-slate-100">
      <div className="mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-40px)] grid-cols-[auto_1fr] gap-5">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex flex-col gap-5">
            <header className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-400/80">Manager Dashboard</p>
                  <h1 className="mt-2 text-2xl font-black text-white">{activeTabDetails.title}</h1>
                  <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">{activeTabDetails.description}</p>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/50 px-4 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-base font-bold text-white shadow-lg shadow-cyan-500/20">
                    RK
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">Bhargav</p>
                    <p className="text-xs text-slate-400">Manager</p>
                  </div>
                </div>
              </div>
            </header>

            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
