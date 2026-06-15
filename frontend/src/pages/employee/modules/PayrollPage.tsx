import React, { useMemo, useState } from "react";
import { Download, FileText, Info, Search, WalletCards } from "lucide-react";
import { motion } from "framer-motion";

type PayslipRecord = {
  month: string;
  year: string;
  creditedOn: string;
  netSalary: string;
  status: "Available" | "Processing";
};

const LOCAL_STORAGE_KEY = "employeePayslips";

const defaultPayslipRecords: PayslipRecord[] = [
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

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = ["2026", "2025", "2024"];

const pastelCard =
  "rounded-[30px] border border-black/5 shadow-[0_14px_38px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.15)]";

const innerCard =
  "rounded-[22px] border border-black/5 bg-white/48 transition-all duration-300 hover:bg-white/65";

const inputClass =
  "h-12 w-full rounded-2xl border border-black/5 bg-white/65 px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const PayrollPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [payslipRecords, setPayslipRecords] = useState<PayslipRecord[]>(
    defaultPayslipRecords
  );

  React.useEffect(() => {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PayslipRecord[];

        if (Array.isArray(parsed)) {
          setPayslipRecords(parsed);
        }
      } catch {
        // ignore invalid storage data
      }
    }
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(payslipRecords)
    );
  }, [payslipRecords]);

  const matchedPayslip = useMemo(() => {
    if (!selectedMonth || !selectedYear) return null;

    return (
      payslipRecords.find(
        (item) => item.month === selectedMonth && item.year === selectedYear
      ) || null
    );
  }, [selectedMonth, selectedYear, payslipRecords]);

  const latestAvailablePayslip = useMemo(() => {
    return payslipRecords.find((item) => item.status === "Available") || null;
  }, [payslipRecords]);

  return (
    <div className="w-full space-y-7 text-[#0f172a]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[30px] border border-white/10 bg-[#162447] p-6 text-white shadow-[0_16px_42px_rgba(0,0,0,0.26)]"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              Employee Payroll Center
            </p>

            <h2 className="text-[34px] font-bold tracking-tight text-white">
              Payroll
            </h2>

            <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-white/72">
              View your salary summary and download monthly payslips.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 px-6 py-5">
            <p className="text-[14px] text-white/65">Current Month</p>

            <h3 className="mt-2 text-[30px] font-bold text-white">
              April 2026
            </h3>
          </div>
        </div>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Request Payslip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pastelCard} bg-[#d8d3e7] p-6 xl:col-span-7`}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
              <Search className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
                Request Payslip
              </h3>

              <p className="mt-1 text-[14px] text-[#64748b]">
                Select month and year to send a payslip request to HR.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                Month
              </label>

              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSubmitted(false);
                }}
                className={inputClass}
              >
                <option value="">Choose month</option>

                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                Year
              </label>

              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSubmitted(false);
                }}
                className={inputClass}
              >
                <option value="">Choose year</option>

                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  if (!selectedMonth || !selectedYear) {
                    alert("Please select month and year");
                    return;
                  }

                  setSubmitted(true);
                }}
                className="h-12 w-full rounded-2xl border border-black/5 bg-[#6356d8] px-6 text-[14px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5447ca] hover:shadow-[0_10px_20px_rgba(99,86,216,0.22)]"
              >
                Request to HR
              </button>
            </div>
          </div>

          {submitted && (
            <div className="mt-6 rounded-[24px] border border-emerald-200 bg-[#dcefe8] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[17px] font-bold text-[#15936b]">
                    Request Sent to HR
                  </p>

                  <p className="mt-1 text-[14px] text-[#475569]">
                    Payslip request for{" "}
                    <span className="font-semibold text-[#0f172a]">
                      {selectedMonth} {selectedYear}
                    </span>{" "}
                    has been submitted.
                  </p>

                  {matchedPayslip && (
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      Current status:{" "}
                      <span className="font-semibold text-[#0f172a]">
                        {matchedPayslip.status}
                      </span>
                    </p>
                  )}
                </div>

                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-2 text-[12px] font-semibold text-[#15936b]">
                  Pending HR Review
                </span>
              </div>
            </div>
          )}

          {/* Extra content to balance empty space */}
          <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className={`${innerCard} p-5`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                  <Info className="h-5 w-5" />
                </div>

                <h4 className="text-[17px] font-bold text-[#10223d]">
                  Request Guidelines
                </h4>
              </div>

              <div className="space-y-3 text-[14px] text-[#475569]">
                <p>• Choose the salary month and year correctly.</p>
                <p>• HR usually processes requests within 1–2 working days.</p>
                <p>• Available payslips can be downloaded directly.</p>
              </div>
            </div>

            <div className={`${innerCard} p-5`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-[#15936b]">
                  <WalletCards className="h-5 w-5" />
                </div>

                <h4 className="text-[17px] font-bold text-[#10223d]">
                  Latest Available
                </h4>
              </div>

              {latestAvailablePayslip ? (
                <div>
                  <p className="text-[22px] font-bold text-[#10223d]">
                    {latestAvailablePayslip.month} {latestAvailablePayslip.year}
                  </p>

                  <p className="mt-2 text-[14px] text-[#64748b]">
                    Credited on {latestAvailablePayslip.creditedOn}
                  </p>

                </div>
              ) : (
                <p className="text-[14px] text-[#64748b]">
                  No available payslip found.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payslip List */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pastelCard} bg-[#dcefe8] p-6 xl:col-span-5`}
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#15936b]">
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
                Your Payslips
              </h3>

              <p className="mt-1 text-[14px] text-[#64748b]">
                Payslips generated by HR will appear here.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {payslipRecords.length > 0 ? (
              payslipRecords.map((record) => (
                <div
                  key={`${record.month}-${record.year}`}
                  className="group relative overflow-hidden rounded-[22px] border border-black/70 bg-white/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-black/80 hover:bg-white/65"
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 ${
                      record.status === "Available"
                        ? "bg-[#15936b]"
                        : "bg-[#d97706]"
                    }`}
                  />

                  <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="pl-2">
                      <p className="text-[17px] font-bold text-[#10223d]">
                        {record.month} {record.year}
                      </p>

                      <p className="mt-1 text-[13px] text-[#64748b]">
                        Credited on {record.creditedOn || "—"}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3 pl-2 sm:pl-0">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold ${
                          record.status === "Available"
                            ? "border-emerald-200 bg-emerald-100 text-[#15936b]"
                            : "border-amber-200 bg-amber-100 text-[#b45309]"
                        }`}
                      >
                        {record.status}
                      </span>

                      {record.status === "Available" && (
                        <button
                          type="button"
                          onClick={() =>
                            alert(
                              `Downloading payslip for ${record.month} ${record.year}`
                            )
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-black/5 bg-[#15936b] px-4 py-2 text-[13px] font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f7f5d]"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black/5 bg-white/40 p-6 text-center text-[14px] text-[#64748b]">
                No payslips have been generated yet.
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default PayrollPage;