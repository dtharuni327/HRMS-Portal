import { type Dispatch, type SetStateAction, type ChangeEvent, type FC } from 'react';
import { Users, Check, CheckCircle2, Smile, Zap, Plus, X, XCircle, Megaphone, Star } from 'lucide-react';
import hrImage from '../../../images/image.png';
import image14 from '../../../images/image14.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { SparkCard, StatCard, type Announcement, type Employee, type HRDetails, type Job, type LeaveData, type Policy, type RequestItem, type Training, type AttendanceStatus, type Payslip } from './managerShared';
import { useEffect, useMemo, useState, useRef } from 'react';
interface DashboardModuleProps {
  hrDetails: HRDetails;
  profileImage: string | null;
  showProfileModal: boolean;
  setShowProfileModal: Dispatch<SetStateAction<boolean>>;
  handleProfileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  setActivePage: Dispatch<SetStateAction<'dashboard' | 'profile'>>;
  setActiveTab: Dispatch<SetStateAction<'Home' | 'Approvals' | 'Regularisation' | 'Attendance' | 'AttendanceAnalytics' | 'ProjectEffortReport' | 'TeamDirectory' | 'TeamLeaveCalendar' | 'Employee' | 'TaskManager' | 'ClientUpdates'>>;
  announcements: Announcement[];
  announcementForm: { title: string; tag: string };
  setAnnouncementForm: Dispatch<SetStateAction<{ title: string; tag: string }>>;
  requests: RequestItem[];
  setRequests: Dispatch<SetStateAction<RequestItem[]>>;
  wfhRequests: RequestItem[];
  setWfhRequests: Dispatch<SetStateAction<RequestItem[]>>;
  employees: Employee[];
  attendanceStatus: AttendanceStatus;
  jobs: Job[];
  trainings: Training[];
  generatedPayslips: Payslip[];
  policies: Policy[];
  leaveData: LeaveData[];
  setIsAnnouncementModalOpen: Dispatch<SetStateAction<boolean>>;
  isAnnouncementModalOpen: boolean;
  handleAddAnnouncement: () => void;
  getTimeAgo: (timestamp: number) => string;
}

const nowTimestamp = Date.now();

