import { type FC, useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Users,
  X,
  BriefcaseBusiness,
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  designation?: string;
  email?: string;
  employeeId?: string;
  role?: string;
}

interface ClientProject {
  id: number;
  name: string;
  dueDate: string;
}

interface Client {
  id: number;
  name: string;
  projects: ClientProject[];
}

interface Team {
  id: number;
  teamName: string;
  projectManager: string;
  teamLead: string;
  clientName?: string;
  projectName?: string;
  employees: Employee[];
  billableHours: number;
  nonBillableHours: number;
  createdAt: string;
}

interface ProjectEffortReportModuleProps {
  employees?: Employee[];
}

const ProjectEffortReportModule: FC<
  ProjectEffortReportModuleProps
> = ({
  employees = [],
}) => {

  const [teams, setTeams] = useState<
    Team[]
  >([]);

  const [showModal, setShowModal] =
    useState(false);

  const storageKey = 'projectEffortTeams';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Team[];
        setTeams(parsed);
      }
    } catch (error) {
      console.error('Failed to load teams from storage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(teams));
    } catch (error) {
      console.error('Failed to save teams to storage', error);
    }
  }, [teams]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === storageKey && event.newValue) {
        try {
          setTeams(JSON.parse(event.newValue) as Team[]);
        } catch (error) {
          console.error('Failed to parse teams from storage event', error);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [teamName, setTeamName] =
    useState('');

  const [projectManager, setProjectManager] =
    useState('');

  const [teamLead, setTeamLead] =
    useState('');

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [selectedEmployees,
    setSelectedEmployees] = useState<
      Employee[]
    >([]);

  const [clients] = useState<Client[]>([
    {
      id: 1,
      name: 'Aster Labs',
      projects: [
        { id: 1, name: 'HRMS rollout', dueDate: '2026-06-30' },
        { id: 2, name: 'Onboarding automation', dueDate: '2026-08-15' },
      ],
    },
    {
      id: 2,
      name: 'BluePeak Tech',
      projects: [
        { id: 3, name: 'Payroll integration', dueDate: '2026-07-10' },
      ],
    },
    {
      id: 3,
      name: 'Northstar Retail',
      projects: [
        { id: 4, name: 'Attendance module', dueDate: '2026-06-22' },
        { id: 5, name: 'Shift rostering', dueDate: '2026-07-05' },
      ],
    },
  ]);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const selectedClient = clients.find(client => client.id === selectedClientId) || null;
  const selectedProject = selectedClient?.projects.find(project => project.id === selectedProjectId) || null;

  const isProjectAllocated = (clientName: string, projectName: string) =>
    teams.some(
      team =>
        team.clientName === clientName &&
        team.projectName === projectName
    );

  const filteredTeams = teams.filter(team => {
    if (!dateFrom && !dateTo) return true;
    const createdDate = new Date(team.createdAt);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    if (fromDate && createdDate < fromDate) return false;
    if (toDate && createdDate > toDate) return false;
    return true;
  });

  const totalTeamHours = teams.reduce(
    (sum, team) => sum + team.billableHours + team.nonBillableHours,
    0
  );

  /* SELECT EMPLOYEE */

  const toggleEmployee = (
    employee: Employee
  ) => {

    const exists =
      selectedEmployees.find(
        item => item.id === employee.id
      );

    if (exists) {

      setSelectedEmployees(prev =>
        prev.filter(
          item => item.id !== employee.id
        )
      );

    } else {

      setSelectedEmployees(prev => [
        ...prev,
        employee,
      ]);
    }
  };

  /* CREATE TEAM */

  const handleCreateTeam = () => {

    if (
      !teamName ||
      !projectManager ||
      !teamLead ||
      !selectedClientId ||
      !selectedProjectId
    ) {
      alert('Please fill all fields and select a client project');
      return;
    }

    const billableSum = selectedEmployees.length * 28;
    const nonBillableSum = selectedEmployees.length * 5;

    const newTeam: Team = {
      id: Date.now(),
      teamName,
      projectManager,
      teamLead,
      clientName: selectedClient?.name,
      projectName: selectedProject?.name,
      employees: selectedEmployees,
      billableHours: billableSum,
      nonBillableHours: nonBillableSum,
      createdAt: new Date().toISOString(),
    };

    setTeams(prev => [
      ...prev,
      newTeam,
    ]);

    setTeamName('');
    setProjectManager('');
    setTeamLead('');
    setSelectedClientId(null);
    setSelectedProjectId(null);
    setSelectedEmployees([]);
    setShowModal(false);
  };

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
                bg-emerald-500/20
                text-emerald-400
              "
            >
              <FileText size={24} />
            </div>

            <div>

              <h2 className="text-2xl font-black text-white">
                Project Effort Report
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage teams and project
                effort reports
              </p>

              <p className="mt-1 text-xs text-slate-300">
                Dev: saved teams {teams.length}
              </p>

            </div>

          </div>

          {/* ADD TEAM */}
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-emerald-500
              to-teal-600
              px-6
              py-4
              text-sm
              font-black
              uppercase
              tracking-[0.12em]
              text-white
            "
          >
            <Plus size={18} />
            Add Team
          </button>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
            Filter by date
          </p>
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500">
                From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500">
                To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none"
              />
            </div>
            <button
              onClick={() => {
                setDateFrom('');
                setDateTo('');
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold uppercase text-slate-700 hover:bg-slate-200"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
            Filtered Teams
          </p>
          <p className="mt-4 text-3xl font-black text-slate-900">
            {filteredTeams.length}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            matching the selected date range
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
            Total Hours
          </p>
          <p className="mt-4 text-3xl font-black text-cyan-700">
            {totalTeamHours}h
          </p>
          <p className="text-sm text-slate-500 mt-1">
            across all teams
          </p>
        </div>
      </div>

      {/* CLIENT PROJECTS CARD - SEPARATE */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
          Client Projects
        </p>
        <div className="mt-4 space-y-4">
          {clients.map(client => (
            <div
              key={client.id}
              className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-sm font-semibold text-slate-900">
                {client.name}
              </p>
              <div className="mt-3 space-y-3">
                {client.projects.map(project => (
                  <div
                    key={project.id}
                    className="rounded-2xl bg-white p-3 shadow-sm border border-slate-200"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          {project.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Due {project.dueDate}
                        </p>
                      </div>
                      {(() => {
                        const projectAllocated = isProjectAllocated(
                          client.name,
                          project.name
                        );
                        return (
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${projectAllocated ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}
                          >
                            {projectAllocated
                              ? 'Team Allocated'
                              : 'Not Allocated'}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EMPTY STATE */}
      {teams.length === 0 && (

        <div
          className="
            rounded-[2rem]
            bg-white
            p-12
            text-center
            shadow-[0_16px_45px_rgba(0,0,0,0.08)]
          "
        >

          <BriefcaseBusiness
            size={60}
            className="
              mx-auto
              text-emerald-500
            "
          />

          <h3 className="mt-6 text-3xl font-black text-slate-900">
            No Teams Created
          </h3>

          <p className="mt-3 text-slate-600">
            Click on Add Team to create
            your first team.
          </p>

        </div>

      )}

      {/* TEAM LIST */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filteredTeams.map(team => (

          <div
            key={team.id}
            className="
              rounded-[2rem]
              bg-white
              p-6
              shadow-[0_16px_45px_rgba(0,0,0,0.08)]
            "
          >

            {/* TOP */}
            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-2xl font-black text-slate-900">
                  {team.teamName}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  Project Team Overview
                </p>

                {team.clientName && team.projectName && (
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {team.clientName} / {team.projectName}
                  </p>
                )}

              </div>

              <div
                className="
                  rounded-2xl
                  bg-slate-100
                  p-4
                "
              >

                <p className="text-xs font-black uppercase text-slate-500">
                  Manager
                </p>

                <h4 className="mt-2 text-lg font-black text-slate-900">
                  {team.projectManager}
                </h4>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-slate-100
                  p-4
                "
              >

                <p className="text-xs font-black uppercase text-slate-500">
                  Team Lead
                </p>

                <h4 className="mt-2 text-lg font-black text-slate-900">
                  {team.teamLead}
                </h4>

              </div>

            </div>

            {/* EMPLOYEES */}
            <div className="mt-6">

              <div className="flex items-center gap-3 mb-4">

                <Users
                  size={20}
                  className="text-cyan-600"
                />

                <h4 className="text-lg font-black text-slate-900">
                  Team Members
                </h4>

              </div>

              <div className="space-y-3">

                {team.employees.map(employee => (

                  <div
                    key={employee.id}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-4
                    "
                  >

                    <div>

                      <h5 className="font-bold text-slate-900">
                        {employee.name}
                      </h5>

                      <p className="text-sm text-slate-700">
                        {employee.employeeId}
                      </p>

                    </div>

                    <span
                      className="
                        rounded-full
                        bg-cyan-100
                        px-4
                        py-2
                        text-xs
                        font-black
                        text-cyan-700
                      "
                    >
                      {employee.designation ||
                        employee.role}
                    </span>

                  </div>

                ))}

              </div>

            </div>

            {/* REPORT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

              <div
                className="
                  rounded-2xl
                  bg-emerald-50
                  p-5
                "
              >

                <p className="text-sm font-bold text-slate-600">
                  Billable Hours
                </p>

                <h3 className="mt-3 text-3xl font-black text-emerald-700">
                  {team.billableHours}h
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-rose-50
                  p-5
                "
              >

                <p className="text-sm font-bold text-slate-600">
                  Non Billable
                </p>

                <h3 className="mt-3 text-3xl font-black text-rose-700">
                  {team.nonBillableHours}h
                </h3>

              </div>

              <div
                className="
                  rounded-2xl
                  bg-cyan-50
                  p-5
                "
              >

                <p className="text-sm font-bold text-slate-600">
                  Team Contribution
                </p>

                <h3 className="mt-3 text-3xl font-black text-cyan-700">
                  {totalTeamHours
                    ? Math.round(
                        ((team.billableHours + team.nonBillableHours) /
                          totalTeamHours) *
                          100
                      )
                    : 0}%
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  of total team hours
                </p>

              </div>

            </div>


          </div>

        ))}

      </div>

      {/* MODAL */}
      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
            p-6
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-5xl
              overflow-y-auto
              rounded-[2rem]
              bg-white
              p-8
            "
          >

            {/* TOP */}
            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-3xl font-black text-slate-900">
                  Create New Team
                </h3>

                <p className="mt-2 text-slate-600">
                  Add team manager, team
                  lead and employees
                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  rounded-2xl
                  bg-slate-100
                  p-3
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

              {/* CLIENT */}
              <div>

                <label className="text-sm font-black text-slate-700">
                  Client
                </label>

                <select
                  value={selectedClientId ?? ''}
                  onChange={e => {
                    const clientId = Number(e.target.value);
                    setSelectedClientId(clientId || null);
                    setSelectedProjectId(null);
                  }}
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-black
                    outline-none
                  "
                >
                  <option value="">Select Client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* CLIENT PROJECT */}
              <div>

                <label className="text-sm font-black text-slate-700">
                  Client Project
                </label>

                <select
                  value={selectedProjectId ?? ''}
                  onChange={e => setSelectedProjectId(Number(e.target.value) || null)}
                  disabled={!selectedClient}
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-black
                    outline-none
                    disabled:opacity-50
                  "
                >
                  <option value="">Select Project</option>
                  {selectedClient?.projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>

              </div>

              {/* TEAM NAME */}
              <div>

                <label className="text-sm font-black text-slate-700">
                  Team Name
                </label>

                <input
                  type="text"
                  value={teamName}
                  onChange={e =>
                    setTeamName(
                      e.target.value
                    )
                  }
                  placeholder="Enter Team Name"
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-black
                    outline-none
                  "
                />

              </div>

              {/* MANAGER */}
              <div>

                <label className="text-sm font-black text-slate-700">
                  Manager
                </label>

                <select
                  value={projectManager}
                  onChange={e =>
                    setProjectManager(
                      e.target.value
                    )
                  }
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-black
                    outline-none
                  "
                >

                  <option value="">
                    Select Manager
                  </option>

                  {employees.map(employee => (

                    <option
                      key={employee.id}
                      value={employee.name}
                    >
                      {employee.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* TEAM LEAD */}
              <div>

                <label className="text-sm font-black text-slate-700">
                  Team Lead
                </label>

                <select
                  value={teamLead}
                  onChange={e =>
                    setTeamLead(
                      e.target.value
                    )
                  }
                  className="
                    mt-2
                    w-full
                    rounded-2xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-3
                    text-black
                    outline-none
                  "
                >

                  <option value="">
                    Select Team Lead
                  </option>

                  {employees.map(employee => (

                    <option
                      key={employee.id}
                      value={employee.name}
                    >
                      {employee.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            {/* EMPLOYEE LIST */}
            <div className="mt-10">

              <h4 className="text-xl font-black text-slate-900 mb-5">
                Select Employees
              </h4>

              {/* EMPTY EMPLOYEES */}
              {employees.length === 0 && (

                <div
                  className="
                    rounded-2xl
                    border
                    border-dashed
                    border-slate-300
                    bg-slate-50
                    p-10
                    text-center
                  "
                >

                  <h4 className="text-lg font-black text-slate-700">
                    No Employees Found
                  </h4>

                  <p className="mt-2 text-slate-500">
                    Pass employees prop from
                    your dashboard.
                  </p>

                </div>

              )}

              {/* EMPLOYEE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {employees.map(employee => {

                  const selected =
                    selectedEmployees.find(
                      item =>
                        item.id === employee.id
                    );

                  return (

                    <button
                      key={employee.id}
                      onClick={() =>
                        toggleEmployee(employee)
                      }
                      className={`
                        rounded-2xl
                        border
                        p-5
                        text-left
                        transition

                        ${
                          selected
                            ? 'border-emerald-500 bg-emerald-100 shadow-lg'
                            : 'border-slate-300 bg-white hover:bg-slate-100'
                        }
                      `}
                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <h5 className="font-black text-slate-900">
                            {employee.name}
                          </h5>

                          <p className="mt-1 text-sm text-slate-700">
                            {employee.employeeId}
                          </p>

                          <p className="mt-2 text-xs text-slate-600">
                            {employee.designation ||
                              employee.role}
                          </p>

                        </div>

                        {selected && (

                          <div
                            className="
                              rounded-full
                              bg-emerald-500
                              px-3
                              py-1
                              text-xs
                              font-black
                              text-white
                            "
                          >
                            Added
                          </div>

                        )}

                      </div>

                    </button>

                  );
                })}

              </div>

            </div>

            {/* CREATE */}
            <button
              onClick={handleCreateTeam}
              className="
                mt-10
                rounded-2xl
                bg-gradient-to-r
                from-emerald-500
                to-teal-600
                px-8
                py-4
                text-sm
                font-black
                uppercase
                tracking-[0.12em]
                text-white
              "
            >
              Create Team
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default ProjectEffortReportModule;