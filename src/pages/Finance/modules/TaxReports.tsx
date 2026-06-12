import { useMemo, useState, type FC } from 'react';
import {
  Building2,
  CalendarRange,
  Download,
  FileSpreadsheet,
  Landmark,
  Search,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type TaxCategory = 'All' | 'TDS' | 'PF' | 'ESI' | 'Professional Tax';

interface StatutoryItem {
  id: number;
  category: 'TDS' | 'PF' | 'ESI' | 'Professional Tax';
  month: string;
  employeeCount: number;
  amount: number;
  status: 'Filed' | 'Pending' | 'Review';
  dueDate: string;
}

const statutoryItems: StatutoryItem[] = [
  { id: 1, category: 'TDS', month: 'April', employeeCount: 15, amount: 285000, status: 'Filed', dueDate: '12 May' },
  { id: 2, category: 'PF', month: 'April', employeeCount: 15, amount: 142500, status: 'Review', dueDate: '18 May' },
  { id: 3, category: 'ESI', month: 'April', employeeCount: 7, amount: 35400, status: 'Pending', dueDate: '20 May' },
  { id: 4, category: 'Professional Tax', month: 'April', employeeCount: 15, amount: 19800, status: 'Filed', dueDate: '10 May' },
  { id: 5, category: 'TDS', month: 'May', employeeCount: 15, amount: 291000, status: 'Pending', dueDate: '12 Jun' },
  { id: 6, category: 'PF', month: 'May', employeeCount: 15, amount: 146000, status: 'Filed', dueDate: '15 Jun' },
];

const TaxReportsModule: FC = () => {
  const [category, setCategory] = useState<TaxCategory>('All');
  const [search, setSearch] = useState('');
  const [exportMode, setExportMode] = useState('Excel');

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    return statutoryItems.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSearch = [item.category, item.month, item.status, item.dueDate]
        .join(' ')
        .toLowerCase()
        .includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const summary = useMemo(() => {
    const totalTds = statutoryItems.filter((item) => item.category === 'TDS').reduce((sum, item) => sum + item.amount, 0);
    const totalPf = statutoryItems.filter((item) => item.category === 'PF').reduce((sum, item) => sum + item.amount, 0);
    const totalEsi = statutoryItems.filter((item) => item.category === 'ESI').reduce((sum, item) => sum + item.amount, 0);
    const totalProfessionalTax = statutoryItems.filter((item) => item.category === 'Professional Tax').reduce((sum, item) => sum + item.amount, 0);

    return {
      annualTds: totalTds,
      annualContributions: totalPf + totalEsi,
      annualTax: totalTds + totalProfessionalTax,
      complianceScore: '96%',
      dueCount: statutoryItems.filter((item) => item.status === 'Pending').length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.annualTds.toLocaleString('en-IN')}`} label="Annual TDS" color="from-cyan-100 to-cyan-50 text-slate-900" />
        <StatCard value={`₹${summary.annualContributions.toLocaleString('en-IN')}`} label="PF + ESI" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`₹${summary.annualTax.toLocaleString('en-IN')}`} label="Yearly Tax Summary" color="from-amber-100 to-amber-50 text-slate-900" />
        <StatCard value={summary.complianceScore} label="Compliance Score" color="from-violet-100 to-violet-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-cyan-100 bg-[#effbff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-700">Tax & Compliance</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">TDS, PF, ESI, professional tax, yearly tax summary, and statutory reports.</h3>
          <p className="mt-3 text-sm text-slate-700">Use this module to track statutory deductions, filing status, open compliance items, and the yearly tax position for finance review.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-cyan-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">TDS</p>
              <p className="mt-2 text-sm text-slate-700">Monthly and annual TDS withholding status for payroll and statutory compliance.</p>
            </article>
            <article className="rounded-2xl border border-cyan-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">PF & ESI</p>
              <p className="mt-2 text-sm text-slate-700">Contribution tracking for employee and employer statutory deductions.</p>
            </article>
            <article className="rounded-2xl border border-cyan-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">Professional Tax</p>
              <p className="mt-2 text-sm text-slate-700">State-level professional tax summary and filing readiness.</p>
            </article>
            <article className="rounded-2xl border border-cyan-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-700">Yearly Summary</p>
              <p className="mt-2 text-sm text-slate-700">Annual tax totals and compliance posture for the finance team.</p>
            </article>
          </div>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Filters</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Compliance controls</h3>
            </div>
            <ShieldCheck size={16} className="text-cyan-600" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['All', 'TDS', 'PF', 'ESI', 'Professional Tax'] as TaxCategory[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${category === item ? 'bg-cyan-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700'}`}
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
              placeholder="Search statutory reports"
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['Excel', 'PDF', 'CSV'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setExportMode(item)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] ${exportMode === item ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 bg-white text-slate-600 hover:border-cyan-200 hover:text-cyan-700'}`}
              >
                <Download size={12} />
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50/70 p-3 text-sm text-cyan-900">
            Export mode selected: <strong>{exportMode}</strong>. Finance can review statutory filings and tax summaries with the current compliance dataset.
          </div>
        </SparkCard>
      </div>

      <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Statutory reports</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">Tax filings and statutory summary</h3>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm hover:bg-cyan-700">
            <FileSpreadsheet size={14} />
            Export report
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Employees</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{item.category}</td>
                  <td className="px-4 py-3">{item.month}</td>
                  <td className="px-4 py-3">{item.employeeCount}</td>
                  <td className="px-4 py-3">₹{item.amount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${item.status === 'Filed' ? 'bg-emerald-100 text-emerald-700' : item.status === 'Review' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SparkCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-cyan-700">
            <Landmark size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Annual tax</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">₹{summary.annualTax.toLocaleString('en-IN')}</h4>
          <p className="mt-2 text-sm text-slate-600">Current yearly tax summary across TDS and professional tax entries for the financial cycle.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <Wallet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Statutory dues</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">{summary.dueCount} pending items</h4>
          <p className="mt-2 text-sm text-slate-600">Open compliance items require final verification before statutory filing deadlines.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-violet-700">
            <CalendarRange size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Filing horizon</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Next review in 6 days</h4>
          <p className="mt-2 text-sm text-slate-600">Upcoming statutory deadlines are highlighted for the Finance team to confirm compliance readiness.</p>
        </SparkCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <Building2 size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Compliance snapshot</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Filing status overview</h4>
          <p className="mt-2 text-sm text-slate-600">TDS and professional tax filings are largely up to date, while PF and ESI items are being reviewed for the next cut-off cycle.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-amber-700">
            <ShieldCheck size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Governance</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Statutory controls</h4>
          <p className="mt-2 text-sm text-slate-600">The report supports month-end validation, compliance checks, and statutory filing summary generation for Finance teams.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default TaxReportsModule;
