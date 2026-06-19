import React, { useState } from 'react';
import {
  AlertTriangle,
  BellRing,
  CalendarRange,
  Clock3,
  FileText,
  ReceiptText,
  
} from 'lucide-react';

type Notification = {
  id: string;
  category: string;
  title: string;
  detail?: string;
  time: string;
  priority: 'critical'|'important'|'info'|string;
  unread?: boolean;
  amount?: string;
  outstanding?: string;
};

type Card = {
  label: string;
  count?: number;
  tone?: string;
  callToAction: { label: string };
};

const defaultCards: Card[] = [
  { label: 'Project updates', count: 3, tone: 'bg-slate-100 border-slate-200', callToAction: { label: 'View updates' } },
  { label: 'Invoice reminders', count: 2, tone: 'bg-slate-100 border-slate-200', callToAction: { label: 'Review invoices' } },
  { label: 'Meeting alerts', count: 1, tone: 'bg-slate-100 border-slate-200', callToAction: { label: 'Open calendar' } },
];

const initialNotifications: Notification[] = [
  { id: 'n1', category: 'Project', title: 'UI review feedback posted for sprint', detail: 'Design team uploaded review notes.', time: '2026-06-16T09:30:00', priority: 'info', unread: true },
  { id: 'n2', category: 'Invoice', title: 'Invoice INV-2026-002', detail: '₹84,500 outstanding • Due in 9 days', time: '2026-06-16T07:20:00', priority: 'important', unread: true, amount: 'Rs. 84,500', outstanding: 'Rs. 84,500' },
  { id: 'n3', category: 'Meeting', title: 'Client review meeting confirmed', detail: 'Call scheduled with delivery manager.', time: '2026-06-15T16:00:00', priority: 'important', unread: false },
  { id: 'n4', category: 'Ticket', title: 'Ticket #452 escalated', detail: 'Support has escalated the ticket for urgent fix.', time: '2026-06-14T11:15:00', priority: 'critical', unread: true },
  { id: 'n5', category: 'Document', title: 'New contract files available', detail: 'Contract and requirements uploaded.', time: '2026-06-13T09:00:00', priority: 'info', unread: false },
];

function priorityRank(p: string) {
  if (p === 'critical') return 0;
  if (p === 'important') return 1;
  return 2; // info and others
}

function groupByDay(items: Notification[]) {
  const today = new Date();
  const groups: Record<string, Notification[]> = { 'Today': [], 'Yesterday': [], 'Earlier': [] };
  items.forEach((n) => {
    const d = new Date(n.time);
    const diffDays = Math.floor((today.setHours(0,0,0,0) - new Date(d).setHours(0,0,0,0)) / (1000*60*60*24));
    if (diffDays === 0) groups.Today.push(n);
    else if (diffDays === 1) groups.Yesterday.push(n);
    else groups.Earlier.push(n);
  });
  return groups;
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return d.toLocaleDateString();
}

type Props = {
  notifications?: Notification[];
  cards?: Card[];
};

