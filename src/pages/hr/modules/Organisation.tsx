import { type FC } from 'react';

import { Network } from 'lucide-react';

import {
  SparkCard,
  type Employee
} from '../hrShared';

interface OrganisationModuleProps {
  employees: Employee[];
}

const getSeniority = (years: number) => {
  if (years <= 1) return 'Junior';
  if (years <= 4) return 'Mid-Level';
  return 'Senior';
};

const OrganisationModule: FC<
  OrganisationModuleProps
> = ({ employees }) => (

  <div className="space-y-6 animate-in slide-in-from-bottom-4">

    {/* DEPARTMENTS */}
    <div className="grid grid-cols-1 gap-6">

      {['Tech', 'Design', 'Admin'].map(
        (dept, index) => {

          // DIFFERENT PASTEL THEMES
          const themes = [
            {
              card: 'bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] border-blue-100',
              iconBg: 'bg-blue-100',
              iconColor: 'text-blue-600',
              badge: 'bg-blue-100 text-blue-700'
            },
            {
              card: 'bg-gradient-to-br from-[#F5F3FF] to-[#FAF5FF] border-violet-100',
              iconBg: 'bg-violet-100',
              iconColor: 'text-violet-600',
              badge: 'bg-violet-100 text-violet-700'
            },
            {
              card: 'bg-gradient-to-br from-[#DCFCE7] to-[#F0FDF4] border-emerald-100',
              iconBg: 'bg-emerald-100',
              iconColor: 'text-emerald-600',
              badge: 'bg-emerald-100 text-emerald-700'
            }
          ];

          const theme = themes[index];

          return (

            <SparkCard
              key={dept}
              className={`
                p-8
                rounded-[30px]
                border
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all
                duration-300
                ${theme.card}
              `}
            >

              {/* TOP */}
              <div className="flex items-center gap-4 mb-6">

                <div
                  className={`
                    p-3
                    rounded-2xl
                    ${theme.iconBg}
                  `}
                >

                  <Network
                    size={24}
                    className={theme.iconColor}
                  />

                </div>

                <div>

                  <h3 className="text-2xl font-black text-slate-800">
                    {dept} Department
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {
                      employees.filter(
                        e => e.dept === dept
                      ).length
                    } Employees
                  </p>

                </div>

              </div>

              {/* EMPLOYEES */}
              <div className="space-y-3">

                {employees
                  .filter(
                    e => e.dept === dept
                  )
                  .map((emp, empIndex) => (

                    <div
                      key={emp.id}
                      className={`
                        flex
                        items-center
                        justify-between
                        p-4
                        rounded-2xl
                        border
                        backdrop-blur-sm
                        transition-all
                        hover:scale-[1.01]
                        ${
                          empIndex % 2 === 0
                            ? 'bg-white/80 border-white/60'
                            : 'bg-white/60 border-white/50'
                        }
                      `}
                    >

                      <div>

                        <p className="font-black text-slate-800">
                          {emp.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {emp.role}
                        </p>

                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-1">
                          {emp.experience} yr{emp.experience === 1 ? '' : 's'} experience
                        </p>

                      </div>

                      <span
                        className={`
                          px-3
                          py-1
                          text-xs
                          rounded-full
                          font-black
                          uppercase
                          ${theme.badge}
                        `}
                      >
                        {getSeniority(emp.experience)}
                      </span>

                    </div>

                ))}

              </div>

            </SparkCard>

          );
      })}

    </div>

  </div>

);

export default OrganisationModule;