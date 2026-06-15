import { useMemo, useState, type FC } from 'react';
import { AlertTriangle, BadgeDollarSign, Search, ShieldCheck, Wallet } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type DeductionType = 'Loan' | 'Leave' | 'Late' | 'Advance Recovery' | 'Other';
type DeductionStatus = 'Pending' | 'Approved' | 'Processed';

interface DeductionEntry {
  id: number;
  employee: string;
  department: string;
  type: DeductionType;
  amount: number;
  month: string;
  reason: string;
  status: DeductionStatus;
}

const initialDeductions: DeductionEntry[] = [
  { id: 301, employee: 'Asha Rao', department: 'HR', type: 'Loan', amount: 4200, month: 'Jun 2026', reason: 'EMI deduction for personal loan recovery', status: 'Pending' },
  { id: 302, employee: 'Nikhil Sharma', department: 'Sales', type: 'Leave', amount: 6800, month: 'Jun 2026', reason: 'Unauthorized leave days applied in payroll', status: 'Approved' },
  { id: 303, employee: 'Priya Menon', department: 'IT', type: 'Late', amount: 1200, month: 'May 2026', reason: 'Late attendance adjustment for 4 days', status: 'Processed' },
  { id: 304, employee: 'Ravi Kumar', department: 'Operations', type: 'Advance Recovery', amount: 9500, month: 'Jun 2026', reason: 'Advance salary recovery against current month', status: 'Pending' },
  { id: 305, employee: 'Sneha Verma', department: 'Finance', type: 'Other', amount: 2100, month: 'Jun 2026', reason: 'Professional development fee deduction', status: 'Approved' },
];

const DeductionsManagement: FC = () => {
  const [deductions, setDeductions] = useState(initialDeductions);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | DeductionType>('All');

  const filteredDeductions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return deductions.filter((item) => {
      const matchesType = filter === 'All' || item.type === filter;
      const matchesSearch =
        !term ||
        item.employee.toLowerCase().includes(term) ||
        item.department.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term) ||
        item.reason.toLowerCase().includes(term);

      return matchesType && matchesSearch;
    });
  }, [deductions, filter, search]);

  const summary = useMemo(() => {
    const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    const pending = deductions.filter((item) => item.status === 'Pending').length;
    const processed = deductions.filter((item) => item.status === 'Processed').length;
    const categories = new Set(deductions.map((item) => item.type)).size;

    return { totalDeductions, pending, processed, categories };
  }, [deductions]);

  const updateStatus = (id: number, status: DeductionStatus) => {
    setDeductions((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.totalDeductions.toLocaleString('en-IN')}`} label="Total Deductions" color="from-rose-100 to-rose-50 text-slate-900" />
        <StatCard value={`${summary.categories}`} label="Deduction Categories" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={`${summary.pending}`} label="Pending Review" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`${summary.processed}`} label="Processed This Month" color="from-amber-100 to-amber-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <SparkCard className="rounded-[2rem] border border-rose-100 bg-[#fff5f5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-rose-700">Deductions Management</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Loan deduction, leave deduction, late deduction, advance salary recovery, and other deductions.</h3>
          <p className="mt-3 text-sm text-slate-700">Finance can review deduction reasons, confirm payroll impact, and keep exceptions visible before the disbursement cycle closes.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-rose-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-700">Loan deduction</p>
              <p className="mt-2 text-sm text-slate-700">EMI and instalment-based recovery entries are reviewed for accuracy before approval.</p>
            </article>
            <article className="rounded-2xl border border-rose-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-700">Leave deduction</p>
              <p className="mt-2 text-sm text-slate-700">Unpaid leave and attendance-based deductions are checked against leave records.</p>
            </article>
            <article className="rounded-2xl border border-rose-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-700">Late deduction</p>
              <p className="mt-2 text-sm text-slate-700">Attendance delays and shortwork adjustments are reflected in payroll only after review.</p>
            </article>
            <article className="rounded-2xl border border-rose-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-rose-700">Advance recovery</p>
              <p className="mt-2 text-sm text-slate-700">Salary advances are tracked to avoid over-deduction in the same pay cycle.</p>
            </article>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-rose-100 bg-white/95 p-3">The deduction queue shows employee, department, reason, and current status in one view.</li>
            <li className="rounded-2xl border border-rose-100 bg-white/95 p-3">Finance can confirm, approve, or mark a deduction as processed after the review is complete.</li>
            <li className="rounded-2xl border border-rose-100 bg-white/95 p-3">This keeps the payroll team aligned on every deduction before salary release.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Deduction list</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Current deduction entries</h3>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700">{deductions.length} items</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee, reason, or category"
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Loan', 'Leave', 'Late', 'Advance Recovery', 'Other'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${filter === item ? 'bg-rose-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredDeductions.map((item) => (
              <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.type}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.department}</span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">{item.employee}</p>
                    <p className="text-xs text-slate-500">{item.month}</p>
                    <p className="mt-2 text-sm text-slate-600">{item.reason}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Amount</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
                  <span className={`rounded-full px-3 py-1 ${item.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Approved' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, 'Approved')}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <ShieldCheck size={13} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(item.id, 'Processed')}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <BadgeDollarSign size={13} /> Mark processed
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredDeductions.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No deductions match the current search or filter.
            </div>
          )}
        </SparkCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-rose-700">
            <Wallet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Payroll impact</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.totalDeductions.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Total deduction value currently under finance review for payroll processing.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <AlertTriangle size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Exceptions</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.pending} entries</h4>
          <p className="mt-2 text-sm text-slate-600">These items still need final approval before the salary cycle is completed.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <ShieldCheck size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Processed</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.processed} completed</h4>
          <p className="mt-2 text-sm text-slate-600">Deductions already finalized for this month’s payroll run.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default DeductionsManagement;
