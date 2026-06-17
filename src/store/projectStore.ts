import { create } from 'zustand';

export interface Project {
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  progress?: string;
  deliveryStage?: string;
}

export interface Member {
  role: string;
  name: string;
  email: string;
  phone: string;
  focus?: string;
  tone?: string;
}

interface ProjectStore {
  projects: Project[];
  addProject: (p: Project) => void;
  // assignments per project name
  assignments: Record<string, Member[]>;
  addAssignment: (projectName: string, member: Member) => void;
  removeAssignment: (projectName: string, memberName: string) => void;
  setAssignmentsForProject: (projectName: string, members: Member[]) => void;
}

const initialProjects: Project[] = [
  { name: 'HRMS Portal', status: 'In Progress', startDate: '12 May 2026', endDate: '30 Jul 2026', progress: '78%', deliveryStage: 'UI Integration & QA' },
  { name: 'Payroll Sync', status: 'Review', startDate: '03 Jun 2026', endDate: '18 Aug 2026', progress: '54%', deliveryStage: 'Approval Pending' },
  { name: 'Client Reports', status: 'Ready', startDate: '19 Apr 2026', endDate: '10 Jun 2026', progress: '92%', deliveryStage: 'Final Delivery Ready' },
];

const initialAssignments: Record<string, Member[]> = {
  'HRMS Portal': [
    { role: 'Project Manager', name: 'Aarav Sharma', email: 'aarav.sharma@company.com', phone: '+91 98765 43210', focus: 'Delivery coordination and client communication', tone: 'bg-[#fff9ea] border-amber-100 text-amber-800' },
    { role: 'Lead Developer', name: 'Meera Iyer', email: 'meera.iyer@company.com', phone: '+91 91234 56789', focus: 'Frontend architecture and implementation', tone: 'bg-[#edf7ff] border-cyan-100 text-cyan-800' },
    { role: 'QA Engineer', name: 'Rohan Malik', email: 'rohan.malik@company.com', phone: '+91 99887 76655', focus: 'Testing, release validation, and bug tracking', tone: 'bg-[#effbf5] border-emerald-100 text-emerald-800' },
    { role: 'Support Lead', name: 'Nisha Verma', email: 'nisha.verma@company.com', phone: '+91 98712 34567', focus: 'Client support, escalations, and follow-up', tone: 'bg-[#fff4f8] border-pink-100 text-pink-800' },
  ],
  'Payroll Sync': [
    { role: 'Project Manager', name: 'Rahul Kumar', email: 'rahul.kumar@company.com', phone: '+91 90123 45678', focus: 'Payments integration', tone: 'bg-[#fff9ea] border-amber-100 text-amber-800' },
    { role: 'Backend Developer', name: 'Vikram Singh', email: 'vikram.singh@company.com', phone: '+91 90111 22334', focus: 'API and data sync', tone: 'bg-[#edf7ff] border-cyan-100 text-cyan-800' },
    { role: 'QA Engineer', name: 'Priya Patel', email: 'priya.patel@company.com', phone: '+91 90807 06050', focus: 'Payment flows testing', tone: 'bg-[#effbf5] border-emerald-100 text-emerald-800' },
    { role: 'Support Lead', name: 'Anjali Gupta', email: 'anjali.gupta@company.com', phone: '+91 90765 43210', focus: 'Client queries & troubleshooting', tone: 'bg-[#fff4f8] border-pink-100 text-pink-800' },
  ],
  'Client Reports': [
    { role: 'Project Manager', name: 'Sunita Rao', email: 'sunita.rao@company.com', phone: '+91 90000 11122', focus: 'Reporting requirements', tone: 'bg-[#fff9ea] border-amber-100 text-amber-800' },
    { role: 'Data Engineer', name: 'Karan Mehta', email: 'karan.mehta@company.com', phone: '+91 90011 22334', focus: 'ETL and exports', tone: 'bg-[#edf7ff] border-cyan-100 text-cyan-800' },
    { role: 'QA Engineer', name: 'Leena Das', email: 'leena.das@company.com', phone: '+91 90022 33445', focus: 'Report validation', tone: 'bg-[#effbf5] border-emerald-100 text-emerald-800' },
  ],
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: initialProjects,
  assignments: initialAssignments,
  addProject: (p: Project) => set((state) => ({ projects: [p, ...state.projects] })),
  addAssignment: (projectName: string, member: Member) => set((state) => ({ assignments: { ...state.assignments, [projectName]: [...(state.assignments[projectName] ?? []), member] } })),
  removeAssignment: (projectName: string, memberName: string) => set((state) => ({ assignments: { ...state.assignments, [projectName]: (state.assignments[projectName] ?? []).filter((m) => m.name !== memberName) } })),
  setAssignmentsForProject: (projectName: string, members: Member[]) => set((state) => ({ assignments: { ...state.assignments, [projectName]: members } })),
}));


export default useProjectStore;
