import React, { useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import { useProjectStore, type Project } from '../../../store/projectStore';
import {
  CalendarRange,
  CheckCircle2,
  FolderKanban,
  Gauge,
  Rocket,
  TimerReset,
} from 'lucide-react';

const projects = [
  {
    name: 'HRMS Portal',
    status: 'In Progress',
    startDate: '12 May 2026',
    endDate: '30 Jul 2026',
    progress: '78%',
    deliveryStage: 'UI Integration & QA',
  },
  {
    name: 'Payroll Sync',
    status: 'Review',
    startDate: '03 Jun 2026',
    endDate: '18 Aug 2026',
    progress: '54%',
    deliveryStage: 'Approval Pending',
  },
  {
    name: 'Client Reports',
    status: 'Ready',
    startDate: '19 Apr 2026',
    endDate: '10 Jun 2026',
    progress: '92%',
    deliveryStage: 'Final Delivery Ready',
  },
];

const ProjectOverview: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0].name);
  const [projectForm, setProjectForm] = useState({
    name: '',
    status: 'In Progress',
    startDate: '',
    endDate: '',
  });
  const addProjectToStore = useProjectStore((s) => s.addProject);
  const [projectList, setProjectList] = useState<Project[]>(projects);

  const activeProject = projectList.find((project) => project.name === selectedProject) ?? projectList[0];

  const handleAddProject = (event: React.FormEvent) => {
    event.preventDefault();

    if (!projectForm.name.trim() || !projectForm.startDate || !projectForm.endDate) {
      alert('Please fill in the required project details before adding a project.');
      return;
    }

    const newProject: Project = {
      name: projectForm.name.trim(),
      status: projectForm.status,
      startDate: new Date(projectForm.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      endDate: new Date(projectForm.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      progress: '0%',
      deliveryStage: '',
    };

    // update local UI list and global project store so other dashboards see it
    setProjectList((prev) => [newProject, ...prev]);
    try {
      addProjectToStore(newProject);
    } catch (e) {
      // swallow - store update shouldn't block UI
    }
    setSelectedProject(newProject.name);
    setProjectForm({ name: '', status: 'In Progress', startDate: '', endDate: '' });
    alert('Project added successfully.');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#d7e6f4', backgroundColor: '#F2EBD6', boxShadow: '0 12px 30px rgba(12,20,28,0.12)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-sky-700/90">Project overview</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Track active projects with clarity on timeline, progress, and current delivery stage.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This section highlights the current project health, including start and end dates, status, and the delivery phase each client initiative is in.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 px-4 py-3 text-sm text-emerald-900" style={{ backgroundColor: '#EBF7F0' }}>
            <div className="flex items-center gap-2 font-semibold"><Rocket className="h-4 w-4" /> {projectList.length} active projects</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#d8e6f6', backgroundColor: '#F6E9EE', boxShadow: '0 12px 28px rgba(12,20,28,0.10)'}}>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sky-800">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-sky-700/90">Summary</p>
              <h4 className="text-[22px] font-bold text-slate-900">Project snapshot</h4>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { label: 'Active Projects', value: '3', icon: FolderKanban },
              { label: 'On Track', value: '2', icon: CheckCircle2 },
              { label: 'In Review', value: '1', icon: TimerReset },
              { label: 'Avg. Progress', value: '75%', icon: Gauge },
            ].map((item) => {
              const Icon = item.icon;
                return (
                <div key={item.label} className="rounded-[22px] border border-emerald-100 p-4 shadow-sm" style={{ backgroundColor: '#F0F8F2' }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-sky-800"><Icon className="h-4 w-4" /></div>
                      <span className="text-[13px] uppercase tracking-[0.18em] text-slate-700">{item.label}</span>
                    </div>
                    <strong className="text-[20px] font-black text-slate-900">{item.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-[30px] border border-[#dbeef9] bg-[#E8F4FB] p-6 shadow-[0_12px_30px_rgba(12,20,28,0.10)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-sky-700/90">Project details</p>
              <h4 className="text-[22px] font-bold text-slate-900">Active project progress</h4>
            </div>
            <CalendarRange className="h-5 w-5 text-sky-700" />
          </div>

          <div className="mb-5 rounded-[24px] border p-4 shadow-sm" style={{ borderColor: '#c7eaf8', backgroundColor: '#F7FBFF' }}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Add project</p>
                <h5 className="text-[18px] font-semibold text-slate-900">Create a new client project</h5>
              </div>
              <Rocket className="h-5 w-5 text-cyan-700" />
            </div>

            <form onSubmit={handleAddProject} className="space-y-3">
              <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700">Project name
                <input required value={projectForm.name} onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Enter project name" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700">Start date
                  <input required type="date" value={projectForm.startDate} onChange={(e) => setProjectForm((prev) => ({ ...prev, startDate: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
                </label>
                <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700">End date
                  <input required type="date" value={projectForm.endDate} onChange={(e) => setProjectForm((prev) => ({ ...prev, endDate: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" />
                </label>
              </div>
              <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700">Status
                <select value={projectForm.status} onChange={(e) => setProjectForm((prev) => ({ ...prev, status: e.target.value }))} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none">
                  <option>In Progress</option>
                  <option>Review</option>
                  <option>Ready</option>
                </select>
              </label>
              {/* Status, Progress and Delivery stage fields removed */}
              <button type="submit" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Add project</button>
            </form>
          </div>

          <div className="mb-4 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">Select project
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none">
                {projectList.map((project) => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-4">
            {projectList.map((project) => (
              <article key={project.name} className={`rounded-[24px] border p-5 shadow-sm`} style={{ borderColor: activeProject.name === project.name ? '#bee7ff' : '#ffdbe9', backgroundColor: activeProject.name === project.name ? clientPalette.iceBlue : clientPalette.softPink }}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[16px] font-semibold text-slate-900">{project.name}</p>
                    </div>

                    <div className="grid gap-3 text-[13px] text-slate-100/90 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Start date</p>
                        <p className="mt-1 font-semibold text-slate-900">{project.startDate}</p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">End date</p>
                        <p className="mt-1 font-semibold text-slate-900">{project.endDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-[220px] rounded-[22px] border border-cyan-100 p-4 shadow-sm" style={{ backgroundColor: '#E8F4FB' }}>
                    <div className="mb-2 flex items-center justify-between text-[12px] text-slate-700">
                      <span className="uppercase tracking-[0.12em] text-[11px]">Status</span>
                      <strong className="text-slate-900">{project.status}</strong>
                    </div>

                    <div className="mb-2 flex items-center justify-between text-[12px] text-slate-700">
                      <span className="uppercase tracking-[0.12em] text-[11px]">Progress</span>
                      <strong className="text-slate-900">{project.progress ?? '0%'}</strong>
                    </div>

                    <div className="h-2 rounded-full bg-slate-200/90">
                      <div className="h-2 rounded-full bg-cyan-400" style={{ width: project.progress ?? '0%' }} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProjectOverview;
