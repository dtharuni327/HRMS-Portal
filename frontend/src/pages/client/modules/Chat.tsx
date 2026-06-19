import React, { useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import { MessageSquareText, Send, Users } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';

const chatThreads = [
  {
    person: 'Project Manager',
    role: 'Delivery lead',
    status: 'Online',
    preview: 'The latest milestone update is ready for review.',
    project: '',
    tone: 'bg-[#E8F4FB] border-cyan-100',
  },
  {
    person: 'HR/Admin',
    role: 'Support coordination',
    status: 'Available',
    preview: 'Please share the approval summary for the release window.',
    project: '',
    tone: 'bg-[#F6E9EE] border-amber-100',
  },
  {
    person: 'Development Team',
    role: 'QA & Engineering',
    status: 'Busy',
    preview: 'We are validating the latest demo build and notes.',
    project: '',
    tone: 'bg-[#E9F6EE] border-emerald-100',
  },
];

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState(chatThreads);
  const projects = useProjectStore((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState<string>(projects?.[0]?.name ?? '');

  const handleSend = () => {
    if (!message.trim()) return;

    alert('Message sent to the project team.');

    setThreads((prev) => [
      {
        person: 'You',
        role: 'Client',
        status: 'New',
        preview: message,
        project: selectedProject,
        tone: 'bg-[#F0F8F2] border-emerald-100',
      },
      ...prev,
    ]);
    setMessage('');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#d7e6f4', backgroundColor: '#F2EBD6', boxShadow: '0 12px 30px rgba(12,20,28,0.12)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Chat / Communication</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Stay connected with your project team and support contacts.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">Connect with your project manager, assigned team members, and HR/Admin for project discussions, status updates, approvals, support requests, and important communications throughout the project lifecycle.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 px-4 py-3 text-sm text-emerald-900" style={{ backgroundColor: '#EBF7F0' }}>
            <div className="flex items-center gap-2 font-semibold"><MessageSquareText className="h-4 w-4" /> Live communication</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#dbeef9', backgroundColor: '#E8F4FB', boxShadow: '0 12px 28px rgba(12,20,28,0.10)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Project communication channels</p>
              <h4 className="text-[22px] font-bold text-slate-900">Project communication channels</h4>
            </div>
            <Users className="h-5 w-5 text-cyan-700" />
          </div>

            <div className="space-y-4">
            <div className="mb-4 rounded-[24px] border border-cyan-100" style={{ backgroundColor: '#F7FBFF' }}>
              <div className="mb-3">
                <label className="text-[12px] font-semibold text-slate-700 mr-2">Select Project</label>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none">
                  {projects.map((p) => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <label className="text-[12px] uppercase tracking-[0.18em] text-slate-700">New message
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0" placeholder="Write a project update, question, approval request, or support message..." />
              </label>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={handleSend} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"><Send className="h-4 w-4" /> Send message</button>
              </div>
            </div>

            {threads.map((thread, idx) => (
              <article key={`${thread.person}-${idx}`} className={`rounded-[24px] border p-5 shadow-sm ${thread.tone}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-[15px] font-semibold text-slate-900">{thread.person}</p>
                      {thread.project && (
                        <span className="rounded-full border border-slate-200 bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{thread.project}</span>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] text-slate-700">{thread.role}</p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-700">{thread.preview}</p>
                  </div>
                  <span className="rounded-full border border-cyan-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-800">{thread.status}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        {/* Right-side communication summary panel removed per request */}
      </div>
    </section>
  );
};

export default Chat;
