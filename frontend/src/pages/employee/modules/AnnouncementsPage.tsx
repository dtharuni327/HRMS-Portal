import React, { useMemo, useState } from "react";
import { BellRing, CalendarDays, Filter, Search } from "lucide-react";
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

const pastelCard =
  "rounded-[30px] border border-black/5 shadow-[0_14px_38px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_46px_rgba(15,23,42,0.15)]";

const inputClass =
  "h-11 w-full rounded-2xl border border-black/5 bg-white/65 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const priorityClasses: Record<AnnouncementPriority, string> = {
  High: "border border-rose-200 bg-rose-100 text-rose-700",
  Medium: "border border-amber-200 bg-amber-100 text-amber-700",
  Low: "border border-emerald-200 bg-emerald-100 text-emerald-700",
};

const categoryClasses: Record<AnnouncementCategory, string> = {
  General: "border border-slate-200 bg-slate-100 text-slate-700",
  HR: "border border-violet-200 bg-violet-100 text-violet-700",
  Manager: "border border-sky-200 bg-sky-100 text-sky-700",
  Policy: "border border-orange-200 bg-orange-100 text-orange-700",
  Event: "border border-emerald-200 bg-emerald-100 text-emerald-700",
};

const getAnnouncementAccent = (category: AnnouncementCategory) => {
  switch (category) {
    case "Event":
      return "bg-[#15936b]";
    case "Policy":
      return "bg-[#c87d16]";
    case "Manager":
      return "bg-[#0d6db8]";
    case "HR":
      return "bg-[#6356d8]";
    default:
      return "bg-[#64748b]";
  }
};

const AnnouncementsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | AnnouncementCategory
  >("All");

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

  return (
    <div className="w-full space-y-7 text-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[30px] border border-white/10 bg-[#162447] p-6 text-white shadow-[0_16px_42px_rgba(0,0,0,0.26)]"
      >
        <div>
          <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-200">
            Employee Communication Center
          </p>

          <h2 className="text-[34px] font-bold tracking-tight text-white">
            Announcements
          </h2>

          <p className="mt-2 max-w-[760px] text-[15px] leading-6 text-white/72">
            Announcements published by HR and managers will appear here.
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${pastelCard} bg-[#ddd8ea] p-6`}
      >
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[26px] font-bold tracking-tight text-[#10223d]">
              Latest Announcements
            </h3>

            <p className="mt-1 text-[14px] text-[#64748b]">
              Search and filter company updates, policies, and manager reminders.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search announcements..."
                className={`${inputClass} py-2 pl-10 pr-4 sm:w-[280px]`}
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as "All" | AnnouncementCategory
                  )
                }
                className={`${inputClass} appearance-none py-2 pl-10 pr-10 sm:w-[190px]`}
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="HR">HR</option>
                <option value="Manager">Manager</option>
                <option value="Policy">Policy</option>
                <option value="Event">Event</option>
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]">
                ▾
              </div>
            </div>
          </div>
        </div>

        <div className="max-h-[720px] space-y-4 overflow-y-auto pr-2">
          {filteredAnnouncements.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4, scale: 1.003 }}
              className="relative overflow-hidden rounded-[24px] border border-black/5 bg-white/50 p-6 transition-all duration-300 hover:bg-white/65"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 ${getAnnouncementAccent(
                  item.category
                )}`}
              />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4 pl-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-[#6356d8]">
                    <BellRing className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[20px] font-bold text-[#10223d]">
                        {item.title}
                      </h4>

                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                          priorityClasses[item.priority]
                        }`}
                      >
                        {item.priority}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                          categoryClasses[item.category]
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <p className="mt-3 max-w-5xl text-[15px] leading-7 text-[#475569]">
                      {item.message}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3 text-[13px] text-[#64748b]">
                      <span className="rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                        Posted by{" "}
                        <span className="font-semibold text-[#10223d]">
                          {item.announcedBy}
                        </span>{" "}
                        ({item.role})
                      </span>

                      <span className="flex items-center gap-2 rounded-xl border border-black/5 bg-white/50 px-3 py-2">
                        <CalendarDays className="h-4 w-4 text-[#6356d8]" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-black/5 bg-white/40 p-10 text-center">
              <p className="text-[18px] font-semibold text-[#10223d]">
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