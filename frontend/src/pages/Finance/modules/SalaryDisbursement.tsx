import type { FC } from 'react';
import { CalendarDays, IndianRupee, ReceiptText, ShieldCheck } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';
import { financeEmployees } from './Payroll';

const totalGrossSalary = financeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
const totalAllowances = Math.round(totalGrossSalary * 0.12);
const totalDeductions = Math.round(totalGrossSalary * 0.08);
const totalNetSalary = totalGrossSalary + totalAllowances - totalDeductions;

const salaryCycle = {
  grossSalary: totalGrossSalary,
  allowances: totalAllowances,
  deductions: totalDeductions,
  netSalary: totalNetSalary,
  payDate: '12 Jun 2026',
};

const salaryPreview = financeEmployees.map((emp) => {
  const basic = Math.round(emp.salary * 0.72);
  const allowance = Math.round(emp.salary * 0.12);
  const deduction = Math.round(emp.salary * 0.08);

  return {
    name: emp.name,
    department: emp.dept,
    basic,
    allowance,
    deduction,
    net: basic + allowance - deduction,
  };
});

const SalaryDisbursementModule: FC = () => (
  <div className="space-y-6">
    <SparkCard className="rounded-[2rem] border border-sky-100 bg-[#edf5ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Salary Processing</p>
      <h3 className="mt-3 text-2xl font-black text-slate-900">Monthly salary processing made simple</h3>
      <p className="mt-2 max-w-3xl text-sm text-slate-700">Review the current month’s salary run, check each employee’s basic pay, allowances, deductions, and net payout, and confirm the scheduled pay date.</p>
    </SparkCard>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      <StatCard icon={<IndianRupee size={22} className="text-emerald-700" />} value={`₹${(salaryCycle.grossSalary / 100000).toFixed(1)}L`} label="Monthly Gross Salary" color="from-white via-emerald-50 to-emerald-100 text-emerald-800" />
      <StatCard icon={<ReceiptText size={22} className="text-violet-700" />} value={`₹${(salaryCycle.allowances / 1000).toFixed(0)}K`} label="Allowances" color="from-white via-violet-50 to-violet-100 text-violet-800" />
      <StatCard icon={<ShieldCheck size={22} className="text-rose-700" />} value={`₹${(salaryCycle.deductions / 1000).toFixed(0)}K`} label="Deductions" color="from-white via-rose-50 to-rose-100 text-rose-800" />
      <StatCard icon={<IndianRupee size={22} className="text-sky-700" />} value={`₹${(salaryCycle.netSalary / 100000).toFixed(1)}L`} label="Net Salary" color="from-white via-sky-50 to-sky-100 text-sky-800" />
      <StatCard icon={<CalendarDays size={22} className="text-amber-700" />} value={salaryCycle.payDate} label="Pay Date" color="from-white via-amber-50 to-amber-100 text-amber-800" />
    </div>

    <SparkCard className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Monthly salary summary</p>
          <h4 className="mt-2 text-xl font-black text-slate-900">Salary breakdown for this month</h4>
          <p className="mt-1 text-sm text-slate-600">Here is a clear view of how each employee’s monthly salary is calculated before release.</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">Ready for payout</span>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="px-3 py-3 font-semibold">Employee</th>
              <th className="px-3 py-3 font-semibold">Basic Salary</th>
              <th className="px-3 py-3 font-semibold">Allowances</th>
              <th className="px-3 py-3 font-semibold">Deductions</th>
              <th className="px-3 py-3 font-semibold text-right">Net Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {salaryPreview.map((entry) => (
              <tr key={entry.name} className="hover:bg-slate-50/80">
                <td className="px-3 py-3">
                  <p className="font-semibold text-slate-900">{entry.name}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{entry.department}</p>
                </td>
                <td className="px-3 py-3">₹{entry.basic.toLocaleString('en-IN')}</td>
                <td className="px-3 py-3">₹{entry.allowance.toLocaleString('en-IN')}</td>
                <td className="px-3 py-3">₹{entry.deduction.toLocaleString('en-IN')}</td>
                <td className="px-3 py-3 text-right font-semibold text-emerald-700">₹{entry.net.toLocaleString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SparkCard>
  </div>
);

export default SalaryDisbursementModule;
