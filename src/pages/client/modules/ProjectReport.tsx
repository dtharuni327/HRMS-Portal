import React, { useMemo, useState } from 'react';
import { clientPalette } from '../../../utils/colorPalette';
import { ClipboardList, Download, FileDown, Rocket } from 'lucide-react';

const weeklyReports = [
  {
    period: 'Week 1 (Jun 2-8)',
    status: 'Completed',
    summary: 'Requirements finalized, design review completed, and development kickoff done.',
    tone: 'bg-[#effbf5] border-emerald-100',
    manager: 'Rajesh Kumar',
    lastUpdated: '2026-06-08 14:30',
    attachments: [{ type: 'text', label: 'Download Text' }, { type: 'pdf', label: 'Download PDF' }]
  },
  {
    period: 'Week 2 (Jun 9-15)',
    status: 'In Progress',
    summary: 'Core module integration is underway with QA validation in parallel.',
    tone: 'bg-[#edf7ff] border-cyan-100',
    manager: 'Priya Sharma',
    lastUpdated: '2026-06-15 11:20',
    attachments: [{ type: 'text', label: 'Download Text' }, { type: 'pdf', label: 'Download PDF' }]
  },
  {
    period: 'Week 3 (Jun 16-22)',
    status: 'Planned',
    summary: 'Client feedback review, release preparation, and milestone checkpoint.',
    tone: 'bg-[#fff9ea] border-amber-100',
    manager: 'Amit Singh',
    lastUpdated: '2026-06-16 09:45',
    attachments: [{ type: 'text', label: 'Download Text' }, { type: 'pdf', label: 'Download PDF' }]
  },
];

const ProjectReport: React.FC = () => {
  const [period, setPeriod] = useState('All');
  const [search, setSearch] = useState('');

  const handleExportReport = () => {
    alert('All weekly reports exported to your download folder.');
  };

  const handleDownloadWeeklyReport = (reportPeriod: string, format: 'text' | 'pdf') => {
    const report = weeklyReports.find((r) => r.period === reportPeriod);
    if (!report) return;

    const content = `Weekly Report: ${report.period}\nManager: ${report.manager}\nLast Updated: ${report.lastUpdated}\nStatus: ${report.status}\n\n${report.summary}`;
    const filename = `weekly-report-${report.period.replace(/[^0-9]/g, '')}.${format === 'pdf' ? 'pdf' : 'txt'}`;

    if (format === 'text') {
      const element = document.createElement('a');
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(content)}`);
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert(`PDF export for ${report.period} - ${report.manager} initiated.`);
    }
  };

  const filteredReports = useMemo(() => {
    return weeklyReports.filter((item) => {
      const matchesPeriod = period === 'All' || item.status === period || item.period.toLowerCase().includes(period.toLowerCase());
      const matchesSearch = item.summary.toLowerCase().includes(search.toLowerCase()) || item.period.toLowerCase().includes(search.toLowerCase());
      return matchesPeriod && matchesSearch;
    });
  }, [period, search]);

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.warmCream, boxShadow: '0 18px 45px rgba(148,163,184,0.22)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Project Reports</p>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><Rocket className="h-4 w-4" /> Progress reporting dashboard</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#e5eefb', backgroundColor: clientPalette.iceBlue, boxShadow: '0 18px 40px rgba(148,163,184,0.18)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Weekly reports</p>
              <h4 className="text-[22px] font-bold text-slate-900">Progress by week</h4>
            </div>
            <ClipboardList className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-5 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_180px]">
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none" placeholder="Search report content" />
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none">
                <option>All</option>
                <option>Completed</option>
                <option>In Progress</option>
                <option>Planned</option>
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={handleExportReport} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Export report</button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReports.map((item) => (
              <article key={item.period} className={`rounded-[24px] border p-5 shadow-sm ${item.tone}`}>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-slate-900">{item.period}</p>
                      <p className="mt-1 text-[13px] leading-6 text-slate-700">{item.summary}</p>
                    </div>
                    <span className="rounded-full border border-white/90 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">{item.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-3">
                    {item.attachments.map((attachment) => (
                      <button
                        key={attachment.type}
                        onClick={() => handleDownloadWeeklyReport(item.period, attachment.type as 'text' | 'pdf')}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-white/90"
                      >
                        {attachment.type === 'pdf' ? <FileDown className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                        {attachment.label}
                      </button>
                    ))}
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

export default ProjectReport;