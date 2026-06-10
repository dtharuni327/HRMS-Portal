import React, { useState, type ReactNode, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DashboardNavbar from '../../components/DashboardNavbar';
import { Home, Users, Search, ClipboardList, Calendar, FileText, UserPlus, BookOpen, FileBarChart, Network, Briefcase, LogOut } from 'lucide-react';
import DashboardModule from './modules/dashboard';
import ProfilePage from './modules/ProfilePage';
import EmployeesModule from './modules/Employees';
import AttendanceModule from './modules/Attendance';
import LeaveModule from './modules/Approvals';
import TaskManager from './modules/TaskManager';
import PayrollModule from './modules/Payroll';
import RecruitmentModule from './modules/Recruitment';
import DocumentsModule from './modules/Documents';
import ReportsModule from './modules/Reports';
import OrganisationModule from './modules/Organisation';
import PoliciesModule from './modules/Policies';

import { type Announcement, type Employee, type HRDetails, type Job, type LeaveData, type Policy, type RequestItem, type Training, type OnboardingEntry, type HRDocument, type AttendanceStatus, type Payslip } from './hrShared';

interface SidebarIconProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isLogout?: boolean;
}

const initialAnnouncements: (Announcement & { timestamp: number })[] = [
  { id: 1, title: 'Annual Hackathon 2026 Starting Soon', tag: 'Event', time: '2h ago', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 2, title: 'New Health Insurance Policy Updated', tag: 'Update', time: '5h ago', timestamp: Date.now() - 5 * 60 * 60 * 1000 }
];

const DarkHRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  // State definitions
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Employees' | 'Tasks' | 'Attendance' | 'Leave' | 'Payroll' | 'Recruitment' | 'Documents' | 'Reports' | 'Organization'>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingReport, setIsAddingReport] = useState(false);
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', tag: '' });
  const [reportForm, setReportForm] = useState({ name: '' });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [policyForm, setPolicyForm] = useState({ title: '', content: '', file: null as File | null, type: 'text' as 'text' | 'pdf' });
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    panNumber: '',
    address: '',
    role: '',
    designation: '',
    dept: '',
    location: '',
    reportingManager: '',
    salary: '',
    experience: '',
    joiningDate: '',
    birthday: ''
  });
  const [onboardingForm, setOnboardingForm] = useState({ name: '', role: '', dept: '', startDate: '', manager: '' });
  const [isAddingOnboard, setIsAddingOnboard] = useState(false);
  const [onboardingEntries, setOnboardingEntries] = useState<OnboardingEntry[]>([
    { id: 1, name: 'Meera Nair', role: 'HR Executive', dept: 'Admin', startDate: '2026-06-01', manager: 'Priya Singh', status: 'Pending' },
    { id: 2, name: 'Aarav Joshi', role: 'Backend Developer', dept: 'Tech', startDate: '2026-06-10', manager: 'Rahul Sharma', status: 'Pending' },
  ]);
  const [documents, setDocuments] = useState<HRDocument[]>([
    { id: 1, name: 'Offer Letter - Meera Nair.pdf', type: 'pdf', uploadedBy: 'Shrushti Desu', uploadedAt: '2026-05-15', employeeId: 10 },
    { id: 2, name: 'NDA - Aarav Joshi.pdf', type: 'pdf', uploadedBy: 'Shrushti Desu', uploadedAt: '2026-05-16', employeeId: 2 },
  ]);
  
  const [trainings] = useState<Training[]>([
    { id: 1, title: 'Leadership Essentials', instructor: 'Maya Singh', enrollees: 24, status: 'Upcoming', completion: 0 },
    { id: 2, title: 'Advanced Excel', instructor: 'Rohan Patel', enrollees: 18, status: 'Active', completion: 45 },
    { id: 3, title: 'Workplace Wellness', instructor: 'Anjali Mehta', enrollees: 30, status: 'Completed', completion: 100 }
  ]);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<(Announcement & { timestamp: number })[]>(initialAnnouncements);

  const [employees, setEmployees] = useState<Employee[]>([
  {
    id: 1,
    name: 'Shrushti Desu',
    role: 'Software Engineer',
    dept: 'Technology',
    salary: 85000,
    experience: 4,
    isMVP: true,
    joinDate: '2022-01-15',
    birthday: '1994-01-15',
    email: 'shrushti.desu@company.com',
    phone: '+91-9876543210',
    aadhaarNumber: '1234 5678 9012',
    panNumber: 'ABCDE1234F',
    address: 'Mumbai, Maharashtra',
    designation: 'Software Engineer',
    location: 'Mumbai',
    reportingManager: 'Rahul Sharma'
  },
  {
    id: 2,
    name: 'Ananya Rao',
    role: 'UI/UX Designer',
    dept: 'Technology',
    salary: 72000,
    experience: 3,
    isMVP: false,
    joinDate: '2022-06-20',
    birthday: '1995-06-01',
    email: 'ananya.rao@company.com',
    phone: '+91-9876543211',
    aadhaarNumber: '1234 5678 9013',
    panNumber: 'ABCDE1234G',
    address: 'Bangalore, Karnataka',
    designation: 'UI/UX Designer',
    location: 'Bangalore',
    reportingManager: 'Rahul Sharma'
  },
  {
    id: 3,
    name: 'Rahul Sharma',
    role: 'Technical Lead',
    dept: 'Technology',
    salary: 95000,
    experience: 6,
    isMVP: false,
    joinDate: '2021-03-10',
    birthday: '1991-03-10',
    email: 'rahul.sharma@company.com',
    phone: '+91-9876543212',
    aadhaarNumber: '1234 5678 9014',
    panNumber: 'ABCDE1234H',
    address: 'Pune, Maharashtra',
    designation: 'Technical Lead',
    location: 'Pune',
    reportingManager: 'Siddharth Jain'
  },
  {
    id: 4,
    name: 'Priya Singh',
    role: 'HR Manager',
    dept: 'Human Resources',
    salary: 65000,
    experience: 7,
    isMVP: false,
    joinDate: '2020-11-05',
    birthday: '1990-11-05',
    email: 'priya.singh@company.com',
    phone: '+91-9876543213',
    aadhaarNumber: '1234 5678 9015',
    panNumber: 'ABCDE1234I',
    address: 'Delhi, Delhi',
    designation: 'HR Manager',
    location: 'Delhi',
    reportingManager: 'Siddharth Jain'
  },
  {
    id: 5,
    name: 'Vikram Seth',
    role: 'Data Engineer',
    dept: 'Technology',
    salary: 78000,
    experience: 2,
    isMVP: false,
    joinDate: '2022-04-12',
    birthday: '1993-04-12',
    email: 'vikram.seth@company.com',
    phone: '+91-9876543214',
    aadhaarNumber: '1234 5678 9016',
    panNumber: 'ABCDE1234J',
    address: 'Hyderabad, Telangana',
    designation: 'Data Engineer',
    location: 'Hyderabad',
    reportingManager: 'Rahul Sharma'
  },
  {
    id: 6,
    name: 'Kavya Iyer',
    role: 'Frontend Developer',
    dept: 'Technology',
    salary: 80000,
    experience: 1,
    isMVP: true,
    joinDate: '2023-02-18',
    birthday: '1998-02-18',
    email: 'kavya.iyer@company.com',
    phone: '+91-9876543215',
    aadhaarNumber: '1234 5678 9017',
    panNumber: 'ABCDE1234K',
    address: 'Chennai, Tamil Nadu',
    designation: 'Frontend Developer',
    location: 'Chennai',
    reportingManager: 'Shrushti Desu'
  },
  {
    id: 7,
    name: 'Arjun Mehta',
    role: 'Backend Developer',
    dept: 'Technology',
    salary: 87000,
    experience: 3,
    isMVP: false,
    joinDate: '2022-08-10',
    birthday: '1996-08-10',
    email: 'arjun.mehta@company.com',
    phone: '+91-9876543216',
    aadhaarNumber: '1234 5678 9018',
    panNumber: 'ABCDE1234L',
    address: 'Ahmedabad, Gujarat',
    designation: 'Backend Developer',
    location: 'Ahmedabad',
    reportingManager: 'Shrushti Desu'
  },
  {
    id: 8,
    name: 'Sneha Patel',
    role: 'UI/UX Designer',
    dept: 'Technology',
    salary: 70000,
    experience: 2,
    isMVP: false,
    joinDate: '2021-09-25',
    birthday: '1997-09-25',
    email: 'sneha.patel@company.com',
    phone: '+91-9876543217',
    aadhaarNumber: '1234 5678 9019',
    panNumber: 'ABCDE1234M',
    address: 'Surat, Gujarat',
    designation: 'UI/UX Designer',
    location: 'Surat',
    reportingManager: 'Ananya Rao'
  },
  {
    id: 9,
    name: 'Rohit Kumar',
    role: 'QA Engineer / Tester',
    dept: 'Technology',
    salary: 68000,
    experience: 5,
    isMVP: false,
    joinDate: '2020-12-30',
    birthday: '1992-12-30',
    email: 'rohit.kumar@company.com',
    phone: '+91-9876543218',
    aadhaarNumber: '1234 5678 9020',
    panNumber: 'ABCDE1234N',
    address: 'Jaipur, Rajasthan',
    designation: 'QA Engineer',
    location: 'Jaipur',
    reportingManager: 'Rahul Sharma'
  },
  {
    id: 10,
    name: 'Meera Nair',
    role: 'HR Executive',
    dept: 'Human Resources',
    salary: 60000,
    experience: 0,
    isMVP: false,
    joinDate: '2023-01-05',
    birthday: '1999-01-05',
    email: 'meera.nair@company.com',
    phone: '+91-9876543219',
    aadhaarNumber: '1234 5678 9021',
    panNumber: 'ABCDE1234O',
    address: 'Cochin, Kerala',
    designation: 'HR Executive',
    location: 'Cochin',
    reportingManager: 'Priya Singh'
  },
  {
    id: 11,
    name: 'Siddharth Jain',
    role: 'Director',
    dept: 'Management',
    salary: 98000,
    experience: 4,
    isMVP: false,
    joinDate: '2021-07-14',
    birthday: '1989-07-14',
    email: 'siddharth.jain@company.com',
    phone: '+91-9876543220',
    aadhaarNumber: '1234 5678 9022',
    panNumber: 'ABCDE1234P',
    address: 'Noida, Uttar Pradesh',
    designation: 'Director',
    location: 'Noida',
    reportingManager: 'Board of Directors'
  },
  {
    id: 12,
    name: 'Pooja Reddy',
    role: 'Recruiter',
    dept: 'Human Resources',
    salary: 62000,
    experience: 1,
    isMVP: false,
    joinDate: '2022-03-22',
    birthday: '1998-03-22',
    email: 'pooja.reddy@company.com',
    phone: '+91-9876543221',
    aadhaarNumber: '1234 5678 9023',
    panNumber: 'ABCDE1234Q',
    address: 'Visakhapatnam, Andhra Pradesh',
    designation: 'Recruiter',
    location: 'Visakhapatnam',
    reportingManager: 'Priya Singh'
  },
  {
    id: 13,
    name: 'Karthik Reddy',
    role: 'Full Stack Developer',
    dept: 'Technology',
    salary: 92000,
    experience: 5,
    isMVP: true,
    joinDate: '2021-05-19',
    birthday: '1993-05-19',
    email: 'karthik.reddy@company.com',
    phone: '+91-9876543222',
    aadhaarNumber: '1234 5678 9024',
    panNumber: 'ABCDE1234R',
    address: 'Secunderabad, Telangana',
    designation: 'Full Stack Developer',
    location: 'Secunderabad',
    reportingManager: 'Shrushti Desu'
  },
  {
    id: 14,
    name: 'Aisha Khan',
    role: 'Business Operations Associate',
    dept: 'Operations',
    salary: 75000,
    experience: 2,
    isMVP: false,
    joinDate: '2022-11-11',
    birthday: '1996-11-11',
    email: 'aisha.khan@company.com',
    phone: '+91-9876543223',
    aadhaarNumber: '1234 5678 9025',
    panNumber: 'ABCDE1234S',
    address: 'Lucknow, Uttar Pradesh',
    designation: 'Business Operations Associate',
    location: 'Lucknow',
    reportingManager: 'Siddharth Jain'
  },
  {
    id: 15,
    name: 'Nikhil Verma',
    role: 'System Administrator',
    dept: 'Technology',
    salary: 83000,
    experience: 6,
    isMVP: false,
    joinDate: '2020-08-27',
    birthday: '1990-08-27',
    email: 'nikhil.verma@company.com',
    phone: '+91-9876543224',
    aadhaarNumber: '1234 5678 9026',
    panNumber: 'ABCDE1234T',
    address: 'Indore, Madhya Pradesh',
    designation: 'System Administrator',
    location: 'Indore',
    reportingManager: 'Rahul Sharma'
  }
]);

  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 2, name: 'Kavya Iyer', type: 'Leave', reason: 'Medical', date: 'May 04' }
  ]);

  const [wfhRequests, setWfhRequests] = useState<RequestItem[]>([
    { id: 1, name: 'Vikram Seth', type: 'WFH', reason: 'Home Repairs', date: 'May 02' },
    { id: 3, name: 'Rahul Sharma', type: 'WFH', reason: 'Family Event', date: 'May 06' }
  ]);

  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, title: 'Frontend Developer', dept: 'Tech', applicants: 12, status: 'Open' },
    { id: 2, title: 'UI/UX Intern', dept: 'Design', applicants: 45, status: 'Urgent' }
  ]);

  const [reports, setReports] = useState<string[]>([
    'Payroll_April_26.pdf', 'Performance_Review_Q1.pdf', 'Audit_Log_Security.csv'
  ]);

  const [policies, setPolicies] = useState<Policy[]>([
    { id: 1, title: 'Code of Conduct', content: 'Expected behavior standards...', type: 'text', lastUpdated: '2026-04-15' },
    { id: 2, title: 'Leave Policy', content: 'Entitled leave types...', type: 'text', lastUpdated: '2026-03-20' },
    { id: 3, title: 'Remote Work Policy', content: 'Guidelines for working remotely...', type: 'pdf', lastUpdated: '2026-02-10' }
  ]);

  const generatedPayslips: Payslip[] = [
    { id: 'PS-4401', empId: 1, name: 'Shrushti Desu', month: 'April', amount: 85000, date: '2026-04-30' }
  ];

  const [leaveData, setLeaveData] = useState<LeaveData[]>([
    { id: 1, employee: 'Shrushti Desu', type: 'Casual', days: 3, startDate: '2026-05-08', endDate: '2026-05-10', reason: 'Medical appointment', status: 'Pending' },
    { id: 2, employee: 'Rahul Sharma', type: 'Sick', days: 1, startDate: '2026-05-05', endDate: '2026-05-05', reason: 'Fever recovery', status: 'Approved' },
    { id: 3, employee: 'Ankita Rao', type: 'Casual', days: 2, startDate: '2026-05-15', endDate: '2026-05-16', reason: 'Family event', status: 'Pending' },
    { id: 4, employee: 'Sameer Patel', type: 'Annual', days: 5, startDate: '2026-06-01', endDate: '2026-06-05', reason: 'Vacation', status: 'Approved' }
  ]);

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    1: 'Present', 2: 'WFH', 3: 'Present', 4: 'On Leave', 5: 'Present'
  });

  const hrDetails: HRDetails = {
    name: 'Shrushti Desu',
    role: 'HR Manager',
    email: 'shrushti.desu@company.com',
    phone: '+91 98765 43210',
    dept: 'Human Resources',
    experience: '4 years',
    avatar: 'SD',
    gender: 'Female'
  };

  // Handlers
  const resetEmployeeForm = () => {
    setFormData({
      name: '',
      username: '',
      password: '',
      email: '',
      phone: '',
      aadhaarNumber: '',
      panNumber: '',
      address: '',
      role: '',
      designation: '',
      dept: '',
      location: '',
      reportingManager: '',
      salary: '',
      experience: '',
      joiningDate: '',
      birthday: ''
    });
    setIsEditingEmployee(false);
    setEditingEmployeeId(null);
  };

  const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const startEditEmployee = (employee: Employee) => {
    setFormData({
      name: employee.name,
      username: employee.username ?? '',
      password: employee.password ?? '',
      email: employee.email ?? '',
      phone: employee.phone ?? '',
      aadhaarNumber: employee.aadhaarNumber ?? '',
      panNumber: employee.panNumber ?? '',
      address: employee.address ?? '',
      role: employee.role,
      designation: employee.designation ?? '',
      dept: employee.dept,
      location: employee.location ?? '',
      reportingManager: employee.reportingManager ?? '',
      salary: String(employee.salary),
      experience: String(employee.experience ?? 0),
      joiningDate: employee.joinDate ?? '',
      birthday: employee.birthday ?? ''
    });
    setEditingEmployeeId(employee.id);
    setIsEditingEmployee(true);
    setIsAdding(true);
  };

  const handleSaveEmployee = (e: FormEvent) => {
    e.preventDefault();
    const experience = parseInt(formData.experience) || 0;
    if (isEditingEmployee && editingEmployeeId !== null) {
      setEmployees(prev => prev.map(emp => emp.id === editingEmployeeId ? {
        ...emp,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        address: formData.address,
        role: formData.role,
        designation: formData.designation,
        dept: formData.dept,
        location: formData.location,
        reportingManager: formData.reportingManager,
        salary: parseInt(formData.salary) || 0,
        experience,
        joinDate: formData.joiningDate || emp.joinDate,
        birthday: formData.birthday || emp.birthday
      } : emp));
    } else {
      setEmployees(prev => [...prev, {
        id: prev.length + 1,
        employeeId: `EMP-${String(prev.length + 1).padStart(3, '0')}`,
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        address: formData.address,
        role: formData.role,
        designation: formData.designation,
        dept: formData.dept,
        location: formData.location,
        reportingManager: formData.reportingManager,
        salary: parseInt(formData.salary) || 0,
        experience,
        isMVP: false,
        joinDate: formData.joiningDate || new Date().toISOString().split('T')[0],
        birthday: formData.birthday
      }]);
    }
    setIsAdding(false);
    resetEmployeeForm();
  };

  const handleAddReport = (e: FormEvent) => {
    e.preventDefault();
    if (reportForm.name.trim()) {
      setReports(prev => [`${reportForm.name}.pdf`, ...prev]);
      setReportForm({ name: '' });
      setIsAddingReport(false);
    }
  };

  const handleAddPolicy = (e: FormEvent) => {
    e.preventDefault();
    if (!policyForm.title || !policyForm.content) return;
    setPolicies(prev => [{
      id: Math.max(...prev.map(p => p.id), 0) + 1,
      title: policyForm.title,
      content: policyForm.content,
      type: policyForm.type,
      lastUpdated: new Date().toISOString().split('T')[0]
    }, ...prev]);
    setPolicyForm({ title: '', content: '', file: null, type: 'text' });
    setIsAddingPolicy(false);
  };

  const handleAddOnboarding = (e: FormEvent) => {
    e.preventDefault();
    const newEntry: OnboardingEntry = {
      id: onboardingEntries.length + 1,
      name: onboardingForm.name,
      role: onboardingForm.role,
      dept: onboardingForm.dept,
      startDate: onboardingForm.startDate,
      manager: onboardingForm.manager,
      status: 'Pending',
    };

    setOnboardingEntries((prev) => [newEntry, ...prev]);
    setEmployees((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: onboardingForm.name,
        role: onboardingForm.role,
        dept: onboardingForm.dept,
        salary: 0,
        experience: 0,
        isMVP: false,
        joinDate: onboardingForm.startDate,
      },
    ]);
    setOnboardingForm({ name: '', role: '', dept: '', startDate: '', manager: '' });
    setIsAddingOnboard(false);
  };

  const handleUploadDocument = (employeeId: number, file: File) => {
    setDocuments((prev) => [
      {
        id: prev.length + 1,
        name: file.name,
        type: file.type,
        uploadedBy: hrDetails.name,
        uploadedAt: new Date().toLocaleDateString('en-GB'),
        employeeId,
      },
      ...prev,
    ]);
  };

  const handleMarkOnboarded = (id: number) => {
    setOnboardingEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: 'Onboarded' } : entry
      )
    );
  };

  const handleMarkOffboarded = (id: number) => {
    setOnboardingEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: 'Offboarded' } : entry
      )
    );
  };

  const handleAddAnnouncement = () => {
    if (!announcementForm.title.trim()) return;
    setAnnouncements(prev => [{
      id: Math.max(...prev.map(a => a.id), 0) + 1,
      title: announcementForm.title,
      tag: announcementForm.tag || 'General',
      time: 'just now',
      timestamp: Date.now()
    }, ...prev]);
    setAnnouncementForm({ title: '', tag: '' });
    setIsAnnouncementModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const [activePage, setActivePage] = useState<'dashboard' | 'profile'>('dashboard');

  const performanceData = [
    { dept: 'Tech', rating: 4.5 }, { dept: 'Design', rating: 4.2 }, { dept: 'HR', rating: 4.8 }, { dept: 'Admin', rating: 4.0 }
  ];

  return (
    <div
  className="
    flex
    h-screen
    w-full
    overflow-hidden
    font-sans
    relative
    p-4

    bg-gradient-to-br
    from-[#081a4a]
    via-[#11286d]
    to-[#05112b]

    text-slate-100
  "
>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <aside
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
        className={`group/sidebar fixed inset-y-5 left-5 z-50 overflow-hidden rounded-[2.2rem] border border-[#203a72] bg-gradient-to-b from-[#071b44] via-[#081d45] to-[#061738] py-4 px-3 shadow-[0_25px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out backdrop-blur-xl ${sidebarOpen ? 'w-[250px]' : 'w-[96px]'}`}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] bg-[linear-gradient(to_bottom,rgba(59,130,246,0.08),transparent_18%,transparent_82%,rgba(168,85,247,0.06))]" />
        <div className="relative z-10 flex h-full flex-col">
          <nav className="flex flex-1 flex-col gap-1.5 pt-1 min-h-0 overflow-hidden">
            <SidebarIcon icon={<Home size={20} />} label="Home" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')}/>
            <SidebarIcon icon={<Users size={20} />} label="Employees" active={activeTab === 'Employees'} onClick={() => setActiveTab('Employees')} />
            <SidebarIcon icon={<Briefcase size={20} />} label="Task Manager" active={activeTab === 'Tasks'} onClick={() => setActiveTab('Tasks')} />
            <SidebarIcon icon={<ClipboardList size={20} />} label="Attendance" active={activeTab === 'Attendance'} onClick={() => setActiveTab('Attendance')} />
            <SidebarIcon icon={<Calendar size={20} />} label="Approvals" active={activeTab === 'Leave'} onClick={() => setActiveTab('Leave')} />
            <SidebarIcon icon={<FileText size={20} />} label="Payroll" active={activeTab === 'Payroll'} onClick={() => setActiveTab('Payroll')} />
            <SidebarIcon icon={<UserPlus size={20} />} label="Recruitment" active={activeTab === 'Recruitment'} onClick={() => setActiveTab('Recruitment')} />
            <SidebarIcon icon={<BookOpen size={20} />} label="Documents" active={activeTab === 'Documents'} onClick={() => setActiveTab('Documents')} />
            <SidebarIcon icon={<FileBarChart size={20} />} label="Reports & Policies" active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
            <SidebarIcon icon={<Network size={20} />} label="Organization" active={activeTab === 'Organization'} onClick={() => setActiveTab('Organization')} />
          </nav>
          {/* LOGOUT SECTION */}
<div
  className="
    mt-3
    pt-3
    pb-1
    border-t
    border-white/10
  "
>

  <button
    onClick={handleLogout}
    className="
      relative
      flex
      h-[56px]
      w-full
      items-center
      rounded-[1.4rem]
      transition-all
      duration-300

      justify-center
      group-hover/sidebar:justify-start

      px-0
      group-hover/sidebar:px-[18px]

      text-[#7dd3fc]
      hover:bg-white/5
    "
  >

    {/* ICON */}
    <div
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        shrink-0
      "
    >
      <LogOut size={20} />
    </div>

    {/* TEXT */}
    <span
      className="
        whitespace-nowrap
        text-[15px]
        font-semibold
        tracking-wide

        opacity-0
        w-0

        transition-all
        duration-300

        overflow-hidden

        group-hover/sidebar:opacity-100
        group-hover/sidebar:w-auto
        group-hover/sidebar:ml-3
      "
    >
      SIGN OUT
    </span>

  </button>

</div>
        </div>
      </aside>

      <main className={`flex-1 flex flex-col relative z-10 overflow-visible transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[132px]'}`}>
        <DashboardNavbar
          title={activeTab === 'Dashboard' ? 'HR Dashboard' : activeTab === 'Tasks' ? 'Task Manager' : activeTab === 'Leave' ? 'Approvals' : activeTab === 'Documents' ? 'Documents' : activeTab}
          subtitle="Manage documents."
          roleLabel="HR Manager"
          rightContent={
            activeTab === 'Employees' ? (
              <div className="relative w-full max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={staffSearch}
                  onChange={e => setStaffSearch(e.target.value)}
                  placeholder="Quick search..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs outline-none focus:border-cyan-500 transition-all text-white"
                />
              </div>
            ) : undefined
          }
        />

        <div className="flex-1 overflow-x-visible overflow-y-auto hide-scrollbar">
          {activeTab === 'Dashboard' && activePage === 'dashboard' && (
  <DashboardModule
    setActivePage={setActivePage}
    hrDetails={hrDetails}
    profileImage={profileImage}
    showProfileModal={showProfileModal}
    setShowProfileModal={setShowProfileModal}
    handleProfileUpload={handleProfileUpload}
    announcements={announcements}
    announcementForm={announcementForm}
    setAnnouncementForm={setAnnouncementForm}
    requests={requests}
    setRequests={setRequests}
    wfhRequests={wfhRequests}
    setWfhRequests={setWfhRequests}
    employees={employees}
    attendanceStatus={attendanceStatus}
    jobs={jobs}
    trainings={trainings}
    generatedPayslips={generatedPayslips}
    policies={policies}
    leaveData={leaveData}
    setIsAnnouncementModalOpen={setIsAnnouncementModalOpen}
    isAnnouncementModalOpen={isAnnouncementModalOpen}
    handleAddAnnouncement={handleAddAnnouncement}
    getTimeAgo={(timestamp: number) => {
      const diff = Date.now() - timestamp;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(diff / (1000 * 60));
      if (hours > 0) return `${hours}h ago`;
      if (minutes > 0) return `${minutes}m ago`;
      return 'just now';
    }}
  />
)}

{activePage === 'profile' && (
  <ProfilePage
    hrDetails={hrDetails}
    profileImage={profileImage}
    handleProfileUpload={handleProfileUpload}
    setActivePage={setActivePage}
  />
)}
          {activeTab === 'Employees' && (
            <EmployeesModule
              employees={employees}
              setEmployees={setEmployees}
              staffSearch={staffSearch}
              setStaffSearch={setStaffSearch}
              isAdding={isAdding}
              setIsAdding={setIsAdding}
              formData={formData}
              setFormData={setFormData}
              handleSaveEmployee={handleSaveEmployee}
              startEditEmployee={startEditEmployee}
            />
          )}
          {activeTab === 'Attendance' && <AttendanceModule employees={employees} attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus} />}
          {activeTab === 'Leave' && <LeaveModule leaveData={leaveData} setLeaveData={setLeaveData} wfhRequests={wfhRequests} setWfhRequests={setWfhRequests} />}
          {activeTab === 'Payroll' && <PayrollModule />}
          {activeTab === 'Recruitment' && <RecruitmentModule jobs={jobs} setJobs={setJobs} />}
          {activeTab === 'Tasks' && <TaskManager />}
          {activeTab === 'Documents' && <DocumentsModule employees={employees} onboardingEntries={onboardingEntries} setOnboardingEntries={setOnboardingEntries} documents={documents} setDocuments={setDocuments} isAddingOnboard={isAddingOnboard} setIsAddingOnboard={setIsAddingOnboard} onboardingForm={onboardingForm} setOnboardingForm={setOnboardingForm} handleAddOnboarding={handleAddOnboarding} handleUploadDocument={handleUploadDocument} handleMarkOnboarded={handleMarkOnboarded} handleMarkOffboarded={handleMarkOffboarded} />}
          {activeTab === 'Reports' && (
            <div className="space-y-6">
              <ReportsModule
                reports={reports}
                isAddingReport={isAddingReport}
                setIsAddingReport={setIsAddingReport}
                reportForm={reportForm}
                setReportForm={setReportForm}
                handleAddReport={handleAddReport}
                performanceData={performanceData}
              />
              <PoliciesModule
                policies={policies}
                setPolicies={setPolicies}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isAddingPolicy={isAddingPolicy}
                setIsAddingPolicy={setIsAddingPolicy}
                policyForm={policyForm}
                setPolicyForm={setPolicyForm}
                handleAddPolicy={handleAddPolicy}
                selectedPolicy={selectedPolicy}
                setSelectedPolicy={setSelectedPolicy}
              />
            </div>
          )}
          {activeTab === 'Organization' && <OrganisationModule employees={employees} />}
        </div>
      </main>
    </div>
  );
};

const SidebarIcon: React.FC<SidebarIconProps> = ({ icon, label, active, onClick, isLogout }) => (
  <button
    onClick={onClick}
    className={`relative flex h-[58px] w-full items-center justify-center rounded-[1.4rem] transition-all duration-300 group-hover/sidebar:justify-start group-hover/sidebar:px-[18px] ${active ? 'bg-gradient-to-r from-[#5a4bc7] to-[#4b3f99] text-white shadow-[0_10px_30px_rgba(91,75,199,0.35)]' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${isLogout ? 'hover:text-rose-400 hover:bg-rose-500/10' : ''}`}
  >
    <div
      className={`absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center transition-all duration-300 group-hover/sidebar:left-[18px] group-hover/sidebar:translate-x-0 ${active ? 'text-[#7dd3fc]' : 'text-slate-400 group-hover/sidebar:text-white'}`}
    >
      {icon}
    </div>
    <span className="ml-[62px] whitespace-nowrap text-[15px] font-semibold tracking-wide opacity-0 transition-all duration-300 group-hover/sidebar:opacity-100">
      {label}
    </span>
    {active && <div className="absolute left-0 w-1 h-6 bg-gradient-to-b from-[#f5d0fe] via-[#c084fc] to-[#a855f7] rounded-r-full shadow-[0_0_12px_rgba(192,132,252,0.9)]" />}
  </button>
);

export default DarkHRDashboard;