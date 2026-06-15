import React, { useMemo, useState } from 'react';
import { Search, Clock3, CheckCircle2, CircleDashed, ArrowUpRight, User, FileUp, MessageSquare } from 'lucide-react';

type TaskStatus = 'Pending' | 'In Progress' | 'Under Review' | 'Completed';
type TaskPriority = 'High' | 'Medium' | 'Low';

type Task = {
  id: number;
  title: string;
  description: string;
  assignedEmpId: number;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  requirements?: string;
  hrReview?: string;
  employeeUploads?: string[];
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Prepare new hire onboarding checklist',
    description: 'Create task list and documentation for all new employee onboarding steps.',
    assignedEmpId: 3,
    dueDate: 'May 25, 2026',
    status: 'Pending',
    priority: 'High',
    progress: 10,
  },
  {
    id: 2,
    title: 'Review payroll approval workflow',
    description: 'Audit current payroll approval steps and make recommendations for faster processing.',
    assignedEmpId: 7,
    dueDate: 'May 27, 2026',
    status: 'In Progress',
    priority: 'Medium',
    progress: 55,
  },
  {
    id: 3,
    title: 'Update employee directory records',
    description: 'Verify employee details and update missing phone, department, and role information.',
    assignedEmpId: 12,
    dueDate: 'May 29, 2026',
    status: 'Completed',
    priority: 'Low',
    progress: 100,
    hrReview: 'Excellent work. All records match completely.',
  },
];

// Pastel color mappings for the entire card background based on task status
const cardPastelBgStyles: Record<TaskStatus, string> = {
  Pending: 'bg-amber-50/70 border-amber-200/60',
  'In Progress': 'bg-sky-50/70 border-sky-200/60',
  'Under Review': 'bg-purple-50/70 border-purple-200/60',
  Completed: 'bg-emerald-50/60 border-emerald-200/60',
};

const statusBadgeStyles: Record<TaskStatus, string> = {
  Pending: 'bg-amber-100/80 text-amber-800 border border-amber-200',
  'In Progress': 'bg-sky-100/80 text-sky-800 border border-sky-200',
  'Under Review': 'bg-purple-100/80 text-purple-800 border border-purple-200',
  Completed: 'bg-emerald-100/80 text-emerald-800 border border-emerald-200',
};

