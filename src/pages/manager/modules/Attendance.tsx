import React from 'react';

const Attendance = () => {
  const staff = [
    { name: "Rahul Verma", status: "On Leave", color: "text-red-500" },
    { name: "Sneha Reddy", status: "WFH", color: "text-cyan-500" },
    { name: "Amit Shah", status: "Active", color: "text-green-500" }
  ];
  return (
    <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 h-full animate-in fade-in">
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-left">Team Attendance</h3>
      <div className="space-y-4">
        {staff.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs text-white">{s.name[0]}</div>
              <span className="text-[11px] font-black uppercase tracking-wide text-white">{s.name}</span>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${s.color}`}>{s.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Attendance;