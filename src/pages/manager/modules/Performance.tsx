import React from 'react';
import { Clock, TrendingUp } from 'lucide-react';

const Performance = () => (
  <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 h-full animate-in fade-in">
    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-left">Analytics</h3>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
        <Clock size={24} className="text-cyan-500 mb-4" />
        <p className="text-2xl font-black text-white text-left">8.5h</p>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">Avg Hours</p>
      </div>
      <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
        <TrendingUp size={24} className="text-purple-500 mb-4" />
        <p className="text-2xl font-black text-white text-left">94%</p>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">Attendance</p>
      </div>
    </div>
  </div>
);
export default Performance;