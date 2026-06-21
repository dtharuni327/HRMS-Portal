import { type FC, useState } from 'react';

import { Network, Mail, Phone, Eye } from 'lucide-react';

import {
  SparkCard,
  type Employee
} from './managerShared.tsx';

interface TeamDirectoryModuleProps {
  employees: Employee[];
}

const getSeniority = (years?: number) => {
  const safeYears = years ?? 0;
  if (safeYears <= 1) return 'Junior';
  if (safeYears <= 4) return 'Mid-Level';
  return 'Senior';
};

const getDepartmentName = (emp: Employee) => emp.department ?? emp.dept ?? 'Unknown';

const TeamDirectoryModule: FC<
  TeamDirectoryModuleProps
> = ({ employees }) => {
  const [viewingAttendance, setViewingAttendance] = useState<number | null>(null);

  const departments = Array.from(new Set(employees.map(getDepartmentName))).sort();

  return (

  <div className="space-y-6 animate-in slide-in-from-bottom-4 p-8">

    {/* DEPARTMENTS WITH DETAILED INFO */}
    <div className="grid grid-cols-1 gap-6">

      {departments.map((dept, index) => {

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

          const theme = themes[index % themes.length];
          const deptEmployees = employees.filter(e => getDepartmentName(e) === dept);

          return (

            <SparkCard
              key={dept}
              className={`
                p-6
                rounded-[30px]
                border
                shadow-sm
                transition-all
                duration-300
                ${theme.card}
              `}
            >

              {/* HEADER */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl ${theme.iconBg}`}>
                  <Network size={24} className={theme.iconColor} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">
                    {dept} Department
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {deptEmployees.length} Employees
                  </p>
                </div>
              </div>

              {/* EMPLOYEES LIST */}
              <div className="space-y-3">
                {deptEmployees.map((emp, empIndex) => (
                    <div
                      key={emp.id}
                      className={`
                        p-4
                        rounded-2xl
                        border
                        backdrop-blur-sm
                        transition-all
                        hover:shadow-md
                        ${
                          empIndex % 2 === 0
                            ? 'bg-white/80 border-white/60'
                            : 'bg-white/60 border-white/50'
                        }
                      `}
                    >

                      {/* NAME & DESIGNATION */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-black text-slate-800 text-lg">
                            {emp.name}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {emp.role} • {emp.experience} yrs
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full font-black uppercase ${theme.badge}`}>
                          {getSeniority(emp.experience)}
                        </span>
                      </div>

                      {/* CONTACT INFO */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-slate-500" />
                          {emp.email ? (
                            <a href={`mailto:${emp.email}`} className="text-sm text-blue-600 hover:underline">
                              {emp.email}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-slate-500" />
                          {emp.phone ? (
                            <a href={`tel:${emp.phone}`} className="text-sm text-blue-600 hover:underline">
                              {emp.phone}
                            </a>
                          ) : (
                            <span className="text-sm text-slate-500">—</span>
                          )}
                        </div>
                      </div>

                      {/* MANAGER & QUICK ACTIONS */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="text-slate-500">Reports to</p>
                          <p className="font-semibold text-slate-700">{emp.reportingManager || '—'}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingAttendance(emp.id);
                          }}
                          className={`
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-lg
                            font-semibold
                            text-sm
                            transition-all
                            ${
                              viewingAttendance === emp.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }
                          `}
                        >
                          <Eye size={16} />
                          Attendance
                        </button>
                      </div>

                      {/* ATTENDANCE PREVIEW */}
                      {viewingAttendance === emp.id && (
                        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <p className="text-xs font-semibold text-slate-600 mb-2">Recent Attendance</p>
                          <div className="flex gap-1">
                            {['P', 'P', 'H', 'P', 'P', 'A', 'P'].map((status, i) => (
                              <div
                                key={i}
                                title={status === 'P' ? 'Present' : status === 'H' ? 'Half Day' : 'Absent'}
                                className={`
                                  w-6
                                  h-6
                                  rounded-md
                                  flex
                                  items-center
                                  justify-center
                                  text-xs
                                  font-bold
                                  ${
                                    status === 'P'
                                      ? 'bg-green-200 text-green-800'
                                      : status === 'H'
                                      ? 'bg-yellow-200 text-yellow-800'
                                      : 'bg-red-200 text-red-800'
                                  }
                                `}
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
              </div>
            </SparkCard>

          );
        }
      )}

    </div>

  </div>

  );
};

export default TeamDirectoryModule;