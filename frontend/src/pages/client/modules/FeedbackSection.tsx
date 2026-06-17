import React, { useState } from 'react';
import {
  MessageCircleMore,
  Star,
} from 'lucide-react';

const projects = [
  { id: 1, name: 'CRM Platform Development' },
  { id: 2, name: 'Mobile App Redesign' },
  { id: 3, name: 'E-commerce Integration' },
  { id: 4, name: 'Analytics Dashboard' },
];

const ratingCriteria = [
  { id: 'delivery', label: 'Delivery Quality', description: 'How well we deliver on commitments' },
  { id: 'support', label: 'Support Experience', description: 'Quality of support and communication' },
  { id: 'quality', label: 'Work Quality', description: 'Technical quality and attention to detail' },
  { id: 'timeline', label: 'Timeline Adherence', description: 'Meeting deadlines and milestones' },
  { id: 'satisfaction', label: 'Overall Satisfaction', description: 'Overall satisfaction with the project' },
];

const defaultRatings = {
  delivery: '4',
  support: '4',
  quality: '4',
  timeline: '4',
  satisfaction: '4',
};

const FeedbackSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [ratings, setRatings] = useState<Record<string, string>>(defaultRatings);
  const [feedback, setFeedback] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState<Array<{ projectId: string; project: string; ratings: Record<string, string>; feedback: string }>>([]);
  const [showSubmittedFeedback, setShowSubmittedFeedback] = useState(false);

  const handleRatingChange = (criteriaId: string, value: string) => {
    setRatings((prev) => ({ ...prev, [criteriaId]: value }));
  };

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);
    if (!value) {
      setFeedback('');
      setRatings(defaultRatings);
      return;
    }

    const existing = submittedFeedback.find((item) => item.projectId === value);
    if (existing) {
      setRatings(existing.ratings);
      setFeedback(existing.feedback);
    } else {
      setFeedback('');
      setRatings(defaultRatings);
    }
  };

  const handleSubmitFeedback = () => {
    if (!selectedProject || !feedback.trim()) {
      alert('Please select a project and provide feedback.');
      return;
    }

    const project = projects.find((p) => p.id.toString() === selectedProject);
    if (!project) return;

    setSubmittedFeedback((prev) => {
      const existingIndex = prev.findIndex((item) => item.projectId === selectedProject);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { projectId: selectedProject, project: project.name, ratings, feedback };
        return next;
      }
      return [...prev, { projectId: selectedProject, project: project.name, ratings, feedback }];
    });

    setShowSubmittedFeedback(true);
    alert('Feedback saved successfully.');
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-[#e5eefb] bg-[#fff8ef] p-6 shadow-[0_18px_45px_rgba(148,163,184,0.22)] lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-amber-700/90">Feedback Section</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-900 lg:text-[32px]">Submit project feedback and ratings</h3>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-inner shadow-emerald-100">
            <div className="flex items-center gap-2 font-semibold"><MessageCircleMore className="h-4 w-4" /> Client feedback</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <article className="rounded-[30px] border border-[#e5eefb] bg-[#edf7ff] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-cyan-700/90">Feedback Form</p>
              <h4 className="text-[22px] font-bold text-slate-900">Rate and provide feedback</h4>
            </div>
            <Star className="h-5 w-5 text-cyan-700" />
          </div>

          <div className="mb-6 rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700 font-semibold mb-2">Select Project</label>
            <select
              value={selectedProject}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
            >
              <option value="">-- Choose a project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProject ? (
            <>
              {submittedFeedback.some((item) => item.projectId === selectedProject) ? (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
                  Feedback already given for this project. You can edit and update it.
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  Rate the project and submit your feedback once you are ready.
                </div>
              )}

              <div className="space-y-5 mb-6">
                {ratingCriteria.map((criteria) => (
                  <div key={criteria.id} className="rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
                <div className="mb-2">
                  <p className="text-[12px] uppercase tracking-[0.18em] text-slate-700 font-semibold">{criteria.label}</p>
                  <p className="text-[11px] text-slate-600 mt-1">{criteria.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = (index + 1).toString();
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => handleRatingChange(criteria.id, value)}
                          className="text-slate-400 hover:text-amber-500"
                          aria-label={`${criteria.label} ${value} stars`}
                        >
                          <Star className={`h-6 w-6 ${Number(ratings[criteria.id]) >= index + 1 ? 'text-amber-500' : 'text-slate-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg px-3 py-1 min-w-[60px] justify-center">
                    <span className="text-sm font-semibold text-slate-900">{ratings[criteria.id]}</span>
                    <span className="text-xs text-slate-600">/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[24px] border border-cyan-100 bg-white/90 p-4 shadow-sm">
            <label className="block text-[12px] uppercase tracking-[0.18em] text-slate-700 font-semibold mb-2">Feedback Comments</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none"
              placeholder="Share your detailed feedback, suggestions, or comments about this project..."
            />
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={handleSubmitFeedback}
                className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Submit Feedback
              </button>
            </div>
          </div>
            </>
          ) : null}
        </article>

        {submittedFeedback.length > 0 && (
          <article className="rounded-[30px] border border-[#e5eefb] bg-[#fff5f8] p-6 shadow-[0_18px_40px_rgba(148,163,184,0.18)]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.26em] text-pink-700/90">Submitted Feedback</p>
                <h4 className="text-[22px] font-bold text-slate-900">Recent submissions</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmittedFeedback((prev) => !prev)}
                className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-semibold text-pink-700 hover:bg-pink-50"
              >
                {showSubmittedFeedback ? 'Hide feedback' : 'Show feedback'}
              </button>
            </div>

            {showSubmittedFeedback && (
              <div className="space-y-4">
                {submittedFeedback.map((item, index) => (
                  <article key={index} className="rounded-[24px] border border-pink-100 bg-[#fff4f8] p-4 shadow-sm">
                    <p className="text-[13px] font-semibold text-slate-900 mb-2">{item.project}</p>
                    <div className="grid grid-cols-2 gap-2 mb-3 md:grid-cols-5">
                      {ratingCriteria.map((criteria) => (
                        <div key={criteria.id} className="text-center">
                          <p className="text-[10px] text-slate-600 uppercase">{criteria.label}</p>
                          <p className="text-sm font-bold text-slate-900">{item.ratings[criteria.id]}/5</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[12px] leading-5 text-slate-700 border-t border-pink-100 pt-3">{item.feedback}</p>
                  </article>
                ))}
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;