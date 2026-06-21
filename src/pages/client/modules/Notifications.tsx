import React, { useMemo, useState } from 'react';
import {
  BellRing,
  Clock3,
  ReceiptText,
} from 'lucide-react';

type Notification = {
  id: string;
  category: string;
  title: string;
  detail?: string;
  time: string;
  priority: 'critical' | 'important' | 'info' | string;
  unread?: boolean;
  amount?: string;
  outstanding?: string;
  severity?: number;
};

type Props = {
  notifications?: Notification[];
};

const initialNotifications: Notification[] = [
  { id: 'n1', category: 'Project', title: 'UI review feedback posted for sprint', detail: 'Design team uploaded review notes.', time: '2026-06-16T09:30:00', priority: 'info', unread: true },
  { id: 'n2', category: 'Invoice', title: 'Invoice INV-2026-002', detail: '₹84,500 outstanding • Due in 9 days', time: '2026-06-16T07:20:00', priority: 'important', unread: true, amount: 'Rs. 84,500', outstanding: 'Rs. 84,500' },
  { id: 'n3', category: 'Meeting', title: 'Client review meeting confirmed', detail: 'Call scheduled with delivery manager.', time: '2026-06-15T16:00:00', priority: 'important', unread: false },
  { id: 'n4', category: 'Ticket', title: 'Ticket #452 escalated', detail: 'Support has escalated the ticket for urgent fix.', time: '2026-06-14T11:15:00', priority: 'critical', unread: true },
  { id: 'n5', category: 'Document', title: 'New contract files available', detail: 'Contract and requirements uploaded.', time: '2026-06-13T09:00:00', priority: 'info', unread: false },
];

function computeSeverity(notification: Notification) {
  const base = notification.priority === 'critical' ? 100 : notification.priority === 'important' ? 80 : 50;
  const categoryBoost = notification.category === 'Invoice' ? 15 : notification.category === 'Meeting' ? 12 : notification.category === 'Project' ? 10 : notification.category === 'Document' ? 8 : notification.category === 'Ticket' ? 5 : 0;
  return base + categoryBoost;
}

