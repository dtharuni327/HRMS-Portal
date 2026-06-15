import { useMemo, useState, type FC } from 'react';
import { AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type AuditCategory = 'All' | 'Salary' | 'Payroll' | 'Finance' | 'Invoice' | 'User';

interface AuditEntry {
  id: number;
  category: Exclude<AuditCategory, 'All'>;
  action: string;
  user: string;
  time: string;
  status: 'Approved' | 'Updated' | 'Rejected' | 'Verified';
  note: string;
}

const initialAuditLogs: AuditEntry[] = [
  { id: 1, category: 'Salary', action: 'Salary edit approved', user: 'Finance Admin', time: '09:30 AM', status: 'Approved', note: 'Updated monthly salary band for employee EMP-102.' },
  { id: 2, category: 'Payroll', action: 'Payroll approval completed', user: 'Payroll Lead', time: '10:10 AM', status: 'Verified', note: 'Payroll cycle approved after validation of deductions and bonuses.' },
  { id: 3, category: 'Finance', action: 'Finance update recorded', user: 'Finance Head', time: '11:05 AM', status: 'Updated', note: 'Updated reimbursement and incentive settlement notes.' },
  { id: 4, category: 'Invoice', action: 'Invoice status revised', user: 'Billing Officer', time: '12:20 PM', status: 'Updated', note: 'Marked invoice INV-208 as partially paid after client confirmation.' },
  { id: 5, category: 'User', action: 'User action logged', user: 'HR Manager', time: '01:15 PM', status: 'Verified', note: 'Reviewed employee payroll report and exported finance summary.' },
  { id: 6, category: 'Payroll', action: 'Payroll rejection review', user: 'Compliance Team', time: '02:40 PM', status: 'Rejected', note: 'Flagged mismatch in deduction entry for one employee.' },
];

const AuditLogs: FC = () => {
  const [category, setCategory] = useState<AuditCategory>('All');
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return initialAuditLogs.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = !term || [item.action, item.user, item.note, item.category].some((value) => value.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const summary = useMemo(() => ({
    total: filteredLogs.length,
    approved: filteredLogs.filter((item) => item.status === 'Approved').length,
    verified: filteredLogs.filter((item) => item.status === 'Verified').length,
    alerts: filteredLogs.filter((item) => item.status === 'Rejected').length,
  }), [filteredLogs]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={summary.total} label="Audit Events" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={summary.approved} label="Approved Changes" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={summary.verified} label="Verified Actions" color="from-violet-100 to-violet-50 text-slate-900" />
        <StatCard value={summary.alerts} label="Compliance Alerts" color="from-rose-100 to-rose-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Audit trail</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Track salary edits, payroll approvals, finance updates, invoice updates, and user actions.</h3>
          <p className="mt-3 text-sm text-slate-700">This section records the finance audit trail for payroll changes, approvals, billing updates, and user activity that may need follow-up or compliance review.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Salary edits</p>
              <p className="mt-2 text-sm text-slate-700">Changes to salary records are captured for review and traceability.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Payroll approvals</p>
              <p className="mt-2 text-sm text-slate-700">Payroll cycle actions and validation outcomes are logged to support approvals.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Finance updates</p>
              <p className="mt-2 text-sm text-slate-700">Finance changes, reimbursements, incentives, and deductions are added to the history.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Invoice updates</p>
              <p className="mt-2 text-sm text-slate-700">Invoice status changes and collection updates are tracked for accountability.</p>
            </article>
          </div>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Filter & search</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Audit filters</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Live</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Salary', 'Payroll', 'Finance', 'Invoice', 'User'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${category === item ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="mt-4 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-600 shadow-sm">
            <Search size={14} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search action, user, or note"
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/90 p-4 text-sm text-slate-700">
            Showing <strong>{summary.total}</strong> audit entries for the current filter. Rejected entries are highlighted for compliance review.
          </div>
        </SparkCard>
      </div>

      <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Recent activity</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">Audit log timeline</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            <ShieldCheck size={13} />
            Secure traceability
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {filteredLogs.map((entry) => (
            <article key={entry.id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{entry.category}</span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${entry.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : entry.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-900">{entry.action}</p>
                  <p className="text-sm text-slate-600">{entry.note}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>{entry.user}</p>
                  <p className="mt-1">{entry.time}</p>
                </div>
              </div>
            </article>
          ))}

          {filteredLogs.length === 0 && (
            <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No audit entries match the current filter.
            </div>
          )}
        </div>
      </SparkCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <ShieldCheck size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Status</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Approved & Verified</h4>
          <p className="mt-2 text-sm text-slate-600">The log highlights approved and verified actions for finance review and accountability.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-rose-700">
            <AlertCircle size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Compliance</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Rejection flags</h4>
          <p className="mt-2 text-sm text-slate-600">Rejected entries remain visible so finance and HR can review mismatches and exceptions quickly.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <ShieldCheck size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Traceability</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">User action history</h4>
          <p className="mt-2 text-sm text-slate-600">Every finance change is tied to a user, timestamp, and action summary for audit review.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default AuditLogs;
