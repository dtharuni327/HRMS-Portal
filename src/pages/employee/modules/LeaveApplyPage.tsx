import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  FileText,
  FileUp,
  Home,
  Info,
  Laptop,
  Plane,
  WalletCards,
} from "lucide-react";

type LeaveTab = "apply" | "wfh" | "history" | "requests";
type WfhRequestType = "day" | "permanent";

const leaveBalanceCards = [
  { title: "Annual Leave", value: 8 },
  { title: "Sick Leave", value: 3 },
  { title: "Casual Leave", value: 2 },
  { title: "Loss of Pay", value: 0 },
];

const upcomingHolidays = [
  { title: "Independence Day", date: "15 Aug 2026" },
  { title: "Ganesh Chaturthi", date: "27 Aug 2026" },
  { title: "Gandhi Jayanti", date: "02 Oct 2026" },
];

const wfhMonthlyUsage = {
  month: "April 2026",
  usedDays: 4,
  monthlyLimit: 8,
  isPermanentWfh: false,
  pendingRequests: 1,
  approvedRequests: 3,
};

const pageCard =
  "rounded-[30px] border border-black/5 shadow-[0_12px_34px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.16)]";

const innerCard =
  "rounded-[22px] border border-black/30 bg-white/48 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]";

const inputClass =
  "h-12 w-full rounded-2xl border border-black/5 bg-white/65 px-4 pr-10 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const LeaveApplyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaveTab>("apply");
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fileName, setFileName] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("April 2026");
  const [submitted, setSubmitted] = useState(false);

  const [wfhType, setWfhType] = useState<WfhRequestType>("day");
  const [wfhStartDate, setWfhStartDate] = useState("");
  const [wfhEndDate, setWfhEndDate] = useState("");
  const [wfhReason, setWfhReason] = useState("");
  const [wfhSubmitted, setWfhSubmitted] = useState(false);

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();

    if (diff < 0) return 0;

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const wfhRequestDays = useMemo(() => {
    if (wfhType === "permanent") return 0;
    if (!wfhStartDate || !wfhEndDate) return 0;

    const start = new Date(wfhStartDate);
    const end = new Date(wfhEndDate);
    const diff = end.getTime() - start.getTime();

    if (diff < 0) return 0;

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  }, [wfhType, wfhStartDate, wfhEndDate]);

  const wfhRemainingDays = Math.max(
    wfhMonthlyUsage.monthlyLimit - wfhMonthlyUsage.usedDays,
    0,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (!leaveType) return alert("Please select leave type");
    if (!startDate) return alert("Please select start date");
    if (!endDate) return alert("Please select end date");
    if (totalDays <= 0) return alert("End date must be after start date");
    if (!reason.trim()) return alert("Please enter reason for leave");

    setSubmitted(true);
  };

  const handleWfhSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWfhSubmitted(false);

    if (wfhType === "day") {
      if (!wfhStartDate) return alert("Please select WFH start date");
      if (!wfhEndDate) return alert("Please select WFH end date");
      if (wfhRequestDays <= 0) return alert("WFH end date must be after start date");
    }

    if (!wfhReason.trim()) return alert("Please enter reason for work from home");

    setWfhSubmitted(true);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#081224] px-4 py-6 text-[#0f172a]">
      <div className="mx-auto min-h-screen w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[30px] border border-white/10 bg-[#172554] p-6 text-white shadow-[0_14px_38px_rgba(0,0,0,0.28)]"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-sky-200">
                Employee Leave Center
              </p>
              <h2 className="text-[30px] font-semibold tracking-tight text-white">
                Leave Management
              </h2>
              <p className="mt-2 text-[14px] text-white/70">
                Apply for leave, work from home, track balances, and manage your requests from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {(["apply", "wfh", "history", "requests"] as LeaveTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-[16px] px-5 py-2.5 text-[14px] font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-[#6356d8] text-white shadow-[0_10px_22px_rgba(99,86,216,0.28)] hover:bg-[#5447ca]"
                      : "border border-white/12 bg-white/8 text-white/75 hover:bg-white/15 hover:text-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.12)]"
                  }`}
                >
                  {tab === "apply"
                    ? "Apply Leave"
                    : tab === "wfh"
                      ? "WFH Request"
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
              className={`${pageCard} bg-[#d6d0e4] p-6 xl:col-span-7`}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-[20px] border border-black/5 bg-white/45 p-3 text-[#6356d8]">
                  <Plane className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-[24px] font-semibold tracking-tight text-[#111827]">
                    Apply for Leave
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Fill in your leave details and submit for approval.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Leave Type
                  </label>

                  <div className="relative">
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Comp Off">Comp Off</option>
                      <option value="Loss of Pay">Loss of Pay</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                      Start Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setSubmitted(false);
                        }}
                        className={inputClass}
                      />
                      <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                      End Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setSubmitted(false);
                        }}
                        className={inputClass}
                      />
                      <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                    </div>
                  </div>
                </div>

                <div className={`${innerCard} grid grid-cols-1 gap-4 p-4 md:grid-cols-3`}>
                  <div>
                    <p className="text-[13px] text-[#64748b]">Selected Type</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {leaveType}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-[#64748b]">Duration</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {totalDays > 0 ? `${totalDays} day(s)` : "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-[#64748b]">Approval SLA</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      1–2 business days
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Reason
                  </label>

                  <textarea
                    rows={5}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setSubmitted(false);
                    }}
                    placeholder="Enter reason for leave"
                    className="w-full rounded-2xl border border-black/5 bg-white/65 px-4 py-3 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Upload Document <span className="font-medium text-[#64748b]">(optional)</span>
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-black/10 bg-white/45 px-4 py-4 transition hover:border-[#6356d8]/35 hover:bg-white/65">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#6356d8]/10 p-2 text-[#6356d8]">
                        <FileUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#111827]">
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
                      onChange={(e) => {
                        setFileName(e.target.files?.[0]?.name || "");
                        setSubmitted(false);
                      }}
                    />

                    <span className="rounded-xl bg-[#6356d8] px-4 py-2 text-[13px] font-semibold text-white">
                      Browse
                    </span>
                  </label>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#6356d8] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#5447ca] hover:shadow-[0_10px_20px_rgba(99,86,216,0.25)]"
                  >
                    Apply Leave
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLeaveType("Annual Leave");
                      setStartDate("");
                      setEndDate("");
                      setReason("");
                      setFileName("");
                      setSubmitted(false);
                    }}
                    className="rounded-2xl border border-black/5 bg-white/55 px-6 py-3 text-[14px] font-semibold text-[#0f172a] transition hover:bg-white/75"
                  >
                    Cancel
                  </button>
                </div>

                {submitted && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-[#15936b]">
                    Your leave request has been submitted successfully.
                  </div>
                )}
              </form>
            </motion.div>

            <div className="space-y-6 xl:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${pageCard} bg-[#dcefe8] p-6`}
              >
                <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[22px] font-semibold text-[#10223d]">
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
                      className={`${inputClass} h-11 appearance-none`}
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
                    <div key={card.title} className={`${innerCard} p-5 transition hover:bg-white/65`}>
                      <p className="text-[15px] font-semibold text-[#475569]">
                        {card.title}
                      </p>
                      <p className="mt-3 text-[36px] font-semibold tracking-tight text-[#15936b]">
                        {card.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${pageCard} bg-[#ddd8ea] p-6`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/5 bg-white/45 text-[#6356d8]">
                    <Info className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-[22px] font-bold tracking-tight text-[#111827]">
                      Leave Process
                    </h3>
                    <p className="mt-1 text-[14px] text-[#64748b]">
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
                    <div key={step} className={`${innerCard} relative overflow-hidden p-4 transition hover:bg-white/65`}>
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#6356d8]" />

                      <div className="flex items-center gap-4 pl-2">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6356d8] text-[15px] font-bold text-white shadow-[0_10px_20px_rgba(99,86,216,0.22)]">
                          {index + 1}
                        </div>

                        <div>
                          <p className="text-[15px] font-semibold text-[#111827]">
                            {step}
                          </p>
                          <p className="mt-1 text-[13px] text-[#64748b]">
                            Step {index + 1} of 4
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${pageCard} bg-[#efe7cf] p-6`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/5 bg-white/45 text-[#b7791f]">
                    <WalletCards className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-[24px] font-bold tracking-tight text-[#111827]">
                      Policy Snapshot
                    </h3>
                    <p className="mt-1 text-[14px] text-[#64748b]">
                      Quick reminders before applying
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Minimum notice for planned leave", "Apply at least 2 working days in advance."],
                    ["Medical proof for sick leave", "Required if leave exceeds 2 consecutive days."],
                  ].map(([title, desc]) => (
                    <div key={title} className={`${innerCard} relative overflow-hidden p-5 transition hover:bg-white/65`}>
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#c87d16]" />
                      <div className="pl-2">
                        <p className="text-[16px] font-bold text-[#111827]">{title}</p>
                        <p className="mt-1 text-[14px] text-[#64748b]">{desc}</p>
                      </div>
                    </div>
                  ))}

                  <div className={`${innerCard} relative overflow-hidden p-5`}>
                    <div className="absolute left-0 top-0 h-full w-1 bg-[#c87d16]" />
                    <div className="pl-2">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c87d16] text-white">
                          <FileText className="h-5 w-5" />
                        </div>
                        <p className="text-[17px] font-bold text-[#111827]">
                          Upcoming Holidays
                        </p>
                      </div>

                      <div className="space-y-3">
                        {upcomingHolidays.map((holiday) => (
                          <div key={holiday.title} className="flex items-center justify-between rounded-2xl border border-black/30 bg-white/40 px-4 py-3 transition hover:bg-white/65">
                            <span className="text-[14px] font-semibold text-[#111827]">
                              {holiday.title}
                            </span>
                            <span className="text-[13px] text-[#64748b]">
                              {holiday.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "wfh" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${pageCard} bg-[#d6d0e4] p-6 xl:col-span-7`}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-[20px] border border-black/5 bg-white/45 p-3 text-[#6356d8]">
                  <Home className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-[24px] font-semibold tracking-tight text-[#111827]">
                    Work From Home Request
                  </h3>
                  <p className="text-[14px] text-[#64748b]">
                    Submit a day-based or permanent WFH request to HR.
                  </p>
                </div>
              </div>

              <form onSubmit={handleWfhSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Request Type
                  </label>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setWfhType("day");
                        setWfhSubmitted(false);
                      }}
                      className={`rounded-[22px] border p-5 text-left transition ${
                        wfhType === "day"
                          ? "border-[#6356d8] bg-white/70 shadow-[0_10px_24px_rgba(99,86,216,0.16)]"
                          : "border-black/10 bg-white/42 hover:bg-white/65"
                      }`}
                    >
                      <CalendarDays className="mb-3 h-5 w-5 text-[#6356d8]" />
                      <p className="text-[16px] font-bold text-[#111827]">Day WFH Request</p>
                      <p className="mt-1 text-[13px] text-[#64748b]">
                        Use this for one or multiple selected days.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setWfhType("permanent");
                        setWfhStartDate("");
                        setWfhEndDate("");
                        setWfhSubmitted(false);
                      }}
                      className={`rounded-[22px] border p-5 text-left transition ${
                        wfhType === "permanent"
                          ? "border-[#15936b] bg-white/70 shadow-[0_10px_24px_rgba(21,147,107,0.16)]"
                          : "border-black/10 bg-white/42 hover:bg-white/65"
                      }`}
                    >
                      <Laptop className="mb-3 h-5 w-5 text-[#15936b]" />
                      <p className="text-[16px] font-bold text-[#111827]">Permanent WFH</p>
                      <p className="mt-1 text-[13px] text-[#64748b]">
                        Use this when employee works remotely permanently.
                      </p>
                    </button>
                  </div>
                </div>

                {wfhType === "day" && (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                        WFH Start Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={wfhStartDate}
                          onChange={(e) => {
                            setWfhStartDate(e.target.value);
                            setWfhSubmitted(false);
                          }}
                          className={inputClass}
                        />
                        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                        WFH End Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={wfhEndDate}
                          onChange={(e) => {
                            setWfhEndDate(e.target.value);
                            setWfhSubmitted(false);
                          }}
                          className={inputClass}
                        />
                        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                      </div>
                    </div>
                  </div>
                )}

                <div className={`${innerCard} grid grid-cols-1 gap-4 p-4 md:grid-cols-3`}>
                  <div>
                    <p className="text-[13px] text-[#64748b]">Selected Type</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {wfhType === "day" ? "Day WFH" : "Permanent WFH"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-[#64748b]">Duration</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      {wfhType === "permanent"
                        ? "Permanent"
                        : wfhRequestDays > 0
                          ? `${wfhRequestDays} day(s)`
                          : "--"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[13px] text-[#64748b]">Approval SLA</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#111827]">
                      HR review required
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Reason
                  </label>

                  <textarea
                    rows={5}
                    value={wfhReason}
                    onChange={(e) => {
                      setWfhReason(e.target.value);
                      setWfhSubmitted(false);
                    }}
                    placeholder="Enter reason for work from home"
                    className="w-full rounded-2xl border border-black/5 bg-white/65 px-4 py-3 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    className="rounded-2xl bg-[#6356d8] px-6 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:bg-[#5447ca] hover:shadow-[0_10px_20px_rgba(99,86,216,0.25)]"
                  >
                    Submit WFH Request
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWfhType("day");
                      setWfhStartDate("");
                      setWfhEndDate("");
                      setWfhReason("");
                      setWfhSubmitted(false);
                    }}
                    className="rounded-2xl border border-black/5 bg-white/55 px-6 py-3 text-[14px] font-semibold text-[#0f172a] transition hover:bg-white/75"
                  >
                    Cancel
                  </button>
                </div>

                {wfhSubmitted && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-[#15936b]">
                    Your WFH request has been submitted to HR successfully.
                  </div>
                )}
              </form>
            </motion.div>

            <div className="space-y-6 xl:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${pageCard} bg-[#dcefe8] p-6`}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/5 bg-white/45 text-[#15936b]">
                    <Laptop className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-[22px] font-bold tracking-tight text-[#111827]">
                      WFH Summary
                    </h3>
                    <p className="mt-1 text-[14px] text-[#64748b]">
                      Status for {wfhMonthlyUsage.month}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className={`${innerCard} p-5`}>
                    <p className="text-[14px] font-semibold text-[#475569]">
                      WFH This Month
                    </p>
                    <p className="mt-3 text-[38px] font-bold text-[#15936b]">
                      {wfhMonthlyUsage.isPermanentWfh ? "∞" : wfhMonthlyUsage.usedDays}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      {wfhMonthlyUsage.isPermanentWfh
                        ? "Permanent remote employee"
                        : `of ${wfhMonthlyUsage.monthlyLimit} days used`}
                    </p>
                  </div>

                  <div className={`${innerCard} p-5`}>
                    <p className="text-[14px] font-semibold text-[#475569]">
                      Remaining Days
                    </p>
                    <p className="mt-3 text-[38px] font-bold text-[#6356d8]">
                      {wfhMonthlyUsage.isPermanentWfh ? "N/A" : wfhRemainingDays}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      {wfhMonthlyUsage.isPermanentWfh
                        ? "Monthly limit not applied"
                        : "available this month"}
                    </p>
                  </div>

                  <div className={`${innerCard} p-5`}>
                    <p className="text-[14px] font-semibold text-[#475569]">
                      Approved
                    </p>
                    <p className="mt-3 text-[38px] font-bold text-[#0d6db8]">
                      {wfhMonthlyUsage.approvedRequests}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      approved requests
                    </p>
                  </div>

                  <div className={`${innerCard} p-5`}>
                    <p className="text-[14px] font-semibold text-[#475569]">
                      Pending HR
                    </p>
                    <p className="mt-3 text-[38px] font-bold text-[#c87d16]">
                      {wfhMonthlyUsage.pendingRequests}
                    </p>
                    <p className="mt-1 text-[13px] text-[#64748b]">
                      waiting for approval
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${pageCard} bg-[#efe7cf] p-6`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/5 bg-white/45 text-[#b7791f]">
                    <Info className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-[22px] font-bold tracking-tight text-[#111827]">
                      WFH Policy
                    </h3>
                    <p className="mt-1 text-[14px] text-[#64748b]">
                      Quick rules before submitting
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Day request", "Choose start and end dates for temporary WFH."],
                    ["Permanent request", "No monthly day count is applied after HR approval."],
                    ["HR approval", "All WFH requests are reviewed and approved by HR."],
                  ].map(([title, desc]) => (
                    <div key={title} className={`${innerCard} relative overflow-hidden p-5`}>
                      <div className="absolute left-0 top-0 h-full w-1 bg-[#c87d16]" />
                      <div className="pl-2">
                        <p className="text-[16px] font-bold text-[#111827]">{title}</p>
                        <p className="mt-1 text-[14px] text-[#64748b]">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${pageCard} bg-[#d6d0e4] p-6`}
          >
            <h3 className="text-[22px] font-semibold text-[#111827]">
              Leave History
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Previously applied leave and WFH records will appear here.
            </p>
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${pageCard} bg-[#dcefe8] p-6`}
          >
            <h3 className="text-[22px] font-semibold text-[#111827]">
              Pending Requests
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Leave and WFH requests awaiting manager or HR approval.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaveApplyPage;
