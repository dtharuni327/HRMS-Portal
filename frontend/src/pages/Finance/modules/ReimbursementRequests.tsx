import { useMemo, useState, type FC } from 'react';
import { Banknote, CheckCircle2, ReceiptText, Search, ShieldCheck, XCircle } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type ClaimType = 'Travel' | 'Food' | 'Internet';
type ClaimStatus = 'Pending' | 'Approved' | 'Rejected';
type PaymentStatus = 'Pending' | 'Paid';

interface ReimbursementClaim {
  id: number;
  employee: string;
  department: string;
  type: ClaimType;
  amount: number;
  date: string;
  purpose: string;
  status: ClaimStatus;
  paymentStatus: PaymentStatus;
}

const initialClaims: ReimbursementClaim[] = [
  { id: 101, employee: 'Asha Rao', department: 'HR', type: 'Travel', amount: 18250, date: '12 Jun 2026', purpose: 'Client visit and local transport', status: 'Pending', paymentStatus: 'Pending' },
  { id: 102, employee: 'Nikhil Sharma', department: 'Sales', type: 'Food', amount: 4200, date: '11 Jun 2026', purpose: 'Team lunch during field meeting', status: 'Approved', paymentStatus: 'Pending' },
  { id: 103, employee: 'Priya Menon', department: 'IT', type: 'Internet', amount: 1699, date: '10 Jun 2026', purpose: 'Monthly hotspot recharge for project work', status: 'Approved', paymentStatus: 'Paid' },
  { id: 104, employee: 'Ravi Kumar', department: 'Operations', type: 'Travel', amount: 24500, date: '09 Jun 2026', purpose: 'Warehouse site inspection', status: 'Rejected', paymentStatus: 'Pending' },
  { id: 105, employee: 'Sneha Verma', department: 'Finance', type: 'Food', amount: 3850, date: '08 Jun 2026', purpose: 'Vendor discussion and meals', status: 'Pending', paymentStatus: 'Pending' },
  { id: 106, employee: 'Arjun Das', department: 'Marketing', type: 'Internet', amount: 1299, date: '07 Jun 2026', purpose: 'Work-from-home internet top-up', status: 'Approved', paymentStatus: 'Pending' },
];

const ReimbursementRequests: FC = () => {
  const [claims, setClaims] = useState(initialClaims);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | ClaimStatus>('All');

  const filteredClaims = useMemo(() => {
    const term = search.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesFilter = filter === 'All' || claim.status === filter;
      const matchesSearch =
        !term ||
        claim.employee.toLowerCase().includes(term) ||
        claim.department.toLowerCase().includes(term) ||
        claim.type.toLowerCase().includes(term) ||
        claim.purpose.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [claims, filter, search]);

  const summary = useMemo(() => {
    const openClaims = claims.filter((claim) => claim.status === 'Pending').length;
    const approved = claims.filter((claim) => claim.status === 'Approved').length;
    const paid = claims.filter((claim) => claim.paymentStatus === 'Paid').length;
    const totalClaimValue = claims.reduce((sum, claim) => sum + claim.amount, 0);

    return { openClaims, approved, paid, totalClaimValue };
  }, [claims]);

  const updateStatus = (id: number, status: ClaimStatus) => {
    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === id
          ? {
              ...claim,
              status,
              paymentStatus: status === 'Approved' ? 'Pending' : claim.paymentStatus,
            }
          : claim
      )
    );
  };

  const markPaid = (id: number) => {
    setClaims((prev) =>
      prev.map((claim) => {
        if (claim.id !== id || claim.status !== 'Approved' || claim.paymentStatus === 'Paid') {
          return claim;
        }

        return { ...claim, paymentStatus: 'Paid' };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value="₹1.2L" label="Open Claims" color="from-emerald-100 to-emerald-50" />
        <StatCard value={`${summary.openClaims}`} label="Pending Approvals" color="from-amber-100 to-amber-50" />
        <StatCard value={`${summary.approved}`} label="Approved This Month" color="from-sky-100 to-sky-50" />
        <StatCard value={`${summary.paid}`} label="Paid Claims" color="from-violet-100 to-violet-50" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Reimbursement Requests</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Travel claims, food claims, and internet claims in one approval queue.</h3>
          <p className="mt-3 text-sm text-slate-700">Finance can approve or reject reimbursements, track payment status, and keep claim history visible for every employee.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Claim types</p>
              <p className="mt-2 text-sm text-slate-700">Travel, food, and internet reimbursement requests are reviewed separately for faster approvals.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Approval flow</p>
              <p className="mt-2 text-sm text-slate-700">Approvals and rejections are updated instantly, with payment status tracked after settlement.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Finance view</p>
              <p className="mt-2 text-sm text-slate-700">A single dashboard keeps pending claims, approvals, and paid reimbursements under control.</p>
            </article>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Claim amount, type, and purpose are visible before any approval decision.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Status changes can be applied directly from the list to keep the reimbursement queue current.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Paid claims are highlighted separately to confirm settlement progress.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Claims</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Review reimbursement queue</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{claims.length} requests</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by employee, department, type, or reason"
                className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${filter === item ? 'bg-emerald-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {filteredClaims.map((claim) => (
              <article key={claim.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{claim.type}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">{claim.department}</span>
                    </div>
                    <p className="mt-3 text-base font-semibold text-slate-900">{claim.employee}</p>
                    <p className="text-xs text-slate-500">Claim #{claim.id} • {claim.date}</p>
                    <p className="mt-2 text-sm text-slate-600">{claim.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">₹{claim.amount.toLocaleString('en-IN')}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Claim amount</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]">
                  <span className={`rounded-full px-3 py-1 ${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : claim.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {claim.status}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${claim.paymentStatus === 'Paid' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'}`}>
                    {claim.paymentStatus === 'Paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(claim.id, 'Approved')}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(claim.id, 'Rejected')}
                    className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  >
                    <XCircle size={13} /> Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => markPaid(claim.id)}
                    disabled={claim.status !== 'Approved' || claim.paymentStatus === 'Paid'}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${claim.status === 'Approved' && claim.paymentStatus !== 'Paid'
                      ? 'border-sky-200 bg-white text-sky-700 hover:bg-sky-50'
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'} `}
                  >
                    <Banknote size={13} /> {claim.paymentStatus === 'Paid' ? 'Paid' : 'Mark paid'}
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredClaims.length === 0 && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No reimbursement claims match the current search or status filter.
            </div>
          )}
        </SparkCard>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <ShieldCheck size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Approvals</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.approved} claims approved</h4>
          <p className="mt-2 text-sm text-slate-600">Approval decisions are logged instantly so the finance team always sees the latest queue.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <ReceiptText size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Claim value</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.totalClaimValue.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Total reimbursement value currently in the finance review pipeline.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <Banknote size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Payment status</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.paid} claims paid</h4>
          <p className="mt-2 text-sm text-slate-600">Keep track of which reimbursements are already settled and which still await transfer.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default ReimbursementRequests;
