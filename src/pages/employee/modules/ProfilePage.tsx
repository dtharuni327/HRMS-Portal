import React from "react";
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const ProfilePage: React.FC = () => {
  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <h2 className="text-[30px] font-semibold tracking-tight">Profile</h2>
        <p className="mt-2 text-[14px] text-white/80">
          View employee details, reporting information, and work profile.
        </p>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-4 ${cardHover}`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[#a78bfa] text-[32px] font-bold text-white">
              RK
            </div>

            <h3 className="mt-4 text-[24px] font-semibold text-[#1e293b]">
              Ramakrishna
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Software Engineer
            </p>

            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-[13px] font-semibold text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              Active Employee
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Employee ID</p>
              <p className="mt-1 text-[15px] font-semibold text-[#1e293b]">
                EMP-2048
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Department</p>
              <p className="mt-1 text-[15px] font-semibold text-[#1e293b]">
                Engineering
              </p>
            </div>

            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <p className="text-[13px] text-[#64748b]">Work Location</p>
              <p className="mt-1 text-[15px] font-semibold text-[#1e293b]">
                Hyderabad
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6 xl:col-span-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <User className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[22px] font-semibold text-[#1e293b]">
                  Personal Information
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Basic employee contact details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Mail className="h-4 w-4" />
                  <span className="text-[13px]">Email</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  ramakrishna@company.com
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Phone className="h-4 w-4" />
                  <span className="text-[13px]">Phone</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  +91 98765 43210
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[13px]">Address</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  Hyderabad, Telangana
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-[13px]">Date of Joining</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  12 Jan 2024
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <Briefcase className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[22px] font-semibold text-[#1e293b]">
                  Work Information
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Role, reporting, and work schedule
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Building2 className="h-4 w-4" />
                  <span className="text-[13px]">Department</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  Engineering
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Users className="h-4 w-4" />
                  <span className="text-[13px]">Manager</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  Bhargav Ram
                </p>
              </div>

              <div className="rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-2 text-[#64748b]">
                  <Clock3 className="h-4 w-4" />
                  <span className="text-[13px]">Shift</span>
                </div>
                <p className="mt-2 text-[15px] font-semibold text-[#1e293b]">
                  10:00 AM - 07:00 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <ShieldCheck className="h-5 w-5 text-[#4b3f72]" />
            </div>
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                Emergency Contact
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Contact person for emergency situations
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#faf8ff] p-5">
            <p className="text-[16px] font-semibold text-[#1e293b]">
              Suresh Kumar
            </p>
            <p className="mt-1 text-[14px] text-[#64748b]">Father</p>
            <p className="mt-3 text-[15px] font-semibold text-[#1e293b]">
              +91 91234 56789
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
        >
          <h3 className="text-[22px] font-semibold text-[#1e293b]">
            Account Summary
          </h3>
          <p className="mt-1 text-[14px] text-[#64748b]">
            Current employee account status
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-[24px] font-semibold text-emerald-700">Active</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Status</p>
            </div>

            <div className="rounded-2xl bg-[#f3f0ff] p-4 text-center">
              <p className="text-[24px] font-semibold text-[#4b3f72]">2.4 yrs</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Tenure</p>
            </div>

            <div className="rounded-2xl bg-amber-50 p-4 text-center">
              <p className="text-[24px] font-semibold text-amber-700">Full-Time</p>
              <p className="mt-1 text-[13px] text-[#64748b]">Employee Type</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ProfilePage;