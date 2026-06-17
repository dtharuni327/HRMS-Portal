import React, { useMemo, useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import { BadgeDollarSign, ReceiptText, Wallet } from 'lucide-react';

const payments = [
  {
    receipt: 'RCPT-2026-104',
    date: '10 Jun 2026',
    amount: 'Rs. 45,000',
    status: 'Confirmed',
    method: 'UPI / Razorpay',
    note: 'Milestone 2 payment received and reconciled.',
    tone: 'bg-[#effbf5] border-emerald-100',
  },
  {
    receipt: 'RCPT-2026-103',
    date: '04 Jun 2026',
    amount: 'Rs. 18,500',
    status: 'Pending',
    method: 'Bank Transfer',
    note: 'Awaiting approval from finance operations.',
    tone: 'bg-[#fff9ea] border-amber-100',
  },
  {
    receipt: 'RCPT-2026-102',
    date: '29 May 2026',
    amount: 'Rs. 32,000',
    status: 'Confirmed',
    method: 'Card Payment',
    note: 'Receipt shared to the client portal.',
    tone: 'bg-[#edf7ff] border-cyan-100',
  },
];


const PaymentHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All'|'Confirmed'|'Pending'>('All');
  const [timeFilter, setTimeFilter] = useState<'All'|'ThisMonth'|'LastMonth'>('All');
  // download counts removed — not used currently

  const handleDownloadReceipts = () => {
    alert('Receipt download started for the selected payment records.');
  };

  const handleRequestStatement = () => {
    alert('Statement request sent to the finance team.');
  };

  const parseAmount = (amt: string) => {
    // expecting format like 'Rs. 18,500' or 'Rs. 45000'
    return Number(amt.replace(/[Rs.\s,]/g, '')) || 0;
  };

  const formatCurrency = (v: number) => `Rs. ${v.toLocaleString('en-IN')}`;

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesSearch = [item.receipt, item.amount, item.method, item.date, item.note]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesStatus || !matchesSearch) return false;

      if (timeFilter === 'ThisMonth') {
        const d = new Date(item.date);
        const now = new Date();
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
      }

      if (timeFilter === 'LastMonth') {
        const d = new Date(item.date);
        const now = new Date();
        const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        if (d.getMonth() !== lm.getMonth() || d.getFullYear() !== lm.getFullYear()) return false;
      }

      return true;
    });
  }, [search, statusFilter, timeFilter]);

  const groupedByMonth = useMemo(() => {
    const map: Record<string, typeof payments> = {};
    payments.forEach((p) => {
      const d = new Date(p.date);
      const key = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, []);

  const totals = useMemo(() => {
    const totalPaid = payments.reduce((acc, p) => p.status === 'Confirmed' ? acc + parseAmount(p.amount) : acc, 0);
    const pending = payments.reduce((acc, p) => p.status === 'Pending' ? acc + parseAmount(p.amount) : acc, 0);
    const last = payments[0];
    const avg = payments.length ? Math.round(totalPaid / Math.max(1, payments.filter(p=>p.status==='Confirmed').length)) : 0;
    // monthly totals (last two months)
    const now = new Date();
    const thisMonthKey = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    const lm = new Date(now.getFullYear(), now.getMonth() -1, 1);
    const lastMonthKey = lm.toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthlyTotals: Record<string, number> = {};
    Object.entries(groupedByMonth).forEach(([k, arr]) => { monthlyTotals[k] = arr.reduce((s, a) => s + parseAmount(a.amount), 0); });

    return { totalPaid, pending, outstanding: pending, lastReceipt: last?.receipt ?? '-', avg, monthlyTotals, thisMonthKey, lastMonthKey };
  }, [groupedByMonth]);

  const handleView = (receipt: string) => {
    alert(`Open receipt ${receipt}`);
  };

  const handleDownload = (receipt: string) => {
    alert(`Downloading PDF for ${receipt}`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.warmCream, boxShadow: '0 18px 45px rgba(148,163,184,0.22)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Payment History</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Track previous payments, receipts, dates, pending charges, and confirmations.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This view gives the client a clean payment record for web and mobile access, with real transaction details and status indicators.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><BadgeDollarSign className="h-4 w-4" /> Live payment overview</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.iceBlue, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Payment records</p>
              <h4 className="text-[22px] font-bold text-slate-900">Recent transactions</h4>
            </div>
            <ReceiptText className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_220px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Search receipt ID, amount, date, or payment method" />
              <div className="flex gap-2">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none">
                  <option>All</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                </select>
                <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value as any)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none">
                  <option value="All">All</option>
                  <option value="ThisMonth">This month</option>
                  <option value="LastMonth">Last month</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex gap-2">
                {['All','Confirmed','Pending','ThisMonth','LastMonth'].map((chip) => (
                  <button key={chip} onClick={() => { if (chip === 'ThisMonth' || chip === 'LastMonth') setTimeFilter(chip as any); else { setStatusFilter(chip as any); setTimeFilter('All'); } }} className={`rounded-full px-3 py-1 text-sm ${ (statusFilter===chip || timeFilter===chip) ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                    {chip === 'ThisMonth' ? 'This month' : chip === 'LastMonth' ? 'Last month' : chip}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-3">
                <button type="button" onClick={handleDownloadReceipts} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Download receipts</button>
                <button type="button" onClick={handleRequestStatement} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Request statement</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedByMonth).map(([month, items]) => (
              <div key={month}>
                <h5 className="mb-3 text-[13px] font-semibold text-slate-700">{month}</h5>
                <div className="space-y-4">
                  {items.map((item) => {
                    // allow timeline ordering and filteredPayments visibility
                    if (!filteredPayments.find((f) => f.receipt === item.receipt)) return null;
                    const amt = parseAmount(item.amount);
                    const statusColor = item.status === 'Confirmed' ? 'text-emerald-700 bg-emerald-50' : item.status === 'Pending' ? 'text-amber-700 bg-amber-50' : 'text-slate-700 bg-slate-100';
                    return (
                      <article key={item.receipt} className={`rounded-[24px] border p-5 shadow-sm ${item.tone}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-start">
                              <p className="text-[20px] font-extrabold text-slate-900">{formatCurrency(amt)}</p>
                              <p className="mt-1 text-[13px] text-slate-700 flex items-center gap-2"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold ${statusColor}`}>{item.status === 'Confirmed' ? '✓ Confirmed' : '⏳ Awaiting'}</span></p>
                              <p className="mt-2 text-[13px] text-slate-700">Receipt: <span className="font-semibold text-slate-900">{item.receipt}</span></p>
                              <p className="mt-1 text-[13px] text-slate-700">{item.date} • {item.method}</p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3">
                            <p className="text-[13px] text-slate-700">{item.note}</p>
                            <div className="flex gap-2">
                              <button onClick={() => handleView(item.receipt)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-800">View</button>
                              <button onClick={() => handleDownload(item.receipt)} className="rounded-2xl bg-slate-900 px-3 py-1 text-sm font-semibold text-white">Download PDF</button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.softPink, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Payment summary</p>
              <h4 className="text-[22px] font-bold text-slate-900">Financial status</h4>
            </div>
            <Wallet className="h-5 w-5 text-pink-700" />
          </div>

          <div className="grid gap-4">
            <article className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
              <p className="text-[12px] uppercase tracking-[0.22em] text-pink-700/90">Outstanding balance</p>
              <p className="mt-2 text-[24px] font-black text-slate-900">{formatCurrency(totals.outstanding)}</p>
              <p className="mt-2 text-[13px] leading-6 text-slate-700">Total pending payments awaiting confirmation.</p>
            </article>

            <article className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
              <p className="text-[12px] uppercase tracking-[0.22em] text-pink-700/90">Payment insights</p>
              <div className="mt-2 grid gap-2">
                <div className="flex items-center justify-between text-sm text-slate-700"><span>Total transactions</span><span className="font-semibold text-slate-900">{payments.length}</span></div>
                <div className="flex items-center justify-between text-sm text-slate-700"><span>Average payment</span><span className="font-semibold text-slate-900">{formatCurrency(totals.avg)}</span></div>
                <div className="flex items-center justify-between text-sm text-slate-700"><span>Last receipt</span><span className="font-semibold text-slate-900">{totals.lastReceipt}</span></div>
              </div>
            </article>

            <article className="rounded-[24px] border border-cyan-100 bg-[#edf7ff] p-4 shadow-sm">
              <p className="text-[12px] uppercase tracking-[0.22em] text-cyan-700/90">Payment activity</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between"><span>{totals.thisMonthKey}</span><span className="font-semibold text-slate-900">{formatCurrency(totals.monthlyTotals[totals.thisMonthKey]||0)}</span></div>
                <div className="flex items-center justify-between"><span>{totals.lastMonthKey}</span><span className="font-semibold text-slate-900">{formatCurrency(totals.monthlyTotals[totals.lastMonthKey]||0)}</span></div>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
};

export default PaymentHistory;
