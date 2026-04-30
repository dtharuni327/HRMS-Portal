import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  BellRing,
  CalendarDays,
  Filter,
  Megaphone,
  Search,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";

type AnnouncementPriority = "High" | "Medium" | "Low";
type AnnouncementCategory = "General" | "HR" | "Manager" | "Policy" | "Event";

type Announcement = {
  id: number;
  title: string;
  message: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  announcedBy: string;
  role: "HR" | "Manager";
  date: string;
};

const announcementsData: Announcement[] = [
  {
    id: 1,
    title: "Quarterly Town Hall Meeting",
    message:
      "All employees are requested to attend the quarterly town hall meeting scheduled this Friday at 10:30 AM.",
    category: "Event",
    priority: "High",
    announcedBy: "HR Team",
    role: "HR",
    date: "24 Apr 2026",
  },
  {
    id: 2,
    title: "Updated Leave Policy",
    message:
      "The updated leave policy is now available. Please review the new guidelines before applying for planned leaves.",
    category: "Policy",
    priority: "Medium",
    announcedBy: "HR Team",
    role: "HR",
    date: "22 Apr 2026",
  },
  {
    id: 3,
    title: "Sprint Review Reminder",
    message:
      "Engineering team members should submit task updates before the sprint review meeting.",
    category: "Manager",
    priority: "Medium",
    announcedBy: "Bhargav Ram",
    role: "Manager",
    date: "21 Apr 2026",
  },
];

const priorityClasses: Record<AnnouncementPriority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const categoryClasses: Record<AnnouncementCategory, string> = {
  General: "bg-slate-100 text-slate-700",
  HR: "bg-[#f3f0ff] text-[#4b3f72]",
  Manager: "bg-sky-100 text-sky-700",
  Policy: "bg-orange-100 text-orange-700",
  Event: "bg-emerald-100 text-emerald-700",
};

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const AnnouncementsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | AnnouncementCategory>(
    "All"
  );

  const filteredAnnouncements = useMemo(() => {
    return announcementsData.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.message.toLowerCase().includes(search.toLowerCase()) ||
        item.announcedBy.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  const highPriorityCount = announcementsData.filter(
    (item) => item.priority === "High"
  ).length;

  const hrAnnouncements = announcementsData.filter(
    (item) => item.role === "HR"
  ).length;

  const managerAnnouncements = announcementsData.filter(
    (item) => item.role === "Manager"
  ).length;

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
              Announcements
            </h2>
            <p className="mt-2 text-[14px] text-white/80">
              View announcements posted by HR and managers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-[13px] text-white/70">Total Announcements</p>
            <p className="mt-1 text-[24px] font-semibold">
              {announcementsData.length}
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
              <p className="text-[14px] text-[#64748b]">HR Announcements</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {hrAnnouncements}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <Megaphone className="h-5 w-5 text-[#4b3f72]" />
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
              <p className="text-[14px] text-[#64748b]">Manager Updates</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {managerAnnouncements}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-3">
              <UserRound className="h-5 w-5 text-sky-600" />
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
              <p className="text-[14px] text-[#64748b]">High Priority</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {highPriorityCount}
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
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
              Latest Announcements
            </h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Announcements published by HR and managers will appear here.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[280px]"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as "All" | AnnouncementCategory)
                }
                className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[190px]"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Policy">Policy</option>
                <option value="Event">Event</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAnnouncements.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="rounded-[20px] border border-[#ece7ff] bg-[#faf8ff] p-5 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_10px_24px_rgba(75,63,114,0.12)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                    <BellRing className="h-5 w-5 text-[#4b3f72]" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[18px] font-semibold text-[#1e293b]">
                        {item.title}
                      </h4>

                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                          priorityClasses[item.priority]
                        }`}
                      >
                        {item.priority}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                          categoryClasses[item.category]
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="mt-3 max-w-4xl text-[14px] leading-6 text-[#64748b]">
                      {item.message}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-[#64748b]">
                      <span className="rounded-xl bg-white px-3 py-2">
                        Announced by{" "}
                        <span className="font-semibold text-[#1e293b]">
                          {item.announcedBy}
                        </span>{" "}
                        ({item.role})
                      </span>

                      <span className="flex items-center gap-1 rounded-xl bg-white px-3 py-2">
                        <CalendarDays className="h-4 w-4" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#dcd3ff] bg-[#faf8ff] p-10 text-center">
              <p className="text-[18px] font-semibold text-[#1e293b]">
                No announcements found
              </p>
              <p className="mt-2 text-[14px] text-[#64748b]">
                Try changing your search or category filter.
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default AnnouncementsPage;