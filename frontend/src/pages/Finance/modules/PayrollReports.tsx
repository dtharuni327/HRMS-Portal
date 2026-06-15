import { useMemo, useState, type FC } from 'react';
import { Building2, Download, FileSpreadsheet, Search, Users } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

type ReportType = 'Monthly' | 'Employee' | 'Department';

interface MonthlyReportRow {
  month: string;
  employees: number;
  gross: number;
  deductions: number;
  net: number;
}

interface EmployeeReportRow {
  employeeId: string;
  employee: string;
  dept: string;
  salary: number;
  bonus: number;
  deductions: number;
  net: number;
}

interface DepartmentReportRow {
  department: string;
  employees: number;
  gross: number;
  deductions: number;
  net: number;
}

const hrPayrollEmployees = [
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
];

const employeeReports: EmployeeReportRow[] = hrPayrollEmployees.map((employee) => {
  const bonus = Math.round(employee.salary * 0.08);
  const deductions = Math.round(employee.salary * 0.03);

  return {
    employeeId: `EMP-${String(employee.id).padStart(3, '0')}`,
    employee: employee.name,
    dept: employee.dept,
    salary: employee.salary,
    bonus,
    deductions,
    net: employee.salary + bonus - deductions,
  };
});

const monthlyReports: MonthlyReportRow[] = [
  {
    month: 'Current month',
    employees: employeeReports.length,
    gross: employeeReports.reduce((sum, item) => sum + item.salary + item.bonus, 0),
    deductions: employeeReports.reduce((sum, item) => sum + item.deductions, 0),
    net: employeeReports.reduce((sum, item) => sum + item.net, 0),
  },
];

const departmentReports: DepartmentReportRow[] = Object.values(
  employeeReports.reduce<Record<string, { department: string; employees: number; gross: number; deductions: number; net: number }>>((acc, item) => {
    const department = item.dept;
    const current = acc[department] ?? { department, employees: 0, gross: 0, deductions: 0, net: 0 };

    current.employees += 1;
    current.gross += item.salary + item.bonus;
    current.deductions += item.deductions;
    current.net += item.net;

    acc[department] = current;
    return acc;
  }, {}),
).map((item) => ({
  department: item.department,
  employees: item.employees,
  gross: item.gross,
  deductions: item.deductions,
  net: item.net,
}));

