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

type TaskStatus = "Pending" | "In Progress" | "Pending HR Approval" | "Completed";
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
  sentToHR?: boolean;
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
      return "border-emerald-200 bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "border-amber-200 bg-amber-100 text-amber-700";
    case "Pending HR Approval":
      return "border-violet-200 bg-violet-100 text-violet-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
};

const cardBase =
  "rounded-[30px] border border-black/5 shadow-[0_12px_34px_rgba(15,23,42,0.10)] transition-all duration-300 hover:shadow-[0_18px_46px_rgba(15,23,42,0.15)]";

const innerCard =
  "rounded-[22px] border border-black/70 bg-white/48 transition-all duration-200 hover:bg-white/65";

const inputClass =
  "h-12 w-full rounded-2xl border border-black/5 bg-white/65 px-4 text-[14px] text-[#0f172a] outline-none placeholder:text-[#64748b] transition focus:border-[#6356d8]/60 focus:ring-2 focus:ring-[#6356d8]/15";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");

  const handleStartTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "In Progress",
              progress: Math.max(task.progress, 35),
            }
          : task
      )
    );
  };

  const handleCompleteTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "Pending HR Approval",
              progress: 100,
              sentToHR: true,
            }
          : task
      )
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.project.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : task.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tasks, search, statusFilter]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "Pending").length;
  const inProgressTasks = tasks.filter((task) => task.status === "In Progress").length;
  const activeTasks = pendingTasks + inProgressTasks;

  const statCards = [
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: Briefcase,
      className: "bg-[#e7e4f7] border-violet-200/50",
      iconClassName: "bg-violet-100 text-[#6356d8]",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: CircleDashed,
      className: "bg-[#efe7cf] border-amber-200/50",
      iconClassName: "bg-amber-100 text-[#c87d16]",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      className: "bg-[#dcefe8] border-emerald-200/50",
      iconClassName: "bg-emerald-100 text-[#15936b]",
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: Clock3,
      className: "bg-[#dfe6f1] border-sky-200/50",
      iconClassName: "bg-sky-100 text-[#0d6db8]",
    },
  ];

  return (
    <div className="w-full space-y-7 text-[#0f172a]">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[30px] border border-white/10 bg-[#162447] p-6 text-white shadow-[0_16px_42px_rgba(0,0,0,0.26)]"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-200">
              Employee Task Center
            </p>

            <h2 className="text-[34px] font-bold tracking-tight text-white">
              Tasks
            </h2>

            <p className="mt-2 max-w-[720px] text-[15px] leading-6 text-white/72">
              Track assigned work, progress, priorities, and due dates in one place.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/10 px-6 py-5">
            <p className="text-[14px] text-white/65">Today's Focus</p>

            <h3 className="mt-2 text-[32px] font-bold text-white">
              {activeTasks} Active Tasks
            </h3>
          </div>
        </div>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.03 }}
              className={`${cardBase} ${card.className} border-black/70 hover:border-black/80 p-6`}
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

                <div className={`rounded-2xl p-3 ${card.iconClassName}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${cardBase} bg-[#e7e1ea] p-6`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#be123c]">
              Assigned Work
            </p>

            <h3 className="mt-2 text-[28px] font-bold tracking-tight text-[#10223d]">
              Task Board
            </h3>

            <p className="mt-1 text-[14px] text-[#64748b]">
              Search, filter, and manage your assigned tasks.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className={`${inputClass} pl-11 sm:w-[300px]`}
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | TaskStatus)
                }
                className={`${inputClass} appearance-none pl-11 pr-10 sm:w-[220px]`}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending HR Approval">Pending HR Approval</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035 }}
                whileHover={{ y: -4, scale: 1.003 }}
                className={`${innerCard} group relative overflow-hidden p-5`}
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-[#6356d8]" />

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1 pl-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[19px] font-bold text-[#10223d]">
                        {task.title}
                      </h4>

                      <span
                        className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${getStatusClasses(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>

                    </div>

                    <p className="mt-3 max-w-3xl text-[14px] leading-6 text-[#475569]">
                      {task.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-[13px] text-[#475569]">
                      <span className="rounded-xl border border-black/70 bg-white/50 px-3 py-2">
                        Project:{" "}
                        <span className="font-semibold text-[#0f172a]">
                          {task.project}
                        </span>
                      </span>

                      <span className="rounded-xl border border-black/70 bg-white/50 px-3 py-2">
                        Assigned By:{" "}
                        <span className="font-semibold text-[#0f172a]">
                          {task.assignedBy}
                        </span>
                      </span>

                      <span className="flex items-center gap-1 rounded-xl border border-black/70 bg-white/50 px-3 py-2">
                        <CalendarDays className="h-4 w-4 text-[#6356d8]" />
                        <span className="font-semibold text-[#0f172a]">
                          {task.dueDate}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full rounded-[20px] border border-black/70 bg-white/55 p-4 xl:w-[280px]">
                    <div className="mb-2 flex items-center justify-between text-[13px]">
                      <span className="text-[#64748b]">Progress</span>
                      <span className="font-bold text-[#0f172a]">{task.progress}%</span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-[#6356d8] transition-all duration-500"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleStartTask(task.id)}
                        disabled={
                          task.status === "In Progress" ||
                          task.status === "Completed" ||
                          task.status === "Pending HR Approval"
                        }
                        className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                          task.status === "In Progress"
                            ? "cursor-not-allowed bg-amber-200 text-amber-800"
                            : task.status === "Pending HR Approval"
                            ? "cursor-not-allowed bg-violet-200 text-violet-800"
                            : task.status === "Completed"
                            ? "cursor-not-allowed bg-emerald-200 text-emerald-800"
                            : "bg-[#6356d8] text-white hover:-translate-y-0.5 hover:bg-[#5447ca]"
                        }`}
                      >
                        {task.status === "In Progress"
                          ? "Started"
                          : task.status === "Pending HR Approval"
                          ? "Sent HR"
                          : task.status === "Completed"
                          ? "Done"
                          : "Start Task"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={task.status !== "In Progress"}
                        className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition-all duration-200 ${
                          task.status === "In Progress"
                            ? "bg-[#15936b] text-white hover:-translate-y-0.5 hover:bg-[#0f7f5d]"
                            : task.status === "Pending HR Approval"
                            ? "cursor-not-allowed bg-violet-100 text-violet-400"
                            : task.status === "Completed"
                            ? "cursor-not-allowed bg-emerald-100 text-emerald-400"
                            : "cursor-not-allowed bg-slate-100 text-slate-400"
                        }`}
                      >
                        {task.status === "Pending HR Approval"
                          ? "Pending HR"
                          : task.status === "Completed"
                          ? "Completed"
                          : "Complete"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-black/5 bg-white/40 p-10 text-center">
              <h4 className="text-[18px] font-semibold text-[#10223d]">
                No tasks found
              </h4>
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