
import { useEffect, useMemo, useState, type FC, type Dispatch, type SetStateAction } from 'react';

import {
  Check,
  XCircle,
  CheckCircle2
} from 'lucide-react';

import {
  SparkCard,
  type LeaveData,
  type RequestItem
} from '../managerShared';
import { hrmsApi } from '../../../services/hrmsApi';

interface ApprovalsModuleProps {
  leaveData: LeaveData[];
  setLeaveData: Dispatch<SetStateAction<LeaveData[]>>;
  wfhRequests: RequestItem[];
  setWfhRequests: Dispatch<SetStateAction<RequestItem[]>>;
}

const ApprovalsModule: FC<ApprovalsModuleProps> = ({
  leaveData,
  setLeaveData,
  wfhRequests,
  setWfhRequests
}) => {

  const allLeaveRequests = leaveData;

  const [activeRejectLeaveId, setActiveRejectLeaveId] = useState<number | null>(null);
  const [rejectReasonDrafts, setRejectReasonDrafts] = useState<Record<number, string>>({});
  const [activeRejectWfhId, setActiveRejectWfhId] = useState<number | null>(null);
  const [rejectWfhReasonDrafts, setRejectWfhReasonDrafts] = useState<Record<number, string>>({});
  const [selectedLeaveIds, setSelectedLeaveIds] = useState<number[]>([]);
  const [showBalances, setShowBalances] = useState(false);

  const pendingLeaveIds = allLeaveRequests
    .filter((leave) => leave.status === 'Pending')
    .map((leave) => leave.id);

  const allPendingSelected =
    selectedLeaveIds.length > 0 &&
    selectedLeaveIds.length === pendingLeaveIds.length;

  useEffect(() => {
    setSelectedLeaveIds((prev) => prev.filter((id) => pendingLeaveIds.includes(id)));
  }, [pendingLeaveIds]);

  const pendingNotifications =
    leaveData.filter(l => l.status === 'Pending').length +
    wfhRequests.filter(r => r.status === 'Pending').length;

  const totalRequests = leaveData.length;
  const casualLeaveCount = leaveData.filter((leave) => leave.type === 'Casual').length;
  const usedLeaveDays = leaveData
    .filter((leave) => leave.status === 'Approved')
    .reduce((sum, leave) => sum + leave.days, 0);
  const pendingCount = leaveData.filter((leave) => leave.status === 'Pending').length;

  // Per-employee stats used by the per-request dropdown
  const [openStatsFor, setOpenStatsFor] = useState<number | null>(null);

  const employeeStats = useMemo(() => {
    const allowances = { Casual: 12, Sick: 10, Annual: 18 } as const;
    const map = new Map<string, {
      pendingTotal: number;
      pendingByType: Record<keyof typeof allowances, number>;
      taken: Record<keyof typeof allowances, number>;
      allowances: typeof allowances;
    }>();

    leaveData.forEach((leave) => {
      const name = leave.employee;
      const existing = map.get(name) ?? {
        pendingTotal: 0,
        pendingByType: { Casual: 0, Sick: 0, Annual: 0 },
        taken: { Casual: 0, Sick: 0, Annual: 0 },
        allowances,
      };

      if (leave.status === 'Pending') {
        existing.pendingTotal += 1;
        if (existing.pendingByType[leave.type as keyof typeof allowances] !== undefined) {
          existing.pendingByType[leave.type as keyof typeof allowances] += 1;
        }
      }

      if (leave.status === 'Approved') {
        if (existing.taken[leave.type as keyof typeof allowances] !== undefined) {
          existing.taken[leave.type as keyof typeof allowances] += leave.days;
        }
      }

      map.set(name, existing);
    });

    return Object.fromEntries(Array.from(map.entries()));
  }, [leaveData]);

  const leaveBalances = useMemo(() => {
    const allowances = {
      Casual: 12,
      Sick: 10,
      Annual: 18,
    } as const;

    const employeeMap = new Map<string, {
      employee: string;
      taken: Record<keyof typeof allowances, number>;
    }>();

    allLeaveRequests.forEach((leave) => {
      const existing = employeeMap.get(leave.employee) ?? {
        employee: leave.employee,
        taken: { Casual: 0, Sick: 0, Annual: 0 },
      };
      if (existing.taken[leave.type as keyof typeof allowances] !== undefined) {
        existing.taken[leave.type as keyof typeof allowances] += leave.days;
      }
      employeeMap.set(leave.employee, existing);
    });

    return Array.from(employeeMap.values()).map((item) => ({
      employee: item.employee,
      taken: item.taken,
      remaining: {
        Casual: Math.max(0, allowances.Casual - item.taken.Casual),
        Sick: Math.max(0, allowances.Sick - item.taken.Sick),
        Annual: Math.max(0, allowances.Annual - item.taken.Annual),
      },
    }));
  }, [allLeaveRequests]);

  const startRejectLeave = (leaveId: number) => {
    setActiveRejectLeaveId(leaveId);
    setRejectReasonDrafts(prev => ({
      ...prev,
      [leaveId]: prev[leaveId] ?? '',
    }));
  };

  const cancelRejectLeave = () => {
    setActiveRejectLeaveId(null);
  };

  const syncLeaveStatus = async (leaveId: number, status: 'APPROVED' | 'REJECTED') => {
    const leave = leaveData.find((item) => item.id === leaveId);

    if (!leave?.employeeId) {
      return;
    }

    await hrmsApi.updateLeaveStatus({
      leave_id: leave.id,
      empId: leave.employeeId,
      status,
    });
  };

  const confirmRejectLeave = async (leaveId: number) => {
    const reason = rejectReasonDrafts[leaveId]?.trim();
    if (!reason) {
      alert('Please enter a reject reason before rejecting.');
      return;
    }

    try {
      await syncLeaveStatus(leaveId, 'REJECTED');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reject leave request.';
      alert(message);
      return;
    }

    setLeaveData(prev =>
      prev.map(leave =>
        leave.id === leaveId
          ? {
              ...leave,
              status: 'Rejected',
              rejectionReason: reason,
            }
          : leave
      )
    );

    setActiveRejectLeaveId(null);
  };

  const startRejectWfh = (requestId: number) => {
    setActiveRejectWfhId(requestId);
    setRejectWfhReasonDrafts(prev => ({
      ...prev,
      [requestId]: prev[requestId] ?? '',
    }));
  };

  const cancelRejectWfh = () => {
    setActiveRejectWfhId(null);
  };

  const confirmRejectWfh = (requestId: number) => {
    const reason = rejectWfhReasonDrafts[requestId]?.trim();
    if (!reason) {
      alert('Please enter a reject reason before rejecting.');
      return;
    }

    setWfhRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'Rejected',
              rejectionReason: reason,
            }
          : request
      )
    );

    setActiveRejectWfhId(null);
  };
  const approveLeave = async (leaveId: number) => {
    try {
      await syncLeaveStatus(leaveId, 'APPROVED');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to approve leave request.';
      alert(message);
      return;
    }

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
  };

  const bulkApproveSelected = async () => {
    if (!selectedLeaveIds.length) return;

    try {
      await Promise.all(selectedLeaveIds.map((leaveId) => syncLeaveStatus(leaveId, 'APPROVED')));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to approve selected leave requests.';
      alert(message);
      return;
    }

    setLeaveData((prev) =>
      prev.map((leave) =>
        selectedLeaveIds.includes(leave.id)
          ? { ...leave, status: 'Approved' }
          : leave
      )
    );

    setSelectedLeaveIds([]);
  };

  const bulkRejectSelected = async () => {
    if (!selectedLeaveIds.length) return;
    const reason = window.prompt('Enter reject reason for selected leave requests:');
    if (!reason?.trim()) return;

    try {
      await Promise.all(selectedLeaveIds.map((leaveId) => syncLeaveStatus(leaveId, 'REJECTED')));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reject selected leave requests.';
      alert(message);
      return;
    }

    setLeaveData((prev) =>
      prev.map((leave) =>
        selectedLeaveIds.includes(leave.id)
          ? {
              ...leave,
              status: 'Rejected',
              rejectionReason: reason,
            }
          : leave
      )
    );

    setSelectedLeaveIds([]);
  };

  const toggleSelectAllPending = () => {
    if (allPendingSelected) {
      setSelectedLeaveIds([]);
      return;
    }
    setSelectedLeaveIds(pendingLeaveIds);
  };

  const toggleLeaveSelection = (leaveId: number) => {
    setSelectedLeaveIds((prev) =>
      prev.includes(leaveId)
        ? prev.filter((id) => id !== leaveId)
        : [...prev, leaveId]
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

        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-rose-100
            px-3
            py-2
            text-xs
            font-black
            text-rose-700
          "
        >
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          {pendingNotifications} New
        </div>

      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">

        {/* TOTAL REQUESTS */}
        <SparkCard
          className="
            p-6
            bg-[#EFF6FF]
            border
            border-sky-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-sky-600">
            {totalRequests}
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Total leave requests
          </p>

          <p className="text-xs text-slate-500 mt-1">
            All leave applications
          </p>

        </SparkCard>

        {/* CASUAL REQUESTS */}
        <SparkCard
          className="
            p-6
            bg-[#FEF3C7]
            border
            border-amber-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-amber-600">
            {casualLeaveCount}
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Casual leave requests
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Requests of type Casual
          </p>

        </SparkCard>

        {/* USED DAYS */}
        <SparkCard
          className="
            p-6
            bg-[#ECFDF5]
            border
            border-emerald-100
            rounded-3xl
            shadow-sm
          "
        >

          <p className="text-3xl font-black text-emerald-600">
            {usedLeaveDays}d
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Used leave days
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Approved leave duration
          </p>

        </SparkCard>

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
            {pendingCount}
          </p>

          <p className="text-xs text-slate-600 uppercase font-bold mt-2">
            Pending requests
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Awaiting approval
          </p>

        </SparkCard>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <SparkCard className="p-6 bg-white/90 border border-slate-200 rounded-3xl shadow-xl">
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Leave Balances</h3>
              <p className="text-sm text-slate-500">Remaining allowances (per year)</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowBalances(s => !s)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {showBalances ? 'Hide Balances' : 'Show Balances'}
              </button>

              <p className="text-xs text-slate-500">Click to view per-employee remaining allowances.</p>
            </div>

            {showBalances && (
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="bg-[#EDE9FE] text-violet-700 uppercase text-[10px] font-black tracking-[0.18em]">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Casual</th>
                      <th className="px-4 py-3">Sick</th>
                      <th className="px-4 py-3">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveBalances.map((balance, index) => (
                      <tr key={balance.employee} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-3 font-semibold text-slate-900">{balance.employee}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{employeeStats[balance.employee]?.taken?.Casual ?? 0} / 12</div>
                          <div className="text-xs text-slate-500">Pending: {employeeStats[balance.employee]?.pendingByType?.Casual ?? 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{employeeStats[balance.employee]?.taken?.Sick ?? 0} / 10</div>
                          <div className="text-xs text-slate-500">Pending: {employeeStats[balance.employee]?.pendingByType?.Sick ?? 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold">{employeeStats[balance.employee]?.taken?.Annual ?? 0} / 18</div>
                          <div className="text-xs text-slate-500">Pending: {employeeStats[balance.employee]?.pendingByType?.Annual ?? 0}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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

        <div className="px-6 py-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">Bulk leave actions</p>
            <p className="text-xs text-slate-500">Select pending requests and approve or reject them together.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={toggleSelectAllPending}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {allPendingSelected ? 'Clear selection' : 'Select all pending'}
            </button>
            <button
              type="button"
              onClick={bulkApproveSelected}
              disabled={!selectedLeaveIds.length}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Approve selected
            </button>
            <button
              type="button"
              onClick={bulkRejectSelected}
              disabled={!selectedLeaveIds.length}
              className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              Reject selected
            </button>
          </div>
        </div>

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
                <th className="px-8 py-5">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={toggleSelectAllPending}
                    disabled={pendingLeaveIds.length === 0}
                    className="h-4 w-4 rounded border-slate-300 text-violet-600"
                  />
                </th>
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

                  <td className="px-8 py-5">
                    <input
                      type="checkbox"
                      checked={leave.status === 'Pending' && selectedLeaveIds.includes(leave.id)}
                      disabled={leave.status !== 'Pending'}
                      onChange={() => toggleLeaveSelection(leave.id)}
                      className="h-4 w-4 rounded border-slate-300 text-violet-600"
                    />
                  </td>

                  {/* EMPLOYEE */}
                  <td className="px-8 py-5">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="font-bold text-slate-900">{leave.employee}</p>
                        <p className="text-[10px] text-slate-500">Request ID: #L{leave.id}</p>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenStatsFor(openStatsFor === leave.id ? null : leave.id)}
                          className="text-xs rounded-xl bg-slate-100 px-3 py-1 font-semibold text-slate-700"
                        >
                          {openStatsFor === leave.id ? 'Hide' : 'Stats'}
                        </button>
                      </div>

                    </div>

                    {openStatsFor === leave.id && (
                      <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                        <p className="font-semibold">Pending requests: {employeeStats[leave.employee]?.pendingTotal ?? 0}</p>
                        <p className="mt-1">Used days: {employeeStats[leave.employee] ? Object.values(employeeStats[leave.employee].taken).reduce((a, b) => a + b, 0) : 0}d</p>

                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                          <div className="rounded bg-white p-2 text-center shadow-sm">
                            <div className="font-bold">Casual</div>
                            <div>{employeeStats[leave.employee]?.taken?.Casual ?? 0} / 12</div>
                          </div>
                          <div className="rounded bg-white p-2 text-center shadow-sm">
                            <div className="font-bold">Sick</div>
                            <div>{employeeStats[leave.employee]?.taken?.Sick ?? 0} / 10</div>
                          </div>
                          <div className="rounded bg-white p-2 text-center shadow-sm">
                            <div className="font-bold">Annual</div>
                            <div>{employeeStats[leave.employee]?.taken?.Annual ?? 0} / 18</div>
                          </div>
                        </div>
                      </div>
                    )}

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

                      activeRejectLeaveId === leave.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={rejectReasonDrafts[leave.id] || ''}
                            onChange={e =>
                              setRejectReasonDrafts(prev => ({
                                ...prev,
                                [leave.id]: e.target.value,
                              }))
                            }
                            placeholder="Enter reject reason"
                            className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none"
                            rows={3}
                          />

                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                confirmRejectLeave(leave.id)
                              }
                              className="rounded-xl bg-rose-600 px-4 py-2 text-[10px] font-bold uppercase text-white transition hover:bg-rose-700"
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={cancelRejectLeave}
                              className="rounded-xl bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase text-slate-700 transition hover:bg-slate-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
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
                              transition-transform
                              duration-150
                              font-bold
                              text-[10px]
                              uppercase
                              hover:-translate-y-0.5
                            "
                          >
                            <Check size={14} />
                            Approve
                          </button>

                          {/* REJECT */}
                          <button
                            onClick={() =>
                              startRejectLeave(leave.id)
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
                              transition-transform
                              duration-150
                              font-bold
                              text-[10px]
                              uppercase
                              hover:-translate-y-0.5
                            "
                          >
                            <XCircle size={14} />
                            Reject
                          </button>

                        </div>
                      )

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

      <div className="rounded-3xl bg-slate-900 p-4 shadow-xl sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-300">WFH Queue</p>
            <h3 className="text-2xl font-bold text-white">WFH Requests</h3>
           </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-white">
            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">Pending: {wfhRequests.filter((request) => !request.status || request.status === 'Pending').length}</span>
            <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-slate-100">Approved: {wfhRequests.filter((request) => request.status === 'Approved').length}</span>
          </div>
        </div>
      </div>

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
                      {(!request.status || request.status === 'Pending') ? (
                        activeRejectWfhId === request.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={rejectWfhReasonDrafts[request.id] || ''}
                              onChange={e =>
                                setRejectWfhReasonDrafts(prev => ({
                                  ...prev,
                                  [request.id]: e.target.value,
                                }))
                              }
                              placeholder="Enter reject reason"
                              className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none"
                              rows={3}
                            />

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  confirmRejectWfh(request.id)
                                }
                                className="rounded-xl bg-rose-600 px-4 py-2 text-[10px] font-bold uppercase text-white transition hover:bg-rose-700"
                              >
                                Confirm Reject
                              </button>
                              <button
                                onClick={cancelRejectWfh}
                                className="rounded-xl bg-slate-100 px-4 py-2 text-[10px] font-bold uppercase text-slate-700 transition hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => approveWfhRequest(request.id)}
                              className="rounded-xl bg-emerald-100 px-3 py-2 text-[10px] font-bold uppercase text-emerald-700 transition hover:bg-emerald-200"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => startRejectWfh(request.id)}
                              className="rounded-xl bg-rose-100 px-3 py-2 text-[10px] font-bold uppercase text-rose-700 transition hover:bg-rose-200"
                            >
                              Reject
                            </button>
                          </div>
                        )
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

export default ApprovalsModule;
