import { useState, type FC } from 'react';
import { Briefcase, Landmark, ShieldCheck, Users, Eye, PencilLine, X } from 'lucide-react';
import { SparkCard, StatCard } from '../FinanceShared';
import { financeEmployees } from './Payroll';

const salaryBreakdownTotal = 1.05;

const calculateBreakdown = (salary: number) => {
  const basic = Math.round(salary * 0.72);
  const hra = Math.round(salary * 0.12);
  const allowance = Math.round(salary * 0.08);
  const pf = Math.round(salary * 0.08);
  const tax = Math.round(salary * 0.05);
  const net = basic + hra + allowance - pf - tax;

  return { basic, hra, allowance, pf, tax, net };
};

const calculateSalaryFromBreakdown = (basic: number, hra: number, allowance: number, pf: number, tax: number) => {
  const total = basic + hra + allowance + pf + tax;
  return Math.round(total / salaryBreakdownTotal);
};

const calculateNetSalary = (basic: number, hra: number, allowance: number, pf: number, tax: number) =>
  basic + hra + allowance - pf - tax;

const formatSalaryLabel = (salary: number) => `₹${salary.toLocaleString('en-IN')}`;

const buildEmployeeRecord = (employee: { id: number; name: string; dept: string; salary: number }) => {
  const breakdown = calculateBreakdown(employee.salary);
  const bankName = employee.dept === 'Human Resources' ? 'SBI' : 'HDFC';
  const accountNumber = `${String(employee.id).padStart(4, '0')}${String(employee.id * 13).slice(-4)}`;
  const ifsc = employee.dept === 'Human Resources' ? 'SBIN0003456' : 'HDFC0008123';
  const branch = employee.dept === 'Human Resources' ? 'MG Road, Bengaluru' : 'Banjara Hills, Hyderabad';

  return {
    id: employee.id,
    name: employee.name,
    department: employee.dept,
    salary: employee.salary,
    salaryLabel: `₹${employee.salary.toLocaleString('en-IN')}`,
    bankName,
    accountNumber,
    ifsc,
    branch,
    bank: `${bankName} • A/c ${accountNumber}`,
    bankSummary: `${bankName} • A/c ${accountNumber} • IFSC ${ifsc} • ${branch}`,
    history: employee.id % 2 === 0 ? 'Updated this week' : 'Updated recently',
    ...breakdown,
  };
};

