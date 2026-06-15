import { useState, type FC } from 'react';
import { CalendarDays, IndianRupee, ReceiptText, ShieldCheck } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';

export const financeEmployees = [
  { id: 1, name: 'Shrushti Desu', role: 'Software Engineer', dept: 'Technology', salary: 85000, experience: 4, isMVP: true, joinDate: '2022-01-15', birthday: '1994-01-15', email: 'shrushti.desu@company.com', phone: '+91-9876543210', aadhaarNumber: '1234 5678 9012', panNumber: 'ABCDE1234F', address: 'Mumbai, Maharashtra', designation: 'Software Engineer', location: 'Mumbai', reportingManager: 'Rahul Sharma' },
  { id: 2, name: 'Ananya Rao', role: 'UI/UX Designer', dept: 'Technology', salary: 72000, experience: 3, isMVP: false, joinDate: '2022-06-20', birthday: '1995-06-01', email: 'ananya.rao@company.com', phone: '+91-9876543211', aadhaarNumber: '1234 5678 9013', panNumber: 'ABCDE1234G', address: 'Bangalore, Karnataka', designation: 'UI/UX Designer', location: 'Bangalore', reportingManager: 'Rahul Sharma' },
  { id: 3, name: 'Rahul Sharma', role: 'Technical Lead', dept: 'Technology', salary: 95000, experience: 6, isMVP: false, joinDate: '2021-03-10', birthday: '1991-03-10', email: 'rahul.sharma@company.com', phone: '+91-9876543212', aadhaarNumber: '1234 5678 9014', panNumber: 'ABCDE1234H', address: 'Pune, Maharashtra', designation: 'Technical Lead', location: 'Pune', reportingManager: 'Siddharth Jain' },
  { id: 4, name: 'Priya Singh', role: 'HR Manager', dept: 'Human Resources', salary: 65000, experience: 7, isMVP: false, joinDate: '2020-11-05', birthday: '1990-11-05', email: 'priya.singh@company.com', phone: '+91-9876543213', aadhaarNumber: '1234 5678 9015', panNumber: 'ABCDE1234I', address: 'Delhi, Delhi', designation: 'HR Manager', location: 'Delhi', reportingManager: 'Siddharth Jain' },
  { id: 5, name: 'Vikram Seth', role: 'Data Engineer', dept: 'Technology', salary: 78000, experience: 2, isMVP: false, joinDate: '2022-04-12', birthday: '1993-04-12', email: 'vikram.seth@company.com', phone: '+91-9876543214', aadhaarNumber: '1234 5678 9016', panNumber: 'ABCDE1234J', address: 'Hyderabad, Telangana', designation: 'Data Engineer', location: 'Hyderabad', reportingManager: 'Rahul Sharma' },
  { id: 6, name: 'Kavya Iyer', role: 'Frontend Developer', dept: 'Technology', salary: 80000, experience: 1, isMVP: true, joinDate: '2023-02-18', birthday: '1998-02-18', email: 'kavya.iyer@company.com', phone: '+91-9876543215', aadhaarNumber: '1234 5678 9017', panNumber: 'ABCDE1234K', address: 'Chennai, Tamil Nadu', designation: 'Frontend Developer', location: 'Chennai', reportingManager: 'Shrushti Desu' },
  { id: 7, name: 'Arjun Mehta', role: 'Backend Developer', dept: 'Technology', salary: 87000, experience: 3, isMVP: false, joinDate: '2022-08-10', birthday: '1996-08-10', email: 'arjun.mehta@company.com', phone: '+91-9876543216', aadhaarNumber: '1234 5678 9018', panNumber: 'ABCDE1234L', address: 'Ahmedabad, Gujarat', designation: 'Backend Developer', location: 'Ahmedabad', reportingManager: 'Shrushti Desu' },
  { id: 8, name: 'Sneha Patel', role: 'UI/UX Designer', dept: 'Technology', salary: 70000, experience: 2, isMVP: false, joinDate: '2021-09-25', birthday: '1997-09-25', email: 'sneha.patel@company.com', phone: '+91-9876543217', aadhaarNumber: '1234 5678 9019', panNumber: 'ABCDE1234M', address: 'Surat, Gujarat', designation: 'UI/UX Designer', location: 'Surat', reportingManager: 'Ananya Rao' },
  { id: 9, name: 'Rohit Kumar', role: 'QA Engineer / Tester', dept: 'Technology', salary: 68000, experience: 5, isMVP: false, joinDate: '2020-12-30', birthday: '1992-12-30', email: 'rohit.kumar@company.com', phone: '+91-9876543218', aadhaarNumber: '1234 5678 9020', panNumber: 'ABCDE1234N', address: 'Jaipur, Rajasthan', designation: 'QA Engineer', location: 'Jaipur', reportingManager: 'Rahul Sharma' },
  { id: 10, name: 'Meera Nair', role: 'HR Executive', dept: 'Human Resources', salary: 60000, experience: 0, isMVP: false, joinDate: '2023-01-05', birthday: '1999-01-05', email: 'meera.nair@company.com', phone: '+91-9876543219', aadhaarNumber: '1234 5678 9021', panNumber: 'ABCDE1234O', address: 'Cochin, Kerala', designation: 'HR Executive', location: 'Cochin', reportingManager: 'Priya Singh' },
  { id: 11, name: 'Siddharth Jain', role: 'Director', dept: 'Management', salary: 98000, experience: 4, isMVP: false, joinDate: '2021-07-14', birthday: '1989-07-14', email: 'siddharth.jain@company.com', phone: '+91-9876543220', aadhaarNumber: '1234 5678 9022', panNumber: 'ABCDE1234P', address: 'Noida, Uttar Pradesh', designation: 'Director', location: 'Noida', reportingManager: 'Board of Directors' },
  { id: 12, name: 'Pooja Reddy', role: 'Recruiter', dept: 'Human Resources', salary: 62000, experience: 1, isMVP: false, joinDate: '2022-03-22', birthday: '1998-03-22', email: 'pooja.reddy@company.com', phone: '+91-9876543221', aadhaarNumber: '1234 5678 9023', panNumber: 'ABCDE1234Q', address: 'Visakhapatnam, Andhra Pradesh', designation: 'Recruiter', location: 'Visakhapatnam', reportingManager: 'Priya Singh' },
  { id: 13, name: 'Karthik Reddy', role: 'Full Stack Developer', dept: 'Technology', salary: 92000, experience: 5, isMVP: true, joinDate: '2021-05-19', birthday: '1993-05-19', email: 'karthik.reddy@company.com', phone: '+91-9876543222', aadhaarNumber: '1234 5678 9024', panNumber: 'ABCDE1234R', address: 'Secunderabad, Telangana', designation: 'Full Stack Developer', location: 'Secunderabad', reportingManager: 'Shrushti Desu' },
  { id: 14, name: 'Aisha Khan', role: 'Business Operations Associate', dept: 'Operations', salary: 75000, experience: 2, isMVP: false, joinDate: '2022-11-11', birthday: '1996-11-11', email: 'aisha.khan@company.com', phone: '+91-9876543223', aadhaarNumber: '1234 5678 9025', panNumber: 'ABCDE1234S', address: 'Lucknow, Uttar Pradesh', designation: 'Business Operations Associate', location: 'Lucknow', reportingManager: 'Siddharth Jain' },
  { id: 15, name: 'Nikhil Verma', role: 'System Administrator', dept: 'Technology', salary: 83000, experience: 6, isMVP: false, joinDate: '2020-08-27', birthday: '1990-08-27', email: 'nikhil.verma@company.com', phone: '+91-9876543224', aadhaarNumber: '1234 5678 9026', panNumber: 'ABCDE1234T', address: 'Indore, Madhya Pradesh', designation: 'System Administrator', location: 'Indore', reportingManager: 'Rahul Sharma' },
] as const;

