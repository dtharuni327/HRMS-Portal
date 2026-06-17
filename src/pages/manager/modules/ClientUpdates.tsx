import React, { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { BellRing, CalendarRange, Upload } from 'lucide-react';

interface ClientUpdate {
  id: number;
  project: string;
  startDate: string;
  endDate: string;
  summary: string;
  artifactName: string;
  artifactType: string;
  artifactDataUrl: string | null;
  createdAt: number;
}

const CLIENT_UPDATES_STORAGE_KEY = 'managerClientUpdates';

const projectOptions = ['HRMS Portal', 'Payroll Sync', 'Client Reports'];

const ClientUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<ClientUpdate[]>([]);
  const [project, setProject] = useState(projectOptions[0]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState('');
  const [artifactFile, setArtifactFile] = useState<File | null>(null);
  const [artifactPreview, setArtifactPreview] = useState<string | null>(null);
  const [artifactType, setArtifactType] = useState('PDF / Text');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CLIENT_UPDATES_STORAGE_KEY);
    if (stored) {
      try {
        setUpdates(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CLIENT_UPDATES_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CLIENT_UPDATES_STORAGE_KEY, JSON.stringify(updates));
  }, [updates]);

  useEffect(() => {
    return () => {
      if (artifactPreview) {
        URL.revokeObjectURL(artifactPreview);
      }
    };
  }, [artifactPreview]);

  const filteredUpdates = useMemo(
    () => [...updates].sort((a, b) => b.createdAt - a.createdAt),
    [updates]
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setError('');
    setArtifactFile(null);
    setArtifactPreview(null);
    setArtifactType('PDF / Text');

    if (!file) {
      return;
    }

    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload only PDF or plain text files.');
      return;
    }

    setArtifactFile(file);
    setArtifactType(file.type === 'application/pdf' ? 'PDF' : 'Text');
    setArtifactPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!project.trim() || !startDate.trim() || !endDate.trim() || !summary.trim()) {
      setError('Project, start/end dates, and update summary are required.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be later than end date.');
      return;
    }

    if (!artifactFile) {
      setError('Please attach a PDF or text artifact.');
      return;
    }

    setIsSaving(true);
    const reader = new FileReader();
    reader.onload = () => {
      const artifactDataUrl = reader.result as string;
      const newUpdate: ClientUpdate = {
        id: Date.now(),
        project,
        startDate,
        endDate,
        summary,
        artifactName: artifactFile.name,
        artifactType,
        artifactDataUrl,
        createdAt: Date.now(),
      };
      setUpdates((current) => [newUpdate, ...current]);
      setProject(projectOptions[0]);
      setStartDate('');
      setEndDate('');
      setSummary('');
      setArtifactFile(null);
      setArtifactPreview(null);
      setArtifactType('PDF / Text');
      setIsSaving(false);
    };
    reader.onerror = () => {
      setError('Failed to read attached file. Please try again.');
      setIsSaving(false);
    };
    reader.readAsDataURL(artifactFile);
  };

  const handlePreviewArtifact = (update: ClientUpdate) => {
    if (update.artifactDataUrl) {
      window.open(update.artifactDataUrl, '_blank');
    } else {
      alert('Artifact preview is unavailable for this update.');
    }
  };

  return (
    <section className="space-y-6 animate-in fade-in duration-700 p-6">
      <div className="rounded-[30px] border border-[#e5eefb] bg-[#f8fbff] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-cyan-700/90">Client updates</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Post weekly updates</h3>
          </div>
          <div className="rounded-[24px] border border-cyan-100 bg-cyan-50/90 px-4 py-3 text-sm text-cyan-900 shadow-inner shadow-cyan-100">
            <div className="flex items-center gap-2 font-semibold"><BellRing className="h-4 w-4" /> Manager client update</div>
          </div>
        </div>
      </div>

      <div>
        <article className="rounded-[30px] border border-[#e5eefb] bg-[#fff5f8] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Recent activity</p>
              <h4 className="text-[22px] font-bold text-slate-900">Latest client update items</h4>
            </div>
            <CalendarRange className="h-5 w-5 text-pink-700" />
          </div>

          <div className="space-y-4">
            {filteredUpdates.slice(0, 4).map((update) => (
              <article key={update.id} className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-900">{update.project}</p>
                      <p className="mt-1 text-[12px] text-slate-500">{update.startDate} – {update.endDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-pink-700">{update.artifactType}</p>
                      <p className="mt-1 text-[12px] text-slate-500">{update.artifactName}</p>
                    </div>
                  </div>
                  <p className="text-[13px] leading-6 text-slate-700">{update.summary}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewArtifact(update)}
                  className="mt-3 rounded-2xl border border-pink-200 bg-white px-3 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50"
                >
                  Preview attachment
                </button>
              </article>
            ))}
          </div>
        </article>
      </div>

      <div className="rounded-[30px] border border-[#e5eefb] bg-white p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Summary</label>
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                rows={5}
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                placeholder="Describe the weekly progress, achievements, blockers, and next steps for the client."
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Project</label>
                <select
                  value={project}
                  onChange={(event) => setProject(event.target.value)}
                  className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                >
                  {projectOptions.map((projectOption) => (
                    <option key={projectOption} value={projectOption}>{projectOption}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                    className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">End date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) => setEndDate(event.target.value)}
                    className="w-full rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Upload artifact</label>
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-900 file:px-4 file:py-2 file:text-white"
                />
                {artifactFile ? (
                  <p className="mt-3 text-sm text-slate-700">Selected: <span className="font-semibold text-slate-900">{artifactFile.name}</span></p>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">Accepted formats: PDF, TXT.</p>
                )}
                {artifactPreview && (
                  <a
                    href={artifactPreview}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 hover:text-cyan-900"
                  >
                    <Upload className="h-4 w-4" /> Preview selected file
                  </a>
                )}
              </div>
            </div>
          </div>

          {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-[20px] bg-cyan-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Publishing update...' : 'Publish update to client'}
          </button>
        </form>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {filteredUpdates.length === 0 ? (
          <article className="rounded-[30px] border border-[#e5eefb] bg-[#fff5f8] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
            <p className="text-sm text-slate-700">No client updates have been posted yet. Use the form above to share weekly progress and work artifacts.</p>
          </article>
        ) : (
          filteredUpdates.map((update) => (
            <article key={update.id} className="rounded-[30px] border border-[#e5eefb] bg-[#f9fcff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Period</p>
                  <h4 className="mt-2 text-[20px] font-bold text-slate-900">{update.startDate} – {update.endDate}</h4>
                </div>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-[12px] font-semibold text-cyan-800">{update.artifactType}</span>
              </div>

              <p className="mt-4 text-[14px] leading-6 text-slate-700">{update.summary}</p>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-slate-500">Attachment: {update.artifactName}</div>
                <button
                  type="button"
                  onClick={() => handlePreviewArtifact(update)}
                  className="rounded-2xl border border-cyan-200 bg-white px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  View attachment
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

export default ClientUpdates;
