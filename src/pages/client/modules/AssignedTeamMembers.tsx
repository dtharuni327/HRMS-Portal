import React, { useMemo, useState } from 'react';
import { Mail, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';

type Member = {
  role?: string;
  name: string;
  email?: string;
  phone?: string;
  focus?: string;
  tone?: string;
};

const AssignedTeamMembers: React.FC = () => {
  const projects = useProjectStore((s) => s.projects);
  const defaultProject = projects?.[0]?.name ?? 'HRMS Portal';
  const [selectedProject, setSelectedProject] = useState<string>(defaultProject);
  const [query, setQuery] = useState('');

  const handleEmailTeam = () => {
    alert(`Email sent to team for ${selectedProject}.`);
  };

  const handleScheduleReview = () => {
    alert(`Review meeting request has been scheduled for ${selectedProject}.`);
  };

  const assignmentsFromStore = useProjectStore((s) => s.assignments);
  const addAssignment = useProjectStore((s) => s.addAssignment);
  const removeAssignment = useProjectStore((s) => s.removeAssignment);
  const projectMembers: Member[] = useMemo(() => assignmentsFromStore[selectedProject] ?? [], [assignmentsFromStore, selectedProject]);
  const [isEditing, setIsEditing] = useState(false);
  const [newMember, setNewMember] = useState<Member>({ name: '', role: '', email: '', phone: '', focus: '', tone: '' });

  const filteredMembers = projectMembers.filter((member) =>
    [member.name, member.role, member.focus].join(' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-[#e5eefb] bg-[#fff9ea] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Assigned team members</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Meet the people driving this client project.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This view highlights the project manager, developers, QA, and support team along with their key contact details.</p>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-900 shadow-inner shadow-amber-100">
            <label className="flex items-center gap-3">
              <Sparkles className="h-4 w-4" />
              <span className="mr-2 font-semibold">Project</span>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="rounded-lg border border-amber-100 bg-white/90 px-3 py-1 text-sm font-semibold text-amber-900 outline-none">
                {projects.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </label>
            <div className="mt-2 text-[13px]">{projectMembers.length} team members assigned</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[30px] border border-[#e5eefb] bg-[#edf7ff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Team roster</p>
              <h4 className="text-[22px] font-bold text-slate-900">Project contacts — {selectedProject}</h4>
            </div>
            <Users className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Search by name, role, or area of focus" />
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={handleEmailTeam} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Email team</button>
              <button type="button" onClick={handleScheduleReview} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Schedule review</button>
              <button type="button" onClick={() => setIsEditing((s) => !s)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">{isEditing ? 'Finish editing' : 'Edit team'}</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <article key={member.name} className={`rounded-[24px] border p-5 shadow-sm ${member.tone}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-[13px] uppercase tracking-[0.22em]">{member.role}</p>
                    <h5 className="text-[18px] font-semibold text-slate-900">{member.name}</h5>
                    <p className="text-[13px] leading-6 text-slate-700">{member.focus}</p>
                  </div>

                  <div className="space-y-2 text-[13px] text-slate-700">
                    <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {member.email}</div>
                    <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {member.phone}</div>
                    {isEditing && (
                      <div className="mt-2">
                        <button onClick={() => removeAssignment(selectedProject, member.name)} className="text-sm text-rose-600">Remove</button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {isEditing && (
            <div className="mt-4 rounded-[16px] border border-slate-200 bg-white p-4">
              <h5 className="font-semibold mb-2">Add team member</h5>
              <div className="grid gap-2 sm:grid-cols-2">
                <input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Full name" className="rounded border px-3 py-2" />
                <input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="Role" className="rounded border px-3 py-2" />
                <input value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} placeholder="Email" className="rounded border px-3 py-2" />
                <input value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} placeholder="Phone" className="rounded border px-3 py-2" />
              </div>
              <div className="mt-3">
                <button onClick={() => {
                  if (!newMember.name.trim()) return alert('Enter a name');
                  addAssignment(selectedProject, { ...newMember });
                  setNewMember({ name: '', role: '', email: '', phone: '' });
                }} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Add</button>
              </div>
            </div>
          )}
        </article>

        <article className="rounded-[30px] border border-[#e5eefb] bg-[#fff5f8] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
          <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Project summary</p>
          <h4 className="mt-2 text-[22px] font-bold text-slate-900">{selectedProject}</h4>

          <div className="mt-6 space-y-4">
            {/* Project details from store */}
            {(() => {
              const proj = projects.find((p) => p.name === selectedProject);
              return proj ? (
                <>
                  <div className="rounded-[20px] border border-pink-100 bg-white p-4 text-[14px] leading-6 text-slate-700 shadow-sm">
                    <p className="text-sm text-slate-600">Status</p>
                    <div className="mt-2 flex items-center justify-between">
                      <strong className="text-lg">{proj.status}</strong>
                      <span className="text-sm text-slate-500">{proj.progress ?? '0%'}</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-200/90">
                      <div className="h-2 rounded-full bg-cyan-400" style={{ width: proj.progress ?? '0%' }} />
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-pink-100 bg-white p-4 text-[14px] leading-6 text-slate-700 shadow-sm">
                    <p className="text-sm text-slate-600">Timeline</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase">Start Date</p>
                        <p className="font-semibold">{proj.startDate}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500 uppercase">End Date</p>
                        <p className="font-semibold">{proj.endDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] border border-pink-100 bg-white p-4 text-[14px] leading-6 text-slate-700 shadow-sm">
                    <p className="text-sm text-slate-600">Assigned Members</p>
                    <p className="mt-2 font-semibold">{(assignmentsFromStore[selectedProject] ?? []).length} members</p>
                  </div>
                </>
              ) : (
                <div className="rounded-[20px] border border-pink-100 bg-white p-4 text-[14px] leading-6 text-slate-700 shadow-sm">No project details available.</div>
              );
            })()}
          </div>
        </article>
      </div>
    </section>
  );
};

export default AssignedTeamMembers;
