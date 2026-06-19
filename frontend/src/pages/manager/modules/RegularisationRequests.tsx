import { useState, type FC, type Dispatch, type SetStateAction } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SparkCard, type RequestItem } from '../managerShared';

interface RegularisationRequestsModuleProps {
  regularisationRequests: RequestItem[];
  setRegularisationRequests: Dispatch<SetStateAction<RequestItem[]>>;
}

const RegularisationRequestsModule: FC<RegularisationRequestsModuleProps> = ({
  regularisationRequests,
  setRegularisationRequests,
}) => {
  const [activeRejectId, setActiveRejectId] = useState<number | null>(null);
  const [rejectReasonDrafts, setRejectReasonDrafts] = useState<Record<number, string>>({});

  const startReject = (requestId: number) => {
    setActiveRejectId(requestId);
    setRejectReasonDrafts((prev) => ({
      ...prev,
      [requestId]: prev[requestId] ?? '',
    }));
  };

  const cancelReject = () => {
    setActiveRejectId(null);
  };

  const confirmReject = (requestId: number) => {
    const reason = rejectReasonDrafts[requestId]?.trim();
    if (!reason) {
      alert('Please enter a reject reason before rejecting.');
      return;
    }

    setRegularisationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: 'Rejected',
              rejectionReason: reason,
            }
          : request
      )
    );

    setActiveRejectId(null);
  };

  const approveRequest = (requestId: number) => {
    setRegularisationRequests((prev) =>
      prev.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Approved' }
          : request
      )
    );
  };

  const pendingCount = regularisationRequests.filter((request) => request.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">
      <SparkCard className="p-6 bg-gradient-to-r from-slate-50 via-slate-100 to-sky-50 border border-slate-200 text-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Regularisation Requests</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">{pendingCount} pending request{pendingCount === 1 ? '' : 's'}</h2>
          </div>
          <p className="text-sm text-slate-600 max-w-xl">
            Review missed punch or attendance regularisation requests from your team and approve or reject them with a reason.
          </p>
        </div>
      </SparkCard>

      <div className="grid gap-4">
        {regularisationRequests.map((request) => (
          <SparkCard key={request.id} className="p-6 rounded-[2rem] border border-slate-200 bg-white shadow-sm shadow-slate-900/5 text-slate-900">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{request.type} · {request.date}</p>
                <h3 className="mt-2 text-xl font-black text-slate-900">{request.name}</h3>
                <p className="mt-1 text-slate-600">{request.reason}</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  request.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : request.status === 'Approved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {request.status}
                </span>
                {request.status === 'Rejected' && request.rejectionReason && (
                  <div className="rounded-2xl bg-slate-900/80 px-3 py-2 text-sm text-slate-300 border border-slate-700">
                    Rejection reason: {request.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {request.status === 'Pending' && (
              <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] items-end">
                <div className="space-y-2">
                  {activeRejectId === request.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={rejectReasonDrafts[request.id] ?? ''}
                        onChange={(e) =>
                          setRejectReasonDrafts((prev) => ({
                            ...prev,
                            [request.id]: e.target.value,
                          }))
                        }
                        rows={3}
                        placeholder="Enter reject reason"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-300"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                          onClick={() => confirmReject(request.id)}
                        >
                          Confirm Reject
                        </button>
                        <button
                          type="button"
                          className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200"
                          onClick={cancelReject}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                        onClick={() => approveRequest(request.id)}
                      >
                        <CheckCircle2 size={16} /> Approve
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-700"
                        onClick={() => startReject(request.id)}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </SparkCard>
        ))}
      </div>
    </div>
  );
};

export default RegularisationRequestsModule;