const DashboardModule: FC<DashboardModuleProps> = ({
  hrDetails,
  profileImage,
  showProfileModal,
  setShowProfileModal,
  handleProfileUpload,
  setActivePage,
  setActiveTab,
  announcements,
  announcementForm,
  setAnnouncementForm,
  isAnnouncementModalOpen,
  handleAddAnnouncement,
  wfhRequests,
  setWfhRequests,
  employees,
  attendanceStatus,
  leaveData,
  setIsAnnouncementModalOpen,
  getTimeAgo,
}) => {
  const validAnnouncements = announcements.filter(a => {
    const ageInHours = (nowTimestamp - a.timestamp) / (1000 * 60 * 60);
    return ageInHours < 24;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [viewYear, setViewYear] = useState(currentTime.getFullYear());
  const [viewMonth, setViewMonth] = useState(currentTime.getMonth());
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { in?: string; out?: string; duration?: number; status: 'Full' | 'Partial' | 'Absent' | 'Leave' }>>({
    '2026-05-12': { in: '09:05', out: '17:20', duration: 8.25, status: 'Full' },
    '2026-05-13': { in: '09:15', out: '16:00', duration: 6.75, status: 'Partial' },
    '2026-05-14': { in: '09:02', out: '17:10', duration: 8.13, status: 'Full' },
    '2026-05-15': { in: '09:10', out: '17:05', duration: 7.92, status: 'Partial' },
    '2026-05-16': { in: '09:00', out: '17:20', duration: 8.33, status: 'Full' },
    '2026-05-17': { in: '09:20', out: '15:10', duration: 5.83, status: 'Partial' }
  });
  const todayKey = currentTime.toISOString().split('T')[0];
  const todayMonthDay = currentTime.toISOString().slice(5, 10);

  const todayEvents = useMemo(() => {
    return employees.reduce(
      (events, emp) => {
        if (emp.birthday) {
          const birthdayMonthDay = emp.birthday.slice(5);
          if (birthdayMonthDay === todayMonthDay) {
            events.push({
              name: emp.name,
              type: 'Birthday' as const,
              date: birthdayMonthDay,
              note: ''
            });
          }
        }

        if (emp.joinDate) {
          const anniversaryMonthDay = emp.joinDate.slice(5);
          if (anniversaryMonthDay === todayMonthDay) {
            events.push({
              name: emp.name,
              type: 'Anniversary' as const,
              date: anniversaryMonthDay,
              note: ''
            });
          }
        }

        return events;
      },
      [] as Array<{
        name: string;
        type: 'Birthday' | 'Anniversary';
        date: string;
        note: string;
      }>
    );
  }, [employees, todayMonthDay]);

  const normalizeDept = (dept?: string) => {
    const normalized = dept?.trim() || 'Unknown';
    if (/^tech\b/i.test(normalized)) return 'Technology';
    if (/^admin\b/i.test(normalized)) return 'Administration';
    if (/^(hr|human resources)$/i.test(normalized)) return 'Human Resources';
    return normalized;
  };

  const departmentCounts = useMemo(() => {
    const counts = employees.reduce<Record<string, number>>((acc, emp) => {
      const dept = normalizeDept(emp.department ?? emp.dept);
      acc[dept] = (acc[dept] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [employees]);

  const formatPunchTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatTimer = (value: number) => {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const secs = value % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const requiredHours = 8;
  const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long' });

  const monthCalendarDays = useMemo(() => {
    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const days: Array<{ date?: Date; key: string; status: string }> = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      days.push({ key: `blank-${i}`, date: undefined, status: 'Empty' });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(viewYear, viewMonth, day);
      const key = date.toISOString().split('T')[0];
      const record = attendanceRecords[key];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      let status: string;

      if (record) {
        status = record.status;
      } else if (date < today) {
        status = isWeekend ? 'Weekend' : 'Absent';
      } else {
        status = 'Future';
      }

      days.push({ date, key, status });
    }

    return days;
  }, [viewYear, viewMonth, attendanceRecords, currentTime]);

  // Compute today's attendance counts from `attendanceStatus` (real-time)
  const todayAttendanceCounts = useMemo(() => {
    const values = Object.values(attendanceStatus);
    const present = values.filter(s => s === 'Present').length;
    const wfh = values.filter(s => s === 'WFH').length;
    const leave = values.filter(s => typeof s === 'string' && s.toLowerCase().includes('leave')).length;
    return [
      { status: 'Present', count: present },
      { status: 'WFH', count: wfh },
      { status: 'Leave', count: leave }
    ];
  }, [attendanceStatus]);

  const pendingWfhRequests = useMemo(
    () => wfhRequests.filter(request => !request.status || request.status === 'Pending'),
    [wfhRequests]
  );

  const pendingLeaveRequests = useMemo(
    () => leaveData.filter(leave => leave.status === 'Pending'),
    [leaveData]
  );

useEffect(() => {

  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);

}, []);

const timerRef = useRef<number | null>(null);
const checkInRef = useRef<number | null>(null);

useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        
  <div className="relative mt-16 mb-6">

    <div className="relative mt-4 mb-4">

      <div className="relative mt-6 mb-4">

        <SparkCard
          overflowVisible
          className="
            relative
            p-6
            md:p-8
            min-h-[20rem]
            rounded-[2rem]
            bg-[#0f172a]
            border border-white/10
            shadow-[0_18px_50px_rgba(15,23,42,0.45)]
          "
        >

          <div className="flex min-h-full items-start">

            <div className="relative z-30 flex-1 space-y-4">

              <div className="flex items-center gap-4">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      object-cover
                      border-2
                      border-cyan-400
                      shadow-lg
                    "
                  />

                ) : (

                  <div
                    className="
                      w-14
                      h-14
                      bg-cyan-500
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      font-black
                      text-lg
                      text-white
                      shadow-lg
                    "
                  >
                    {hrDetails.avatar}
                  </div>

                )}

                <div>

                  <h3 className="text-2xl font-black text-white leading-tight">
                    Welcome Back, {hrDetails.name.split(' ')[0]}!
                  </h3>

                  <p className="text-slate-300 font-bold text-base uppercase tracking-[0.1em]">
                    {hrDetails.role}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 max-w-full sm:max-w-lg">

                <div className="flex flex-col">

                  <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider">
                    Email
                  </span>

                  <span className="text-white text-xs opacity-90 truncate">
                    {hrDetails.email}
                  </span>

                </div>

                <div className="flex flex-col">

                  <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider">
                    Phone
                  </span>

                  <span className="text-white text-xs opacity-90">
                    {hrDetails.phone}
                  </span>

                </div>

                <div className="flex flex-col">

                  <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider">
                    Experience
                  </span>

                  <span className="text-white text-sm font-black">
                    {hrDetails.experience}
                  </span>

                </div>

                <div className="flex flex-col">

                  <span className="text-slate-400 font-black uppercase text-[8px] tracking-wider">
                    Department
                  </span>

                  <span className="text-white text-sm font-black">
                    {hrDetails.dept}
                  </span>

                </div>

              </div>
                  <div className="mt-6">
                    <button
  type="button"
  onClick={() => setActivePage('profile')}
  className="
    relative
    z-40
    inline-flex
    items-center
    justify-center
    rounded-2xl
    bg-cyan-500
    px-6
    py-3
    text-xs
    font-black
    uppercase
    tracking-widest
    text-black
    transition-all
    duration-200
    hover:bg-cyan-400
    cursor-pointer
  "
>
  View Profile
</button>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 pointer-events-none flex items-end">
                  <img
  src={
    hrDetails?.gender?.toLowerCase() === "male"
      ? image14
      : hrImage
  }
  alt="HR Illustration"
  className="
    w-[280px]
    md:w-[400px]
    lg:w-[460px]
    object-contain
    drop-shadow-2xl
  "
/>
                </div>
              </div>
            </SparkCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6 mt-8">
  
    {/* TOTAL STAFF */}
    <button
      type="button"
      onClick={() => setActiveTab('Attendance')}
      className="
        w-full
        rounded-[2rem]
        bg-[#e7e0f7]
        border
        border-white/10
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#ddd5f2]
        focus:outline-none
        focus:ring-2
        focus:ring-[#6356d8]/50
        cursor-pointer
      "
    >
      <StatCard
        icon={<Users size={24} />}
        value={employees.length}
        label="Total Staff"
        color="text-[#6356d8]"
      />
    </button>
  
    {/* PRESENT TODAY */}
    <button
      type="button"
      onClick={() => setActiveTab('Attendance')}
      className="
        w-full
        rounded-[2rem]
        bg-[#e9fff2]
        border
        border-white/10
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#e3fff5]
        focus:outline-none
        focus:ring-2
        focus:ring-[#16a34a]/50
        cursor-pointer
      "
    >
      <StatCard
        icon={<CheckCircle2 size={24} />}
        value={
          Object.values(attendanceStatus).filter(
            s => s === 'Present'
          ).length
        }
        label="Present Today"
        color="text-[#16a34a]"
      />
    </button>
  
    {/* WORK FROM HOME */}
    <button
      type="button"
      onClick={() => setActiveTab('Attendance')}
      className="
        w-full
        rounded-[2rem]
        bg-[#e6f6ff]
        border
        border-white/10
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#e0f4ff]
        focus:outline-none
        focus:ring-2
        focus:ring-[#0891b2]/50
        cursor-pointer
      "
    >
      <StatCard
        icon={<Smile size={24} />}
        value={
          Object.values(attendanceStatus).filter(
            s => s === 'WFH'
          ).length
        }
        label="Work From Home"
        color="text-[#0891b2]"
      />
    </button>
  
    {/* ON LEAVE */}
    <button
      type="button"
      onClick={() => setActiveTab('Attendance')}
      className="
        w-full
        rounded-[2rem]
        bg-[#ffe6ea]
        border
        border-white/10
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#ffe0e7]
        focus:outline-none
        focus:ring-2
        focus:ring-[#e11d48]/50
        cursor-pointer
      "
    >
      <StatCard
        icon={
          <div className="h-6 w-6 rounded-full bg-rose-400/40" />
        }
        value={
          Object.values(attendanceStatus).filter(
            s => s === 'On Leave'
          ).length
        }
        label="On Leave"
        color="text-[#e11d48]"
      />
    </button>
  
    {/* WFH REQUESTS */}
    <button
      type="button"
      onClick={() => setActiveTab('Approvals')}
      className="
        w-full
        rounded-[2rem]
        bg-[#fff0d8]
        border
        border-white/10
        shadow-[0_16px_45px_rgba(0,0,0,0.12)]
        text-left
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:bg-[#fff5e5]
        focus:outline-none
        focus:ring-2
        focus:ring-[#d97706]/50
        cursor-pointer
      "
    >
      <StatCard
        icon={<Zap size={24} />}
        value={wfhRequests.length}
        label="WFH Requests"
        color="text-[#d97706]"
      />
    </button>
  
  </div>
<section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.15fr]">

  {/* WORK SESSION (left column wrapper will include compact top cards below) */}
  <div className="flex flex-col gap-6">
  <article
    className="
      rounded-[2rem]
      border
      border-violet-100
      bg-[#efe9ff]
      p-5
      shadow-[0_12px_30px_rgba(0,0,0,0.08)]
      h-[470px]
      flex
      flex-col
      justify-between
    "
  >

    {/* HEADER */}
    <div className="flex items-start justify-between">

      <div>
        <h2 className="text-[28px] font-black text-slate-900">
          Work Session
        </h2>

        <p className="mt-1 text-[14px] text-slate-600">
          Track live work hours
        </p>
      </div>

      {/* STATUS */}
      <div
        className={`
          rounded-full
          px-3
          py-1.5
          text-[11px]
          font-bold

          ${
            checkedIn && !checkedOut
              ? 'bg-violet-100 text-violet-700'
              : checkedOut
              ? 'bg-slate-200 text-slate-300'
              : 'bg-white text-slate-500'
          }
        `}
      >
        {checkedIn && !checkedOut
          ? 'Checked In'
          : checkedOut
          ? 'Checked Out'
          : 'Not Checked'}
      </div>

    </div>

    {/* TIMER */}
    <div className="flex justify-center">

      <div className="relative flex h-[210px] w-[210px] items-center justify-center">

        {/* DASH */}
        <div
          className="absolute inset-0 rounded-full opacity-35"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, rgba(139,92,246,0.35) 0deg 2deg, transparent 2deg 8deg)'
          }}
        />

        {/* PURPLE */}
        <div className="absolute inset-[12px] rounded-full bg-[#dacfff]" />

        {/* BORDER */}
        <div className="absolute inset-[20px] rounded-full border-[8px] border-[#bcaaf8]" />

        {/* WHITE */}
        <div className="absolute inset-[32px] rounded-full bg-white">

          <div className="flex h-full w-full flex-col items-center justify-center px-4 box-border max-w-[220px] mx-auto">

            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Hours</p>

            <h1 className="text-[28px] md:text-[34px] font-extrabold tracking-tight text-slate-900 leading-none mt-2">
              {formatTimer(seconds)}
            </h1>

            <p className="mt-1 text-xs text-slate-500">{checkedIn && !checkedOut ? 'Running' : checkedOut ? 'Checked Out' : 'Not Running'}</p>

            {/* ACTIONS (moved below circle): centered pill buttons with slight float */}

          </div>

        </div>

      </div>

    </div>

    {/* centered large action area below the circle */}
    <div className="mt-6 flex flex-col items-center gap-4 w-full">
      <div className="flex items-center justify-center gap-6 text-sm text-slate-700">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 11a2 2 0 100-4 2 2 0 000 4z" fill="#10b981"/></svg>
          <div className="text-xs text-slate-500">Check In</div>
          <div className="text-sm font-bold text-slate-900">{checkInTime ? formatPunchTime(checkInTime) : '--:--'}</div>
        </div>

        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7l-5 5 5 5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="text-xs text-slate-500">Check Out</div>
          <div className="text-sm font-bold text-slate-900">{checkOutTime ? formatPunchTime(checkOutTime) : '--:--'}</div>
        </div>
      </div>

      <div className="w-full max-w-[380px] grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            const now = new Date();

            setCheckedIn(true);
            setCheckedOut(false);
            setSeconds(0);
            setCheckInTime(now);
            checkInRef.current = now.getTime();
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            setSeconds(0);
            timerRef.current = window.setInterval(() => {
              if (checkInRef.current) {
                const secs = Math.floor((Date.now() - checkInRef.current) / 1000);
                setSeconds(secs);
                // eslint-disable-next-line no-console
                console.log('work-timer tick', secs);
              }
            }, 1000);
            // eslint-disable-next-line no-console
            console.log('work-timer started', checkInRef.current);
            setCheckOutTime(null);

            setAttendanceRecords(prev => ({
              ...prev,
              [todayKey]: { in: formatPunchTime(now), status: 'Partial' }
            }));
          }}
          disabled={checkedIn && !checkedOut}
          className="w-full bg-violet-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 17l5-5-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Check In</span>
        </button>

        <button
          onClick={() => {
            if (!checkInTime) return;

            const now = new Date();

            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            // eslint-disable-next-line no-console
            console.log('work-timer stopped');
            const startMs = checkInRef.current ?? checkInTime.getTime();
            setSeconds(Math.floor((now.getTime() - startMs) / 1000));
            checkInRef.current = null;

            const duration =
              Math.round(
                ((now.getTime() - checkInTime.getTime()) /
                  3600000) *
                  100
              ) / 100;

            setCheckedOut(true);
            setCheckedIn(false);
            setCheckOutTime(now);

            setAttendanceRecords(prev => ({
              ...prev,
              [todayKey]: {
                in: formatPunchTime(checkInTime),
                out: formatPunchTime(now),
                duration,
                status: duration >= requiredHours ? 'Full' : 'Partial'
              }
            }));
          }}
          disabled={!checkedIn || checkedOut}
          className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold shadow-sm hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7l-5 5 5 5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Check Out</span>
        </button>
      </div>
    </div>

  </article>

  </div>

  {/* CALENDAR */}
  <article
    className="
      rounded-[2rem]
      border
      border-slate-200
      bg-white
      p-5
      shadow-[0_12px_30px_rgba(0,0,0,0.08)]
      h-[470px]
      flex
      flex-col
    "
  >

    {/* HEADER */}
    <div className="flex items-center justify-between">

      <div>
        <h2 className="text-[28px] font-black text-slate-900">
          Attendance Calendar
        </h2>

        <p className="mt-1 text-[14px] text-slate-500">
          Monthly overview
        </p>
      </div>

      {/* MONTH */}
      <div className="flex items-center gap-2">

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
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-sm
            font-black
          "
        >
          ←
        </button>

        <div
          className="
            rounded-xl
            border
            border-slate-200
            bg-[#f8fafc]
            px-4
            py-2
            text-xs
            font-bold
            text-slate-900
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
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-slate-100
            text-sm
            font-black
          "
        >
          →
        </button>

      </div>

    </div>

    {/* CALENDAR BOX */}
    <div className="mt-5 flex-1 rounded-[1.5rem] bg-[#f8fafc] p-4 border border-slate-100">

      <div className="flex gap-4 h-full">

        {/* LEFT CALENDAR */}
        <div className="flex-1">

          {/* DAYS */}
          <div className="grid grid-cols-7 gap-2">

            {DAY_LABELS.map(label => (

              <div
                key={label}
                className="
                  text-center
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-slate-400
                "
              >
                {label}
              </div>

            ))}

          </div>

          {/* DATES */}
          <div className="mt-3 grid grid-cols-7 gap-2">

            {monthCalendarDays.map(
              ({ date, key, status }) => (

                <div
                  key={key}
                  className={`
                    flex
                    h-[44px]
                    items-start
                    justify-end
                    rounded-[0.9rem]
                    border
                    p-2
                    text-[11px]
                    font-black
                    transition-all

                    ${
                      status === 'Full'
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-700'
                        : status === 'Partial'
                        ? 'bg-amber-100 border-amber-200 text-amber-700'
                        : status === 'Leave'
                        ? 'bg-rose-100 border-rose-200 text-rose-700'
                        : status === 'Weekend'
                        ? 'bg-slate-200 border-slate-300 text-slate-500'
                        : 'bg-white border-slate-200 text-slate-700'
                    }

                    ${
                      date &&
                      date.toISOString().split('T')[0] ===
                        todayKey
                        ? 'ring-2 ring-cyan-400 bg-cyan-50'
                        : ''
                    }
                  `}
                >

                  {date
                    ? date.getDate()
                    : ''}

                </div>

              )
            )}

          </div>

        </div>

        {/* RIGHT LEGEND */}
        <div
          className="
            w-[170px]
            rounded-[1.2rem]
            bg-white
            border
            border-slate-200
            p-4
            flex
            flex-col
            justify-center
            gap-4
          "
        >

          <h3 className="text-sm font-black text-slate-900">
            Attendance Status
          </h3>

          {/* PRESENT */}
          <div className="flex items-center gap-3">

            <div className="h-4 w-4 rounded-full bg-emerald-400" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Present
              </p>

              <p className="text-xs text-slate-500">
                Full attendance
              </p>
            </div>

          </div>

          {/* PARTIAL */}
          <div className="flex items-center gap-3">

            <div className="h-4 w-4 rounded-full bg-amber-400" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Partial
              </p>

              <p className="text-xs text-slate-500">
                Half / partial day
              </p>
            </div>

          </div>

          {/* LEAVE */}
          <div className="flex items-center gap-3">

            <div className="h-4 w-4 rounded-full bg-rose-400" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Leave
              </p>

              <p className="text-xs text-slate-500">
                Approved leave
              </p>
            </div>

          </div>

          {/* WEEKEND */}
          <div className="flex items-center gap-3">

            <div className="h-4 w-4 rounded-full bg-slate-400" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Weekend
              </p>

              <p className="text-xs text-slate-500">
                Holiday / weekend
              </p>
            </div>

          </div>

          {/* TODAY */}
          <div className="flex items-center gap-3">

            <div className="h-4 w-4 rounded-full border-2 border-cyan-500 bg-cyan-100" />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Today
              </p>

              <p className="text-xs text-slate-500">
                Current date
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  </article>

</section>
            {showProfileModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <div className="relative w-full max-w-2xl rounded-[2rem] border border-white/10 bg-[#0B1020] p-6 shadow-2xl">
                  <button onClick={() => setShowProfileModal(false)} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all">
                    <X size={18} className="text-white" />
                  </button>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center justify-center text-3xl font-black text-white shadow-lg">
                            {hrDetails.avatar}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-[#0B1020] rounded-full" />
                        <input type="file" accept="image/*" id="profileUpload" className="hidden" onChange={handleProfileUpload} />
                        <label htmlFor="profileUpload" className="absolute -bottom-2 -right-2 cursor-pointer w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg transition-all">
                          <Plus size={16} className="text-black" />
                        </label>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-white">{hrDetails.name}</h2>
                        <p className="text-cyan-400 font-bold text-base mt-1">{hrDetails.role}</p>
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-black mt-2">HRM2401</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Email</p>
                        <h3 className="text-white text-sm font-bold break-all">{hrDetails.email}</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Phone</p>
                        <h3 className="text-white text-sm font-bold">{hrDetails.phone}</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Department</p>
                        <h3 className="text-white text-sm font-bold">{hrDetails.dept}</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Experience</p>
                        <h3 className="text-white text-sm font-bold">{hrDetails.experience}</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Employee ID</p>
                        <h3 className="text-white text-sm font-bold">HRM2401</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Office</p>
                        <h3 className="text-white text-sm font-bold">Hyderabad HQ</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Joining Date</p>
                        <h3 className="text-white text-sm font-bold">15 Jan 2022</h3>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Access Level</p>
                        <div className="inline-flex px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">Administrator</div>
                      </div>
                      <div className="hover-zoom-card bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Recruitment</p>
                        <div className="inline-flex px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">Active Hiring</div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-2">Employees Managed</p>
                        <h3 className="text-white text-sm font-bold">150+</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* ========================= TOP ROW ========================= */}

  {/* removed old Attendance & Vibe Trends and top Broadcaster - replaced by compact top row below */}

  {/* ========================= BOTTOM SECTION (spans all 3 cols) ========================= */}
  <div className="lg:col-span-3 w-full flex flex-col gap-6">

 {/* ROW: WFH + LEAVE + MVP + CELEBRATIONS */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">

  <div
      onClick={() => setActiveTab('Approvals')}
      className="h-full w-full cursor-pointer rounded-[28px] transition-all duration-200 hover:-translate-y-0.5 focus:outline-none"
    >
      <SparkCard className="h-full w-full min-h-[420px] p-6 bg-[#fff0d8] border border-amber-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">
  
      <div className="mb-5 flex items-center justify-between gap-3">
        <h3 className="font-bold text-amber-950 text-lg">
          WFH Requests
        </h3>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-800">
          {pendingWfhRequests.length} Request{pendingWfhRequests.length === 1 ? '' : 's'}
        </span>
      </div>
  
      <div className="space-y-3">
  
        {pendingWfhRequests.length === 0 ? (
          <p className="rounded-2xl bg-white/80 px-4 py-4 text-xs text-slate-500 text-center border border-amber-100">
            No pending WFH requests.
          </p>
        ) : (
          pendingWfhRequests.map(req => (
            <div
              key={req.id}
              className="
                flex
                justify-between
                items-center
                p-4
                min-h-[95px]
                bg-white
                rounded-2xl
                border
                border-amber-100
              "
            >
  
            <div className="flex-1">
  
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900 break-words">
                    {req.name}
                  </p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                    req.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-700'
                      : req.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status || 'Pending'}
                  </span>
                </div>
  
                <p className="text-[10px] text-amber-600 font-black uppercase leading-relaxed mt-2">
                  {req.reason}
                </p>
  
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  {req.date}
                </p>
  
              </div>
  
              <div className="flex flex-col gap-2 ml-3">
  
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setWfhRequests(prev =>
                      prev.map(r =>
                        r.id === req.id
                          ? { ...r, status: 'Approved' }
                          : r
                      )
                    );
                  }}
                  disabled={req.status === 'Approved' || req.status === 'Rejected'}
                  className="p-2 rounded-xl bg-emerald-100 text-emerald-600 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={16} />
                </button>
  
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setWfhRequests(prev =>
                      prev.map(r =>
                        r.id === req.id
                          ? { ...r, status: 'Rejected' }
                          : r
                      )
                    );
                  }}
                  disabled={req.status === 'Approved' || req.status === 'Rejected'}
                  className="p-2 rounded-xl bg-rose-100 text-rose-600 transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle size={16} />
                </button>
  
              </div>
  
            </div>
  
          ))
        )}
  
      </div>
  
      </SparkCard>
    </div>
  
    {/* LEAVE REQUESTS */}
    <button
      type="button"
      onClick={() => setActiveTab('Approvals')}
      className="h-full w-full rounded-[28px] text-left transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-rose-400/60 cursor-pointer"
    >
      <SparkCard className="h-full w-full min-h-[420px] p-6 bg-[#ffe6ea] border border-rose-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">
  
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-bold text-rose-950 text-lg">
            Leave Requests
          </h3>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rose-800">
            {pendingLeaveRequests.length} Request{pendingLeaveRequests.length === 1 ? '' : 's'}
          </span>
        </div>
  
        <div className="space-y-3">
  
          {pendingLeaveRequests.map(leave => (
  
          <div
            key={leave.id}
            className="
              flex
              justify-between
              items-center
              p-4
              min-h-[95px]
              bg-white
              rounded-2xl
              border
              border-rose-100
            "
          >
  
            <div className="flex-1">
  
              <p className="text-sm font-bold text-slate-900 break-words">
                {leave.employee}
              </p>
  
              <p className="text-[10px] text-rose-600 uppercase font-black mt-2">
                {leave.type}
              </p>
  
              <p className="text-[10px] text-slate-500 font-bold mt-1">
                {leave.days} Days
              </p>
  
            </div>
  
            <span
              className="
                px-3
                py-1.5
                bg-rose-100
                text-rose-700
                text-[10px]
                font-bold
                rounded-full
                ml-3
                whitespace-nowrap
              "
            >
              {leave.status}
            </span>
  
          </div>
  
        ))}
  
        {pendingLeaveRequests.length === 0 && (
          <p className="rounded-2xl bg-white/80 px-4 py-4 text-xs text-slate-500 text-center border border-rose-100">
            No pending leave requests.
          </p>
        )}
  
        </div>
  
      </SparkCard>
    </button>
  
  {/* MVP EMPLOYEES */}
  <SparkCard className="w-full p-6 bg-[#f2e8ff] border border-violet-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">

    <h3 className="font-bold text-violet-950 text-lg mb-5">
      MVP Employees
    </h3>

    <div className="space-y-3">

      {employees
        .filter(e => e.isMVP)
        .map(emp => (

          <div
            key={emp.id}
            className="
              flex
              items-center
              gap-4
              p-4
              min-h-[95px]
              bg-white
              rounded-2xl
              border
              border-violet-100
            "
          >

            <Star
              size={18}
              className="
                text-yellow-500
                fill-yellow-500
                shrink-0
              "
            />

            <div>

              <p className="text-sm font-bold text-slate-900">
                {emp.name}
              </p>

              <p className="text-[10px] text-violet-600 font-black uppercase mt-1">
                {emp.role}
              </p>

            </div>

          </div>

        ))}

    </div>

  </SparkCard>

  {/* TODAY'S CELEBRATIONS */}
  <SparkCard className="w-full p-6 bg-[#e6fffb] border border-cyan-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">

    <div className="mb-5">

      <h3 className="font-bold text-cyan-950 text-lg">
        Today's Celebrations
      </h3>

      <p className="text-cyan-700 text-xs mt-1">
        Birthdays & anniversaries
      </p>

    </div>

    {todayEvents.length > 0 ? (

      <div className="space-y-3">

        {todayEvents.slice(0, 3).map(event => (

          <div
            key={`${event.name}-${event.type}`}
            className="
              p-4
              min-h-[95px]
              bg-white
              rounded-2xl
              border
              border-cyan-100
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-bold text-slate-900">
                  {event.name}
                </p>

                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 mt-1">
                  {event.type}
                </p>

              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-100
                  text-cyan-700
                "
              >

                <Smile size={18} />

              </div>

            </div>

            {event.note ? (
              <p className="text-xs text-slate-600 mt-3">
                {event.note}
              </p>
            ) : null}

          </div>

        ))}

      </div>

    ) : (

      <div className="py-10 text-center text-slate-500">

        <p className="text-sm font-bold text-slate-900">
          No celebrations today
        </p>

      </div>

    )}

  </SparkCard>

</div>

    {/* ROW 2: Daily Attendance + Department Distribution + Broadcaster (top row compact) */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

      {/* DAILY ATTENDANCE STATUS */}
      <SparkCard className="w-full p-8 bg-[#e6f6ff] border border-cyan-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-black text-cyan-950 text-xl">Daily Attendance Status</h3>
            <p className="text-cyan-700 text-sm mt-1">Workforce overview</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-cyan-200 text-cyan-800 text-xs font-black uppercase">Today</div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={todayAttendanceCounts} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#bae6fd" />
              <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#155e75', fontWeight: 700 }} />
              <YAxis tick={{ fill: '#155e75', fontWeight: 700 }} />
              <Tooltip cursor={false} contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(203, 242, 255, 0.7)', color: '#0f172a' }} />
              <Bar dataKey="count" fill="#06b6d4" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SparkCard>

      {/* BROADCASTER (moved into top row) */}
      <SparkCard
        className="
          w-full
          p-8
          bg-[#f2e8ff]
          border
          border-violet-100
          rounded-[28px]
          shadow-[0_16px_45px_rgba(0,0,0,0.10)]
        "
      >
        <div className="flex items-center gap-2 mb-6">
          <Megaphone size={20} className="text-violet-700" />
          <h3 className="font-bold text-violet-950 text-lg">Broadcaster</h3>
        </div>
        <div className="space-y-4">
          {validAnnouncements.length > 0 ? (
            validAnnouncements.map(item => (
              <div
                key={item.id}
                className="
                  group/item
                  cursor-pointer
                  p-4
                  rounded-2xl
                  bg-white
                  border
                  border-violet-100
                  transition-all
                "
              >
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <div className="flex justify-between mt-2">
                  <span className="text-[10px] font-black uppercase text-violet-600">{item.tag}</span>
                  <span className="text-[10px] font-black uppercase text-slate-500">{getTimeAgo(item.timestamp)}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">No announcements</p>
          )}
          <button
            onClick={() => setIsAnnouncementModalOpen(true)}
            className="
              w-full
              py-3
              rounded-xl
              bg-violet-600
              text-white
              text-[10px]
              font-black
              uppercase
              transition-all
              mt-4
            "
          >
            Create Announcement
          </button>
        </div>
      </SparkCard>

      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-950">New Announcement</h3>
                <p className="text-sm text-slate-500">Publish a message to the dashboard broadcaster.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <span className="text-lg font-black">×</span>
              </button>
            </div>
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Title</span>
                <input
                  type="text"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Tag</span>
                <input
                  type="text"
                  value={announcementForm.tag}
                  onChange={e => setAnnouncementForm(prev => ({ ...prev, tag: e.target.value }))}
                  placeholder="Event, Update, General..."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white"
                />
              </label>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAnnouncement}
                className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Publish Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPARTMENT DISTRIBUTION */}
      <SparkCard className="w-full p-8 bg-[#f2e8ff] border border-violet-100 rounded-[28px] shadow-[0_16px_45px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-black text-violet-950 text-xl">Department Distribution</h3>
            <p className="text-violet-700 text-sm mt-1">Total headcount</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-violet-200 text-violet-800 text-xs font-black uppercase">Analytics</div>
        </div>
        <div className="h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            {departmentCounts.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-500">
                No department data available.
              </div>
            ) : (
              <PieChart>
                <Pie data={departmentCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={40} paddingAngle={4}>
                  {departmentCounts.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={['#7c3aed', '#a78bfa', '#c7d2fe', '#c084fc', '#d8b4fe', '#f0abfc'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(199,210,254,0.7)' }} />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </SparkCard>
    </div>
  </div>
</div>


</div>

  );
};

export default DashboardModule;
