import React from 'react';

const ProjectEffortReport = () => (
  <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 h-full animate-in fade-in">
    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-left">Project Effort</h3>
    <div className="space-y-6">
      <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5">
        <div className="flex justify-between mb-4">
          <span className="text-xs font-black text-white uppercase">HRMS Portal</span>
          <span className="text-xs font-black text-cyan-500">120h</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="w-[85%] h-full bg-cyan-500" />
        </div>
      </div>
    </div>
  </div>
);
export default ProjectEffortReport;