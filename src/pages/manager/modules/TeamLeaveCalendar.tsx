import React from 'react';

const TeamLeaveCalendar = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 min-h-[500px] animate-in fade-in">
      <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-8 text-left">Leave Calendar</h3>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] font-black text-slate-500 uppercase mb-3">{d}</div>
        ))}
        {days.map(day => (
          <div key={day} className="aspect-square bg-white/5 border border-white/5 rounded-2xl p-2 group hover:bg-white/10 transition-colors">
            <span className="text-[10px] font-bold text-slate-500">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TeamLeaveCalendar;