const Notifications: React.FC<Props> = ({ notifications: propNotifications, cards: propCards }) => {
  const [filter, setFilter] = useState<'All'|'Unread'|'Project'|'Invoice'|'Meeting'|'Ticket'|'Document'>('All');
  const [notifications, setNotifications] = useState<Notification[]>(propNotifications ?? initialNotifications);
  const [cards, setCards] = useState<Card[]>(propCards ?? defaultCards);

  React.useEffect(() => {
    if (propNotifications) setNotifications(propNotifications);
  }, [propNotifications]);

  React.useEffect(() => {
    if (propCards) setCards(propCards);
  }, [propCards]);

  const handleMarkAllRead = () => {
    setNotifications((s) => s.map(n => ({ ...n, unread: false })));
  };

  const handleExportAlerts = () => {
    alert('Alerts exported for review.');
  };

  const handleViewAll = () => {
    alert('Full notification feed opened.');
  };

  const counts = notifications.reduce((acc, n) => {
    acc.total++;
    if (n.unread) acc.unread++;
    acc.byCategory[n.category] = (acc.byCategory[n.category] || 0) + (n.unread ? 1 : 0);
    return acc;
  }, { total: 0, unread: 0, byCategory: {} as Record<string, number> });

  const sorted = [...notifications].sort((a,b) => {
    const p = priorityRank(a.priority) - priorityRank(b.priority);
    if (p !== 0) return p;
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });

  const visibleAlerts = sorted.filter((n) => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return n.unread;
    return n.category === filter;
  });

  const grouped = groupByDay(visibleAlerts);

  const openNotification = (id: string) => {
    // mark read and simulate open
    setNotifications(s => s.map(x => x.id === id ? { ...x, unread: false } : x));
    alert(`Open notification ${id}`);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border p-6 lg:p-8" style={{ borderColor: '#d1d5db', backgroundColor: '#f8fafc', boxShadow: '0 14px 30px rgba(15,23,42,0.08)'}}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.28em] text-slate-500">Notifications</p>
            <h3 className="text-[28px] font-black tracking-tight text-slate-800 lg:text-[32px]">Keep up with project updates, invoice reminders, meeting alerts, ticket updates, and document alerts.</h3>
            <p className="max-w-xl text-[15px] leading-6 text-slate-600">This panel gives the client a quick, organized summary of the latest actions and important follow-ups from the project team.</p>
          </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-100/90 px-4 py-3 text-sm text-slate-700 shadow-inner shadow-slate-100">
            <div className="flex items-center gap-2 font-semibold"><BellRing className="h-4 w-4 text-slate-500" /> Live alerts</div>
            <div className="text-xs mt-1"><span className="font-semibold text-slate-900">{counts.unread}</span> unread • <span className="font-semibold text-slate-900">{counts.total}</span> total</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[30px] border p-6" style={{ borderColor: '#d1d5db', backgroundColor: '#f1f5f9', boxShadow: '0 14px 30px rgba(15,23,42,0.08)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">Alert overview</p>
              <h4 className="text-[22px] font-bold text-slate-800">What needs attention</h4>
            </div>
            <AlertTriangle className="h-5 w-5 text-slate-400" />
          </div>

          <div className="grid gap-4">
            {cards.map((item) => (
              <article key={item.label} className={`rounded-[24px] border p-4 shadow-sm ${item.tone}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.22em] text-slate-700/90">{item.label}</p>
                    <p className="mt-2 text-[22px] font-extrabold text-slate-900">{item.count}</p>
                    <p className="mt-2 text-[13px] leading-6 text-slate-700">{item.callToAction.label} →</p>
                  </div>
                  <div>
                    <button onClick={() => alert(item.callToAction.label)} className="rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-slate-800">{item.callToAction.label}</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="rounded-[30px] border p-6" style={{ borderColor: '#d1d5db', backgroundColor: '#f7f7f9', boxShadow: '0 14px 30px rgba(15,23,42,0.08)'}}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] uppercase tracking-[0.26em] text-slate-500">Recent alerts</p>
              <h4 className="text-[22px] font-bold text-slate-800">Latest notifications</h4>
            </div>
            <BellRing className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mb-5 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex gap-2 flex-wrap">
                {['All','Unread','Invoice','Meeting','Project','Ticket','Document'].map((k) => (
                  <button key={k} onClick={() => setFilter(k as any)} className={`rounded-2xl px-3 py-1 text-sm ${filter===k?'bg-slate-900 text-white':'bg-white text-slate-700 border border-slate-200'}`}>
                    <span className={filter===k? 'text-white' : 'text-slate-700'}>{k}</span>
                    {k !== 'All' && (counts.byCategory[k] || 0) ? (
                      <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${filter===k? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-800'}`}>{counts.byCategory[k]}</span>
                    ) : null}
                  </button>
                ))}
              </div>
              <div className="ml-auto">
                <button type="button" onClick={handleMarkAllRead} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Mark all as read</button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={handleExportAlerts} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Export alerts</button>
              <button type="button" onClick={handleViewAll} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">View all</button>
            </div>
          </div>

          <div className="space-y-6">
            {['Today','Yesterday','Earlier'].map((section) => (
              grouped[section] && grouped[section].length > 0 ? (
                <div key={section}>
                  <h5 className="text-sm font-semibold text-slate-700 mb-2">{section}</h5>
                  <div className="space-y-3">
                    {grouped[section].map((n) => (
                      <article key={n.id} onClick={() => openNotification(n.id)} className={`rounded-[12px] border p-3 shadow-sm cursor-pointer ${n.unread ? 'bg-slate-50' : 'bg-slate-50/90'} ${n.unread ? (n.priority === 'critical' ? 'border-l-4 border-rose-200' : (n.priority === 'important' ? 'border-l-4 border-amber-200' : 'border-l-4 border-slate-300')) : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-full p-2 shadow-sm" style={{background: n.priority === 'critical' ? '#f8eef2' : (n.priority === 'important' ? '#f9f5eb' : '#eef2f7')}}>
                            {n.category === 'Meeting' ? <CalendarRange className="h-4 w-4 text-slate-700" /> : (n.category === 'Invoice' ? <ReceiptText className="h-4 w-4 text-slate-700" /> : (n.category === 'Document' ? <FileText className="h-4 w-4 text-slate-700" /> : <Clock3 className="h-4 w-4 text-slate-700" />))}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-semibold ${n.unread? 'text-slate-900':'text-slate-700'}`}>{n.title}</p>
                                  {n.unread && <span className="h-2 w-2 rounded-full bg-slate-900" />}
                                  <span className="ml-2 text-xs text-slate-500">{timeAgo(n.time)}</span>
                                </div>
                                <p className="mt-1 text-xs text-slate-600">{n.detail}</p>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className={`text-xs px-2 py-1 rounded-full ${n.priority === 'critical' ? 'bg-rose-100 text-rose-700' : (n.priority === 'important' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800')}`}>{n.priority}</div>
                                <div className="flex gap-2">
                                  <button onClick={(e) => { e.stopPropagation(); alert(`View ${n.id}`); }} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800">View</button>
                                  <button onClick={(e) => { e.stopPropagation(); setNotifications(s => s.map(x => x.id === n.id ? { ...x, unread: !x.unread } : x)); }} className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800">{n.unread? 'Mark read' : 'Mark unread'}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <article className="rounded-[24px] border p-4 shadow-sm bg-slate-50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-500">Alerts summary</p>
                  <p className="mt-1 text-[14px] leading-6 text-slate-600">Quick stats to help prioritize follow-ups.</p>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-xs uppercase text-slate-500 tracking-wide">Unread</p>
                    <p className="text-xl font-extrabold text-slate-900">{counts.unread}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-slate-500 tracking-wide">Critical</p>
                    <p className="text-xl font-extrabold text-slate-900">{notifications.filter(n => n.priority === 'critical').length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-slate-500 tracking-wide">Important</p>
                    <p className="text-xl font-extrabold text-slate-900">{notifications.filter(n => n.priority === 'important').length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs uppercase text-slate-500 tracking-wide">Info</p>
                    <p className="text-xl font-extrabold text-slate-900">{notifications.filter(n => n.priority === 'info').length}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-semibold text-slate-700">Upcoming actions</p>
                <ul className="mt-2 list-disc list-inside text-sm text-slate-700">
                  {sorted.slice(0,3).map(n => (
                    <li key={n.id} className="py-1">
                      <div className="flex items-center justify-between gap-3">
                        <span>{n.title}</span>
                        <span className="text-xs text-slate-500">{timeAgo(n.time)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Notifications;
