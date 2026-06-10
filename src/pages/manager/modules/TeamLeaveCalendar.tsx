import { type FC, useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Plane,
  Briefcase,
  HeartPulse,
} from 'lucide-react';

interface LeaveData {
  id: number;
  employee: string;
  type: string;
  days: number;
  startDate: string;
  status: string;
}

interface Holiday {
  id: string;
  title: string;
  date: string;
  type: string;
}

const HOLIDAY_STORAGE_KEY = 'hrms_global_holidays';

const defaultHolidays: Holiday[] = [
  {
    id: '1',
    date: '2026-05-01',
    title: 'Labour Day',
    type: 'Public Holiday',
  },
  {
    id: '2',
    date: '2026-05-15',
    title: 'Festival Holiday',
    type: 'Company Holiday',
  },
];

interface TeamLeaveCalendarModuleProps {
  leaveData?: LeaveData[];
  employees?: {
    id: number;
    name: string;
  }[];
  attendanceStatus?: Record<
    number,
    string
  >;
}

const TeamLeaveCalendarModule: FC<
  TeamLeaveCalendarModuleProps
> = ({
  leaveData = [],
  employees = [],
  attendanceStatus = {},
}) => {

  const today = new Date();

  const [viewMonth, setViewMonth] =
    useState(today.getMonth());

  const [viewYear, setViewYear] =
    useState(today.getFullYear());

  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    if (typeof window === 'undefined') {
      return defaultHolidays;
    }
    try {
      const stored = window.localStorage.getItem(HOLIDAY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Holiday[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore invalid storage content
    }
    return defaultHolidays;
  });

  const [newHolidayTitle, setNewHolidayTitle] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayType, setNewHolidayType] = useState('Company Holiday');

  useEffect(() => {
    window.localStorage.setItem(
      HOLIDAY_STORAGE_KEY,
      JSON.stringify(holidays)
    );
  }, [holidays]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === HOLIDAY_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue) as Holiday[];
          if (Array.isArray(parsed)) {
            setHolidays(parsed);
          }
        } catch {
          // ignore invalid storage content
        }
      }
    };

    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const monthName = new Date(
    viewYear,
    viewMonth
  ).toLocaleString('default', {
    month: 'long',
  });

  const addHoliday = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newHolidayTitle.trim() || !newHolidayDate) {
      return;
    }

    const newHoliday: Holiday = {
      id: `${Date.now()}-${newHolidayDate}`,
      title: newHolidayTitle.trim(),
      date: newHolidayDate,
      type: newHolidayType,
    };

    setHolidays(prev => [newHoliday, ...prev]);
    setNewHolidayTitle('');
    setNewHolidayDate('');
    setNewHolidayType('Company Holiday');
  };

  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
  };


  const daysInMonth = new Date(
    viewYear,
    viewMonth + 1,
    0
  ).getDate();

  const firstDay = new Date(
    viewYear,
    viewMonth,
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: (
      | null
      | {
          day: number;
          fullDate: string;
        }
    )[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const fullDate = `${viewYear}-${String(
        viewMonth + 1
      ).padStart(2, '0')}-${String(day).padStart(
        2,
        '0'
      )}`;

      days.push({
        day,
        fullDate,
      });
    }

    return days;
  }, [
    viewMonth,
    viewYear,
    firstDay,
    daysInMonth,
  ]);

  const getHoliday = (date: string) => {
    return holidays.find(
      holiday => holiday.date === date
    );
  };

  const getLeavesForDate = (
    date: string
  ) => {
    return leaveData.filter(
      leave => leave.startDate === date
    );
  };

  const getLeaveColor = (type: string) => {
    switch (type.toLowerCase()) {

      case 'casual':
        return 'bg-cyan-100 border-cyan-200 text-cyan-700';

      case 'sick':
        return 'bg-rose-100 border-rose-200 text-rose-700';

      case 'wfh':
        return 'bg-amber-100 border-amber-200 text-amber-700';

      default:
        return 'bg-violet-100 border-violet-200 text-violet-700';
    }
  };

  const presentCount =
    Object.values(attendanceStatus).filter(
      status => status === 'Present'
    ).length;

  const wfhCount =
    Object.values(attendanceStatus).filter(
      status => status === 'WFH'
    ).length;

  const leaveCount =
    leaveData.filter(
      item =>
        item.status === 'Approved'
    ).length;

  const availability =
    employees.length > 0
      ? Math.round(
          (
            (presentCount + wfhCount) /
            employees.length
          ) * 100
        )
      : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* HEADER */}
      <div
        className="
          rounded-[2rem]
          border
          border-white/10
          bg-gradient-to-br
          from-[#1e293b]
          to-[#0f172a]
          p-6
        "
      >

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-violet-500/20
                text-violet-400
              "
            >
              <Calendar size={24} />
            </div>

            <div>

              <h2 className="text-2xl font-black text-white">
                Team Leave Calendar
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Monthly leave schedule overview
              </p>

            </div>

          </div>

          {/* MONTH CONTROLS */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear(prev => prev - 1);
                } else {
                  setViewMonth(prev => prev - 1);
                }
              }}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white/10
                text-white
              "
            >
              <ChevronLeft size={18} />
            </button>

            <div
              className="
                rounded-xl
                bg-white/10
                px-5
                py-2
                text-sm
                font-bold
                text-white
              "
            >
              {monthName} {viewYear}
            </div>

            <button
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear(prev => prev + 1);
                } else {
                  setViewMonth(prev => prev + 1);
                }
              }}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-white/10
                text-white
              "
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
        <div
          className="
            rounded-[2rem]
            bg-white
            p-6
            shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          "
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Company Holiday Schedule
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Add holidays and share them with everyone on the calendar.
              </p>
            </div>
          </div>

          <form
            onSubmit={addHoliday}
            className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <input
              type="date"
              value={newHolidayDate}
              onChange={event => setNewHolidayDate(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              aria-label="Holiday date"
            />

            <input
              type="text"
              placeholder="Holiday title"
              value={newHolidayTitle}
              onChange={event => setNewHolidayTitle(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              aria-label="Holiday title"
            />

            <button
              type="submit"
              className="rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Add Holiday
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {holidays.map(holiday => (
              <div
                key={holiday.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {holiday.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(holiday.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}{' '}
                    • {holiday.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeHoliday(holiday.id)}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div
        className="
          rounded-[2rem]
          bg-white
          p-6
          shadow-[0_16px_45px_rgba(0,0,0,0.08)]
        "
      >

        {/* DAYS */}
        <div className="grid grid-cols-7 gap-3 mb-3">

          {[
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ].map(day => (

            <div
              key={day}
              className="
                text-center
                text-xs
                font-black
                uppercase
                tracking-[0.15em]
                text-slate-400
              "
            >
              {day}
            </div>

          ))}

        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-3">

          {calendarDays.map((item, idx) => {

            if (!item) {
              return (
                <div
                  key={idx}
                  className="h-[120px]"
                />
              );
            }

            const leaves =
              getLeavesForDate(
                item.fullDate
              );

            const holiday =
              getHoliday(
                item.fullDate
              );

            return (
              <div
                key={item.fullDate}
                className="
                  min-h-[120px]
                  rounded-2xl
                  border
                  border-slate-200
                  bg-[#f8fafc]
                  p-3
                "
              >

                {/* DATE */}
                <div className="flex items-center justify-between">

                  <p className="text-sm font-black text-slate-900">
                    {item.day}
                  </p>

                  {holiday && (
                    <span
                      className="
                        rounded-full
                        bg-emerald-100
                        px-2
                        py-1
                        text-[9px]
                        font-bold
                        uppercase
                        text-emerald-700
                      "
                    >
                      Holiday
                    </span>
                  )}

                </div>

                {/* HOLIDAY */}
                {holiday && (
                  <div
                    className="
                      mt-2
                      rounded-xl
                      bg-emerald-50
                      p-2
                      text-[10px]
                      font-bold
                      text-emerald-700
                    "
                  >
                    {holiday.title}
                  </div>
                )}

                {/* LEAVE DATA */}
                <div className="mt-2 space-y-2">

                  {leaves.map(leave => (

                    <div
                      key={leave.id}
                      className={`
                        rounded-xl
                        border
                        px-2
                        py-2
                        text-[10px]
                        font-bold
                        ${getLeaveColor(
                          leave.type
                        )}
                      `}
                    >

                      <p className="truncate">
                        {leave.employee}
                      </p>

                      <p className="mt-1 uppercase">
                        {leave.type}
                      </p>

                    </div>

                  ))}

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* TEAM AVAILABILITY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* AVAILABLE */}
        <div className="rounded-[2rem] bg-emerald-50 p-6">

          <Users
            size={24}
            className="text-emerald-600"
          />

          <p className="mt-4 text-3xl font-black text-emerald-700">
            {presentCount}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            Available
          </p>

        </div>

        {/* ON LEAVE */}
        <div className="rounded-[2rem] bg-rose-50 p-6">

          <Plane
            size={24}
            className="text-rose-600"
          />

          <p className="mt-4 text-3xl font-black text-rose-700">
            {leaveCount}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            On Leave
          </p>

        </div>

        {/* WFH */}
        <div className="rounded-[2rem] bg-amber-50 p-6">

          <Briefcase
            size={24}
            className="text-amber-600"
          />

          <p className="mt-4 text-3xl font-black text-amber-700">
            {wfhCount}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            WFH
          </p>

        </div>

        {/* AVAILABILITY */}
        <div className="rounded-[2rem] bg-cyan-50 p-6">

          <HeartPulse
            size={24}
            className="text-cyan-600"
          />

          <p className="mt-4 text-3xl font-black text-cyan-700">
            {availability}%
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-600">
            Availability
          </p>

        </div>

      </div>

    </div>
  );
};

export default TeamLeaveCalendarModule;