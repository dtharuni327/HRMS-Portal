import React, { useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  CalendarDays,
  CreditCard,
  Download,
  FileText,
  Search,
  WalletCards,
} from "lucide-react";
import { motion } from "framer-motion";

type PayslipRecord = {
  month: string;
  year: string;
  creditedOn: string;
  netSalary: string;
  status: "Available" | "Processing";
};

const payslipRecords: PayslipRecord[] = [
  {
    month: "March",
    year: "2026",
    creditedOn: "31 Mar 2026",
    netSalary: "₹62,500",
    status: "Available",
  },
  {
    month: "February",
    year: "2026",
    creditedOn: "28 Feb 2026",
    netSalary: "₹62,500",
    status: "Available",
  },
  {
    month: "January",
    year: "2026",
    creditedOn: "31 Jan 2026",
    netSalary: "₹61,800",
    status: "Available",
  },
  {
    month: "April",
    year: "2026",
    creditedOn: "-",
    netSalary: "-",
    status: "Processing",
  },
];

const salaryBreakdown = [
  { label: "Basic Pay", value: "₹35,000" },
  { label: "House Rent Allowance", value: "₹14,000" },
  { label: "Special Allowance", value: "₹10,500" },
  { label: "Performance Incentive", value: "₹5,000" },
];

const deductions = [
  { label: "Provident Fund", value: "₹2,400" },
  { label: "Professional Tax", value: "₹200" },
  { label: "Income Tax", value: "₹4,100" },
  { label: "Health Insurance", value: "₹300" },
];

const cardHoverClass =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const PayrollPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const matchedPayslip = useMemo(() => {
    if (!selectedMonth || !selectedYear) return null;

    return (
      payslipRecords.find(
        (item) => item.month === selectedMonth && item.year === selectedYear
      ) || null
    );
  }, [selectedMonth, selectedYear]);

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleDownload = () => {
    alert(`Downloading payslip for ${selectedMonth} ${selectedYear}`);
  };

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">Payroll</h2>
            <p className="mt-2 text-[14px] text-white/80">
              View your salary summary and download monthly payslips.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-[13px] text-white/70">Current Month Net Pay</p>
            <p className="mt-1 text-[24px] font-semibold">₹62,500</p>
          </div>
        </div>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHoverClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Net Salary</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">₹62,500</p>
            </div>
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <WalletCards className="h-5 w-5 text-[#4b3f72]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHoverClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Gross Salary</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">₹64,500</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <BadgeIndianRupee className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHoverClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Total Deductions</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">₹7,000</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3">
              <CreditCard className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHoverClass}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Pay Date</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">31 Mar</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <CalendarDays className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 ${cardHoverClass}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <Search className="h-5 w-5 text-[#4b3f72]" />
            </div>
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                Payslip Request
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Select month and year to check and download your payslip
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Select Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
              >
                <option value="">Choose month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
              >
                <option value="">Choose year</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="h-12 w-full rounded-2xl bg-[#4b3f72] px-6 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
              >
                Submit
              </button>
            </div>
          </div>

          {submitted && (
            <div className="mt-6 rounded-2xl border border-[#dcd3ff] bg-[#f8fafc] p-5">
              {matchedPayslip ? (
                matchedPayslip.status === "Available" ? (
                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[16px] font-semibold text-[#1e293b]">
                          Payslip Found
                        </p>
                        <p className="mt-1 text-[14px] text-[#64748b]">
                          {matchedPayslip.month} {matchedPayslip.year} · Credited on{" "}
                          {matchedPayslip.creditedOn}
                        </p>
                      </div>

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-700">
                        Available
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-[14px] text-[#64748b]">Net Salary</p>
                        <p className="mt-1 text-[20px] font-semibold text-[#1e293b]">
                          {matchedPayslip.netSalary}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b3f72] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
                      >
                        <Download className="h-4 w-4" />
                        Download Payslip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[16px] font-semibold text-[#1e293b]">
                      Payslip Not Ready
                    </p>
                    <p className="text-[14px] text-[#64748b]">
                      Payslip for {matchedPayslip.month} {matchedPayslip.year} is still
                      processing.
                    </p>
                    <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-700">
                      Processing
                    </span>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <p className="text-[16px] font-semibold text-[#1e293b]">
                    No Payslip Found
                  </p>
                  <p className="text-[14px] text-[#64748b]">
                    No payslip exists for the selected month and year.
                  </p>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[12px] font-medium text-slate-600">
                    Not Available
                  </span>
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-5 ${cardHoverClass}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <FileText className="h-5 w-5 text-[#4b3f72]" />
            </div>
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                Salary Breakdown
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Current month earnings and deductions
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {salaryBreakdown.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-[#faf8ff] px-4 py-3"
              >
                <span className="text-[14px] text-[#64748b]">{item.label}</span>
                <span className="text-[14px] font-semibold text-[#1e293b]">
                  {item.value}
                </span>
              </div>
            ))}

            {deductions.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-3"
              >
                <span className="text-[14px] text-[#64748b]">{item.label}</span>
                <span className="text-[14px] font-semibold text-[#1e293b]">
                  {item.value}
                </span>
              </div>
            ))}

            <div className="mt-4 rounded-2xl border border-[#dcd3ff] bg-[#f3f0ff] p-4">
              <p className="text-[14px] text-[#64748b]">Take Home Salary</p>
              <p className="mt-1 text-[24px] font-semibold text-[#4b3f72]">
                ₹62,500
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PayrollPage;