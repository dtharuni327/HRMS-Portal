import React, { useMemo, useState } from "react";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Filter,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "High" | "Medium" | "Low";

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  dueDate: string;
  assignedBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
};

const tasksData: Task[] = [
  {
    id: 1,
    title: "Complete employee onboarding UI",
    description:
      "Finalize onboarding flow screens and validate responsive layout for desktop and tablet.",
    project: "HRMS Portal",
    dueDate: "Today, 5:30 PM",
    assignedBy: "Bhargav Ram",
    status: "In Progress",
    priority: "High",
    progress: 78,
  },
  {
    id: 2,
    title: "Update leave balance integration",
    description:
      "Connect leave balance card with employee service and verify annual/sick leave counts.",
    project: "Leave Module",
    dueDate: "Tomorrow",
    assignedBy: "Ananya Rao",
    status: "Pending",
    priority: "Medium",
    progress: 22,
  },
  {
    id: 3,
    title: "Fix attendance chart responsiveness",
    description:
      "Resolve chart container sizing and improve mobile rendering for weekly attendance graph.",
    project: "Attendance Module",
    dueDate: "24 Apr 2026",
    assignedBy: "Rohit Kumar",
    status: "Completed",
    priority: "Low",
    progress: 100,
  },
  {
    id: 4,
    title: "Review internal jobs design",
    description:
      "Audit the card layout, CTA placement, and empty state design for internal openings.",
    project: "Careers",
    dueDate: "26 Apr 2026",
    assignedBy: "Divya Sharma",
    status: "In Progress",
    priority: "High",
    progress: 61,
  },
  {
    id: 5,
    title: "Upload employee policy documents",
    description:
      "Organize HR policy PDFs and update document tags for easier employee access.",
    project: "Documents",
    dueDate: "28 Apr 2026",
    assignedBy: "HR Team",
    status: "Pending",
    priority: "Low",
    progress: 10,
  },
];

const getStatusClasses = (status: TaskStatus) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const getPriorityClasses = (priority: TaskPriority) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
};

const cardHoverClass =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const TasksPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");

  const filteredTasks = useMemo(() => {
    return tasksData.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalTasks = tasksData.length;
  const completedTasks = tasksData.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasksData.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasksData.filter((task) => task.status === "In Progress").length;

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[30px] font-semibold tracking-tight">Tasks</h2>
            <p className="mt-2 text-[14px] text-white/80">
              Track assigned work, progress, priorities, and due dates in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
            <p className="text-[13px] text-white/70">Today's Focus</p>
            <p className="mt-1 text-[22px] font-semibold">{inProgressTasks} Active Tasks</p>
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
              <p className="text-[14px] text-[#64748b]">Total Tasks</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">{totalTasks}</p>
            </div>
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <Briefcase className="h-5 w-5 text-[#4b3f72]" />
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
              <p className="text-[14px] text-[#64748b]">In Progress</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">{inProgressTasks}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <CircleDashed className="h-5 w-5 text-amber-600" />
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
              <p className="text-[14px] text-[#64748b]">Completed</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">{completedTasks}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
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
              <p className="text-[14px] text-[#64748b]">Pending</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">{pendingTasks}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <Clock3 className="h-5 w-5 text-slate-600" />
            </div>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHoverClass}`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[22px] font-semibold text-[#1e293b]">Task Board</h3>
            <p className="mt-1 text-[14px] text-[#64748b]">
              Search and filter your assigned tasks
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[280px]"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | TaskStatus)
                }
                className="h-11 w-full appearance-none rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-10 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[180px]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="rounded-[20px] border border-[#ece7ff] bg-[#faf8ff] p-5 transition-all duration-300 hover:border-[#4b3f72] hover:shadow-[0_10px_24px_rgba(75,63,114,0.12)]"
              >
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[18px] font-semibold text-[#1e293b]">
                        {task.title}
                      </h4>
                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-medium ${getStatusClasses(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[12px] font-medium ${getPriorityClasses(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p className="mt-3 max-w-3xl text-[14px] leading-6 text-[#64748b]">
                      {task.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-[13px] text-[#64748b]">
                      <span className="rounded-xl bg-white px-3 py-2">
                        Project: <span className="font-medium text-[#1e293b]">{task.project}</span>
                      </span>
                      <span className="rounded-xl bg-white px-3 py-2">
                        Assigned By:{" "}
                        <span className="font-medium text-[#1e293b]">{task.assignedBy}</span>
                      </span>
                      <span className="flex items-center gap-1 rounded-xl bg-white px-3 py-2">
                        <CalendarDays className="h-4 w-4" />
                        <span className="font-medium text-[#1e293b]">{task.dueDate}</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full xl:w-[260px]">
                    <div className="mb-2 flex items-center justify-between text-[13px]">
                      <span className="text-[#64748b]">Progress</span>
                      <span className="font-semibold text-[#1e293b]">{task.progress}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2.5 rounded-full bg-[#4b3f72] transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        className="flex-1 rounded-xl bg-[#4b3f72] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#352d52]"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="flex-1 rounded-xl border border-[#dcd3ff] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#4b3f72] transition hover:bg-[#f3f0ff]"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#dcd3ff] bg-[#faf8ff] p-10 text-center">
              <h4 className="text-[18px] font-semibold text-[#1e293b]">No tasks found</h4>
              <p className="mt-2 text-[14px] text-[#64748b]">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default TasksPage;