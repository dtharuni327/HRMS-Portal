import React, { useEffect, useState } from "react";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import apiClient from "../../../services/apiClient";
import { API_ENDPOINTS } from "../../../services/endpoints";

type Project = {
  id: string;
  name: string;
  client: string;
  status: "Ongoing" | "Completed" | "Delayed";
  assignedEmployees: string[];
};

const mockProjects: Project[] = [
  { id: "P-001", name: "Payroll Integration", client: "Acme Corp", status: "Ongoing", assignedEmployees: ["Alice", "Bob"] },
  { id: "P-002", name: "Mobile App", client: "Beta LLC", status: "Completed", assignedEmployees: ["Carol"] },
  { id: "P-003", name: "Website Revamp", client: "Acme Corp", status: "Delayed", assignedEmployees: ["Dave", "Eve"] },
  { id: "P-004", name: "Client Portal", client: "Gamma Inc", status: "Ongoing", assignedEmployees: ["Frank"] },
];

const ProjectOverview: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pastel accent colors for card differentiation (soft tones over deep-navy)
  const accentColors = [
    "#E6E6FA", // lavender
    "#D4F1DC", // mint
    "#FFF5D6", // cream
    "#DCEEFB", // ice blue
    "#FADADD", // soft pink
    "#F5E0C3", // warm beige
    "#E9D5FF", // soft violet
  ];
  // Dark text color used on pastel cards for good contrast
  const cardText = "#071827";
  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiClient.get(API_ENDPOINTS.PROJECTS.LIST);
        if (!mounted) return;
        // assume API returns an array of projects
        setProjects(res.data ?? []);
      } catch (err) {
        // fallback to mock data on error
        if (!mounted) return;
        setError("Failed to load projects. Showing sample data.");
        setProjects(mockProjects);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const total = projects.length;
  const ongoing = projects.filter((p) => p.status === "Ongoing").length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const delayed = projects.filter((p) => p.status === "Delayed").length;

  const clientMap = projects.reduce<Record<string, Project[]>>((acc, p) => {
    (acc[p.client] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Project & Client Overview</h2>
          <p className="text-sm text-white/70">Summary of projects and client-wise status</p>
        </div>
      </div>

      {loading && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/70">Loading projects...</div>
      )}

      {error && (
        <div className="rounded-lg border border-red-600/20 bg-red-900/10 p-4 text-sm text-red-300">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: accentColors[0], color: cardText }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Total Projects</div>
              <div className="mt-1 text-2xl font-bold">{total}</div>
            </div>
            <div className="rounded-full p-2" style={{ backgroundColor: "#071827" }}>
              <Users className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: accentColors[1], color: cardText }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Ongoing</div>
              <div className="mt-1 text-2xl font-bold">{ongoing}</div>
            </div>
            <div className="rounded-full p-2" style={{ backgroundColor: "#071827" }}>
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: accentColors[2], color: cardText }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Completed</div>
              <div className="mt-1 text-2xl font-bold">{completed}</div>
            </div>
            <div className="rounded-full p-2" style={{ backgroundColor: "#071827" }}>
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: accentColors[3], color: cardText }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>Delayed</div>
              <div className="mt-1 text-2xl font-bold">{delayed}</div>
            </div>
            <div className="rounded-full p-2" style={{ backgroundColor: "#071827" }}>
              <AlertCircle className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg p-4" style={{ backgroundColor: accentColors[4], color: cardText }}>
          <h3 className="mb-3 text-lg font-semibold">Projects</h3>

          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr style={{ color: "rgba(7,24,39,0.8)" }} className="text-sm">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Client</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Assigned</th>
                </tr>
              </thead>
              <tbody>
                {mockProjects.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: "rgba(7,24,39,0.06)" }}>
                    <td className="px-3 py-3 text-sm" style={{ color: cardText }}>{p.id}</td>
                    <td className="px-3 py-3 text-sm" style={{ color: cardText }}>{p.name}</td>
                    <td className="px-3 py-3 text-sm" style={{ color: cardText }}>{p.client}</td>
                    <td className="px-3 py-3 text-sm">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          p.status === "Ongoing"
                            ? "bg-sky-200 text-sky-800"
                            : p.status === "Completed"
                            ? "bg-emerald-200 text-emerald-800"
                            : "bg-amber-200 text-amber-800"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm" style={{ color: cardText }}>{p.assignedEmployees.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ backgroundColor: accentColors[6], color: cardText }}>
          <h3 className="mb-3 text-lg font-semibold">Client-wise Status</h3>

          <div className="space-y-3">
            {Object.entries(clientMap).map(([client, projects], idx) => (
              <div
                key={client}
                className="flex items-center justify-between rounded p-3"
                style={{ backgroundColor: accentColors[idx % accentColors.length], border: "1px solid rgba(7,24,39,0.06)", color: cardText }}
              >
                <div>
                  <div className="text-sm font-semibold">{client}</div>
                  <div className="text-xs" style={{ color: "rgba(7,24,39,0.6)" }}>{projects.length} project(s)</div>
                </div>
                <div className="text-sm" style={{ color: "rgba(7,24,39,0.8)" }}>{projects.map((p) => p.status).join(" • ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
