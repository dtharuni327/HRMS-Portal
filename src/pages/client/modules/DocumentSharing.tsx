import React, { useMemo, useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import { FileText } from 'lucide-react';
import { useProjectStore } from '../../../store/projectStore';


const recentUploads = [
  { name: 'Project Scope Final.pdf', type: 'Requirement Document', updated: '10 Jun 2026' },
  { name: 'Weekly Delivery Report.pdf', type: 'Report', updated: '08 Jun 2026' },
  { name: 'Invoice-2026-003.pdf', type: 'Invoice', updated: '06 Jun 2026' },
];

const DocumentSharing: React.FC = () => {
  const projects = useProjectStore((s) => s.projects);
  const [selectedProject, setSelectedProject] = useState<string>(projects?.[0]?.name ?? '');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [downloadedDocs, setDownloadedDocs] = useState<Array<{ name: string; type: string; updated: string; project?: string; downloadedAt: string }>>([]);

  const handleUploadDocument = () => {
    alert('Upload request sent to the document center.');
  };

  const handleShareLink = () => {
    alert('Share link ready to send to the client team.');
  };

  const filteredFiles = useMemo(() => {
    return recentUploads.filter((item) => {
      const matchesCategory = category === 'All' || item.type === category;
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.type.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.warmCream, boxShadow: '0 18px 45px rgba(148,163,184,0.22)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Document Sharing</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Access contracts, project documents, reports, invoices, requirement documents, and deliverables.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-700">This section keeps all shared client files organized, searchable, and easy to review from both desktop and mobile views.</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><FileText className="h-4 w-4" /> Shared file center</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#dbeafe', backgroundColor: clientPalette.iceBlue, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Recent files</p>
              <h4 className="text-[22px] font-bold text-slate-900">Recent files</h4>
            </div>
            <FileText className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-4 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <label className="text-[12px] font-semibold text-slate-700 mr-2">Project</label>
              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm outline-none">
                {projects.map((p) => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_260px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Search documents, file names, or types" />
              <div className="flex flex-wrap gap-2 items-center overflow-x-auto">
                {[
                  { label: 'All', value: 'All' },
                  { label: 'Requirements', value: 'Requirement Document' },
                  { label: 'Reports', value: 'Report' },
                  { label: 'Invoices', value: 'Invoice' },
                ].map((c) => (
                  <button
                    key={c.value}
                    aria-pressed={category === c.value}
                    onClick={() => setCategory(c.value)}
                    className={`rounded-2xl px-3 py-1 text-sm text-center ${category === c.value ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={handleUploadDocument} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Upload document</button>
              <button type="button" onClick={handleShareLink} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Share link</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredFiles.map((item) => (
              <article key={item.name} className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-[13px] text-slate-700">{item.type} • {item.updated}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert(`View ${item.name}`)} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">View</button>
                    <button onClick={() => {
                      const now = new Date();
                      const downloadedAt = now.toLocaleString();
                      const doc = { name: item.name, type: item.type, updated: item.updated, project: selectedProject, downloadedAt };
                      setDownloadedDocs((prev) => [doc, ...prev.filter(d => d.name !== item.name)]);
                      alert(`Downloading ${item.name}`);
                    }} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">Download</button>
                    {/* Share button removed per request */}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.softPink, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Document summary</p>
              <h4 className="text-[22px] font-bold text-slate-900">Document overview</h4>
            </div>
            <FileText className="h-5 w-5 text-pink-700" />
          </div>

          <div className="grid gap-4">
            <article className="rounded-[16px] border p-4 bg-white shadow-sm">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-700">Downloaded by client</p>
              <div className="mt-3 space-y-2">
                {/* downloadedDocs state will populate this list */}
                {/** placeholder when empty */}
                <p className="text-sm text-slate-600">The list below shows documents downloaded by the client for the selected project.</p>
                <div id="downloaded-list" className="mt-2 space-y-2">
                  {downloadedDocs.length === 0 ? (
                    <p className="text-sm text-slate-500">No documents downloaded by the client yet.</p>
                  ) : (
                    downloadedDocs.map((d) => (
                      <div key={`${d.name}-${d.downloadedAt}`} className="flex items-center justify-between rounded-md border p-2 bg-white">
                        <div>
                          <p className="font-semibold text-slate-900">{d.name}</p>
                          <p className="text-sm text-slate-600">{d.project ?? '—'} • {d.downloadedAt}</p>
                        </div>
                        <div className="text-sm text-slate-700">Downloaded</div>
                      </div>
                    ))
                  )}
                  {downloadedDocs.length > 0 && (
                    <div className="mt-2">
                      <button onClick={() => setDownloadedDocs([])} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-700">Clear list</button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
};

export default DocumentSharing;
