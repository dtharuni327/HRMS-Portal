import React, { useState } from 'react';
import {
  CalendarRange,
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Video,
} from 'lucide-react';

const initialMeetings = [
  {
    title: 'Client Review Call',
    time: '10:30 AM',
    day: 'Mon, 17 Jun 2026',
    attendees: 'Product, Finance, Client Lead',
    note: 'Status review for milestone 2 and billing confirmation.',
    tone: 'bg-[#edf7ff] border-cyan-100',
  },
  {
    title: 'Demo Session',
    time: '02:00 PM',
    day: 'Wed, 19 Jun 2026',
    attendees: 'Client Team, QA, Design',
    note: 'Walkthrough of deliverables and UI updates for the portal.',
    tone: 'bg-[#fff9ea] border-amber-100',
  },
  {
    title: 'Stakeholder Sync',
    time: '11:00 AM',
    day: 'Fri, 21 Jun 2026',
    attendees: 'PM, Support, Client Sponsor',
    note: 'Decision review and next-phase action list.',
    tone: 'bg-[#eefbf4] border-emerald-100',
  },
];

const highlights = [
  { label: 'Upcoming meetings', value: '3', note: 'Planned meetings in the next 7 days.' },
  { label: 'Demo sessions', value: '1', note: 'Live presentation already scheduled.' },
  { label: 'Meeting notes', value: '5', note: 'Notes prepared and shared with the client team.' },
];

const MeetingSchedule: React.FC = () => {
  const [form, setForm] = useState({ title: '', date: '', time: '', attendees: '' });
  const [meetings, setMeetings] = useState(initialMeetings);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleSchedule = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.date || !form.time) return;

    // Format date into readable string similar to existing entries
    let dayLabel = form.date;
    try {
      const d = new Date(form.date + 'T00:00:00');
      dayLabel = `${d.toLocaleDateString('en-US', { weekday: 'short' })}, ${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' })} ${d.getFullYear()}`;
    } catch (e) {
      // fallback to raw value
    }

    const newMeeting = {
      title: form.title,
      time: form.time,
      day: dayLabel,
      attendees: form.attendees || 'TBD',
      note: '',
      tone: 'bg-[#edf7ff] border-cyan-100',
    };

    if (editIndex !== null && editIndex >= 0) {
      setMeetings((prev) => {
        const next = [...prev];
        next[editIndex] = { ...next[editIndex], ...newMeeting };
        return next;
      });
      alert(`Meeting updated: ${form.title} on ${form.date} at ${form.time}.`);
    } else {
      setMeetings((prev) => [newMeeting, ...prev]);
    }

    alert(`Meeting ${editIndex !== null ? 'updated' : 'scheduled'}: ${form.title} on ${form.date} at ${form.time}. Invite details were sent to the client team.`);
    setForm({ title: '', date: '', time: '', attendees: '' });
    setEditIndex(null);
  };

  const getMeetingStatus = (dayString: string): 'completed' | 'upcoming' => {
    try {
      const meetingDate = new Date(dayString.replace(/,/g, ''));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return meetingDate < today ? 'completed' : 'upcoming';
    } catch (e) {
      return 'upcoming';
    }
  };

  const handleEdit = (index: number) => {
    const m = meetings[index];
    // attempt to parse day back to ISO date for the input
    let iso = '';
    try {
      const parsed = new Date(m.day.replace(/,/g, ''));
      if (!Number.isNaN(parsed.getTime())) iso = parsed.toISOString().slice(0, 10);
    } catch (e) {
      iso = '';
    }
    setForm({ title: m.title, date: iso, time: m.time, attendees: m.attendees });
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownload = () => {
    const header = ['Title', 'Time', 'Date', 'Attendees', 'Notes'];
    const rows = meetings.map((m) => [m.title, m.time, m.day, m.attendees, m.note || '']);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meetings_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-[#e5eefb] bg-[#fff8ef] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Meeting Schedule</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Review upcoming client meetings, review calls, demo sessions, and meeting notes.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This section provides a real schedule view for live client meetings, reviews, demos, and follow-up notes.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><CalendarRange className="h-4 w-4" /> Upcoming meetings</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border border-[#e5eefb] bg-[#edf7ff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)] xl:col-span-2 min-h-screen">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Agenda</p>
              <h4 className="text-[22px] font-bold text-slate-900">Planned sessions</h4>
            </div>
            <Video className="h-5 w-5 text-cyan-700" />
          </div>

          <form onSubmit={handleSchedule} className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Title
                <input value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Client review call" />
              </label>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Date
                <input type="date" value={form.date} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
              </label>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Time
                <input type="time" value={form.time} onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
              </label>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Attendees
                <input value={form.attendees} onChange={(e) => setForm((prev) => ({ ...prev, attendees: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Product, Finance, Client Lead" />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">{editIndex !== null ? 'Update meeting' : 'Schedule meeting'}</button>
              <button type="button" onClick={handleDownload} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Download CSV</button>
            </div>
          </form>

          <div className="space-y-4">
            {meetings.map((meeting, idx) => {
              const status = getMeetingStatus(meeting.day);
              const isCompleted = status === 'completed';
              return (
                <article key={`${meeting.title}-${idx}`} className={`rounded-[24px] border p-5 shadow-sm ${meeting.tone} ${isCompleted ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-[15px] font-semibold text-slate-900">{meeting.title}</p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          isCompleted
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {isCompleted ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] text-slate-700">Time: {meeting.time}</p>
                      <p className="mt-1 text-[13px] text-slate-700">Date: {meeting.day}</p>
                      <p className="mt-1 text-[13px] text-slate-700">Attendees: {meeting.attendees}</p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Notes</p>
                      <p className="mt-1 text-[13px] text-slate-700">{meeting.note}</p>
                      <div className="mt-3 flex justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(idx)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">Edit</button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </article>

      </div>
    </section>
  );
};

export default MeetingSchedule;