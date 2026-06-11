import type { FC } from 'react';
import { SparkCard } from '../FinanceShared';

const ReimbursementsModule: FC = () => (
  <SparkCard className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.35)] backdrop-blur-xl">
    <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100">Finance</p>
    <h3 className="mt-3 text-xl font-black text-white">Reimbursements</h3>
    <p className="mt-2 text-sm text-slate-300">Claim submissions, approvals, and reimbursement status for the finance team.</p>
  </SparkCard>
);

export default ReimbursementsModule;
