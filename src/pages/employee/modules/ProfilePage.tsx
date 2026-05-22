import React, { useState } from "react";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const pastelCard =
  "rounded-[30px] border border-black/5 shadow-[0_14px_38px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.15)]";

const infoBox =
  "rounded-[22px] border border-black/5 bg-white/48 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/65";

const documents = [
  {
    title: "Appointment Letter",
    category: "HR Document",
    uploadedBy: "HR Team",
    uploadedOn: "12 Apr 2026",
    size: "1.2 MB",
    status: "Available",
  },
  {
    title: "Salary Revision Letter",
    category: "Payroll",
    uploadedBy: "Finance Team",
    uploadedOn: "18 Apr 2026",
    size: "850 KB",
    status: "Available",
  },
  {
    title: "Employee Policy Handbook",
    category: "Company Policy",
    uploadedBy: "Admin Team",
    uploadedOn: "22 Apr 2026",
    size: "3.1 MB",
    status: "Updated",
  },
];

const ProfilePage: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(() =>
    localStorage.getItem("employeeProfileImage") || ""
  );

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageBase64 = reader.result as string;
      setProfileImage(imageBase64);
      localStorage.setItem("employeeProfileImage", imageBase64);
      window.dispatchEvent(new Event("employeeProfileImageUpdated"));
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveProfileImage = () => {
    setProfileImage("");
    localStorage.removeItem("employeeProfileImage");
    window.dispatchEvent(new Event("employeeProfileImageUpdated"));
  };

  return (
    <div className="w-full space-y-7 text-[#0f172a]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[30px] border border-white/10 bg-[#162447] p-6 text-white shadow-[0_16px_42px_rgba(0,0,0,0.26)]"
      >
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-200">
            Employee Identity Center
          </p>

          <h2 className="text-[34px] font-bold tracking-tight text-white">
            Profile
          </h2>

          <p className="mt-2 max-w-[760px] text-[15px] leading-6 text-white/72">
            View employee details, reporting information, and work profile.
          </p>
        </div>
      </motion.div>

      <section className="space-y-6">
        {/* Profile Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pastelCard} bg-[#eee7dc] p-6`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-[26px] border border-black/5 bg-[#d4c8b8] text-[30px] font-bold text-[#10223d] transition hover:bg-[#cbbdab]">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Employee profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "RK"
                  )}

                  <div className="absolute inset-0 hidden items-center justify-center bg-[#10223d]/70 text-[11px] font-semibold text-white group-hover:flex">
                    Change
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageUpload}
                  />
                </label>

                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#eee7dc] bg-[#15936b]">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </span>
              </div>

              <div>
                <h3 className="text-[30px] font-bold tracking-tight text-[#10223d]">
                  Ramakrishna
                </h3>

                <p className="mt-1 text-[15px] text-[#475569]">
                  Software Engineer
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="rounded-full border border-emerald-200 bg-emerald-100 px-4 py-1.5 text-[12px] font-semibold text-[#15936b]">
                    Active Employee
                  </div>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={handleRemoveProfileImage}
                      className="rounded-full border border-black/5 bg-white/55 px-4 py-1.5 text-[12px] font-semibold text-[#475569] transition hover:bg-white/75 hover:text-[#10223d]"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[560px]">
              <div className={infoBox}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Employee ID
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#10223d]">
                  EMP-2048
                </p>
              </div>

              <div className={infoBox}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Department
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#10223d]">
                  Engineering
                </p>
              </div>

              <div className={infoBox}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Work Location
                </p>
                <p className="mt-2 text-[15px] font-semibold text-[#10223d]">
                  Hyderabad
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${pastelCard} bg-[#dde9f5] p-6`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-[#0d6db8]">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
                  Personal Information
                </h3>

                <p className="mt-1 text-[14px] text-[#64748b]">
                  Basic employee contact details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className={infoBox}>
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Mail className="h-4 w-4 text-[#0d6db8]" />
                  <span className="text-[13px]">Email</span>
                </div>

                <p className="mt-3 text-[16px] font-semibold text-[#10223d]">
                  ramakrishna@company.com
                </p>
              </div>

              <div className={infoBox}>
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Phone className="h-4 w-4 text-[#0d6db8]" />
                  <span className="text-[13px]">Phone</span>
                </div>

                <p className="mt-3 text-[16px] font-semibold text-[#10223d]">
                  +91 98765 43210
                </p>
              </div>

              <div className={infoBox}>
                <div className="flex items-center gap-2 text-[#64748b]">
                  <MapPin className="h-4 w-4 text-[#0d6db8]" />
                  <span className="text-[13px]">Address</span>
                </div>

                <p className="mt-3 text-[16px] font-semibold text-[#10223d]">
                  Hyderabad, Telangana
                </p>
              </div>

              <div className={infoBox}>
                <div className="flex items-center gap-2 text-[#64748b]">
                  <CalendarDays className="h-4 w-4 text-[#0d6db8]" />
                  <span className="text-[13px]">Date of Joining</span>
                </div>

                <p className="mt-3 text-[16px] font-semibold text-[#10223d]">
                  12 Jan 2024
                </p>
              </div>
            </div>
          </motion.div>

          {/* Work Information */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${pastelCard} bg-[#e7e5f4] p-6`}
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                <Briefcase className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
                  Work Information
                </h3>

                <p className="mt-1 text-[14px] text-[#64748b]">
                  Role, reporting, and work schedule
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className={infoBox}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                  <Building2 className="h-5 w-5" />
                </div>

                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Department
                </p>

                <p className="mt-2 text-[16px] font-semibold text-[#10223d]">
                  Engineering
                </p>
              </div>

              <div className={infoBox}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                  <Users className="h-5 w-5" />
                </div>

                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Manager
                </p>

                <p className="mt-2 text-[16px] font-semibold text-[#10223d]">
                  Bhargav Ram
                </p>
              </div>

              <div className={infoBox}>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                  <Clock3 className="h-5 w-5" />
                </div>

                <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                  Shift
                </p>

                <p className="mt-2 text-[16px] font-semibold text-[#10223d]">
                  10:00 AM - 07:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Employee Documents */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${pastelCard} bg-[#dcefe8] p-6`}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#15936b]">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-[24px] font-bold tracking-tight text-[#10223d]">
                  Employee Documents
                </h3>

                <p className="mt-1 text-[14px] text-[#64748b]">
                  Documents uploaded by HR and management.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white/48 px-4 py-3">
              <p className="text-[12px] text-[#64748b]">Total Documents</p>

              <p className="mt-1 text-[22px] font-bold text-[#10223d]">06</p>
            </div>
          </div>

          <div className="space-y-4">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[24px] border border-black/5 bg-white/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/65"
              >
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    doc.status === "Updated" ? "bg-[#c87d16]" : "bg-[#15936b]"
                  }`}
                />

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4 pl-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-[#15936b]">
                      <FileText className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-[18px] font-bold text-[#10223d]">
                          {doc.title}
                        </h4>

                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                            doc.status === "Updated"
                              ? "border-amber-200 bg-amber-100 text-amber-700"
                              : "border-emerald-200 bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <p className="mt-2 text-[14px] text-[#64748b]">
                        {doc.category}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-[#64748b]">
                        <span className="rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                          Uploaded By:{" "}
                          <span className="font-semibold text-[#10223d]">
                            {doc.uploadedBy}
                          </span>
                        </span>

                        <span className="rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                          Date:{" "}
                          <span className="font-semibold text-[#10223d]">
                            {doc.uploadedOn}
                          </span>
                        </span>

                        <span className="rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                          Size:{" "}
                          <span className="font-semibold text-[#10223d]">
                            {doc.size}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="rounded-2xl border border-black/5 bg-white/55 px-5 py-3 text-[14px] font-semibold text-[#10223d] transition hover:bg-white/75"
                    >
                      Preview
                    </button>

                    <button
                      type="button"
                      onClick={() => alert(`Downloading ${doc.title}`)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#15936b] px-5 py-3 text-[14px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f7f5d]"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ProfilePage;