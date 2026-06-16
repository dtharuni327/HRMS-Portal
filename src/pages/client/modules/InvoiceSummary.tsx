import React, { useMemo, useState } from 'react';
import { BadgeDollarSign, CalendarRange, CheckCircle2, FileText, Wallet } from 'lucide-react';

type Invoice = {
  number: string;
  amount: string;
  dueDate: string;
  status: 'Paid'|'Unpaid'|'Pending'|string;
  balance: string;
  client?: string;
};

const initialInvoices: Invoice[] = [
  { number: 'INV-2026-001', amount: 'Rs. 1,25,000', dueDate: '18 Jun 2026', status: 'Paid', balance: 'Rs. 0' },
  { number: 'INV-2026-002', amount: 'Rs. 84,500', dueDate: '25 Jun 2026', status: 'Unpaid', balance: 'Rs. 84,500' },
  { number: 'INV-2026-003', amount: 'Rs. 1,10,000', dueDate: '02 Jul 2026', status: 'Pending', balance: 'Rs. 1,10,000' },
];

const summaryCards = [
  { label: 'Total Invoiced', value: 'Rs. 3,19,500', note: 'Amount raised across the current project cycle.' },
  { label: 'Outstanding', value: 'Rs. 1,94,500', note: 'Pending amount still to be collected.' },
  { label: 'Paid This Month', value: 'Rs. 1,25,000', note: 'Settled invoice amount for the current month.' },
];

function parseAmount(str?: string) {
  if (!str) return 0;
  // remove non-digits
  const digits = str.replace(/[^0-9]/g, '');
  return Number(digits) || 0;
}

function formatCurrency(n: number) {
  return 'Rs. ' + n.toLocaleString('en-IN');
}

function daysFromNow(dateStr: string) {
  const d = new Date(dateStr);
  const today = new Date();
  // clear times
  d.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  const diff = Math.ceil((d.getTime() - today.getTime()) / (1000*60*60*24));
  return diff;
}

type Props = {
  invoices?: Invoice[];
};

