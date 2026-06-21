import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Users,
} from "lucide-react";
import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../services/endpoints";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Ongoing" | "Completed" | "Delayed" | "On Hold";
  assignedEmployees: string[];
  deadline?: string;
  startDate?: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  budget?: number;
};

type ProjectFormState = {
  projectId: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  description: string;
};

type ApiProject = Partial<{
  id: string | number;
  projectId: string | number;
  name: string;
  title: string;
  projectName: string;
  client: string;
  clientName: string;
  clientCompany: string;
  status: string;
  stage: string;
  assignedEmployees: Array<string | { name?: string; fullName?: string }>;
  teamMembers: Array<string | { name?: string; fullName?: string }>;
  employees: Array<string | { name?: string; fullName?: string }>;
  deadline: string;
  dueDate: string;
  endDate: string;
  budget: number | string;
}>;

const normalizeStatus = (status?: string): Project["status"] => {
  const normalized = (status || "").trim().toLowerCase();

  if (["completed", "done", "closed", "finished"].includes(normalized)) {
    return "Completed";
  }

  if (["delayed", "overdue", "late", "at risk"].includes(normalized)) {
    return "Delayed";
  }

  if (["hold", "on hold", "paused", "blocked"].includes(normalized)) {
    return "On Hold";
  }

  return "Ongoing";
};

const normalizePeople = (
  value?: Array<string | { name?: string; fullName?: string }>
) =>
  (value || [])
    .map((item) => {
      if (typeof item === "string") return item;
      return item.fullName || item.name || "";
    })
    .filter(Boolean);

const normalizeProject = (project: ApiProject, index: number): Project => ({
  id: String(project.id || project.projectId || `P-${String(index + 1).padStart(3, "0")}`),
  name: project.name || project.title || project.projectName || "Untitled Project",
  client: project.client || project.clientName || project.clientCompany || "Internal",
  status: normalizeStatus(project.status || project.stage),
  assignedEmployees: normalizePeople(project.assignedEmployees || project.teamMembers || project.employees),
  deadline: project.deadline || project.dueDate || project.endDate,
  budget:
    typeof project.budget === "string"
      ? Number(project.budget)
      : project.budget,
});

const formatDate = (value?: string) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const STORAGE_KEY = "superadmin-projects";

const readStoredProjects = (): Project[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Project[]) : [];
  } catch {
    return [];
  }
};

const writeStoredProjects = (projectsToStore: Project[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToStore));
};

const mergeProjects = (manualProjects: Project[], apiProjects: Project[]) => {
  const merged = [...manualProjects, ...apiProjects];
  return merged.filter((project, index, array) => array.findIndex((item) => item.id === project.id) === index);
};

