import React, { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Building2,
  BarChart3,
} from "lucide-react";

interface PayrollRecord {
  id: number;
  employeeName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "processed" | "pending";
  processDate: string;
}

interface DepartmentPayroll {
  department: string;
  employees: number;
  totalCost: number;
  averageSalary: number;
  processed: number;
  pending: number;
}

interface DeductionAllowance {
  name: string;
  type: "allowance" | "deduction";
  count: number;
  totalAmount: number;
  percentage: number;
}

const PayrollOverview: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "processed" | "pending">("all");

  // Mock data
  const monthlyPayrollSummary = {
    totalPayroll: 2850000,
    salaryProcessed: 2620000,
    salaryPending: 230000,
    totalEmployees: 320,
    processedCount: 280,
    pendingCount: 40,
  };

  const payrollRecords: PayrollRecord[] = [
    {
      id: 1,
      employeeName: "John Doe",
      department: "Engineering",
      basicSalary: 65000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 72000,
      status: "processed",
      processDate: "2026-05-01",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      department: "Sales",
      basicSalary: 55000,
      allowances: 12000,
      deductions: 6000,
      netSalary: 61000,
      status: "processed",
      processDate: "2026-05-01",
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      department: "HR",
      basicSalary: 60000,
      allowances: 10000,
      deductions: 7000,
      netSalary: 63000,
      status: "pending",
      processDate: "",
    },
    {
      id: 4,
      employeeName: "Sarah Williams",
      department: "Marketing",
      basicSalary: 58000,
      allowances: 14000,
      deductions: 7200,
      netSalary: 64800,
      status: "processed",
      processDate: "2026-05-01",
    },
    {
      id: 5,
      employeeName: "Tom Brown",
      department: "Finance",
      basicSalary: 62000,
      allowances: 13000,
      deductions: 7500,
      netSalary: 67500,
      status: "pending",
      processDate: "",
    },
  ];

  const departmentPayrollCosts: DepartmentPayroll[] = [
    {
      department: "Engineering",
      employees: 120,
      totalCost: 8640000,
      averageSalary: 72000,
      processed: 110,
      pending: 10,
    },
    {
      department: "Sales",
      employees: 85,
      totalCost: 5185000,
      averageSalary: 61000,
      processed: 75,
      pending: 10,
    },
    {
      department: "HR",
      employees: 45,
      totalCost: 2835000,
      averageSalary: 63000,
      processed: 40,
      pending: 5,
    },
    {
      department: "Marketing",
      employees: 35,
      totalCost: 2268000,
      averageSalary: 64800,
      processed: 32,
      pending: 3,
    },
    {
      department: "Finance",
      employees: 25,
      totalCost: 1687500,
      averageSalary: 67500,
      processed: 23,
      pending: 2,
    },
    {
      department: "Operations",
      employees: 10,
      totalCost: 630000,
      averageSalary: 63000,
      processed: 8,
      pending: 2,
    },
  ];

  const deductionsAndAllowances: DeductionAllowance[] = [
    {
      name: "House Rent Allowance",
      type: "allowance",
      count: 320,
      totalAmount: 3200000,
      percentage: 28.5,
    },
    {
      name: "Dearness Allowance",
      type: "allowance",
      count: 280,
      totalAmount: 1960000,
      percentage: 17.4,
    },
    {
      name: "Medical Allowance",
      type: "allowance",
      count: 320,
      totalAmount: 960000,
      percentage: 8.5,
    },
    {
      name: "Performance Bonus",
      type: "allowance",
      count: 150,
      totalAmount: 1500000,
      percentage: 13.3,
    },
    {
      name: "Professional Tax",
      type: "deduction",
      count: 250,
      totalAmount: 500000,
      percentage: 4.4,
    },
    {
      name: "Provident Fund",
      type: "deduction",
      count: 320,
      totalAmount: 2560000,
      percentage: 22.7,
    },
    {
      name: "Health Insurance",
      type: "deduction",
      count: 320,
      totalAmount: 640000,
      percentage: 5.7,
    },
  ];

  const filteredRecords = payrollRecords.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtext,
    bgColor,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subtext?: string;
    bgColor: string;
  }) => (
    <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/70">{label}</h3>
        <div className={`rounded-lg p-2.5 ${bgColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">
          {typeof value === "number" ? `₹${(value / 100000).toFixed(1)}L` : value}
        </p>
        {subtext && <p className="mt-1 text-xs text-white/60">{subtext}</p>}
      </div>
    </div>
  );

  const totalAllowances = deductionsAndAllowances
    .filter((d) => d.type === "allowance")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  const totalDeductions = deductionsAndAllowances
    .filter((d) => d.type === "deduction")
    .reduce((sum, d) => sum + d.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Payroll Overview</h1>
        <p className="mt-2 text-white/60">
          Monitor and manage monthly payroll processing and salary distributions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={IndianRupee}
          label="Total Monthly Payroll"
          value={monthlyPayrollSummary.totalPayroll}
          subtext={`${monthlyPayrollSummary.totalEmployees} employees`}
          bgColor="bg-green-500/20 text-green-300"
        />
        <StatCard
          icon={CheckCircle}
          label="Salary Processed"
          value={monthlyPayrollSummary.salaryProcessed}
          subtext={`${monthlyPayrollSummary.processedCount} employees`}
          bgColor="bg-blue-500/20 text-blue-300"
        />
        <StatCard
          icon={Clock}
          label="Salary Pending"
          value={monthlyPayrollSummary.salaryPending}
          subtext={`${monthlyPayrollSummary.pendingCount} employees`}
          bgColor="bg-yellow-500/20 text-yellow-300"
        />
        <StatCard
          icon={TrendingUp}
          label="Processing Status"
          value={`${Math.round((monthlyPayrollSummary.processedCount / monthlyPayrollSummary.totalEmployees) * 100)}%`}
          subtext="of payroll completed"
          bgColor="bg-purple-500/20 text-purple-300"
        />
      </div>

      {/* Payroll Processing Records */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className="mb-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">Payroll Processing Records</h2>
            <p className="mt-1 text-sm text-white/60">
              Individual employee salary processing status
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search by employee or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder-white/40 transition focus:border-white/20 focus:bg-white/10 focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              {["all", "processed", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase transition ${
                    statusFilter === status
                      ? "bg-blue-500/30 text-blue-200"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payroll Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-white/60">
                  Department
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                  Basic Salary
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                  Allowances
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                  Deductions
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-white/60">
                  Net Salary
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-white/60">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr
                  key={rec.id}
                  className="border-b border-white/5 transition hover:bg-white/5"
                >
                  <td className="px-4 py-4 font-medium text-white">{rec.employeeName}</td>
                  <td className="px-4 py-4 text-white/80">{rec.department}</td>
                  <td className="px-4 py-4 text-right text-white/80">
                    ₹{rec.basicSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-green-300">+₹{rec.allowances.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-red-300">-₹{rec.deductions.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-white">
                    ₹{rec.netSalary.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                        rec.status === "processed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department-wise Payroll Cost */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Department-wise Payroll Cost</h2>
          <p className="mt-1 text-sm text-white/60">
            Payroll breakdown and distribution by department
          </p>
        </div>

        <div className="space-y-4">
          {departmentPayrollCosts.map((dept, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-300" />
                  <h3 className="font-semibold text-white">{dept.department}</h3>
                </div>
                <span className="text-sm font-bold text-white">
                  ₹{(dept.totalCost / 100000).toFixed(1)}L
                </span>
              </div>

              <div className="mb-3 grid grid-cols-5 gap-2 text-xs">
                <div className="rounded-lg bg-blue-500/10 p-2 text-center">
                  <p className="text-white/60">Employees</p>
                  <p className="text-lg font-bold text-white">{dept.employees}</p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-2 text-center">
                  <p className="text-white/60">Avg Salary</p>
                  <p className="text-sm font-bold text-green-300">
                    ₹{(dept.averageSalary / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="rounded-lg bg-green-500/10 p-2 text-center">
                  <p className="text-white/60">Processed</p>
                  <p className="text-lg font-bold text-green-300">{dept.processed}</p>
                </div>
                <div className="rounded-lg bg-yellow-500/10 p-2 text-center">
                  <p className="text-white/60">Pending</p>
                  <p className="text-lg font-bold text-yellow-300">{dept.pending}</p>
                </div>
                <div className="rounded-lg bg-blue-500/10 p-2 text-center">
                  <p className="text-white/60">% of Total</p>
                  <p className="text-sm font-bold text-blue-300">
                    {((dept.totalCost / monthlyPayrollSummary.totalPayroll) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{
                    width: `${(dept.totalCost / monthlyPayrollSummary.totalPayroll) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions and Allowances Summary */}
      <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Deductions & Allowances Summary</h2>
          <p className="mt-1 text-sm text-white/60">
            Breakdown of all salary components
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Allowances */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-green-300">Total Allowances</h3>
              <BarChart3 className="h-5 w-5 text-green-300" />
            </div>
            <p className="mb-4 text-2xl font-bold text-white">
              ₹{(totalAllowances / 100000).toFixed(1)}L
            </p>
            <div className="space-y-3">
              {deductionsAndAllowances
                .filter((d) => d.type === "allowance")
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/60">{item.count} employees</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-300">
                        ₹{(item.totalAmount / 100000).toFixed(1)}L
                      </p>
                      <p className="text-xs text-white/60">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-red-300">Total Deductions</h3>
              <BarChart3 className="h-5 w-5 text-red-300" />
            </div>
            <p className="mb-4 text-2xl font-bold text-white">
              ₹{(totalDeductions / 100000).toFixed(1)}L
            </p>
            <div className="space-y-3">
              {deductionsAndAllowances
                .filter((d) => d.type === "deduction")
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-xs text-white/60">{item.count} employees</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-300">
                        ₹{(item.totalAmount / 100000).toFixed(1)}L
                      </p>
                      <p className="text-xs text-white/60">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="border-t border-white/10 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-green-500/10 p-3 text-center">
              <p className="text-xs text-white/60">Total Allowances</p>
              <p className="mt-1 text-lg font-bold text-green-300">
                ₹{(totalAllowances / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3 text-center">
              <p className="text-xs text-white/60">Total Deductions</p>
              <p className="mt-1 text-lg font-bold text-red-300">
                ₹{(totalDeductions / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3 text-center">
              <p className="text-xs text-white/60">Net Impact</p>
              <p className="mt-1 text-lg font-bold text-blue-300">
                ₹{((totalAllowances - totalDeductions) / 100000).toFixed(1)}L
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollOverview;