const InvoiceSummary: React.FC<Props> = ({ invoices: propInvoices }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All'|'Paid'|'Unpaid'|'Pending'|'Overdue'|'DueThisWeek'>('All');
  const [quickFilter, setQuickFilter] = useState<'All'|'Paid'|'Unpaid'|'Overdue'|'DueThisWeek'>('All');

  const handleDownloadPdf = (invoiceNumber?: string) => {
    alert(`Invoice PDF download started${invoiceNumber?': '+invoiceNumber:''}`);
  };
  const handleExportSummary = () => {
    alert('Billing summary exported successfully.');
  };
  // use prop invoices when provided, otherwise use local initial data
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>(propInvoices ?? initialInvoices);

  // update when props change
  React.useEffect(() => {
    if (propInvoices) setLocalInvoices(propInvoices);
  }, [propInvoices]);

  const totals = useMemo(() => {
    const totalCount = localInvoices.length;
    const totalInvoiced = localInvoices.reduce((s, inv) => s + parseAmount(inv.amount), 0);
    const paid = localInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + parseAmount(i.amount), 0);
    const unpaid = localInvoices.filter(i => i.status === 'Unpaid' || i.status === 'Pending').reduce((s, i) => s + parseAmount(i.balance), 0);
    const collectionRate = totalInvoiced ? Math.round((paid/totalInvoiced)*100) : 0;
    return { totalCount, totalInvoiced, paid, unpaid, collectionRate };
  }, [localInvoices]);

  const filteredInvoices = useMemo(() => {
    return localInvoices.filter((invoice) => {
      // quick filters
      if (quickFilter === 'Paid' && invoice.status !== 'Paid') return false;
      if (quickFilter === 'Unpaid' && invoice.status === 'Paid') return false;
      if (quickFilter === 'Overdue') {
        const days = daysFromNow(invoice.dueDate);
        if (days >= 0) return false;
      }
      if (quickFilter === 'DueThisWeek') {
        const days = daysFromNow(invoice.dueDate);
        if (days < 0 || days > 7) return false;
      }

      const matchesSearch = invoice.number.toLowerCase().includes(search.toLowerCase()) || invoice.amount.toLowerCase().includes(search.toLowerCase()) || (invoice.client || '').toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [search, quickFilter, localInvoices]);

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-[#e5eefb] bg-[#fff9ea] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Invoice Summary</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Review invoice numbers, amounts, due dates, and outstanding balances.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This section highlights the client billing status with a simple overview of paid, unpaid, and pending invoices.</p>
          </div>

            <div className="grid grid-cols-4 gap-3">
            <div className="rounded-[12px] bg-white p-4 shadow-sm text-center min-h-[72px] flex flex-col justify-center">
              <p className="text-sm text-slate-400">Total</p>
              <p className="text-2xl font-bold text-slate-900">{totals.totalCount}</p>
            </div>
            <div className="rounded-[12px] bg-white p-4 shadow-sm text-center min-h-[72px] flex flex-col justify-center">
              <p className="text-sm text-slate-400">Paid</p>
              <p className="text-2xl font-bold text-emerald-800">{formatCurrency(totals.paid)}</p>
            </div>
            <div className="rounded-[12px] bg-white p-4 shadow-sm text-center min-h-[72px] flex flex-col justify-center">
              <p className="text-sm text-slate-400">Unpaid</p>
              <p className="text-2xl font-bold text-rose-700">{formatCurrency(totals.unpaid)}</p>
            </div>
            <div className="rounded-[12px] bg-white p-4 shadow-sm text-center min-h-[72px] flex flex-col justify-center">
              <p className="text-sm text-slate-400">Collection Rate</p>
              <p className="text-2xl font-bold text-slate-900">{totals.collectionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr]">
        <article className="rounded-[30px] border border-[#e5eefb] bg-[#edf7ff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Invoices</p>
              <h4 className="text-[22px] font-bold text-slate-900">Invoice list</h4>
            </div>
            <FileText className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Search invoice number, amount, or client..." />
              <div className="flex gap-2">
                {['All','Paid','Unpaid','Overdue','DueThisWeek'].map((k) => (
                  <button key={k} onClick={() => setQuickFilter(k as any)} className={`rounded-2xl px-3 py-1 text-sm ${quickFilter===k?'bg-slate-900 text-white':'bg-white text-slate-700 border border-slate-200'}`}>
                    {k === 'DueThisWeek' ? 'Due This Week' : k}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={() => handleDownloadPdf()} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Download PDF</button>
              <button type="button" onClick={handleExportSummary} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export summary</button>
            </div>
          </div>

            <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-800">
              <thead>
                <tr className="text-sm text-slate-700">
                  <th className="py-3">Invoice #</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Due</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Outstanding</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">No invoices found for the current filters.</td>
                  </tr>
                )}
                {filteredInvoices.map((invoice) => {
                  const amt = parseAmount(invoice.amount);
                  const bal = parseAmount(invoice.balance);
                  const days = daysFromNow(invoice.dueDate);
                  const statusBadge = invoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : (days < 0 ? 'bg-rose-100 text-rose-700' : (invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'));
                  return (
                    <tr key={invoice.number} className="align-top bg-transparent">
                      <td className="py-4 font-semibold text-slate-900">{invoice.number}</td>
                      <td className="py-4 text-slate-900">{formatCurrency(amt)}</td>
                      <td className="py-4">
                        <div className="text-sm text-slate-800">{invoice.dueDate}</div>
                        <div className="text-xs text-slate-500">{days < 0 ? `Overdue by ${Math.abs(days)}d` : `Due in ${days}d`}</div>
                      </td>
                      <td className="py-4"><span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>{invoice.status}</span></td>
                      <td className="py-4 text-slate-900">{formatCurrency(bal)}</td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button onClick={() => alert(`View ${invoice.number}`)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800">View</button>
                          <button onClick={() => handleDownloadPdf(invoice.number)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800">Download</button>
                          <button onClick={() => alert(`Edit ${invoice.number}`)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800">Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  );
};

export default InvoiceSummary;