const priorityStyles: Record<TaskPriority, string> = {
  High: 'bg-red-100 text-red-700 border border-red-200',
  Medium: 'bg-orange-100 text-orange-700 border border-orange-200',
  Low: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const employeeIds = Array.from({ length: 15 }, (_, i) => i + 1);

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | TaskStatus>('All');
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignedEmpId, setNewTaskAssignedEmpId] = useState<number>(1);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskRequirements, setNewTaskRequirements] = useState('');
  
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [reviewInput, setReviewInput] = useState('');

  const [showRequirementsField, setShowRequirementsField] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()) ||
          task.assignedEmpId.toString() === search.trim();

        const matchesStatus = selectedStatus === 'All' ? true : task.status === selectedStatus;
        return matchesSearch && matchesStatus;
      }),
    [tasks, search, selectedStatus]
  );

  const totals = {
    total: tasks.length,
    pending: tasks.filter((task) => task.status === 'Pending').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    underReview: tasks.filter((task) => task.status === 'Under Review').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
  };

  const updateTaskStatus = (id: number, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
              progress: 
                status === 'Completed' ? 100 : 
                status === 'Under Review' ? 85 : 
                status === 'In Progress' ? Math.max(task.progress, 50) : 0,
            }
          : task
      )
    );
  };

  const handleSimulateUpload = (id: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const updatedUploads = [...(task.employeeUploads || []), `document_v${(task.employeeUploads?.length || 0) + 1}.pdf`];
          return {
            ...task,
            employeeUploads: updatedUploads,
            progress: Math.min(task.progress + 25, 90),
            status: 'Under Review',
          };
        }
        return task;
      })
    );
  };

  const handleSaveReview = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, hrReview: reviewInput.trim() || undefined } : task
      )
    );
    setEditingReviewId(null);
    setReviewInput('');
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim() || !newTaskDueDate.trim()) {
      return;
    }

    const nextTask: Task = {
      id: tasks.length ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      assignedEmpId: newTaskAssignedEmpId,
      dueDate: newTaskDueDate,
      status: 'Pending',
      priority: newTaskPriority,
      progress: 0,
      requirements: newTaskRequirements.trim() || undefined,
    };

    setTasks((prev) => [nextTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskAssignedEmpId(1);
    setNewTaskDueDate('');
    setNewTaskPriority('Medium');
    setNewTaskRequirements('');
    setShowRequirementsField(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 1-Line Minimal Height Dashboard Header Row */}
      <div className="rounded-[20px] border border-white/10 bg-[#030712] p-5 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Header Texts Left */}
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#22d3ee]">HR TASK MASTER DASHBOARD</p>
            <h1 className="text-xl font-bold tracking-tight">Employee Task Distribution</h1>
            <p className="text-[11px] text-slate-400">
              Assign workloads by specific employee IDs, monitor real-time completion progress from uploads, and leave official manager reviews.
            </p>
          </div>

          {/* Inline Action + Metric Badges Right */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="rounded-xl bg-[#0891b2] px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-[#06b6d4] whitespace-nowrap shadow-xs"
            >
              {showCreateForm ? 'Hide creation panel' : 'Add new task'}
            </button>

            <div className="flex items-center gap-1 bg-[#1e293b]/60 p-1 rounded-xl border border-white/5">
              <div className="px-2.5 py-0.5 text-center min-w-[50px]">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">TOTAL</p>
                <p className="text-xs font-black">{totals.total}</p>
              </div>
              <div className="px-2.5 py-0.5 text-center min-w-[50px]">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">PENDING</p>
                <p className="text-xs font-black text-amber-400">{totals.pending}</p>
              </div>
              <div className="px-2.5 py-0.5 text-center min-w-[50px]">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">ACTIVE</p>
                <p className="text-xs font-black text-cyan-400">{totals.inProgress}</p>
              </div>
              <div className="px-2.5 py-0.5 text-center min-w-[50px]">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">IN REVIEW</p>
                <p className="text-xs font-black text-purple-400">{totals.underReview}</p>
              </div>
              <div className="px-2.5 py-0.5 text-center min-w-[50px]">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">DONE</p>
                <p className="text-xs font-black text-emerald-400">{totals.completed}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Task List Work Area */}
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 rounded-[24px] bg-white p-6 shadow-xs border border-slate-150">
          
          {/* Action Filter Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Direct Monitoring Desk</h2>
              <p className="text-xs text-slate-500">Filter tasks dynamically or perform lookups using numerical target IDs.</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <Search size={14} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks or Emp ID..."
                  className="w-48 bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Expandable Task Deployment Sub-Panel */}
          {showCreateForm && (
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Task Title</label>
                  <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Assign Employee</label>
                  <select
                    value={newTaskAssignedEmpId}
                    onChange={(e) => setNewTaskAssignedEmpId(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  >
                    {employeeIds.map((id) => (
                      <option key={id} value={id}>Employee ID: {id}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Due date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4 items-start">
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Description</label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Add operational objectives..."
                    className="mt-1.5 min-h-[50px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRequirementsField((prev) => !prev)}
                  className="text-xs font-semibold text-cyan-700 hover:underline"
                >
                  {showRequirementsField ? '- Remove Criteria' : 'Requirements'}
                </button>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Create Task
                </button>
              </div>

              {showRequirementsField && (
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <label className="text-xs font-semibold text-slate-900">Requirements details</label>
                  <textarea
                    value={newTaskRequirements}
                    onChange={(e) => setNewTaskRequirements(e.target.value)}
                    placeholder="Provide acceptance points..."
                    className="mt-1.5 min-h-[55px] w-full rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* Full Width Dual Column Task Grid Layout with Pastel Colored Backgrounds */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`rounded-2xl border p-4 space-y-4 shadow-2xs transition hover:shadow-xs flex flex-col justify-between ${cardPastelBgStyles[task.status]}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-md font-bold text-slate-900">{task.title}</h3>
                      <p className="mt-1 text-xs text-slate-700 leading-relaxed">{task.description}</p>
                    </div>
                    <span className={`${statusBadgeStyles[task.status]} rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap shadow-2xs`}>
                      {task.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 bg-white/70 backdrop-blur-xs p-2.5 rounded-xl text-xs border border-slate-200/40">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                        <User size={10} /> Assigned To
                      </p>
                      <p className="mt-0.5 font-bold text-slate-800">Employee ID: {task.assignedEmpId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Due Date</p>
                      <p className="mt-0.5 font-semibold text-slate-800">{task.dueDate}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Priority</p>
                      <p className="mt-0.5 font-semibold"><span className={`${priorityStyles[task.priority]} px-1.5 py-px rounded text-[10px]`}>{task.priority}</span></p>
                    </div>
                  </div>

                  {task.requirements && (
                    <div className="mt-3 rounded-xl bg-white/80 p-2.5 text-xs text-slate-600 border border-slate-200/40">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Requirements</p>
                      <p className="mt-0.5 text-slate-800 text-[11px] whitespace-pre-line">{task.requirements}</p>
                    </div>
                  )}

                  {/* Submission Flow Segment */}
                  <div className="mt-3 rounded-xl bg-white/50 p-2.5 border border-dashed border-slate-300">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Employee Uploads</p>
                      <button 
                        onClick={() => handleSimulateUpload(task.id)}
                        className="text-[10px] text-cyan-700 font-bold flex items-center gap-1 hover:text-cyan-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs"
                      >
                        <FileUp size={11} /> Simulate Upload
                      </button>
                    </div>
                    {task.employeeUploads && task.employeeUploads.length > 0 ? (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {task.employeeUploads.map((file, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono">
                            📄 {file}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-slate-500 italic">No files uploaded yet.</p>
                    )}
                  </div>

                  {/* Interactive HR Review Section Panel */}
                  <div className="mt-3 rounded-xl bg-[#030712] p-3 text-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <MessageSquare size={11} className="text-cyan-400" /> HR Review &amp; Evaluation
                      </p>
                      {editingReviewId !== task.id && (
                        <button
                          onClick={() => {
                            setEditingReviewId(task.id);
                            setReviewInput(task.hrReview || '');
                          }}
                          className="text-[10px] text-cyan-400 font-semibold hover:underline"
                        >
                          {task.hrReview ? 'Edit Review' : '+ Add Review'}
                        </button>
                      )}
                    </div>

                    {editingReviewId === task.id ? (
                      <div className="space-y-1.5">
                        <textarea
                          value={reviewInput}
                          onChange={(e) => setReviewInput(e.target.value)}
                          placeholder="Type validation feedback or notes..."
                          className="w-full min-h-[50px] rounded-lg bg-white/10 p-2 text-xs text-white outline-none border border-white/10 focus:border-cyan-400 resize-none"
                        />
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => setEditingReviewId(null)}
                            className="px-2 py-0.5 text-[10px] bg-slate-800 rounded text-slate-300 hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveReview(task.id)}
                            className="px-2 py-0.5 text-[10px] bg-cyan-600 rounded text-white hover:bg-cyan-500"
                          >
                            Save Review
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 italic leading-relaxed px-0.5">
                        {task.hrReview ? `"${task.hrReview}"` : 'No manager review submitted yet.'}
                      </p>
                    )}
                  </div>

                </div>

                {/* Progress Status Elements Footer */}
                <div className="mt-4 pt-3 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
                    <div className="flex items-center gap-1">
                      <Clock3 size={13} className="text-slate-500" />
                      <span className="font-semibold text-slate-700">{task.progress}% complete</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/80 border border-slate-200/40">
                    <div className="h-full rounded-full bg-cyan-500 transition-all duration-300" style={{ width: `${task.progress}%` }} />
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {task.status !== 'In Progress' && task.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task.id, 'In Progress')}
                        className="inline-flex items-center gap-1 rounded-xl bg-cyan-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-cyan-500 shadow-xs"
                      >
                        <ArrowUpRight size={12} /> Start Task
                      </button>
                    )}

                    {task.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task.id, 'Completed')}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white transition hover:bg-emerald-500 shadow-xs"
                      >
                        <CheckCircle2 size={12} /> Mark Completed
                      </button>
                    )}

                    {(task.status === 'In Progress' || task.status === 'Completed' || task.status === 'Under Review') && (
                      <button
                        type="button"
                        onClick={() => updateTaskStatus(task.id, 'Pending')}
                        className="inline-flex items-center gap-1 rounded-xl bg-white/80 border border-slate-300/70 px-3 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 shadow-2xs"
                      >
                        <CircleDashed size={12} /> Set Pending
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TaskManager;