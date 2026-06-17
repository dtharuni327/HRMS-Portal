import { useMemo, useState, type FC } from 'react';
import { Bell, CalendarDays, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

interface NotificationItem {
  id: number;
  type: 'Approval' | 'Salary' | 'Invoice' | 'Reimbursement';
  title: string;
  detail: string;
  time: string;
  priority: 'High' | 'Medium' | 'Low';
}

const initialNotifications: NotificationItem[] = [
  { id: 1, type: 'Approval', title: 'Pending reimbursement approval', detail: 'Travel claim for Rahul Sharma requires finance approval before settlement.', time: '10 mins ago', priority: 'High' },
  { id: 2, type: 'Salary', title: 'Salary processing reminder', detail: 'Salary cycle for current month is ready for final review and release.', time: '25 mins ago', priority: 'High' },
  { id: 3, type: 'Invoice', title: 'Invoice alert', detail: 'Invoice INV-208 is due today and still has an unpaid balance.', time: '45 mins ago', priority: 'Medium' },
  { id: 4, type: 'Reimbursement', title: 'Reimbursement reminder', detail: 'Food and internet claims are pending for 3 employees in Finance review.', time: '1 hr ago', priority: 'Medium' },
  { id: 5, type: 'Approval', title: 'Bonus approval pending', detail: 'Festival incentive approvals need final finance sign-off.', time: '2 hrs ago', priority: 'Low' },
];

const Notifications: FC = () => {
  const [filter, setFilter] = useState<'All' | NotificationItem['type']>('All');

  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return initialNotifications;
    return initialNotifications.filter((item) => item.type === filter);
  }, [filter]);

  const summary = useMemo(() => ({
    approvals: initialNotifications.filter((item) => item.type === 'Approval').length,
    urgent: initialNotifications.filter((item) => item.priority === 'High').length,
    today: initialNotifications.length,
    nextReview: '09:30 AM',
  }), []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={summary.approvals} label="Pending Approvals" color="from-amber-100 to-amber-50 text-slate-900" />
        <StatCard value={summary.urgent} label="High Priority" color="from-rose-100 to-rose-50 text-slate-900" />
        <StatCard value={summary.today} label="Today Alerts" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={summary.nextReview} label="Next Review" color="from-violet-100 to-violet-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-amber-100 bg-[#fffaf0] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-700">Notifications</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Pending approvals, salary processing reminders, invoice alerts, and reimbursement reminders.</h3>
          <p className="mt-3 text-sm text-slate-700">This section surfaces finance-critical reminders so approvals, salary runs, invoices, and reimbursement follow-up stay visible for the Finance team.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-amber-100 bg-white/95 p-4"> 
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Approvals</p>
              <p className="mt-2 text-sm text-slate-700">Pending reimbursement, bonus, and settlement approvals are tracked in one place.</p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Salary reminders</p>
              <p className="mt-2 text-sm text-slate-700">Processing reminders help the finance team complete salary releases on time.</p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Invoice alerts</p>
              <p className="mt-2 text-sm text-slate-700">Due invoices and partially paid records are surfaced as follow-up alerts.</p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Reimbursements</p>
              <p className="mt-2 text-sm text-slate-700">Travel, food, and internet claim reminders keep reimbursement backlog visible.</p>
            </article>
          </div>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Filter</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Notification filters</h3>
            </div>
            <Bell size={16} className="text-amber-600" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Approval', 'Salary', 'Invoice', 'Reimbursement'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${filter === item ? 'bg-amber-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-amber-200 hover:text-amber-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-3 text-sm text-amber-900">
            Showing <strong>{filteredNotifications.length}</strong> finance alerts for the selected category.
          </div>
        </SparkCard>
      </div>

      <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Alert queue</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">Finance notifications</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            <Sparkles size={13} />
            Priority view
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {filteredNotifications.map((item) => (
            <article key={item.id} className="rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.type}</span>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${item.priority === 'High' ? 'bg-rose-100 text-rose-700' : item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p className="inline-flex items-center gap-1"><Clock3 size={13} /> {item.time}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-emerald-700"><CheckCircle2 size={13} /> Ready for review</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SparkCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <CalendarDays size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Reminders</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Approval queue</h4>
          <p className="mt-2 text-sm text-slate-600">Finance reminders keep pending approvals and tasks visible before deadlines are missed.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <Bell size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Alerts</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Due invoice notices</h4>
          <p className="mt-2 text-sm text-slate-600">Invoice alerts highlight unsettled balances and urgent follow-up items for the Finance team.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Status</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Ready for review</h4>
          <p className="mt-2 text-sm text-slate-600">Reimbursement and salary reminders are organized for quick finance review and action.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default Notifications;