const PayrollReports: FC = () => {
  const [reportType, setReportType] = useState<ReportType>('Monthly');
  const [search, setSearch] = useState('');
  const [exportMode, setExportMode] = useState('Excel');

  const searchTerm = search.trim().toLowerCase();

  const monthlyData = useMemo(
    () => monthlyReports.filter((item) => item.month.toLowerCase().includes(searchTerm)),
    [searchTerm],
  );

  const employeeData = useMemo(
    () => employeeReports.filter((item) =>
      [item.employee, item.employeeId, item.dept].some((value) => value.toLowerCase().includes(searchTerm)),
    ),
    [searchTerm],
  );

  const departmentData = useMemo(
    () => departmentReports.filter((item) => item.department.toLowerCase().includes(searchTerm)),
    [searchTerm],
  );

  const summary = useMemo(() => {
    const totalGross = monthlyReports.reduce((sum, item) => sum + item.gross, 0);
    const totalNet = monthlyReports.reduce((sum, item) => sum + item.net, 0);
    const avgSalary = Math.round(totalNet / monthlyReports.length / 1000) * 1000;
    const topDept = departmentReports[0]?.department ?? 'Engineering';

    return { totalGross, totalNet, avgSalary, topDept };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard value={`₹${summary.totalGross.toLocaleString('en-IN')}`} label="Gross Payroll" color="from-emerald-100 to-emerald-50 text-slate-900" />
        <StatCard value={`₹${summary.totalNet.toLocaleString('en-IN')}`} label="Net Payroll" color="from-sky-100 to-sky-50 text-slate-900" />
        <StatCard value={`₹${summary.avgSalary.toLocaleString('en-IN')}`} label="Avg Monthly Salary" color="from-amber-100 to-amber-50 text-slate-900" />
        <StatCard value={summary.topDept} label="Top Department" color="from-violet-100 to-violet-50 text-slate-900" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Payroll Reports</p>
          <h3 className="mt-3 text-xl font-black text-slate-900">Monthly payroll report, employee-wise salary report, department-wise salary report, and export options.</h3>
          <p className="mt-3 text-sm text-slate-700">Use this view to review payroll totals across the month, drill into employee-level salary details, and compare department-level compensation summaries before export.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Monthly report</p>
              <p className="mt-2 text-sm text-slate-700">Track monthly gross, deduction, and net payroll totals for finance review.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Employee-wise</p>
              <p className="mt-2 text-sm text-slate-700">Inspect salary, bonus, deductions, and final payout for individual employees.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Department-wise</p>
              <p className="mt-2 text-sm text-slate-700">Compare payroll spending by department and monitor team cost centers.</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white/95 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-700">Export</p>
              <p className="mt-2 text-sm text-slate-700">Export the active report to PDF, Excel, or CSV format for finance sharing.</p>
            </article>
          </div>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Report controls</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">Payroll analytics</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Finance-ready</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['Monthly', 'Employee', 'Department'] as ReportType[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setReportType(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${reportType === item ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'}`}
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
              placeholder={`Search ${reportType.toLowerCase()} reports`}
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-4 flex flex-wrap gap-2">
            {(['Excel', 'PDF', 'CSV'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setExportMode(item)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] ${exportMode === item ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700'}`}
              >
                <Download size={12} />
                {item}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-sm text-emerald-900">
            Export mode selected: <strong>{exportMode}</strong>. This payroll view uses the current employee and department payroll dataset for monthly, employee-wise, and department-wise reporting.
          </div>
        </SparkCard>
      </div>

      <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Report preview</p>
            <h3 className="mt-2 text-xl font-black text-slate-900">{reportType} payroll report</h3>
          </div>
          <button type="button" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm hover:bg-emerald-700">
            <FileSpreadsheet size={14} />
            Export {reportType}
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200">
          {reportType === 'Monthly' && (
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {monthlyData.map((item) => (
                  <tr key={item.month}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.month}</td>
                    <td className="px-4 py-3">{item.employees}</td>
                    <td className="px-4 py-3">₹{item.gross.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.deductions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.net.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'Employee' && (
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Salary</th>
                  <th className="px-4 py-3">Bonus</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {employeeData.map((item) => (
                  <tr key={item.employeeId}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{item.employee}</p>
                      <p className="text-xs text-slate-500">{item.employeeId}</p>
                    </td>
                    <td className="px-4 py-3">{item.dept}</td>
                    <td className="px-4 py-3">₹{item.salary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.bonus.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.deductions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.net.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'Department' && (
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Deductions</th>
                  <th className="px-4 py-3">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {departmentData.map((item) => (
                  <tr key={item.department}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.department}</td>
                    <td className="px-4 py-3">{item.employees}</td>
                    <td className="px-4 py-3">₹{item.gross.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.deductions.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">₹{item.net.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </SparkCard>

      <div className="grid gap-6 md:grid-cols-3">
        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-emerald-700">
            <Users size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Covered staff</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">15 employees</h4>
          <p className="mt-2 text-sm text-slate-600">Latest monthly payroll batch currently covers the active staff count for this cycle.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-sky-700">
            <Building2 size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Departments</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">4 key departments</h4>
          <p className="mt-2 text-sm text-slate-600">The department-wise summary helps compare cost distribution and team payroll load.</p>
        </SparkCard>

        <SparkCard className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-center gap-3 text-violet-700">
            <FileSpreadsheet size={18} />
            <p className="text-[10px] uppercase tracking-[0.35em]">Export ready</p>
          </div>
          <h4 className="mt-3 text-xl font-black text-slate-900">Excel / PDF / CSV</h4>
          <p className="mt-2 text-sm text-slate-600">The export modes are included for the finance team to share payroll reports in their preferred format.</p>
        </SparkCard>
      </div>
    </div>
  );
};

export default PayrollReports;
