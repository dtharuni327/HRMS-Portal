import { useMemo, useState, type FC } from 'react';
import { CalendarClock, CheckCircle2, FileText, Search, Wallet } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue';

interface InvoiceRecord {
  id: number;
  client: string;
  project: string;
  amount: number;
  issuedOn: string;
  dueDate: string;
  status: InvoiceStatus;
}

const initialInvoices: InvoiceRecord[] = [
  { id: 401, client: 'Aster Labs', project: 'HRMS rollout', amount: 185000, issuedOn: '02 Jun 2026', dueDate: '16 Jun 2026', status: 'Sent' },
  { id: 402, client: 'BluePeak Tech', project: 'Payroll integration', amount: 92000, issuedOn: '05 Jun 2026', dueDate: '12 Jun 2026', status: 'Overdue' },
  { id: 403, client: 'Northstar Retail', project: 'Attendance module', amount: 76000, issuedOn: '08 Jun 2026', dueDate: '20 Jun 2026', status: 'Draft' },
  { id: 404, client: 'Helio Health', project: 'Finance dashboard', amount: 132000, issuedOn: '10 Jun 2026', dueDate: '18 Jun 2026', status: 'Paid' },
  { id: 405, client: 'Summit Consulting', project: 'Analytics support', amount: 108000, issuedOn: '11 Jun 2026', dueDate: '22 Jun 2026', status: 'Sent' },
];

const InvoiceManagement: FC = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | InvoiceStatus>('All');

  const filteredInvoices = useMemo(() => {
    const term = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesStatus = statusFilter === 'All' || invoice.status === statusFilter;
      const matchesSearch =
        !term ||
        invoice.client.toLowerCase().includes(term) ||
        invoice.project.toLowerCase().includes(term) ||
        invoice.status.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [invoices, search, statusFilter]);

  const summary = useMemo(() => {
    const openValue = invoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
    const pending = invoices.filter((invoice) => invoice.status === 'Sent' || invoice.status === 'Overdue').length;
    const overdue = invoices.filter((invoice) => invoice.status === 'Overdue').length;
    const paid = invoices.filter((invoice) => invoice.status === 'Paid').length;

    return { openValue, pending, overdue, paid };
  }, [invoices]);

  const updateStatus = (id: number, status: InvoiceStatus) => {
    setInvoices((prev) => prev.map((invoice) => (invoice.id === id ? { ...invoice, status } : invoice)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.openValue.toLocaleString('en-IN')}`} label="Open Invoices" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={`${summary.pending}`} label="Pending Payments" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`${summary.overdue}`} label="Overdue" color="from-amber-100 to-amber-50 text-slate-900" />
        <StatCard value={`${summary.paid}`} label="Paid This Month" color="from-violet-100 to-violet-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <SparkCard className="rounded-[2rem] border border-sky-100 bg-[#edf5ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Invoice Management</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Create and track client invoices, invoice status, due dates, and pending payments.</h3>
          <p className="mt-3 text-sm text-slate-700">Finance can review invoice stages, monitor overdue balances, and keep billing follow-up simple for each client account.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-sky-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-800">Invoice status</p>
              <p className="mt-2 text-sm text-slate-700">Draft, sent, paid, and overdue states are updated directly in the finance queue.</p>
            </article>
            <article className="rounded-2xl border border-sky-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-800">Due dates</p>
              <p className="mt-2 text-sm text-slate-700">Due dates highlight which invoices need immediate attention and collection follow-up.</p>
            </article>
            <article className="rounded-2xl border border-sky-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-800">Client billing</p>
              <p className="mt-2 text-sm text-slate-700">Each invoice is tied to a client project so finance can track the billing context clearly.</p>
            </article>
            <article className="rounded-2xl border border-sky-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-800">Pending payments</p>
              <p className="mt-2 text-sm text-slate-700">The queue keeps uncollected invoices visible so follow-up does not get missed.</p>
            </article>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-sky-100 bg-white/95 p-3">Invoice amount, status, and due date are shown together for quick finance decisions.</li>
            <li className="rounded-2xl border border-sky-100 bg-white/95 p-3">The status buttons allow the team to move invoices from draft to sent and then to paid.</li>
            <li className="rounded-2xl border border-sky-100 bg-white/95 p-3">Overdue invoices are highlighted so collection follow-up stays on schedule.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Invoice queue</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Client billing overview</h3>
            </div>
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">{invoices.length} invoices</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search client or project"
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Draft', 'Sent', 'Paid', 'Overdue'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatusFilter(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${statusFilter === item ? 'bg-sky-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:text-sky-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredInvoices.map((invoice) => (
              <article key={invoice.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{invoice.client}</p>
                    <p className="text-xs text-slate-500">Invoice #{invoice.id} • {invoice.project}</p>
                    <p className="mt-2 text-sm text-slate-600">Issued: {invoice.issuedOn} • Due: {invoice.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{invoice.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Amount</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
                  <span className={`rounded-full px-3 py-1 ${invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : invoice.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : invoice.status === 'Sent' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                    {invoice.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(invoice.id, 'Sent')}
                    className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                  >
                    <FileText size={13} /> Send
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(invoice.id, 'Paid')}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 size={13} /> Mark paid
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(invoice.id, 'Overdue')}
                    className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                  >
                    <CalendarClock size={13} /> Mark overdue
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No invoices match the current search or status filter.
            </div>
          )}
        </SparkCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <FileText size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Billing</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.openValue.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Total invoice value currently open for collection and client follow-up.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <CalendarClock size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Due soon</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.pending} pending</h4>
          <p className="mt-2 text-sm text-slate-600">Invoices that are awaiting payment or still need collection attention.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <Wallet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Collected</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.paid} paid</h4>
          <p className="mt-2 text-sm text-slate-600">Invoices successfully settled this month and removed from the collection queue.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default InvoiceManagement;
