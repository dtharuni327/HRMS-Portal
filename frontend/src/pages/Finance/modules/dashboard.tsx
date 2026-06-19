import type { FC } from 'react';
import { CalendarDays, IndianRupee, ReceiptText, Users } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

const financeEmployees = [
  { id: 1, name: 'Shrushti Desu', dept: 'Technology', salary: 85000 },
  { id: 2, name: 'Ananya Rao', dept: 'Technology', salary: 72000 },
  { id: 3, name: 'Rahul Sharma', dept: 'Technology', salary: 95000 },
  { id: 4, name: 'Priya Singh', dept: 'Human Resources', salary: 65000 },
  { id: 5, name: 'Vikram Seth', dept: 'Technology', salary: 78000 },
  { id: 6, name: 'Kavya Iyer', dept: 'Technology', salary: 80000 },
  { id: 7, name: 'Arjun Mehta', dept: 'Technology', salary: 87000 },
  { id: 8, name: 'Sneha Patel', dept: 'Technology', salary: 70000 },
  { id: 9, name: 'Rohit Kumar', dept: 'Technology', salary: 68000 },
  { id: 10, name: 'Meera Nair', dept: 'Human Resources', salary: 60000 },
  { id: 11, name: 'Siddharth Jain', dept: 'Management', salary: 98000 },
  { id: 12, name: 'Pooja Reddy', dept: 'Human Resources', salary: 62000 },
  { id: 13, name: 'Karthik Reddy', dept: 'Technology', salary: 92000 },
  { id: 14, name: 'Aisha Khan', dept: 'Operations', salary: 75000 },
  { id: 15, name: 'Nikhil Verma', dept: 'Technology', salary: 83000 },
] as const;

const totalMonthlyPayroll = financeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
const averageSalary = Math.round(totalMonthlyPayroll / financeEmployees.length);
const highestSalary = Math.max(...financeEmployees.map((emp) => emp.salary));
const reimbursementProjection = Math.round(totalMonthlyPayroll * 0.035);
const taxReserve = Math.round(totalMonthlyPayroll * 0.08);

const departmentMix = Object.entries(
  financeEmployees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.dept] = (acc[emp.dept] ?? 0) + 1;
    return acc;
  }, {})
).sort((a, b) => b[1] - a[1]);

const topEarners = [...financeEmployees].sort((a, b) => b.salary - a.salary).slice(0, 5);

const FinanceDashboardModule: FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<IndianRupee size={22} className="text-emerald-700" />} value={`₹${(totalMonthlyPayroll / 100000).toFixed(1)}L`} label="Monthly Payroll" color="bg-white text-emerald-700" />
        <StatCard icon={<Users size={22} className="text-sky-700" />} value={financeEmployees.length.toString()} label="Active Employees" color="bg-white text-sky-700" />
        <StatCard icon={<ReceiptText size={22} className="text-violet-700" />} value={`₹${Math.round(averageSalary / 1000)}K`} label="Avg Salary" color="bg-white text-violet-700" />
        <StatCard icon={<CalendarDays size={22} className="text-amber-700" />} value={`₹${Math.round(highestSalary / 1000)}K`} label="Top Salary" color="bg-white text-amber-700" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SparkCard className="rounded-[2rem] border border-sky-100 bg-[#edf5ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Payroll overview</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Monthly salary & payout summary</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-sky-100 bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Net payroll</p>
              <p className="mt-2 text-2xl font-black text-slate-900">₹{(totalMonthlyPayroll / 100000).toFixed(1)}L</p>
              <p className="mt-1 text-sm text-slate-600">Gross salary disbursed from the current employee roster.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white/90 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Reimbursement projection</p>
              <p className="mt-2 text-2xl font-black text-slate-900">₹{(reimbursementProjection / 1000).toFixed(0)}K</p>
              <p className="mt-1 text-sm text-slate-600">Estimated monthly claims based on current payroll size.</p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-sky-100 bg-white/90 p-3">Salary slips generated for {financeEmployees.length} employees</li>
            <li className="rounded-2xl border border-sky-100 bg-white/90 p-3">Tax reserve set aside at ₹{(taxReserve / 1000).toFixed(0)}K for compliance</li>
          </ul>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-rose-100 bg-[#fff5f5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-rose-700">Top earners</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Highest salary employees</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {topEarners.map((emp) => (
              <div key={emp.id} className="rounded-2xl border border-rose-100 bg-white/90 p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{emp.name}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{emp.dept}</p>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold text-rose-700">₹{emp.salary.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </SparkCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Department mix</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Headcount by department</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {departmentMix.map(([dept, count]) => (
              <div key={dept} className="rounded-2xl border border-emerald-100 bg-white/90 p-3 flex items-center justify-between">
                <span className="font-semibold text-slate-900">{dept}</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">{count} employees</span>
              </div>
            ))}
          </div>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-amber-100 bg-[#fffaf0] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.35em] text-amber-700">Planning</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Upcoming finance actions</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Payroll review for 15 employees on 12 Jun</li>
            <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Reimbursement approval queue based on current claims</li>
            <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Tax reserve update aligned to department headcount</li>
          </ul>
        </SparkCard>
      </div>
    </div>
  );
};

export default FinanceDashboardModule;
