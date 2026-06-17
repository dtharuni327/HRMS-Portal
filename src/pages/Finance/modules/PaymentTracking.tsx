import { useMemo, useState, type FC } from 'react';
import { CalendarClock, Search, Wallet } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type PaymentKind = 'Salary' | 'Client' | 'Invoice';
type PaymentStatus = 'Paid' | 'Unpaid' | 'Partially Paid';

interface PaymentRecord {
  id: number;
  title: string;
  kind: PaymentKind;
  amount: number;
  received: number;
  dueDate: string;
  status: PaymentStatus;
  note: string;
}

const initialPayments: PaymentRecord[] = [
  { id: 501, title: 'Monthly Salary Run', kind: 'Salary', amount: 1850000, received: 1850000, dueDate: '05 Jun 2026', status: 'Paid', note: 'Employee payroll disbursed for current cycle' },
  { id: 502, title: 'Client Invoice #A-104', kind: 'Client', amount: 420000, received: 180000, dueDate: '12 Jun 2026', status: 'Partially Paid', note: 'Advance received; balance pending collection' },
  { id: 503, title: 'Invoice #INV-208', kind: 'Invoice', amount: 98000, received: 0, dueDate: '18 Jun 2026', status: 'Unpaid', note: 'Not yet collected from client' },
  { id: 504, title: 'Contractor Settlement', kind: 'Salary', amount: 24000, received: 24000, dueDate: '04 Jun 2026', status: 'Paid', note: 'Completed salary-linked settlement' },
  { id: 505, title: 'Client Invoice #B-311', kind: 'Client', amount: 156000, received: 76000, dueDate: '14 Jun 2026', status: 'Partially Paid', note: 'Second instalment due this week' },
];

const PaymentTrackingModule: FC = () => {
  const [payments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');

  const filteredPayments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return payments.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.kind.toLowerCase().includes(term) ||
        item.note.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [payments, search, statusFilter]);

  const summary = useMemo(() => {
    const totalPaid = payments.filter((item) => item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0);
    const totalOutstanding = payments.filter((item) => item.status !== 'Paid').reduce((sum, item) => sum + (item.amount - item.received), 0);
    const partiallyPaid = payments.filter((item) => item.status === 'Partially Paid').length;
    const unpaid = payments.filter((item) => item.status === 'Unpaid').length;

    return { totalPaid, totalOutstanding, partiallyPaid, unpaid };
  }, [payments]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.totalPaid.toLocaleString('en-IN')}`} label="Salary & Paid Payments" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`₹${summary.totalOutstanding.toLocaleString('en-IN')}`} label="Outstanding Balance" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={`${summary.partiallyPaid}`} label="Partially Paid" color="from-amber-100 to-amber-50 text-slate-900" />
        <StatCard value={`${summary.unpaid}`} label="Unpaid Items" color="from-violet-100 to-violet-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Payment Tracking</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Track salary payments, client payments, paid invoices, unpaid invoices, and partially paid invoices.</h3>
          <p className="mt-3 text-sm text-slate-700">Finance can review the current payment health of payroll, client collections, and invoice settlements in one place.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Salary payments</p>
              <p className="mt-2 text-sm text-slate-700">Payroll-related disbursements and settlement checks are grouped here for quick verification.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Client payments</p>
              <p className="mt-2 text-sm text-slate-700">Collections from client invoices are tracked with partial and outstanding balance visibility.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Paid invoices</p>
              <p className="mt-2 text-sm text-slate-700">Completed invoice records are shown separately to confirm what is already settled.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Partially paid</p>
              <p className="mt-2 text-sm text-slate-700">Balances still due are surfaced immediately so follow-up can start without delay.</p>
            </article>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">The status view keeps salary, client, and invoice payment records aligned with one finance workflow.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Outstanding amounts are calculated from invoice value minus received amount to show real collection risk.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">This makes the finance team aware of both paid and unpaid items at a glance.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Payment queue</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Payment status tracker</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{payments.length} records</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, kind, or note"
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Paid', 'Unpaid', 'Partially Paid'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatusFilter(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${statusFilter === item ? 'bg-emerald-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredPayments.map((item) => {
              const pendingAmount = item.amount - item.received;

              return (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{item.kind}</span>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Unpaid' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">Due: {item.dueDate}</p>
                      <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">₹{item.amount.toLocaleString('en-IN')}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Gross amount</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Received</p>
                      <p className="text-sm font-semibold text-slate-900">₹{item.received.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pending</p>
                      <p className="text-sm font-semibold text-slate-900">₹{pendingAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Coverage</p>
                      <p className="text-sm font-semibold text-slate-900">{Math.round((item.received / item.amount) * 100)}%</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredPayments.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No payment records match the current search or status filter.
            </div>
          )}
        </SparkCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <Wallet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Collected</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.totalPaid.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Amount already settled through salary payouts and completed invoice collections.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <CalendarClock size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Outstanding</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.totalOutstanding.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Current payment gap still waiting for settlement from clients or pending payroll follow-up.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <Wallet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Status mix</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.partiallyPaid} partial • {summary.unpaid} unpaid</h4>
          <p className="mt-2 text-sm text-slate-600">A quick view of the balance between settled and unresolved payment items in the pipeline.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default PaymentTrackingModule;
