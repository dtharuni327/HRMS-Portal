import React from 'react';
import { Mail, Phone } from 'lucide-react';

const TeamDirectory = () => {
  const team = [
    { name: "Rahul Verma", role: "Frontend Developer", email: "rahul.v@company.com" },
    { name: "Sneha Reddy", role: "UX Designer", email: "sneha.r@company.com" },
  ];
  return (
    <div className="bg-[#111] rounded-[2.5rem] p-8 border border-white/5 min-h-[500px] animate-in fade-in">
      <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-8 text-left">Directory</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {team.map((member, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center gap-5 hover:bg-white/10 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 font-black text-xl">{member.name[0]}</div>
            <div className="text-left">
              <h4 className="text-sm font-black text-white uppercase">{member.name}</h4>
              <p className="text-[9px] font-bold text-cyan-500 uppercase tracking-widest mb-3">{member.role}</p>
              <div className="flex gap-4 text-slate-500 text-[9px] font-bold">
                <span className="flex items-center gap-1.5"><Mail size={12}/> {member.email}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TeamDirectory;