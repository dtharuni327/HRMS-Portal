import { useMemo, useState, type FC } from 'react';
import { Download, FileText, Send } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';
import { financeEmployees } from './Payroll';

type PayslipStatus = 'Ready' | 'Downloaded' | 'Sent';

const initialPayslips = financeEmployees.slice(0, 15).map((employee, index) => ({
  ...employee,
  department: employee.dept,
  status: (index < 10 ? 'Sent' : 'Ready') as PayslipStatus,
}));

const PayslipManagement: FC = () => {
  const [payslips, setPayslips] = useState(initialPayslips);
  const [search, setSearch] = useState('');

  const filteredPayslips = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return payslips;

    return payslips.filter((entry) =>
      String(entry.id).toLowerCase().includes(term) ||
      entry.name.toLowerCase().includes(term) ||
      entry.department.toLowerCase().includes(term) ||
      entry.status.toLowerCase().includes(term)
    );
  }, [payslips, search]);

  const summary = useMemo(() => {
    const ready = payslips.filter((entry) => entry.status === 'Ready').length;
    const downloaded = payslips.filter((entry) => entry.status === 'Downloaded').length;
    const sent = payslips.filter((entry) => entry.status === 'Sent').length;

    return { ready, downloaded, sent, total: payslips.length };
  }, [payslips]);

  const updateStatus = (employeeId: number, status: PayslipStatus) => {
    setPayslips((prev) =>
      prev.map((entry) => (entry.id === employeeId ? { ...entry, status } : entry))
    );
  };

  const generateAll = () => {
    setPayslips((prev) => prev.map((entry) => ({ ...entry, status: 'Ready' })));
  };

  const downloadAll = () => {
    setPayslips((prev) => prev.map((entry) => ({ ...entry, status: 'Downloaded' })));
  };

  const sendAll = () => {
    setPayslips((prev) => prev.map((entry) => ({ ...entry, status: 'Sent' })));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`${summary.total}`} label="Employees in Payslip Run" color="from-slate-100 to-slate-50 text-slate-900" />
        <StatCard value={`${summary.ready}`} label="Ready to Generate" color="from-slate-100 to-slate-50 text-slate-900" />
        <StatCard value={`${summary.downloaded}`} label="Downloaded" color="from-slate-100 to-slate-50 text-slate-900" />
        <StatCard value={`${summary.sent}`} label="Sent to Employees" color="from-slate-100 to-slate-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Payslip Management</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Generate, download, and send monthly payslips for your 15 employees in real time.</h3>
          <p className="mt-3 text-sm text-slate-700">This dashboard lets finance teams create payslips, review them, and send them to employee inboxes from one screen.</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={generateAll} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800">Generate all</button>
            <button type="button" onClick={downloadAll} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-emerald-200 hover:text-emerald-700">Download all</button>
            <button type="button" onClick={sendAll} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500">Send all</button>
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Payslips for all 15 employees are prepared and ready for review.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Salary details, deductions, and tax information are checked before each payslip is shared.</li>
            <li className="rounded-2xl border border-emerald-100 bg-white/95 p-3">Delivery status is updated instantly as the payroll team works through the month.</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Employee list</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Payslip queue for this month</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">15 employees</span>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by employee, department, or status"
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 shadow-sm outline-none ring-0 placeholder:text-slate-400"
            />
          </div>

          <div className="mt-4 space-y-3">
            {filteredPayslips.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
               <div className="flex items-start justify-between gap-4">
  <div>
    <p className="text-sm font-semibold text-slate-900">{entry.name}</p>

    <p className="text-xs text-slate-500">
      EMP ID: {entry.id}
    </p>

    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
      {entry.department}
    </p>

    <p className="mt-1 text-sm text-slate-600">
      ₹{entry.salary.toLocaleString('en-IN')} monthly salary
    </p>
  </div>

  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 shadow-sm">
    {entry.status}
  </span>
</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => updateStatus(entry.id, 'Ready')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-700">
                    <FileText size={13} /> Generate
                  </button>
                  <button type="button" onClick={() => updateStatus(entry.id, 'Downloaded')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-sky-200 hover:text-sky-700">
                    <Download size={13} /> Download
                  </button>
                  <button type="button" onClick={() => updateStatus(entry.id, 'Sent')} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-200 hover:text-emerald-700">
                    <Send size={13} /> Send
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SparkCard>
      </div>
    </div>
  );
};

export default PayslipManagement;