const EmployeeSalaryDetails: FC = () => {
  const [employees, setEmployees] = useState(() => financeEmployees.map(buildEmployeeRecord));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof employees)[number] | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<(typeof employees)[number] | null>(null);

  const updateEditingEmployee = (field: string, value: string | number) => {
    setEditingEmployee((prev) => {
      if (!prev) return prev;

      const next = { ...prev, [field]: value } as typeof prev;

      if (field === 'salary') {
        const salary = Number(value) || 0;
        const breakdown = calculateBreakdown(salary);

        return {
          ...next,
          salary,
          salaryLabel: formatSalaryLabel(salary),
          ...breakdown,
          net: calculateNetSalary(breakdown.basic, breakdown.hra, breakdown.allowance, breakdown.pf, breakdown.tax),
        };
      }

      if (['basic', 'hra', 'allowance', 'pf', 'tax'].includes(field)) {
        const basic = Number(next.basic) || 0;
        const hra = Number(next.hra) || 0;
        const allowance = Number(next.allowance) || 0;
        const pf = Number(next.pf) || 0;
        const tax = Number(next.tax) || 0;
        const salary = calculateSalaryFromBreakdown(basic, hra, allowance, pf, tax);

        return {
          ...next,
          salary,
          salaryLabel: formatSalaryLabel(salary),
          net: calculateNetSalary(basic, hra, allowance, pf, tax),
        };
      }

      return next;
    });
  };

  const filteredEmployees = employees.filter((employee) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      employee.id.toString().includes(term) ||
      employee.name.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term)
    );
  });

  const handleSaveChanges = () => {
    if (!editingEmployee) return;
    const updatedSalary = Number(editingEmployee.salary) || 0;
    const updatedBasic = Number(editingEmployee.basic) || 0;
    const updatedHra = Number(editingEmployee.hra) || 0;
    const updatedAllowance = Number(editingEmployee.allowance) || 0;
    const updatedPf = Number(editingEmployee.pf) || 0;
    const updatedTax = Number(editingEmployee.tax) || 0;

    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === editingEmployee.id
          ? {
              ...employee,
              ...editingEmployee,
              salary: updatedSalary || employee.salary,
              salaryLabel: editingEmployee.salaryLabel || formatSalaryLabel(updatedSalary || employee.salary),
              basic: updatedBasic,
              hra: updatedHra,
              allowance: updatedAllowance,
              pf: updatedPf,
              tax: updatedTax,
              bankName: editingEmployee.bankName,
              accountNumber: editingEmployee.accountNumber,
              ifsc: editingEmployee.ifsc,
              branch: editingEmployee.branch,
              bank: `${editingEmployee.bankName} • A/c ${editingEmployee.accountNumber}`,
              bankSummary: `${editingEmployee.bankName} • A/c ${editingEmployee.accountNumber} • IFSC ${editingEmployee.ifsc} • ${editingEmployee.branch}`,
              net: Number(editingEmployee.net) || calculateNetSalary(updatedBasic, updatedHra, updatedAllowance, updatedPf, updatedTax),
            }
          : employee
      )
    );

    setEditingEmployee(null);
  };

  return (
  <div className="space-y-6">
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard icon={<Users size={20} className="text-emerald-700" />} value="15" label="Active Employees" color="from-white via-emerald-50 to-emerald-100 text-emerald-800" />
      <StatCard icon={<Briefcase size={20} className="text-sky-700" />} value="₹8.4L" label="Average Salary" color="from-white via-sky-50 to-sky-100 text-sky-800" />
      <StatCard icon={<ShieldCheck size={20} className="text-violet-700" />} value="5" label="Departments" color="from-white via-violet-50 to-violet-100 text-violet-800" />
      <StatCard icon={<Landmark size={20} className="text-amber-700" />} value="98%" label="Salary Accuracy" color="from-white via-amber-50 to-amber-100 text-amber-800" />
    </div>

    <SparkCard className="rounded-2xl border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Employee Salary Details</p>
      <h3 className="mt-3 text-2xl font-black text-slate-900">Employee-wise salary details and pay structure</h3>
      <p className="mt-2 max-w-3xl text-sm text-slate-700">Use this view to review each employee’s salary structure, current pay level, salary history, and bank details when applicable.</p>
    </SparkCard>

    <SparkCard className="rounded-2xl border border-slate-200 bg-white/95 p-5 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">Search employee</p>
          <h4 className="mt-1 text-lg font-black text-slate-900">Find by employee ID or name</h4>
        </div>
        <div className="flex w-full max-w-xl items-center gap-3">
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by employee ID or name"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none ring-0 placeholder:text-slate-400"
          />
          <button
            type="button"
            className="rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Search
          </button>
        </div>
      </div>
    </SparkCard>

    <div className="grid gap-6 xl:grid-cols-2">
      {filteredEmployees.map((employee) => (
        <SparkCard key={employee.name} className="rounded-2xl border border-slate-200 bg-white/95 p-6 text-slate-800 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Employee</p>
              <h4 className="mt-2 text-xl font-black text-slate-900">{employee.name}</h4>
              <p className="text-sm text-slate-600">{employee.department}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Emp ID: {employee.id}</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{employee.salaryLabel}</span>
          </div>

          <div className="mt-5 grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-700">Current salary</span>
              <p className="mt-1 text-lg font-black text-emerald-900">{employee.salaryLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Last salary status: {employee.history}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Bank details: {employee.bankSummary}</div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSelectedEmployee(employee)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Eye size={14} /> View
            </button>
            <button
              type="button"
              onClick={() => setEditingEmployee(employee)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              <PencilLine size={14} /> Edit
            </button>
          </div>
        </SparkCard>
      ))}
    </div>

    {selectedEmployee && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-sky-800">View Details</p>
              <h4 className="mt-2 text-xl font-black text-slate-900">{selectedEmployee.name}</h4>
              <p className="text-sm text-slate-600">{selectedEmployee.department} • {selectedEmployee.salaryLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEmployee(null)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <X size={14} /> Close
            </button>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-slate-700 grid-cols-1 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Basic Salary: ₹{selectedEmployee.basic.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">House Rent Allowance: ₹{selectedEmployee.hra.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Other Allowances: ₹{selectedEmployee.allowance.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">PF: ₹{selectedEmployee.pf.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Tax Deduction: ₹{selectedEmployee.tax.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Net Salary: ₹{selectedEmployee.net.toLocaleString('en-IN')}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Last salary status: {selectedEmployee.history}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Bank name: {selectedEmployee.bankName}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Account number: {selectedEmployee.accountNumber}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">IFSC code: {selectedEmployee.ifsc}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Branch: {selectedEmployee.branch}</div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">Bank details: {selectedEmployee.bankSummary}</div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setSelectedEmployee(null)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
          </div>
        </div>
      </div>
    )}

    {editingEmployee && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-sm">
        <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.25)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-amber-700">Edit Salary</p>
              <h4 className="mt-2 text-xl font-black text-slate-900">Update salary details for {editingEmployee.name}</h4>
              <p className="text-sm text-slate-600">Make salary or bank changes and save them for the finance record.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditingEmployee(null)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <X size={14} /> Close
            </button>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-slate-700 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Basic salary</span>
              <input
                type="number"
                value={editingEmployee.basic}
                onChange={(event) => updateEditingEmployee('basic', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">House rent allowance</span>
              <input
                type="number"
                value={editingEmployee.hra}
                onChange={(event) => updateEditingEmployee('hra', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Other allowances</span>
              <input
                type="number"
                value={editingEmployee.allowance}
                onChange={(event) => updateEditingEmployee('allowance', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">PF</span>
              <input
                type="number"
                value={editingEmployee.pf}
                onChange={(event) => updateEditingEmployee('pf', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Tax deduction</span>
              <input
                type="number"
                value={editingEmployee.tax}
                onChange={(event) => updateEditingEmployee('tax', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Current salary</span>
              <input
                type="number"
                value={editingEmployee.salary}
                onChange={(event) => updateEditingEmployee('salary', Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Bank name</span>
              <input
                value={editingEmployee.bankName}
                onChange={(event) => updateEditingEmployee('bankName', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Account number</span>
              <input
                value={editingEmployee.accountNumber}
                onChange={(event) => updateEditingEmployee('accountNumber', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">IFSC code</span>
              <input
                value={editingEmployee.ifsc}
                onChange={(event) => updateEditingEmployee('ifsc', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Branch</span>
              <input
                value={editingEmployee.branch}
                onChange={(event) => updateEditingEmployee('branch', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
            <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-500">Salary history</span>
              <input
                value={editingEmployee.history}
                onChange={(event) => updateEditingEmployee('history', event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setEditingEmployee(null)} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="button" onClick={handleSaveChanges} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Save changes</button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default EmployeeSalaryDetails;