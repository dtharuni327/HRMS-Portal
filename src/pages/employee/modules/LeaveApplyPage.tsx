import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  FileUp,
  Info,
  Plane,
  WalletCards,
} from "lucide-react";

type LeaveTab = "apply" | "history" | "requests";

const leaveBalanceCards = [
  {
    title: "Annual Leave",
    value: 8,
    color: "text-[#4b3f72]",
    bg: "bg-[#f3f0ff]",
  },
  {
    title: "Sick Leave",
    value: 3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    title: "Casual Leave",
    value: 2,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "Loss of Pay",
    value: 0,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
];

const upcomingHolidays = [
  { title: "Independence Day", date: "15 Aug 2026" },
  { title: "Ganesh Chaturthi", date: "27 Aug 2026" },
  { title: "Gandhi Jayanti", date: "02 Oct 2026" },
];

const LeaveApplyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaveTab>("apply");
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [submitted, setSubmitted] = useState(false);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const cardHover =
    "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">
              Leave Management
            </h2>
            <p className="mt-2 text-[14px] text-white/80">
              Apply for leave, track balances, and manage your requests from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {(["apply", "history", "requests"] as LeaveTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-5 py-2.5 text-[14px] font-semibold transition ${
                  activeTab === tab
                    ? "bg-white text-[#4b3f72]"
                    : "border border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {tab === "apply"
                  ? "Apply Leave"
                  : tab === "history"
                  ? "History"
                  : "Requests"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {activeTab === "apply" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 ${cardHover}`}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <Plane className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[24px] font-semibold text-[#1e293b]">
                  Apply for Leave
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Fill in your leave details and submit for approval.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Leave Type
                </label>
                <div className="relative">
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="h-12 w-full appearance-none rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                  >
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Comp Off</option>
                    <option>Loss of Pay</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                    />
                    <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 rounded-2xl bg-[#f8fafc] p-4 md:grid-cols-3">
                <div>
                  <p className="text-[13px] text-[#64748b]">Selected Type</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    {leaveType}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#64748b]">Duration</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    {totalDays > 0 ? `${totalDays} day(s)` : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-[13px] text-[#64748b]">Approval SLA</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#1e293b]">
                    1–2 business days
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Reason
                </label>
                <textarea
                  rows={5}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for leave"
                  className="w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 py-3 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                />
              </div>

              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                  Upload Document <span className="text-[#64748b]">(optional)</span>
                </label>
                <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-[#cdbdf9] bg-[#faf8ff] px-4 py-4 transition hover:border-[#4b3f72]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#f3f0ff] p-2">
                      <FileUp className="h-4 w-4 text-[#4b3f72]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#1e293b]">
                        {fileName || "Choose a file to upload"}
                      </p>
                      <p className="text-[12px] text-[#64748b]">
                        PDF, JPG, PNG up to 5 MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  />
                  <span className="rounded-xl bg-[#4b3f72] px-4 py-2 text-[13px] font-semibold text-white">
                    Browse
                  </span>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#4b3f72] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
                >
                  Apply Leave
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-[#4b3f72] bg-white px-6 py-3 text-[14px] font-semibold text-[#4b3f72] transition hover:bg-[#f3f0ff]"
                >
                  Cancel
                </button>
              </div>

              {submitted && (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-[14px] font-medium text-emerald-700">
                  Your leave request has been submitted successfully.
                </div>
              )}
            </form>
          </motion.div>

          <div className="space-y-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-[22px] font-semibold text-[#1e293b]">
                    Leave Balance
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Balance for {selectedMonth}
                  </p>
                </div>

                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="h-11 appearance-none rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-10 text-[14px] text-[#1e293b] outline-none transition focus:border-[#4b3f72]"
                  >
                    <option>April 2026</option>
                    <option>May 2026</option>
                    <option>June 2026</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {leaveBalanceCards.map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-2xl border border-[#ece7ff] p-5 ${card.bg}`}
                  >
                    <p className={`text-[16px] font-semibold ${card.color}`}>
                      {card.title}
                    </p>
                    <p className={`mt-3 text-[36px] font-semibold ${card.color}`}>
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-[#f3f0ff] p-3">
                  <Info className="h-5 w-5 text-[#4b3f72]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1e293b]">
                    Leave Process
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    How your request gets approved
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  "Select leave type and dates",
                  "Submit request with reason",
                  "Manager reviews your request",
                  "HR finalizes and updates balance",
                ].map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-2xl bg-[#f8fafc] p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4b3f72] text-[13px] font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-[14px] text-[#1e293b]">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-2xl bg-[#f3f0ff] p-3">
                  <WalletCards className="h-5 w-5 text-[#4b3f72]" />
                </div>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1e293b]">
                    Policy Snapshot
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Quick reminders before applying
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-[14px] font-medium text-[#1e293b]">
                    Minimum notice for planned leave
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    Apply at least 2 working days in advance.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="text-[14px] font-medium text-[#1e293b]">
                    Medical proof for sick leave
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748b]">
                    Required if leave exceeds 2 consecutive days.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#4b3f72]" />
                    <p className="text-[14px] font-medium text-[#1e293b]">
                      Upcoming Holidays
                    </p>
                  </div>
                  <div className="space-y-2">
                    {upcomingHolidays.map((holiday) => (
                      <div
                        key={holiday.title}
                        className="flex items-center justify-between rounded-xl bg-white px-3 py-2"
                      >
                        <span className="text-[13px] text-[#1e293b]">
                          {holiday.title}
                        </span>
                        <span className="text-[12px] text-[#64748b]">
                          {holiday.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <h3 className="text-[22px] font-semibold text-[#1e293b]">
            Leave History
          </h3>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Previously applied leave records will appear here.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[#ece7ff] text-[13px] text-[#64748b]">
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">From</th>
                  <th className="px-3 py-3">To</th>
                  <th className="px-3 py-3">Days</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    type: "Annual Leave",
                    from: "04 Apr 2026",
                    to: "05 Apr 2026",
                    days: 2,
                    status: "Approved",
                  },
                  {
                    type: "Sick Leave",
                    from: "18 Mar 2026",
                    to: "18 Mar 2026",
                    days: 1,
                    status: "Approved",
                  },
                ].map((row) => (
                  <tr key={`${row.type}-${row.from}`} className="border-b border-[#f3f0ff]">
                    <td className="px-3 py-4 text-[14px] text-[#1e293b]">{row.type}</td>
                    <td className="px-3 py-4 text-[14px] text-[#64748b]">{row.from}</td>
                    <td className="px-3 py-4 text-[14px] text-[#64748b]">{row.to}</td>
                    <td className="px-3 py-4 text-[14px] text-[#1e293b]">{row.days}</td>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-medium text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeTab === "requests" && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <h3 className="text-[22px] font-semibold text-[#1e293b]">
            Pending Requests
          </h3>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Requests awaiting manager or HR approval.
          </p>

          <div className="mt-6 space-y-4">
            {[
              {
                type: "Casual Leave",
                date: "22 Apr 2026 - 23 Apr 2026",
                status: "Under Review",
              },
              {
                type: "Comp Off",
                date: "29 Apr 2026",
                status: "Pending Manager Approval",
              },
            ].map((request) => (
              <div
                key={`${request.type}-${request.date}`}
                className="rounded-2xl border border-[#ece7ff] bg-[#faf8ff] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1e293b]">
                      {request.type}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      {request.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-[12px] font-medium text-amber-700">
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};


export default LeaveApplyPage;