const ProjectOverview: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectFormState>({
    projectId: "",
    name: "",
    client: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const isMountedRef = useRef(true);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
      const apiData = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.projects)
            ? res.data.projects
            : [];

      const normalizedApiProjects = apiData.map((project: ApiProject, index: number) => normalizeProject(project, index));
      const storedManualProjects = readStoredProjects();

      if (!isMountedRef.current) return;

      setProjects(mergeProjects(storedManualProjects, normalizedApiProjects));
      setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (err) {
      if (!isMountedRef.current) return;

      const storedManualProjects = readStoredProjects();
      setProjects(storedManualProjects);
      setError("Unable to load live projects from the API.");
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadProjects();

    const refreshTimer = window.setInterval(loadProjects, 30000);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const handleAddProject = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectForm.name.trim() || !projectForm.client.trim() || !projectForm.startDate || !projectForm.endDate) {
      setError("Please complete the required project details before saving.");
      return;
    }

    const assignedEmployees: string[] = [];

    const newProject: Project = {
      id: projectForm.projectId.trim() || `PRJ-${Date.now().toString(36).toUpperCase()}`,
      name: projectForm.name.trim(),
      client: projectForm.client.trim(),
      status: "Ongoing",
      assignedEmployees,
      startDate: new Date(projectForm.startDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      deadline: new Date(projectForm.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      description: projectForm.description.trim(),
    };

    const storedProjects = readStoredProjects();
    const updatedStoredProjects = [newProject, ...storedProjects].filter(
      (project, index, array) => array.findIndex((item) => item.id === project.id) === index
    );

    writeStoredProjects(updatedStoredProjects);
    setProjects((currentProjects) => mergeProjects([newProject], currentProjects));
    setLastUpdated(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setError(null);
    setProjectForm({
      projectId: "",
      name: "",
      client: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setIsCreateOpen(false);
  };

  const handleRefresh = () => {
    void loadProjects();
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((currentProjects) => {
      const updatedProjects = currentProjects.filter((p) => p.id !== projectId);
      const storedProjects = readStoredProjects();
      const updatedStoredProjects = storedProjects.filter((p) => p.id !== projectId);
      writeStoredProjects(updatedStoredProjects);
      return updatedProjects;
    });
  };

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;

        return [
          project.id,
          project.name,
          project.client,
          project.status,
          project.assignedEmployees.join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);
      }),
    [projects, searchTerm]
  );

  const total = projects.length;
  const ongoing = projects.filter((project) => project.status === "Ongoing").length;
  const completed = projects.filter((project) => project.status === "Completed").length;
  const delayed = projects.filter((project) => project.status === "Delayed").length;
  const onHold = projects.filter((project) => project.status === "On Hold").length;
  const activeClients = new Set(projects.map((project) => project.client)).size;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);

  const clientMap = filteredProjects.reduce<Record<string, Project[]>>((acc, project) => {
    (acc[project.client] ||= []).push(project);
    return acc;
  }, {});

  const hasProjects = filteredProjects.length > 0;

  const statusStyles: Record<Project["status"], string> = {
    Ongoing: "bg-sky-100 text-sky-800 ring-sky-200",
    Completed: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    Delayed: "bg-amber-100 text-amber-800 ring-amber-200",
    "On Hold": "bg-slate-200 text-slate-700 ring-slate-300",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
            Super Admin Dashboard
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">Project & Client Overview</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              Live project status, client distribution, team assignment, and progress visibility across the HRMS portal.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          Syncing live project data...
        </div>
      )}

      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Create project</p>
            <h3 className="mt-2 text-2xl font-black text-slate-900">Add a new super-admin project</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Use the button to open a clean light modal for creating a new project entry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4" />
              Add New Project
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh live data
            </button>
          </div>
        </div>

        {isCreateOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6"
            onClick={() => setIsCreateOpen(false)}
          >
            <div
              className="w-full max-w-3xl rounded-[28px] bg-white p-5 shadow-2xl lg:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">New project</p>
                  <h4 className="mt-2 text-xl font-black text-slate-900">Project details</h4>
                  <p className="mt-2 text-sm text-slate-600">
                    Fill in the project information below. The modal uses a light HRMS-style palette.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="grid gap-3 lg:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Project ID</span>
                  <input
                    value={projectForm.projectId}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, projectId: event.target.value }))}
                    placeholder="Auto-generated if left empty"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Project name *</span>
                  <input
                    required
                    value={projectForm.name}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Enter project name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Client name *</span>
                  <input
                    required
                    value={projectForm.client}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, client: event.target.value }))}
                    placeholder="Enter client company"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </label>


                <label className="space-y-2 text-sm text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Start date *</span>
                  <input
                    required
                    type="date"
                    value={projectForm.startDate}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, startDate: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">End date *</span>
                  <input
                    required
                    type="date"
                    value={projectForm.endDate}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, endDate: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-2 text-sm text-slate-700 lg:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Project description</span>
                  <textarea
                    rows={4}
                    value={projectForm.description}
                    onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
                    placeholder="Short description of the project scope, milestones, or delivery notes"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-cyan-500"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3 lg:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Save project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div
          className="rounded-[28px] border border-white/10 bg-gradient-to-br from-sky-100 to-white p-5 text-slate-900 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Projects</div>
              <div className="mt-2 text-3xl font-black">{total}</div>
              <p className="mt-1 text-sm text-slate-600">Live projects in the HRMS pipeline</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-emerald-100 to-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ongoing</div>
              <div className="mt-2 text-3xl font-black">{ongoing}</div>
              <p className="mt-1 text-sm text-slate-600">Projects currently in execution</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-yellow-100 to-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Delayed</div>
              <div className="mt-2 text-3xl font-black">{delayed}</div>
              <p className="mt-1 text-sm text-slate-600">Projects running behind schedule</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-orange-100 to-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">On Hold</div>
              <div className="mt-2 text-3xl font-black">{onHold}</div>
              <p className="mt-1 text-sm text-slate-600">Projects paused or blocked</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-amber-100 to-white p-5 text-slate-900 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Completed</div>
              <div className="mt-2 text-3xl font-black">{completed}</div>
              <p className="mt-1 text-sm text-slate-600">Delivered projects with closure sign-off</p>
            </div>
            <div className="rounded-2xl bg-slate-900 p-3 text-white">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_1fr]">
        <section className="rounded-[32px] border border-white/10 bg-[#FCFCFD] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Projects</h3>
              <p className="mt-1 text-sm text-slate-500">Live data pulled from the backend API</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search project, client, status..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-300 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-4 py-3">Project ID</th>
                  <th className="px-4 py-3">Project Name</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {hasProjects ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{project.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">{project.name}</div>
                        <div className="mt-1 text-xs text-slate-500">Real-time project record</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{project.client}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[project.status]}`}>
                          {project.status === "On Hold" ? "Hold" : project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(project.deadline)}</td>
                      <td className="px-4 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                      {searchTerm.trim()
                        ? "No projects match your search."
                        : "No live project records returned yet. Check the backend API response."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-6 text-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <h3 className="text-2xl font-black text-slate-900">Client-wise Status</h3>
          <p className="mt-1 text-sm text-slate-500">Grouped by client from the live project dataset</p>

          <div className="mt-6 space-y-3">
            {Object.keys(clientMap).length > 0 ? (
              Object.entries(clientMap).map(([client, clientProjects]) => {
                const count = clientProjects.length;
                const ongoingCount = clientProjects.filter((project) => project.status === "Ongoing").length;
                const completedCount = clientProjects.filter((project) => project.status === "Completed").length;

                return (
                  <div
                    key={client}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{client}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {count} project(s) | {ongoingCount} ongoing | {completedCount} completed
                        </div>
                      </div>

                      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs font-semibold text-cyan-800">
                        {count} total
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {clientProjects.map((project) => (
                        <span
                          key={project.id}
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[project.status]}`}
                        >
                          {project.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
                No client grouping available for the current filter.
              </div>
            )}
          </div>
        </section>
      </div>

      {completed > 0 && (
        <section className="rounded-[32px] border border-white/10 bg-[#FCFCFD] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-slate-900">Completed Projects</h3>
            <p className="mt-1 text-sm text-slate-500">All delivered projects with successful closure</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-separate border-spacing-y-3 text-left">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-4 py-3">Project ID</th>
                  <th className="px-4 py-3">Project Name</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {projects
                  .filter((project) => project.status === "Completed")
                  .map((project) => (
                    <tr key={project.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{project.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div className="font-semibold text-slate-900">{project.name}</div>
                        <div className="mt-1 text-xs text-slate-500">Real-time project record</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{project.client}</td>
                      <td className="px-4 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusStyles[project.status]}`}>
                          {project.status === "On Hold" ? "Hold" : project.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{formatDate(project.deadline)}</td>
                      <td className="px-4 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjectOverview;