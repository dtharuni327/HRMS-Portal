import React from 'react';
import { Check, X } from 'lucide-react';

const Approvals = () => {
  const requests = [
    { name: "Rahul Verma", type: "Leave Request", date: "May 14" },
    { name: "Sneha Reddy", type: "WFH Request", date: "May 15" }
  ];
  return (
    <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 h-full animate-in fade-in">
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic text-white text-left">Approvals</h3>
      <div className="space-y-4">
        {requests.map((r, i) => (
          <div key={i} className="p-5 bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-between group">
            <div className="text-left">
              <p className="text-xs font-black uppercase text-white">{r.name}</p>
              <p className="text-[9px] font-bold text-cyan-500 uppercase mt-1">{r.type}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Check size={14}/></button>
              <button className="p-2 bg-red-500/10 text-red-500 rounded-lg"><X size={14}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Approvals;