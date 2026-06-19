import React, { type ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface DashboardNavbarProps {
  title: string;
  subtitle: string;
  roleLabel?: string;
  productLabel?: string;
  rightContent?: ReactNode;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join('');

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
  title,
  subtitle,
  roleLabel,
  productLabel = 'HRMS',
  rightContent,
}) => {
  const user = useAuthStore((state) => state.user);
  const name = user?.name ?? 'Guest User';
  const initials = getInitials(name);
  const role = roleLabel ?? user?.role ?? 'Employee';

  return (
    <section className="mb-6 rounded-[2rem] border border-slate-500/10 border-l-4 border-l-[#14b8d0] bg-[#081a4a] p-5 shadow-none backdrop-blur-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white sm:text-3xl">{title}</h1>
          <p className="max-w-2xl text-sm text-slate-300/90">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {rightContent && <div>{rightContent}</div>}
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/90 text-base font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{name}</p>
              <p className="truncate text-[11px] text-slate-300">{role}</p>
            </div>
          </div>

          <div className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
            {productLabel}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardNavbar;
