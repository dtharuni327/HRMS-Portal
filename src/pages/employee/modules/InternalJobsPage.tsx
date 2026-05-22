import React, { useMemo, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Filter,
  MapPin,
  Search,
  Send,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

type JobStatus = "Open" | "Closing Soon" | "Closed";
type ApplicationType = "Self" | "Referral";

type InternalJob = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  postedBy: string;
  postedDate: string;
  closingDate: string;
  openings: number;
  status: JobStatus;
  description: string;
  skills: string[];
};

const internalJobs: InternalJob[] = [
  {
    id: 1,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Hyderabad",
    type: "Full Time",
    experience: "1 - 3 Years",
    postedBy: "HR Team",
    postedDate: "22 Apr 2026",
    closingDate: "30 Apr 2026",
    openings: 3,
    status: "Open",
    description:
      "Build responsive HRMS interfaces, reusable components, and employee-facing dashboards.",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "HR Operations Specialist",
    department: "Human Resources",
    location: "Bangalore",
    type: "Full Time",
    experience: "2 - 4 Years",
    postedBy: "HR Team",
    postedDate: "20 Apr 2026",
    closingDate: "26 Apr 2026",
    openings: 2,
    status: "Closing Soon",
    description:
      "Support onboarding, employee documentation, internal communication, and HR operations.",
    skills: ["HRMS", "Onboarding", "Employee Relations"],
  },
  {
    id: 3,
    title: "Payroll Analyst",
    department: "Finance",
    location: "Remote",
    type: "Internal Transfer",
    experience: "1 - 2 Years",
    postedBy: "HR Team",
    postedDate: "18 Apr 2026",
    closingDate: "05 May 2026",
    openings: 1,
    status: "Open",
    description:
      "Assist payroll processing, payslip validation, salary reports, and employee payroll queries.",
    skills: ["Payroll", "Excel", "Compliance"],
  },
];

const statusClasses: Record<JobStatus, string> = {
  Open: "border border-emerald-200 bg-emerald-100 text-emerald-700",
  "Closing Soon": "border border-amber-200 bg-amber-100 text-amber-700",
  Closed: "border border-slate-200 bg-slate-100 text-slate-600",
};

const pastelCard =
  "rounded-[30px] border border-black/5 shadow-[0_14px_38px_rgba(15,23,42,0.10)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.15)]";

