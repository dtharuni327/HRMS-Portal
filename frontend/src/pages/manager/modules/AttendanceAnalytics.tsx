import { type FC } from 'react';
import {
  BarChart3,
  Clock,
  TrendingUp,
  TimerReset,
} from 'lucide-react';

interface AttendanceAnalyticsModuleProps {
  employees?: {
    id: number;
    name: string;
  }[];

  attendanceStatus?: Record<
    number,
    string
  >;
}

const AttendanceAnalyticsModule: FC<
  AttendanceAnalyticsModuleProps
> = ({
  employees = [],
  attendanceStatus = {},
}) => {

  /* ATTENDANCE RATE */

  const attendanceRate = employees.map(
    employee => {

      const status =
        attendanceStatus[employee.id];

      return {
        ...employee,
        rate:
          status === 'Present'
            ? 100
            : status === 'WFH'
            ? 95
            : status === 'Late'
            ? 75
            : 40,
      };
    }
  );

  /* LATE COUNT TREND */

  const lateTrend = [
    {
      week: 'Week 1',
      late: 4,
    },
    {
      week: 'Week 2',
      late: 6,
    },
    {
      week: 'Week 3',
      late: 3,
    },
    {
      week: 'Week 4',
      late: 5,
    },
  ];

  /* AVERAGE HOURS */

  const averageHours =
    employees.length > 0
      ? 8.4
      : 0;

  /* OVERTIME */

  const overtimeHours =
    employees.length * 3;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* AVG WORKING HOURS */}
        <div
          className="
            rounded-[2rem]
            bg-white
            p-6
            shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-slate-500">
                Average Working Hours
              </p>

              <h3 className="mt-3 text-4xl font-black text-slate-900">
                {averageHours}h
              </h3>

            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-cyan-100
                text-cyan-700
              "
            >
              <Clock size={24} />
            </div>

          </div>

        </div>

        {/* OVERTIME */}
        <div
          className="
            rounded-[2rem]
            bg-white
            p-6
            shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-slate-500">
                Overtime Hours
              </p>

              <h3 className="mt-3 text-4xl font-black text-slate-900">
                {overtimeHours}h
              </h3>

            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-violet-100
                text-violet-700
              "
            >
              <TimerReset size={24} />
            </div>

          </div>

        </div>

        {/* PRESENT RATE */}
        <div
          className="
            rounded-[2rem]
            bg-white
            p-6
            shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm font-bold text-slate-500">
                Team Attendance
              </p>

              <h3 className="mt-3 text-4xl font-black text-slate-900">

                {employees.length > 0
                  ? Math.round(
                      (
                        Object.values(
                          attendanceStatus
                        ).filter(
                          status =>
                            status ===
                              'Present' ||
                            status ===
                              'WFH'
                        ).length /
                        employees.length
                      ) * 100
                    )
                  : 0}
                %

              </h3>

            </div>

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
              "
            >
              <TrendingUp size={24} />
            </div>

          </div>

        </div>

      </div>

      {/* ATTENDANCE RATE */}
      <div
        className="
          rounded-[2rem]
          bg-white
          p-6
          shadow-[0_16px_45px_rgba(0,0,0,0.08)]
        "
      >

        <h3 className="text-xl font-black text-slate-900 mb-6">
          Attendance Rate Per Team Member
        </h3>

        <div className="space-y-5">

          {attendanceRate.map(employee => (

            <div
              key={employee.id}
            >

              <div className="flex items-center justify-between mb-2">

                <div>

                  <p className="font-bold text-slate-800">
                    {employee.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    Attendance Rate
                  </p>

                </div>

                <span className="font-black text-slate-900">
                  {employee.rate}%
                </span>

              </div>

              <div
                className="
                  h-3
                  overflow-hidden
                  rounded-full
                  bg-slate-100
                "
              >

                <div
                  style={{
                    width: `${employee.rate}%`,
                  }}
                  className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                  "
                />

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* LATE TREND */}
      <div
        className="
          rounded-[2rem]
          bg-white
          p-6
          shadow-[0_16px_45px_rgba(0,0,0,0.08)]
        "
      >

        <h3 className="text-xl font-black text-slate-900 mb-6">
          Late Count Trend (Last 4 Weeks)
        </h3>

        <div className="grid grid-cols-4 gap-4">

          {lateTrend.map(item => (

            <div
              key={item.week}
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm font-semibold text-slate-500">
                {item.week}
              </p>

              <h3 className="mt-4 text-4xl font-black text-rose-600">
                {item.late}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Late arrivals
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AttendanceAnalyticsModule;