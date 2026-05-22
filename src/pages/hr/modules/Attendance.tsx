import { type Dispatch, type SetStateAction, type FC } from 'react';
import { MapPin, Smile, Calendar, Clock } from 'lucide-react';
import {
  SparkCard,
  type Employee,
  type AttendanceStatus
} from '../hrShared';

interface AttendanceModuleProps {
  employees: Employee[];
  attendanceStatus: AttendanceStatus;
  setAttendanceStatus: Dispatch<SetStateAction<AttendanceStatus>>;
}

const AttendanceModule: FC<AttendanceModuleProps> = ({
  employees,
  attendanceStatus,
  setAttendanceStatus
}) => {
  const lateArrivalIds = [2, 5, 9];
  const lateArrivals = employees.filter((emp) => lateArrivalIds.includes(emp.id)).length;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      {/* LATE ARRIVALS */}
      <SparkCard
        className="
          p-6
          text-center
          bg-[#FEF3C7]
          border
          border-amber-100
          rounded-3xl
          shadow-sm
        "
      >

        <div className="flex items-center justify-center mb-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-700 inline-flex">
            <Clock size={20} />
          </div>
        </div>

        <p className="text-3xl font-black text-amber-700">
          {lateArrivals}
        </p>

        <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest mt-2">
          Late Arrivals
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Company-wide today
        </p>

      </SparkCard>

      {/* PRESENT */}
      <SparkCard
        className="
          p-6
          text-center
          bg-[#EEF4FF]
          border
          border-blue-100
          rounded-3xl
          shadow-sm
        "
      >

        <p className="text-3xl font-black text-blue-600">
          {
            Object.values(attendanceStatus)
              .filter(s => s === 'Present').length
          }
        </p>

        <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest mt-2">
          Present
        </p>

        <p className="text-xs text-slate-500 mt-1">
          In office today
        </p>

      </SparkCard>

      {/* WFH */}
      <SparkCard
        className="
          p-6
          text-center
          bg-[#F8F5FF]
          border
          border-violet-100
          rounded-3xl
          shadow-sm
        "
      >

        <p className="text-3xl font-black text-violet-600">
          {
            Object.values(attendanceStatus)
              .filter(s => s === 'WFH').length
          }
        </p>

        <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest mt-2">
          Work From Home
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Remote working
        </p>

      </SparkCard>

      {/* LEAVE */}
      <SparkCard
        className="
          p-6
          text-center
          bg-[#FFF4F4]
          border
          border-rose-100
          rounded-3xl
          shadow-sm
        "
      >

        <p className="text-3xl font-black text-rose-500">
          {
            Object.values(attendanceStatus)
              .filter(s => s === 'On Leave').length
          }
        </p>

        <p className="text-[10px] uppercase font-bold text-slate-600 tracking-widest mt-2">
          On Leave
        </p>

        <p className="text-xs text-slate-500 mt-1">
          Approved leave
        </p>

      </SparkCard>

    </div>

    {/* TABLE CARD */}
    <SparkCard
      className="
        overflow-hidden
        bg-white/90
        backdrop-blur-xl
        border
        border-slate-200
        rounded-3xl
        shadow-xl
      "
    >

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          {/* TABLE HEADER */}
          <thead
            className="
              bg-[#EDE9FE]
              text-violet-700
              text-[10px]
              uppercase
              font-black
              tracking-widest
            "
          >

            <tr>
              <th className="px-8 py-5">Employee Name</th>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Check-in Time</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5">Actions</th>
            </tr>

          </thead>

          {/* TABLE BODY */}
          <tbody>

            {employees.map((emp, index) => (

              <tr
                key={emp.id}
                className={`
                  transition-all
                  hover:bg-white/70
                  border-b
                  border-white/40
                  ${
                    index % 2 === 0
                      ? 'bg-[#EEF4FF]'
                      : 'bg-[#F8F5FF]'
                  }
                `}
              >

                {/* NAME */}
                <td className="px-8 py-5">

                  <div>

                    <p className="font-bold text-slate-900">
                      {emp.name}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      ID: #{emp.id}
                    </p>

                  </div>

                </td>

                {/* DEPARTMENT */}
                <td className="px-8 py-5 text-slate-700 font-medium">
                  {emp.dept}
                </td>

                {/* STATUS */}
                <td className="px-8 py-5">

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      attendanceStatus[emp.id] === 'Present'
                        ? 'bg-blue-100 text-blue-700'
                        : attendanceStatus[emp.id] === 'WFH'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {attendanceStatus[emp.id] ?? 'On Leave'}
                  </span>

                </td>

                {/* TIME */}
                <td className="px-8 py-5 text-slate-700 font-medium">

                  {attendanceStatus[emp.id] === 'Present' ||
                  attendanceStatus[emp.id] === 'WFH'
                    ? '09:15 AM'
                    : 'N/A'}

                </td>

                {/* LOCATION */}
                <td className="px-8 py-5">

                  <div className="flex items-center gap-1 text-slate-600 text-xs">

                    {attendanceStatus[emp.id] === 'Present' ? (
                      <>
                        <MapPin
                          size={14}
                          className="text-blue-500"
                        />
                        Office - Floor 4
                      </>
                    ) : attendanceStatus[emp.id] === 'WFH' ? (
                      <>
                        <Smile
                          size={14}
                          className="text-violet-500"
                        />
                        Remote
                      </>
                    ) : (
                      <>
                        <Calendar
                          size={14}
                          className="text-rose-500"
                        />
                        On Leave
                      </>
                    )}

                  </div>

                </td>

                {/* ACTIONS */}
                <td className="px-8 py-5">

                  <div className="flex gap-2">

                    {/* PRESENT */}
                    <button
                      onClick={() =>
                        setAttendanceStatus(prev => ({
                          ...prev,
                          [emp.id]: 'Present'
                        }))
                      }
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        attendanceStatus[emp.id] === 'Present'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      Present
                    </button>

                    {/* WFH */}
                    <button
                      onClick={() =>
                        setAttendanceStatus(prev => ({
                          ...prev,
                          [emp.id]: 'WFH'
                        }))
                      }
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        attendanceStatus[emp.id] === 'WFH'
                          ? 'bg-violet-500 text-white'
                          : 'bg-violet-100 text-violet-700'
                      }`}
                    >
                      WFH
                    </button>

                    {/* LEAVE */}
                    <button
                      onClick={() =>
                        setAttendanceStatus(prev => ({
                          ...prev,
                          [emp.id]: 'On Leave'
                        }))
                      }
                      className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                        attendanceStatus[emp.id] === 'On Leave'
                          ? 'bg-rose-500 text-white'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      Leave
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </SparkCard>

  </div>
);
};

export default AttendanceModule;