const inputClass =
  "h-11 w-full rounded-2xl border border-black/5 bg-white/65 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const modalInputClass =
  "h-12 w-full rounded-2xl border border-black/5 bg-white/65 px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const InternalJobsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [applicationModalJob, setApplicationModalJob] =
    useState<InternalJob | null>(null);
  const [applicationType, setApplicationType] =
    useState<ApplicationType>("Self");
  const [referralName, setReferralName] = useState("");
  const [referralEmail, setReferralEmail] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const departments = useMemo(() => {
    return ["All", ...Array.from(new Set(internalJobs.map((job) => job.department)))];
  }, []);

  const filteredJobs = useMemo(() => {
    return internalJobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchText) ||
        job.department.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText) ||
        job.type.toLowerCase().includes(searchText) ||
        job.skills.join(" ").toLowerCase().includes(searchText);

      const matchesDepartment =
        departmentFilter === "All" || job.department === departmentFilter;

      return matchesSearch && matchesDepartment;
    });
  }, [search, departmentFilter]);

  const openApplyModal = (job: InternalJob) => {
    setApplicationModalJob(job);
    setApplicationType("Self");
    setReferralName("");
    setReferralEmail("");
    setResumeFile(null);
  };

  const submitApplication = () => {
    if (!applicationModalJob) return;

    if (!resumeFile) {
      alert("Please upload resume.");
      return;
    }

    if (
      applicationType === "Referral" &&
      (!referralName.trim() || !referralEmail.trim())
    ) {
      alert("Please enter referral candidate name and email.");
      return;
    }

    const applicationPayload = {
      jobId: applicationModalJob.id,
      jobTitle: applicationModalJob.title,
      applicationType,
      appliedBy: "Ramakrishna",
      employeeId: "EMP-2048",
      candidateName:
        applicationType === "Referral" ? referralName : "Ramakrishna",
      candidateEmail:
        applicationType === "Referral"
          ? referralEmail
          : "ramakrishna@company.com",
      resumeFileName: resumeFile.name,
      status: "Pending",
    };

    console.log("Send this to HR backend:", applicationPayload);

    setAppliedJobIds((prev) =>
      prev.includes(applicationModalJob.id)
        ? prev
        : [...prev, applicationModalJob.id]
    );

    setApplicationModalJob(null);
  };

  const statCards = [
    {
      label: "Total Vacancies",
      value: internalJobs.length,
      icon: Briefcase,
      cardClass: "bg-[#e7e4f7] border-violet-200/50",
      iconClass: "bg-violet-100 text-[#6356d8]",
    },
    {
      label: "Applications Sent",
      value: appliedJobIds.length,
      icon: Send,
      cardClass: "bg-[#dcefe8] border-emerald-200/50",
      iconClass: "bg-emerald-100 text-[#15936b]",
    },
    {
      label: "Total Openings",
      value: internalJobs.reduce((sum, job) => sum + job.openings, 0),
      icon: Users,
      cardClass: "bg-[#dfe6f1] border-sky-200/50",
      iconClass: "bg-sky-100 text-[#0d6db8]",
    },
  ];

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
              Employee Career Center
            </p>

            <h2 className="text-[34px] font-bold tracking-tight text-white">
              Internal Jobs
            </h2>

            <p className="mt-2 max-w-[760px] text-[15px] leading-6 text-white/72">
              View internal vacancies announced by HR, apply for yourself, or
              refer a candidate.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 px-6 py-5">
            <p className="text-[14px] text-white/65">Open Vacancies</p>

            <h3 className="mt-2 text-[32px] font-bold text-white">
              {internalJobs.filter((job) => job.status !== "Closed").length}
            </h3>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ delay: index * 0.04, type: "spring", stiffness: 220, damping: 18 }}
              className={`${pastelCard} ${card.cardClass} p-6 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-[#475569]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-[32px] font-bold tracking-tight text-[#0f172a]">
                    {card.value}
                  </p>
                </div>

                <div className={`rounded-2xl p-3 ${card.iconClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Job Board */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${pastelCard} bg-[#ddd8ea] p-6`}
      >
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
              Available Internal Vacancies
            </h3>

            <p className="mt-1 text-[14px] text-[#64748b]">
              These openings are published by HR for internal employees.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className={`${inputClass} py-2 pl-10 pr-4 sm:w-[260px]`}
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className={`${inputClass} appearance-none py-2 pl-10 pr-10 sm:w-[190px]`}
              >
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department === "All" ? "All Departments" : department}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">
                ▾
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, index) => {
            const alreadyApplied = appliedJobIds.includes(job.id);

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                whileHover={{ y: -4, scale: 1.004 }}
                className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[24px] border border-black/5 bg-white/50 p-5 transition-all duration-300 hover:bg-white/65"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-[#6356d8]" />

                <div className="flex h-full flex-col gap-4 pl-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-[21px] font-bold tracking-tight text-[#10223d]">
                        {job.title}
                      </h4>

                      <p className="mt-2 text-[14px] leading-7 text-[#475569]">
                        {job.description}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${statusClasses[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2 text-[13px] text-[#475569]">
                      <Building2 className="h-4 w-4 text-[#6356d8]" />
                      <span>{job.department}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2 text-[13px] text-[#475569]">
                      <MapPin className="h-4 w-4 text-[#6356d8]" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2 text-[13px] text-[#475569]">
                      <Briefcase className="h-4 w-4 text-[#6356d8]" />
                      <span>{job.type}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2 text-[13px] text-[#475569]">
                      <Clock3 className="h-4 w-4 text-[#6356d8]" />
                      <span>{job.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2 text-[13px] text-[#475569] sm:col-span-2">
                      <CalendarDays className="h-4 w-4 text-[#6356d8]" />
                      <span>Closes: {job.closingDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-violet-200 bg-violet-100 px-3 py-1 text-[12px] font-semibold text-[#6356d8]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-black/5 pt-4">
                    <div className="mb-4 text-[13px] text-[#64748b]">
                      Posted by{" "}
                      <span className="font-semibold text-[#10223d]">
                        {job.postedBy}
                      </span>{" "}
                      on {job.postedDate} · {job.openings} opening(s)
                    </div>

                    <button
                      type="button"
                      disabled={alreadyApplied || job.status === "Closed"}
                      onClick={() => openApplyModal(job)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6356d8] px-5 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5447ca] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                    >
                      <Send className="h-4 w-4" />
                      {alreadyApplied ? "Applied" : "Apply Now"}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="mt-5 rounded-[22px] border border-dashed border-black/5 bg-white/40 p-10 text-center">
            <p className="text-[18px] font-semibold text-[#10223d]">
              No internal jobs found
            </p>

            <p className="mt-2 text-[14px] text-[#64748b]">
              Try changing search or department filter.
            </p>
          </div>
        )}
      </motion.section>

      {/* Application Modal */}
      {applicationModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081224]/70 px-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-[30px] border border-black/5 bg-[#eee7dc] p-6 text-[#0f172a] shadow-[0_24px_90px_rgba(0,0,0,0.32)]"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-bold tracking-tight text-[#10223d]">
                  Apply for {applicationModalJob.title}
                </h3>
                <p className="mt-1 text-[14px] text-[#64748b]">
                  Choose self apply or referral and upload resume.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplicationModalJob(null)}
                className="rounded-xl border border-black/5 bg-white/55 p-2 text-[#10223d] transition hover:bg-white/75"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setApplicationType("Self")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  applicationType === "Self"
                    ? "border-violet-300 bg-violet-100"
                    : "border-black/5 bg-white/48 hover:bg-white/65"
                }`}
              >
                <p className="text-[15px] font-semibold text-[#10223d]">
                  Self Apply
                </p>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  Apply for yourself.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setApplicationType("Referral")}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  applicationType === "Referral"
                    ? "border-violet-300 bg-violet-100"
                    : "border-black/5 bg-white/48 hover:bg-white/65"
                }`}
              >
                <p className="text-[15px] font-semibold text-[#10223d]">
                  Referral
                </p>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  Refer another candidate.
                </p>
              </button>
            </div>

            {applicationType === "Referral" && (
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Candidate Name
                  </label>
                  <input
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="Enter candidate name"
                    className={modalInputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                    Candidate Email
                  </label>
                  <input
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="Enter candidate email"
                    className={modalInputClass}
                  />
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="mb-2 block text-[14px] font-semibold text-[#334155]">
                Upload Resume
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-white/48 px-4 py-6 text-center transition hover:bg-white/65">
                <UploadCloud className="h-7 w-7 text-[#6356d8]" />

                <p className="mt-3 text-[14px] font-semibold text-[#10223d]">
                  {resumeFile ? resumeFile.name : "Choose resume file"}
                </p>

                <p className="mt-1 text-[12px] text-[#64748b]">
                  PDF, DOC, DOCX allowed
                </p>

                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setApplicationModalJob(null)}
                className="rounded-xl border border-black/5 bg-white/55 px-5 py-2.5 text-[13px] font-semibold text-[#10223d] transition hover:bg-white/75"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitApplication}
                className="rounded-xl bg-[#6356d8] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#5447ca]"
              >
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InternalJobsPage;