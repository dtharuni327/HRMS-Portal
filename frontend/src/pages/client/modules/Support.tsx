import React, { useRef, useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import {
  AlertTriangle,
  CalendarRange,
  CheckCircle2,
  CircleDashed,
  LifeBuoy,
  Plus,
  ShieldCheck,
} from 'lucide-react';

const initialTickets = [
  {
    id: 'TKT-1042',
    title: 'Portal login issue',
    status: 'In Progress',
    priority: 'High',
    updated: '10 Jun 2026',
    note: 'Support team is verifying the SSO token refresh issue.',
    tone: 'bg-[#fff9ea] border-amber-100',
  },
  {
    id: 'TKT-1039',
    title: 'Invoice download error',
    status: 'Resolved',
    priority: 'Medium',
    updated: '08 Jun 2026',
    note: 'Invoice PDF generation was fixed and confirmed.',
    tone: 'bg-[#effbf5] border-emerald-100',
  },
  {
    id: 'TKT-1034',
    title: 'Project report delay',
    status: 'Escalated',
    priority: 'High',
    updated: '06 Jun 2026',
    note: 'The report scheduling issue has been escalated to the delivery lead.',
    tone: 'bg-[#fff4f8] border-pink-100',
  },
];

const supportStats = [
  { label: 'Open tickets', value: '4', note: 'Issues currently being reviewed by the support team.' },
  { label: 'Resolved today', value: '2', note: 'Critical tickets closed within the last 24 hours.' },
  { label: 'Escalations', value: '1', note: 'High-priority issue is under management review.' },
];

const Support: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tickets, setTickets] = useState(initialTickets);
  const [form, setForm] = useState({ subject: '', category: 'Access', priority: 'Medium', details: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.details.trim()) return;

    const ticketId = `TKT-${Date.now().toString().slice(-4)}`;

    setTickets((prev) => [
      {
        id: ticketId,
        title: form.subject,
        status: 'New',
        priority: form.priority,
        updated: 'Just now',
        note: `${form.category} issue: ${form.details}`,
        tone: 'bg-[#edf7ff] border-cyan-100',
      },
      ...prev,
    ]);

    setForm({ subject: '', category: 'Access', priority: 'Medium', details: '' });
    alert(`Support ticket created successfully: ${ticketId}.`);
  };

  const handleSaveDraft = () => {
    alert('Support draft saved. You can continue later.');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.warmCream, boxShadow: '0 18px 45px rgba(148,163,184,0.22)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Support / Ticket Requests</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Raise issues, track support tickets, view ticket status, and escalation updates.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This section gives the client a real support view for ticket updates, priorities, issue tracking, and escalation handling.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><LifeBuoy className="h-4 w-4" /> Support center</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.iceBlue, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Tickets</p>
              <h4 className="text-[22px] font-bold text-slate-900">Current support requests</h4>
            </div>
            <AlertTriangle className="h-5 w-5 text-cyan-700" />
          </div>

          <form onSubmit={handleSubmit} className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Subject
                <input value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0" placeholder="Login issue / invoice error" />
              </label>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Category
                <select value={form.category} onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0">
                  <option>Access</option>
                  <option>Billing</option>
                  <option>Reports</option>
                  <option>Documents</option>
                </select>
              </label>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Priority
                <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <div className="mt-6 flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleAttachClick}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Attach file
                </button>
                {selectedFile ? (
                  <p className="text-[12px] text-emerald-700">Selected: {selectedFile.name}</p>
                ) : (
                  <p className="text-[12px] text-slate-500">No file selected yet.</p>
                )}
              </div>
            </div>
            <label className="mt-3 block text-[12px] uppercase tracking-[0.18em] text-slate-700">Description
              <textarea value={form.details} onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))} rows={4} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0" placeholder="Describe the issue, impact, and preferred resolution." />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"> <Plus className="h-4 w-4" /> Create ticket</button>
              <button type="button" onClick={handleSaveDraft} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Save draft</button>
            </div>
          </form>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <article key={ticket.id} className={`rounded-[24px] border p-5 shadow-sm ${ticket.tone}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">{ticket.id} — {ticket.title}</p>
                    <p className="mt-1 text-[13px] text-slate-700">Priority: {ticket.priority}</p>
                    <p className="mt-1 text-[13px] text-slate-700">Updated: {ticket.updated}</p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Status</p>
                    <p className="text-[14px] font-semibold text-slate-900">{ticket.status}</p>
                    <p className="mt-1 text-[13px] text-slate-700">{ticket.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.softPink, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Support overview</p>
              <h4 className="text-[22px] font-bold text-slate-900">Ticket summary</h4>
            </div>
            <CircleDashed className="h-5 w-5 text-pink-700" />
          </div>

          <div className="grid gap-4">
            {supportStats.map((item) => (
              <article key={item.label} className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
                <p className="text-[12px] uppercase tracking-[0.22em] text-pink-700/90">{item.label}</p>
                <p className="mt-2 text-[24px] font-black text-slate-900">{item.value}</p>
                <p className="mt-2 text-[13px] leading-6 text-slate-700">{item.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-emerald-100 bg-[#effbf5] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" />
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Status updates</p>
                <p className="mt-1 text-[14px] leading-6 text-slate-700">Tickets are updated with current status, priority, and the latest escalation notes.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-amber-100 bg-[#fff9ea] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <CalendarRange className="mt-0.5 h-4 w-4 text-amber-700" />
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-amber-700">Escalation path</p>
                <p className="mt-1 text-[14px] leading-6 text-slate-700">High-priority issues are escalated to the delivery lead for faster follow-up.</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-cyan-100 bg-[#edf7ff] p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-700" />
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-cyan-700">Client visibility</p>
                <p className="mt-1 text-[14px] leading-6 text-slate-700">Clients can monitor the full support lifecycle without needing internal access.</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Support;
