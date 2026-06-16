import { useMemo, useState, type FC } from 'react';
import { BadgeCheck, Gift, Search, Sparkles, TrendingUp } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type BonusCategory = 'Performance' | 'Festival' | 'Incentive' | 'Special Payment';
type BonusStatus = 'Draft' | 'Approved' | 'Paid';

interface BonusItem {
  id: number;
  employee: string;
  department: string;
  category: BonusCategory;
  amount: number;
  month: string;
  note: string;
  status: BonusStatus;
}

const initialBonuses: BonusItem[] = [
  { id: 201, employee: 'Asha Rao', department: 'HR', category: 'Performance', amount: 15000, month: 'Jun 2026', note: 'Exceeding quarterly KPI target', status: 'Approved' },
  { id: 202, employee: 'Nikhil Sharma', department: 'Sales', category: 'Festival', amount: 8000, month: 'Jun 2026', note: 'Annual festival appreciation payout', status: 'Draft' },
  { id: 203, employee: 'Priya Menon', department: 'IT', category: 'Incentive', amount: 12000, month: 'May 2026', note: 'Project delivery incentive', status: 'Paid' },
  { id: 204, employee: 'Ravi Kumar', department: 'Operations', category: 'Special Payment', amount: 5000, month: 'Jun 2026', note: 'Critical support reward', status: 'Approved' },
  { id: 205, employee: 'Sneha Verma', department: 'Finance', category: 'Performance', amount: 18000, month: 'Jun 2026', note: 'Top performer recognition', status: 'Draft' },
];

const BonusIncentives: FC = () => {
  const [bonuses, setBonuses] = useState(initialBonuses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'All' | BonusCategory>('All');

  const filteredBonuses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return bonuses.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch =
        !term ||
        item.employee.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.note.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [bonuses, category, search]);

  const summary = useMemo(() => {
    const totalBudget = bonuses.reduce((sum, item) => sum + item.amount, 0);
    const approved = bonuses.filter((item) => item.status === 'Approved').length;
    const paid = bonuses.filter((item) => item.status === 'Paid').length;
    const eligible = new Set(bonuses.map((item) => item.employee)).size;

    return { totalBudget, approved, paid, eligible };
  }, [bonuses]);

  const updateStatus = (id: number, status: BonusStatus) => {
    setBonuses((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.totalBudget.toLocaleString('en-IN')}`} label="Bonus Budget" color="from-violet-100 to-violet-50 text-slate-900" />
        <StatCard value={`${summary.eligible}`} label="Eligible Employees" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`${summary.approved}`} label="Approved Payouts" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={`${summary.paid}`} label="Already Paid" color="from-amber-100 to-amber-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <SparkCard className="rounded-[2rem] border border-violet-100 bg-[#f5f3ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-violet-700">Bonus & Incentives</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Performance bonus, festival bonus, incentives, and special payments in one place.</h3>
          <p className="mt-3 text-sm text-slate-700">Finance can plan payouts, review special recognition amounts, and confirm which rewards are already approved or paid.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-violet-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-violet-700">Performance bonus</p>
              <p className="mt-2 text-sm text-slate-700">Rewards tied to KPI success, quarterly targets, and quality outcomes.</p>
            </article>
            <article className="rounded-2xl border border-violet-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-violet-700">Festival bonus</p>
              <p className="mt-2 text-sm text-slate-700">Seasonal appreciation payouts and celebration-linked employee benefits.</p>
            </article>
            <article className="rounded-2xl border border-violet-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-violet-700">Incentives</p>
              <p className="mt-2 text-sm text-slate-700">Project, sales, and milestone incentives that support performance goals.</p>
            </article>
            <article className="rounded-2xl border border-violet-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-violet-700">Special payments</p>
              <p className="mt-2 text-sm text-slate-700">One-time recognition or urgent support awards for critical contributions.</p>
            </article>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-violet-100 bg-white/95 p-3">The payout queue shows category, amount, and approval state for each record.</li>
            <li className="rounded-2xl border border-violet-100 bg-white/95 p-3">Finance can move items from draft to approved and confirm when settlement is complete.</li>
            <li className="rounded-2xl border border-violet-100 bg-white/95 p-4">This view keeps bonus planning transparent across the finance team.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Payout queue</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Bonus and incentives tracker</h3>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violet-700">{bonuses.length} items</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee, category, or note"
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Performance', 'Festival', 'Incentive', 'Special Payment'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${category === item ? 'bg-violet-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredBonuses.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.category}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.department}</span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">{item.employee}</p>
                    <p className="text-xs text-slate-500">{item.month}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Amount</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
                  <span className={`rounded-full px-3 py-1 ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Approved' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, 'Approved')}
                    className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-50"
                  >
                    <BadgeCheck size={13} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, 'Paid')}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <Gift size={13} /> Mark paid
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredBonuses.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No bonus or incentive items match the current search or category.
            </div>
          )}
        </SparkCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-violet-700">
            <TrendingUp size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Budget</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.totalBudget.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Current planned amounts across performance, festival, incentive, and special payment items.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <Gift size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Recognition</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.approved} approved</h4>
          <p className="mt-2 text-sm text-slate-600">Items ready for payout decisions and finance sign-off.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <Sparkles size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Paid</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.paid} completed</h4>
          <p className="mt-2 text-sm text-slate-600">Rewards already settled so the finance team can monitor outstanding payouts.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default BonusIncentives;
