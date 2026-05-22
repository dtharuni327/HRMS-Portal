
import { useEffect, useState, type FC } from 'react';

import {
  Check,
  XCircle,
  CheckCircle2
} from 'lucide-react';

import {
  SparkCard,
  type LeaveData,
  type RequestItem
} from '../hrShared';

const LeaveModule: FC = () => {

  // =========================
  // STATE
  // =========================

  const [leaveData, setLeaveData] = useState<LeaveData[]>([
    {
      id: 1,
      employee: 'Shrushti',
      type: 'Casual',
      days: 2,
      startDate: '15 May 2026',
      endDate: '17 May 2026',
      reason: 'Family commitment',
      status: 'Pending',
    },
    {
      id: 2,
      employee: 'Rahul',
      type: 'Sick',
      days: 1,
      startDate: '18 May 2026',
      endDate: '18 May 2026',
      reason: 'Doctor appointment',
      status: 'Approved',
    },
  ]);

  const [storedLeaveRequests, setStoredLeaveRequests] = useState<LeaveData[]>([]);
  const [wfhRequests, setWfhRequests] = useState<RequestItem[]>([
    {
      id: 1,
      name: 'Vikram Seth',
      type: 'WFH',
      reason: 'Home repairs',
      date: 'May 02',
      startDate: 'May 02',
      endDate: 'May 02',
      status: 'Pending',
    },
    {
      id: 3,
      name: 'Rahul Sharma',
      type: 'WFH',
      reason: 'Family event',
      date: 'May 06',
      startDate: 'May 06',
      endDate: 'May 06',
      status: 'Pending',
    },
  ]);

  const allLeaveRequests = [...storedLeaveRequests, ...leaveData];

  const loadStoredLeaveRequests = (): LeaveData[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem('hrLeaveRequests');
    if (!stored) return [];

    try {
      const parsed = JSON.parse(stored) as RequestItem[];
      return parsed.map((request) => ({
        id: request.id,
        employee: request.name,
        type: request.type,
        days: request.startDate && request.endDate
          ? Math.max(
              1,
              Math.floor(
                (new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            )
          : 1,
        startDate: request.startDate ?? request.date,
        endDate: request.endDate ?? request.date,
        reason: request.reason,
        status: 'Pending',
      }));
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setStoredLeaveRequests(loadStoredLeaveRequests());
  }, []);

  // =========================
  // APPROVE LEAVE
  // =========================

  const approveLeave = (leaveId: number) => {
    setLeaveData((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: 'Approved',
            }
          : leave
      )
    );

    setStoredLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: 'Approved',
            }
          : leave
      )
    );
  };

  // =========================
  // REJECT LEAVE
  // =========================

  const rejectLeave = (leaveId: number) => {
    setLeaveData((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: 'Rejected',
            }
          : leave
      )
    );

    setStoredLeaveRequests((prev) =>
      prev.map((leave) =>
        leave.id === leaveId
          ? {
              ...leave,
              status: 'Rejected',
            }
          : leave
      )
    );
  };

  const approveWfhRequest = (requestId: number) => {
    setWfhRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Approved' }
          : request
      )
    );
  };

  const rejectWfhRequest = (requestId: number) => {
    setWfhRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Rejected' }
          : request
      )
    );
  };

  return (

    <div className="space-y-6 animate-in slide-in-from-bottom-4">

      {/* TOP SECTION */}
      <div className="flex justify-between items-center flex-wrap gap-4">


        {/* TOTAL REQUESTS */}
        <div
          className="
            px-4
            py-2
            rounded-2xl
            bg-[#F3E8FF]
            border
            border-violet-200
            text-violet-700
            text-xs
            font-black
            uppercase
            tracking-wider
            shadow-sm
          "
        >
          Total Requests: {allLeaveRequests.length}
        </div>

      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        {/* PENDING */}
        <SparkCard
          className="
            p-6
            bg-[#FFF7ED]
            border
            border-orange-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-orange-500">
            {
              allLeaveRequests.filter(
                l => l.status === 'Pending'
              ).length
            }
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Pending
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Awaiting approval
          </p>

        </SparkCard>

        {/* APPROVED */}
        <SparkCard
          className="
            p-6
            bg-[#EEFDF3]
            border
            border-emerald-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-emerald-500">
            {
              allLeaveRequests.filter(
                l => l.status === 'Approved'
              ).length
            }
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Approved
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Confirmed
          </p>

        </SparkCard>

        {/* REJECTED */}
        <SparkCard
          className="
            p-6
            bg-[#FFF1F2]
            border
            border-rose-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-rose-500">
            {
              allLeaveRequests.filter(
                l => l.status === 'Rejected'
              ).length
            }
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Rejected
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Not approved
          </p>

        </SparkCard>

        {/* TOTAL DAYS */}
        <SparkCard
          className="
            p-6
            bg-[#F5F3FF]
            border
            border-violet-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-violet-500">
            {
              allLeaveRequests.reduce(
                (sum, l) => sum + l.days,
                0
              )
            }
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Total Days
          </p>

          <p className="text-xs text-slate-500 mt-1">
            All requests
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
                <th className="px-8 py-5">Employee</th>
                <th className="px-8 py-5">Leave Type</th>
                <th className="px-8 py-5">Duration</th>
                <th className="px-8 py-5">Date Range</th>
                <th className="px-8 py-5">Reason</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody>

              {allLeaveRequests.map((leave, index) => (

                <tr
                  key={leave.id}
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

                  {/* EMPLOYEE */}
                  <td className="px-8 py-5">

                    <div>

                      <p className="font-bold text-slate-900">
                        {leave.employee}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        Request ID: #L{leave.id}
                      </p>

                    </div>

                  </td>

                  {/* TYPE */}
                  <td className="px-8 py-5">

                    <div className="flex items-center gap-2">

                      {leave.type === 'Casual' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}

                      {leave.type === 'Sick' && (
                        <div className="w-2 h-2 bg-rose-500 rounded-full" />
                      )}

                      {leave.type === 'Annual' && (
                        <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      )}

                      <span className="text-slate-800 font-semibold">
                        {leave.type}
                      </span>

                    </div>

                  </td>

                  {/* DAYS */}
                  <td className="px-8 py-5">

                    <span className="px-3 py-1 bg-white rounded-full text-slate-700 font-bold shadow-sm border border-slate-100">
                      {leave.days} day{leave.days > 1 ? 's' : ''}
                    </span>

                  </td>

                  {/* DATE RANGE */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {leave.startDate}
                    {leave.endDate ? ` - ${leave.endDate}` : ''}
                  </td>

                  {/* REASON */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {leave.reason || 'N/A'}
                  </td>

                  {/* STATUS */}
                  <td className="px-8 py-5">

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        leave.status === 'Pending'
                          ? 'bg-orange-100 text-orange-700'
                          : leave.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {leave.status}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="px-8 py-5">

                    {leave.status === 'Pending' ? (

                      <div className="flex gap-2">

                        {/* APPROVE */}
                        <button
                          onClick={() =>
                            approveLeave(leave.id)
                          }
                          className="
                            flex
                            items-center
                            gap-1
                            px-3
                            py-2
                            bg-emerald-100
                            text-emerald-700
                            rounded-xl
                            transition-all
                            font-bold
                            text-[10px]
                            uppercase
                            hover:scale-105
                          "
                        >
                          <Check size={14} />
                          Approve
                        </button>

                        {/* REJECT */}
                        <button
                          onClick={() =>
                            rejectLeave(leave.id)
                          }
                          className="
                            flex
                            items-center
                            gap-1
                            px-3
                            py-2
                            bg-rose-100
                            text-rose-700
                            rounded-xl
                            transition-all
                            font-bold
                            text-[10px]
                            uppercase
                            hover:scale-105
                          "
                        >
                          <XCircle size={14} />
                          Reject
                        </button>

                      </div>

                    ) : leave.status === 'Approved' ? (

                      <div className="flex items-center gap-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-bold uppercase w-fit">
                        <CheckCircle2 size={14} />
                        Approved
                      </div>

                    ) : (

                      <div className="flex items-center gap-1 px-3 py-2 bg-rose-100 text-rose-700 rounded-xl text-[10px] font-bold uppercase w-fit">
                        <XCircle size={14} />
                        Rejected
                      </div>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </SparkCard>

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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">WFH Requests</h3>
              <p className="text-sm text-slate-500">
                All work-from-home requests that need HR visibility.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {wfhRequests.length} requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm text-slate-700">
              <thead className="bg-[#EDE9FE] text-violet-700 text-[11px] uppercase font-black tracking-[0.18em]">
                <tr>
                  <th className="px-6 py-4 border-b border-slate-200">Employee</th>
                  <th className="px-6 py-4 border-b border-slate-200">Request</th>
                  <th className="px-6 py-4 border-b border-slate-200">Date Range</th>
                  <th className="px-6 py-4 border-b border-slate-200">Reason</th>
                  <th className="px-6 py-4 border-b border-slate-200">Status</th>
                  <th className="px-6 py-4 border-b border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wfhRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`border-t border-slate-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">{request.name}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <span className="inline-flex items-center rounded-full bg-cyan-100 px-3 py-1 text-[11px] font-bold uppercase text-cyan-700">
                        {request.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {request.startDate && request.endDate
                        ? `${request.startDate} - ${request.endDate}`
                        : request.date}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[220px] break-words">{request.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase ${
                        request.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : request.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {request.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {request.status === 'Pending' ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => approveWfhRequest(request.id)}
                            className="rounded-xl bg-emerald-100 px-3 py-2 text-[10px] font-bold uppercase text-emerald-700 transition hover:bg-emerald-200"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectWfhRequest(request.id)}
                            className="rounded-xl bg-rose-100 px-3 py-2 text-[10px] font-bold uppercase text-rose-700 transition hover:bg-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="inline-flex rounded-xl bg-slate-100 px-3 py-2 text-[10px] font-bold uppercase text-slate-700">
                          {request.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </SparkCard>

    </div>

  );

};

export default LeaveModule;