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
  Open: "bg-emerald-100 text-emerald-700",
  "Closing Soon": "bg-amber-100 text-amber-700",
  Closed: "bg-slate-100 text-slate-600",
};

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

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

  const filteredJobs = useMemo(() => {
    return internalJobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.department.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.join(" ").toLowerCase().includes(search.toLowerCase());

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
              Internal Jobs
            </h2>
            <p className="mt-2 text-[14px] text-white/80">
              View internal vacancies announced by HR, apply for yourself, or refer a candidate.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-[13px] text-white/70">Open Vacancies</p>
            <p className="mt-1 text-[24px] font-semibold">
              {internalJobs.filter((job) => job.status !== "Closed").length}
            </p>
          </div>
        </div>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Total Vacancies</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {internalJobs.length}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <Briefcase className="h-5 w-5 text-[#4b3f72]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Applications Sent</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {appliedJobIds.length}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <Send className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Total Openings</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {internalJobs.reduce((sum, job) => sum + job.openings, 0)}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
      >
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[22px] font-semibold text-[#1e293b]">
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
                className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[260px]"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[190px]"
              >
                <option value="All">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredJobs.map((job) => {
            const alreadyApplied = appliedJobIds.includes(job.id);

            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-[20px] border border-[#ece7ff] bg-[#faf8ff] p-5 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_10px_24px_rgba(75,63,114,0.12)]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-[19px] font-semibold text-[#1e293b]">
                        {job.title}
                      </h4>
                      <p className="mt-2 text-[14px] leading-6 text-[#64748b]">
                        {job.description}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                        statusClasses[job.status]
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-[#64748b]">
                      <Building2 className="h-4 w-4 text-[#4b3f72]" />
                      <span>{job.department}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-[#64748b]">
                      <MapPin className="h-4 w-4 text-[#4b3f72]" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-[#64748b]">
                      <Clock3 className="h-4 w-4 text-[#4b3f72]" />
                      <span>{job.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-[13px] text-[#64748b]">
                      <CalendarDays className="h-4 w-4 text-[#4b3f72]" />
                      <span>Closes: {job.closingDate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-[#4b3f72]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[#e9e2ff] pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[13px] text-[#64748b]">
                      Posted by{" "}
                      <span className="font-semibold text-[#1e293b]">
                        {job.postedBy}
                      </span>{" "}
                      on {job.postedDate} · {job.openings} opening(s)
                    </div>

                    <button
                      type="button"
                      disabled={alreadyApplied || job.status === "Closed"}
                      onClick={() => openApplyModal(job)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4b3f72] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#352d52] disabled:cursor-not-allowed disabled:opacity-60"
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
          <div className="rounded-2xl border border-dashed border-[#dcd3ff] bg-[#faf8ff] p-10 text-center">
            <p className="text-[18px] font-semibold text-[#1e293b]">
              No internal jobs found
            </p>
            <p className="mt-2 text-[14px] text-[#64748b]">
              Try changing search or department filter.
            </p>
          </div>
        )}
      </motion.section>

      {applicationModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-xl rounded-[24px] border border-[#dcd3ff] bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[22px] font-semibold text-[#1e293b]">
                  Apply for {applicationModalJob.title}
                </h3>
                <p className="mt-1 text-[14px] text-[#64748b]">
                  Choose self apply or referral and upload resume.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setApplicationModalJob(null)}
                className="rounded-xl border border-[#dcd3ff] bg-white p-2 text-[#4b3f72] hover:bg-[#f3f0ff]"
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
                    ? "border-[#4b3f72] bg-[#f3f0ff]"
                    : "border-[#dcd3ff] bg-white hover:bg-[#faf8ff]"
                }`}
              >
                <p className="text-[15px] font-semibold text-[#1e293b]">
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
                    ? "border-[#4b3f72] bg-[#f3f0ff]"
                    : "border-[#dcd3ff] bg-white hover:bg-[#faf8ff]"
                }`}
              >
                <p className="text-[15px] font-semibold text-[#1e293b]">
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
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    Candidate Name
                  </label>
                  <input
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="Enter candidate name"
                    className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                    Candidate Email
                  </label>
                  <input
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="Enter candidate email"
                    className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                  />
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Upload Resume
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#cdbdf9] bg-[#faf8ff] px-4 py-6 text-center transition hover:border-[#4b3f72]">
                <UploadCloud className="h-7 w-7 text-[#4b3f72]" />
                <p className="mt-3 text-[14px] font-semibold text-[#1e293b]">
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
                className="rounded-xl border border-[#dcd3ff] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#4b3f72] transition hover:bg-[#f3f0ff]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitApplication}
                className="rounded-xl bg-[#4b3f72] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#352d52]"
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