function groupByDay(items: Notification[]) {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const groups: Record<string, Notification[]> = { Today: [], Yesterday: [], Earlier: [] };

  items.forEach((item) => {
    const itemDate = new Date(item.time);
    const startOfItem = new Date(itemDate);
    startOfItem.setHours(0, 0, 0, 0);
    const diffDays = Math.round((startOfToday.getTime() - startOfItem.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) groups.Today.push(item);
    else if (diffDays === 1) groups.Yesterday.push(item);
    else groups.Earlier.push(item);
  });

  return groups;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return d.toLocaleDateString();
}

const Notifications: React.FC<Props> = ({ notifications: propNotifications }) => {
  const [notifications, setNotifications] = useState<Notification[]>(propNotifications ?? initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Action' | 'Billing' | 'Documents' | 'Meetings' | 'Project'>('Action');

  React.useEffect(() => {
    if (propNotifications) setNotifications(propNotifications);
  }, [propNotifications]);

  const enrichedNotifications = useMemo(
    () =>
      notifications
        .map((notification) => ({
          ...notification,
          severity: notification.severity ?? computeSeverity(notification),
        }))
        .sort((a, b) => {
          if ((b.severity ?? 0) !== (a.severity ?? 0)) return (b.severity ?? 0) - (a.severity ?? 0);
          return new Date(b.time).getTime() - new Date(a.time).getTime();
        }),
    [notifications]
  );

  const quickCounts = useMemo(() => {
    const now = new Date();
    const topInvoice = enrichedNotifications.find((n) => n.category === 'Invoice' && n.outstanding);
    return {
      actionsRequired: enrichedNotifications.filter(
        (n) =>
          n.unread &&
          ['Ticket', 'Document', 'Meeting', 'Invoice', 'Project'].includes(n.category)
      ).length,
      pendingInvoice: enrichedNotifications.filter((n) => n.category === 'Invoice' && n.outstanding).length,
      documentsWaiting: enrichedNotifications.filter((n) => n.category === 'Document' && n.unread).length,
      upcomingMeetings: enrichedNotifications.filter((n) => {
        if (n.category !== 'Meeting') return false;
        const meetingTime = new Date(n.time);
        const daysAhead = (meetingTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysAhead >= 0 && daysAhead <= 7;
      }).length,
      unread: enrichedNotifications.filter((n) => n.unread).length,
      total: enrichedNotifications.length,
      topInvoice,
      topProjectUpdate: enrichedNotifications.find((n) => n.category === 'Project'),
      invoiceStatus: topInvoice ? (topInvoice.outstanding ? 'Awaiting payment' : 'Paid') : 'No pending invoice',
    };
  }, [enrichedNotifications]);

  const categoryLists = useMemo(
    () => ({
      Action: enrichedNotifications.filter(
        (n) =>
          n.unread &&
          ['Ticket', 'Document', 'Meeting', 'Invoice', 'Project'].includes(n.category)
      ),
      Billing: enrichedNotifications.filter((n) => n.category === 'Invoice'),
      Documents: enrichedNotifications.filter((n) => n.category === 'Document'),
      Meetings: enrichedNotifications.filter((n) => n.category === 'Meeting'),
      Project: enrichedNotifications.filter((n) => n.category === 'Project'),
    }),
    [enrichedNotifications]
  );

  const visibleNotifications = selectedCategory === 'All' ? enrichedNotifications : categoryLists[selectedCategory] ?? [];
  const groupedTimeline = useMemo(() => groupByDay(visibleNotifications), [visibleNotifications]);

  const markAllRead = () => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  };

  const openNotification = (id: string) => {
    setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)));
    alert(`Open notification ${id}`);
  };

  const toggleRead = (id: string) => {
    setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, unread: !notification.unread } : notification)));
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-slate-200 bg-slate-50 p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-slate-500">Client Communication Center</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-800 lg:text-[32px]">A priority-based hub for what matters most.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-600">Clients see actions, money, project delivery, and urgent updates first—rather than a generic notification list.</p>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <BellRing className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold">Priority Summary</span>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              <div className="flex items-center justify-between gap-4">
                <span>Actions</span>
                <span className="font-semibold text-slate-900">{quickCounts.actionsRequired}</span>
              </div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <span>Invoices</span>
                <span className="font-semibold text-slate-900">{quickCounts.pendingInvoice}</span>
              </div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <span>Documents</span>
                <span className="font-semibold text-slate-900">{quickCounts.documentsWaiting}</span>
              </div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <span>Meetings</span>
                <span className="font-semibold text-slate-900">{quickCounts.upcomingMeetings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">Action Center</p>
              <h4 className="text-[22px] font-bold text-slate-800">Top items by importance</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Actions Required', value: quickCounts.actionsRequired },
                { label: 'Pending Invoices', value: quickCounts.pendingInvoice },
                { label: 'Documents Waiting', value: quickCounts.documentsWaiting },
                { label: 'Meetings Ahead', value: quickCounts.upcomingMeetings },
              ].map((card) => (
                <div key={card.label} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-[28px] font-extrabold text-slate-900">{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Action', 'Billing', 'Documents', 'Meetings', 'Project', 'All'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as any)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold ${selectedCategory === category ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {visibleNotifications.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600">No notifications in this section yet.</div>
            ) : (
              visibleNotifications.slice(0, 5).map((notification) => (
                <article
                  key={notification.id}
                  onClick={() => openNotification(notification.id)}
                  className={`rounded-[20px] border p-4 shadow-sm cursor-pointer ${notification.unread ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                        {notification.unread && <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{notification.detail}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{notification.category}</span>
                        <span>•</span>
                        <span>{timeAgo(notification.time)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold ${notification.priority === 'critical' ? 'bg-rose-100 text-rose-700' : notification.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                        {notification.priority}
                      </div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleRead(notification.id);
                        }}
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                      >
                        {notification.unread ? 'Mark read' : 'Mark unread'}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={markAllRead} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Mark all as read</button>
            <button type="button" onClick={() => alert('Export alerts')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export alerts</button>
            <button type="button" onClick={() => alert('View full feed')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View full feed</button>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">Financial Alerts</p>
                <h4 className="text-[22px] font-bold text-slate-800">Money Section</h4>
              </div>
              <ReceiptText className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pending invoice</p>
                  <p className="mt-3 text-[22px] font-extrabold text-slate-900">{quickCounts.topInvoice?.title ?? 'No pending invoice'}</p>
                  <p className="mt-2 text-sm text-slate-600">{quickCounts.topInvoice ? `${quickCounts.topInvoice.amount ?? quickCounts.topInvoice.outstanding ?? ''} • Due ${formatDate(quickCounts.topInvoice.time)}` : 'No invoice pending review'}</p>
                </div>
                <div className="rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">{quickCounts.topInvoice ? quickCounts.invoiceStatus : 'No pending invoice'}</div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-700">
                <div className="rounded-[18px] bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">Amount</p>
                  <p className="mt-1">{quickCounts.topInvoice?.amount ?? quickCounts.topInvoice?.outstanding ?? '—'}</p>
                </div>
                <div className="rounded-[18px] bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">Due date</p>
                  <p className="mt-1">{quickCounts.topInvoice ? formatDate(quickCounts.topInvoice.time) : '—'}</p>
                </div>
                <div className="rounded-[18px] bg-white p-4 shadow-sm">
                  <p className="font-semibold text-slate-900">Status</p>
                  <p className="mt-1">{quickCounts.topInvoice ? quickCounts.invoiceStatus : 'No invoice'}</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">AI Summary</p>
                <h4 className="text-[22px] font-bold text-slate-800">Client Snapshot</h4>
              </div>
              <BellRing className="h-5 w-5 text-slate-400" />
            </div>

            <div className="mt-6 space-y-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <p>• {quickCounts.pendingInvoice} invoices pending review or payment.</p>
              <p>• {quickCounts.upcomingMeetings} meetings scheduled within the next week.</p>
              <p>• {categoryLists.Project.length} project updates waiting for review.</p>
              <p>• {quickCounts.documentsWaiting} documents uploaded that need attention.</p>
              <div className="rounded-[20px] bg-slate-900 px-4 py-3 text-sm text-white">
                Recommended Action: {quickCounts.topInvoice ? `Review ${quickCounts.topInvoice.title}${quickCounts.topProjectUpdate ? ` and approve ${quickCounts.topProjectUpdate.title}.` : '.'}` : 'No invoice pending action.'}
              </div>
            </div>
          </article>
        </div>
      </div>

      <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">Timeline View</p>
            <h4 className="text-[22px] font-bold text-slate-800">Today • Yesterday • Earlier</h4>
          </div>
          <Clock3 className="h-5 w-5 text-slate-400" />
        </div>

        <div className="mt-6 space-y-6">
          {['Today', 'Yesterday', 'Earlier'].map((section) => (
            groupedTimeline[section] && groupedTimeline[section].length > 0 ? (
              <div key={section}>
                <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{section}</p>
                  <p className="text-sm text-slate-500">{groupedTimeline[section].length} items</p>
                </div>
                <div className="space-y-3">
                  {groupedTimeline[section].map((notification) => (
                    <div key={notification.id} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{formatTime(notification.time)} • {notification.category}</p>
                        </div>
                        <div className={`rounded-full px-2 py-1 text-[11px] font-semibold ${notification.priority === 'critical' ? 'bg-rose-100 text-rose-700' : notification.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                          {notification.priority}
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{notification.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          ))}
        </div>
      </article>
    </section>
  );
};

export default Notifications;