type PayrollStatus = 'Paid' | 'Pending';

const totalMonthlyPayroll = financeEmployees.reduce((sum, emp) => sum + emp.salary, 0);
const taxDeduction = Math.round(totalMonthlyPayroll * 0.08);
const providentFund = Math.round(totalMonthlyPayroll * 0.12);
const netPayable = totalMonthlyPayroll - taxDeduction - providentFund;
const payoutReady = Math.round(totalMonthlyPayroll * 0.42);

const initialEmployeePayrollStatus = financeEmployees.map((emp, index) => ({
  ...emp,
  status: (index < 10 ? 'Paid' : 'Pending') as PayrollStatus,
  note: index < 10 ? 'Processed for this cycle' : 'Awaiting approval',
}));

const departmentMix = Object.entries(
  financeEmployees.reduce<Record<string, number>>((acc, emp) => {
    acc[emp.dept] = (acc[emp.dept] ?? 0) + emp.salary;
    return acc;
  }, {})
).sort((a, b) => b[1] - a[1]);

const topEarners = [...financeEmployees].sort((a, b) => b.salary - a.salary).slice(0, 4);

const PayrollModule: FC = () => {
  const [employeePayrollStatus, setEmployeePayrollStatus] = useState(initialEmployeePayrollStatus);
  const [bulkStatus, setBulkStatus] = useState<'Paid' | 'Pending'>('Paid');

  const paidEmployees = employeePayrollStatus.filter((emp) => emp.status === 'Paid');
  const pendingEmployees = employeePayrollStatus.filter((emp) => emp.status === 'Pending');
  const processedPayroll = paidEmployees.reduce((sum, emp) => sum + emp.salary, 0);
  const pendingPayroll = totalMonthlyPayroll - processedPayroll;
  const payrollStatus = processedPayroll >= totalMonthlyPayroll * 0.75 ? 'On Track' : 'Needs Review';
  const payrollCompletion = Math.round((processedPayroll / totalMonthlyPayroll) * 100);

  const handleStatusChange = (employeeId: number, status: PayrollStatus) => {
    setEmployeePayrollStatus((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, status, note: status === 'Paid' ? 'Processed for this cycle' : 'Awaiting approval' } : emp))
    );
  };

  const applyBulkStatus = () => {
    setEmployeePayrollStatus((prev) =>
      prev.map((emp) => ({
        ...emp,
        status: bulkStatus,
        note: bulkStatus === 'Paid' ? 'Processed for this cycle' : 'Awaiting approval',
      }))
    );
  };

  return (
  <div className="space-y-6">
    <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)]">
      <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Payroll overview</p>
      <h2 className="mt-2 text-2xl font-black text-slate-900">Monthly payroll summary, salary cost, and status</h2>
      <p className="mt-2 text-sm text-slate-600">Review salary processing, pending approvals, and live payroll status from one view.</p>
    </div>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
      <StatCard icon={<IndianRupee size={22} className="text-emerald-700" />} value={`₹${(totalMonthlyPayroll / 100000).toFixed(1)}L`} label="Monthly Payroll Summary" color="from-white via-emerald-50 to-emerald-100 text-emerald-800" />
      <StatCard icon={<ShieldCheck size={22} className="text-sky-700" />} value={`₹${Math.round(netPayable / 1000)}K`} label="Total Salary Cost" color="from-white via-sky-50 to-sky-100 text-sky-800" />
      <StatCard icon={<ReceiptText size={22} className="text-violet-700" />} value={`₹${Math.round(pendingPayroll / 1000)}K`} label="Pending / Awaiting Review" color="from-white via-violet-50 to-violet-100 text-violet-800" />
      <StatCard icon={<CalendarDays size={22} className="text-amber-700" />} value={`₹${Math.round(processedPayroll / 1000)}K`} label="Processed / Paying" color="from-white via-amber-50 to-amber-100 text-amber-800" />
      <StatCard icon={<ShieldCheck size={22} className="text-rose-700" />} value={payrollStatus} label="Payroll Status" color="from-white via-rose-50 to-rose-100 text-rose-800" />
    </div>

    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Bulk actions</p>
        <h3 className="text-base font-black text-slate-900">Mark all employee salaries in one go</h3>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={bulkStatus}
          onChange={(event) => setBulkStatus(event.target.value as PayrollStatus)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none"
        >
          <option value="Paid">Bulk Paid</option>
          <option value="Pending">Bulk Pending</option>
        </select>
        <button
          type="button"
          onClick={applyBulkStatus}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Apply
        </button>
      </div>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Paid salaries</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">Employees whose salary is already paid</h3>
        <p className="mt-2 text-sm text-slate-700">This table shows the employees whose salaries have already been processed for the current cycle.</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 shadow-sm">
          <table className="min-w-full divide-y divide-emerald-100 text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                <th className="px-3 py-3 font-semibold">Employee</th>
                <th className="px-3 py-3 font-semibold">Department</th>
                <th className="px-3 py-3 font-semibold text-right">Salary</th>
                <th className="px-3 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 text-slate-700">
              {paidEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-emerald-50/70">
                  <td className="px-3 py-3 font-semibold text-slate-900">{emp.name}</td>
                  <td className="px-3 py-3">{emp.dept}</td>
                  <td className="px-3 py-3 text-right font-semibold text-emerald-700">₹{emp.salary.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right">
                    <select
                      value={emp.status}
                      onChange={(event) => handleStatusChange(emp.id, event.target.value as PayrollStatus)}
                      className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-semibold text-emerald-800 shadow-sm outline-none ring-0"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SparkCard>

      <SparkCard className="rounded-[2rem] border border-rose-100 bg-[#fff5f5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-rose-700">Pending salaries</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">Employees whose salary is still pending</h3>
        <p className="mt-2 text-sm text-slate-700">This table shows the salary entries that still need approval or release.</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-rose-100 bg-white/95 shadow-sm">
          <table className="min-w-full divide-y divide-rose-100 text-left text-sm">
            <thead className="bg-rose-50 text-rose-900">
              <tr>
                <th className="px-3 py-3 font-semibold">Employee</th>
                <th className="px-3 py-3 font-semibold">Department</th>
                <th className="px-3 py-3 font-semibold text-right">Salary</th>
                <th className="px-3 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50 text-slate-700">
              {pendingEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-rose-50/70">
                  <td className="px-3 py-3 font-semibold text-slate-900">{emp.name}</td>
                  <td className="px-3 py-3">{emp.dept}</td>
                  <td className="px-3 py-3 text-right font-semibold text-rose-700">₹{emp.salary.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right">
                    <select
                      value={emp.status}
                      onChange={(event) => handleStatusChange(emp.id, event.target.value as PayrollStatus)}
                      className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-800 shadow-sm outline-none ring-0"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SparkCard>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SparkCard className="rounded-[2rem] border border-sky-100 bg-[#edf5ff] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Payroll cycle</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">Current pay run and deduction summary</h3>
        <p className="mt-2 text-sm text-slate-700">Payroll status: {payrollStatus} ({payrollCompletion}% processed).</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Gross salary</p>
            <p className="mt-2 text-2xl font-black text-slate-900">₹{(totalMonthlyPayroll / 100000).toFixed(1)}L</p>
            <p className="mt-1 text-sm text-slate-600">Base payroll for all active employees in this cycle.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-white/90 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Deductions</p>
            <p className="mt-2 text-2xl font-black text-slate-900">₹{(taxDeduction / 1000).toFixed(0)}K</p>
            <p className="mt-1 text-sm text-slate-600">Includes tax and statutory deductions before payout.</p>
          </div>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <li className="rounded-2xl border border-sky-100 bg-white/90 p-3">{financeEmployees.length} employees are included in the current pay run.</li>
          <li className="rounded-2xl border border-sky-100 bg-white/90 p-3">Payout readiness is at ₹{Math.round(payoutReady / 1000)}K, with final approval scheduled before 12 Jun.</li>
          <li className="rounded-2xl border border-sky-100 bg-white/90 p-3">Provident contribution reserve is set at ₹{Math.round(providentFund / 1000)}K for the month.</li>
        </ul>
      </SparkCard>

      <SparkCard className="rounded-[2rem] border border-rose-100 bg-[#fff5f5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-rose-700">Payslip focus</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">Key salary revisions this month</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          {topEarners.map((emp) => (
            <div key={emp.id} className="flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white/90 p-3">
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

    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <SparkCard className="rounded-[2rem] border border-emerald-100 bg-[#effcf5] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-700">Salary mix</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">Payroll contribution by department</h3>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          {departmentMix.map(([dept, total]) => (
            <div key={dept} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/90 p-3">
              <span className="font-semibold text-slate-900">{dept}</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">₹{Math.round(total / 1000)}K</span>
            </div>
          ))}
        </div>
      </SparkCard>

      <SparkCard className="rounded-[2rem] border border-amber-100 bg-[#fffaf0] p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-700">Payroll actions</p>
        <h3 className="mt-3 text-xl font-black text-slate-900">What needs attention this cycle</h3>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Confirm employee level revisions and salary changes before release.</li>
          <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Review tax and provident calculations for the current batch.</li>
          <li className="rounded-2xl border border-amber-100 bg-white/90 p-3">Approve final payout list and payslip distribution by 12 Jun.</li>
        </ul>
      </SparkCard>
    </div>
  </div>
  );
};

export default PayrollModule;
