import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import DashboardNavbar from '../../components/DashboardNavbar';
import ManagerSidebar from '../../components/manager/ManagerSidebar';
import DashboardModule from './modules/dashboard';
import ProfilePage from './modules/ProfilePage';
import ApprovalsModule from './modules/Approvals';
import AttendanceModule from './modules/Attendance';
import EmployeesModule from './modules/Employee';
import AttendanceAnalyticsModule from './modules/AttendanceAnalytics';
import ProjectEffortReportModule from './modules/ProjectEffortReport';
import RegularisationRequestsModule from './modules/RegularisationRequests';
import TeamDirectoryModule from './modules/TeamDirectory';
import TeamLeaveCalendarModule from './modules/TeamLeaveCalendar';
import TaskManagerModule from './modules/TaskManager';

import { type Announcement, type Employee, type HRDetails, type Job, type LeaveData, type Policy, type RequestItem, type Training, type AttendanceStatus, type Payslip } from './managerShared';

type EmployeeFormState = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  passportNumber: string;
  uan: string;
  pfNumber: string;
  esiNumber: string;
  taxState: string;
  workMode: 'WFH' | 'Office' | 'Hybrid' | '';
  role: string;
  designation: string;
  dept: string;
  location: string;
  reportingManager: string;
  salary: string;
  experience: string;
  joiningDate: string;
  birthday: string;
  gender: string;
};

const initialAnnouncements: (Announcement & { timestamp: number })[] = [
  { id: 1, title: 'Annual Hackathon 2026 Starting Soon', tag: 'Event', time: '2h ago', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 2, title: 'New Health Insurance Policy Updated', tag: 'Update', time: '5h ago', timestamp: Date.now() - 5 * 60 * 60 * 1000 }
];

const DarkHRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  
  // State definitions
  const [activeTab, setActiveTab] = useState<'Home' | 'Approvals' | 'Regularisation' | 'Attendance' | 'AttendanceAnalytics' | 'ProjectEffortReport' | 'TeamDirectory' | 'TeamLeaveCalendar' | 'Employee' | 'TaskManager'>('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', tag: '' });
  const [profileImage, setProfileImage] = useState<string | null>(() =>
    localStorage.getItem('employeeProfileImage') || null
  );
  const [formData, setFormData] = useState<EmployeeFormState>({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    panNumber: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    branch: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    bloodGroup: '',
    maritalStatus: '',
    nationality: '',
    passportNumber: '',
    uan: '',
    pfNumber: '',
    esiNumber: '',
    taxState: '',
    workMode: '',
    role: '',
    designation: '',
    dept: '',
    location: '',
    reportingManager: '',
    salary: '',
    experience: '',
    joiningDate: '',
    birthday: '',
    gender: 'Male'
  });
  const [activePage, setActivePage] = useState<'dashboard' | 'profile'>('dashboard');
  const [employeeData] = useState({
    name: 'Rajesh Kumar',
    department: 'Operations',
    position: 'Operations Manager',
    employeeId: 'MGR-001',
    profilePicture: '',
    email: 'rajesh.kumar@company.com',
    phone: '+91-9876543290',
    experience: '8 years',
    joinDate: '2018-06-15',
    salary: 120000,
    location: 'Mumbai',
    reportingTo: 'Siddharth Jain',
    aadhaarNumber: '9876 5432 1098',
    panNumber: 'XYZ1234ABC',
    address: 'Mumbai, Maharashtra',
    designation: 'Operations Manager',
    gender: 'Male'
  });

  const hrDetails: HRDetails = {
    name: employeeData.name,
    role: employeeData.position,
    email: employeeData.email,
    phone: employeeData.phone,
    dept: employeeData.department,
    experience: employeeData.experience,
    avatar: employeeData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    gender: employeeData.gender || 'Male'
  };
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
    { id: 2, name: 'Kavya Iyer', type: 'Leave', reason: 'Medical', date: 'May 04', status: 'Pending' }
  ]);

  const [wfhRequests, setWfhRequests] = useState<RequestItem[]>([
    { id: 1, name: 'Vikram Seth', type: 'WFH', reason: 'Home Repairs', date: 'May 02', status: 'Pending' },
    { id: 3, name: 'Rahul Sharma', type: 'WFH', reason: 'Family Event', date: 'May 06', status: 'Pending' }
  ]);

  const [regularisationRequests, setRegularisationRequests] = useState<RequestItem[]>([
    { id: 4, name: 'Ananya Rao', type: 'Regularisation', reason: 'Missed punch due to client meeting', date: 'May 12', status: 'Pending' },
    { id: 5, name: 'Vikram Seth', type: 'Regularisation', reason: 'Late swipe after onsite session', date: 'May 10', status: 'Pending' }
  ]);

  const [jobs] = useState<Job[]>([
    { id: 1, title: 'Frontend Developer', dept: 'Tech', applicants: 12, status: 'Open' },
    { id: 2, title: 'UI/UX Intern', dept: 'Design', applicants: 45, status: 'Urgent' }
  ]);

  const [policies] = useState<Policy[]>([
    { id: 1, title: 'Code of Conduct', content: 'Expected behavior standards...', type: 'text', lastUpdated: '2026-04-15' },
    { id: 2, title: 'Leave Policy', content: 'Entitled leave types...', type: 'text', lastUpdated: '2026-03-20' },
    { id: 3, title: 'Remote Work Policy', content: 'Guidelines for working remotely...', type: 'pdf', lastUpdated: '2026-02-10' }
  ]);

  const generatedPayslips: Payslip[] = [
    { id: 'PS-4401', empId: 1, name: 'Shrushti Desu', month: 'April', amount: 85000, date: '2026-04-30' }
  ];

  const [leaveData, setLeaveData] = useState<LeaveData[]>([
    { id: 1, employee: 'Shrushti Desu', type: 'Casual', days: 3, startDate: '2026-05-08', status: 'Pending' },
    { id: 2, employee: 'Rahul Sharma', type: 'Sick', days: 1, startDate: '2026-05-05', status: 'Approved' }
  ]);

  // Listen for profile image updates from ProfilePage
  useEffect(() => {
    const handleProfileImageUpdate = () => {
      const updatedImage = localStorage.getItem('employeeProfileImage');
      setProfileImage(updatedImage || null);
    };

    window.addEventListener('employeeProfileImageUpdated', handleProfileImageUpdate);
    return () => {
      window.removeEventListener('employeeProfileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.toLowerCase() === '/manager/task-manager') {
      setActiveTab('TaskManager');
    }
  }, [location.pathname]);

  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    1: 'Present', 2: 'WFH', 3: 'Present', 4: 'On Leave', 5: 'Present'
  });

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
      bankName: '',
      accountNumber: '',
      ifsc: '',
      branch: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      bloodGroup: '',
      maritalStatus: '',
      nationality: '',
      passportNumber: '',
      uan: '',
      pfNumber: '',
      esiNumber: '',
      taxState: '',
      workMode: '',
      role: '',
      designation: '',
      dept: '',
      location: '',
      reportingManager: '',
      salary: '',
      experience: '',
      joiningDate: '',
      birthday: '',
      gender: 'Male'
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
      username: employee.username || '',
      password: employee.password || '',
      email: employee.email || '',
      phone: employee.phone || '',
      aadhaarNumber: employee.aadhaarNumber || '',
      panNumber: employee.panNumber || '',
      address: employee.address || '',
      bankName: employee.bankName || '',
      accountNumber: employee.accountNumber || '',
      ifsc: employee.ifsc || '',
      branch: employee.branch || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      bloodGroup: employee.bloodGroup || '',
      maritalStatus: employee.maritalStatus || '',
      nationality: employee.nationality || '',
      passportNumber: employee.passportNumber || '',
      uan: employee.uan || '',
      pfNumber: employee.pfNumber || '',
      esiNumber: employee.esiNumber || '',
      taxState: employee.taxState || '',
      workMode: employee.workMode || '',
      role: employee.role,
      designation: employee.designation || '',
      dept: employee.dept,
      location: employee.location || '',
      reportingManager: employee.reportingManager || '',
      salary: String(employee.salary),
      experience: String(employee.experience ?? 0),
      joiningDate: employee.joinDate || '',
      birthday: employee.birthday || '',
      gender: employee.gender || 'Male'
    });
    setEditingEmployeeId(employee.id);
    setIsEditingEmployee(true);
    setIsAdding(true);
  };

  const handleSaveEmployee = (
  e: FormEvent
) => {

  e.preventDefault();

  const experience =
    parseInt(
      formData.experience
    ) || 0;

  if (
    isEditingEmployee &&
    editingEmployeeId !== null
  ) {

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id ===
        editingEmployeeId
          ? {
              ...emp,

              name:
                formData.name,

              username:
                formData.username,

              password:
                formData.password,

              email:
                formData.email,

              phone:
                formData.phone,

              aadhaarNumber:
                formData.aadhaarNumber,

              panNumber:
                formData.panNumber,

              address:
                formData.address,

              workMode:
                formData.workMode,

              bankName:
                formData.bankName,

              accountNumber:
                formData.accountNumber,

              ifsc:
                formData.ifsc,

              branch:
                formData.branch,

              emergencyContactName:
                formData.emergencyContactName,

              emergencyContactPhone:
                formData.emergencyContactPhone,

              bloodGroup:
                formData.bloodGroup,

              maritalStatus:
                formData.maritalStatus,

              nationality:
                formData.nationality,

              passportNumber:
                formData.passportNumber,

              uan:
                formData.uan,

              pfNumber:
                formData.pfNumber,

              esiNumber:
                formData.esiNumber,

              taxState:
                formData.taxState,

              role:
                formData.role,

              designation:
                formData.designation,

              dept:
                formData.dept,

              location:
                formData.location,

              reportingManager:
                formData.reportingManager,

              salary:
                parseInt(
                  formData.salary
                ) || 0,

              experience,

              joinDate:
                formData.joiningDate,

              birthday:
                formData.birthday,

              gender: formData.gender || 'Male',
            }
          : emp
      )
    );

  } else {

    const newEmployee: Employee = {

      id:
        employees.length + 1,

      employeeId: `EMP-${
        employees.length + 1
      }`,

      name:
        formData.name,

      username:
        formData.username,

      password:
        formData.password,

      email:
        formData.email,

      phone:
        formData.phone,

      aadhaarNumber:
        formData.aadhaarNumber,

      panNumber:
        formData.panNumber,

      address:
        formData.address,

      workMode:
        formData.workMode,

      bankName:
        formData.bankName,

      accountNumber:
        formData.accountNumber,

      ifsc:
        formData.ifsc,

      branch:
        formData.branch,

      emergencyContactName:
        formData.emergencyContactName,

      emergencyContactPhone:
        formData.emergencyContactPhone,

      bloodGroup:
        formData.bloodGroup,

      maritalStatus:
        formData.maritalStatus,

      nationality:
        formData.nationality,

      passportNumber:
        formData.passportNumber,

      uan:
        formData.uan,

      pfNumber:
        formData.pfNumber,

      esiNumber:
        formData.esiNumber,

      taxState:
        formData.taxState,

      role:
        formData.role,

      designation:
        formData.designation,

      dept:
        formData.dept,

      location:
        formData.location,

      reportingManager:
        formData.reportingManager,

      salary:
        parseInt(
          formData.salary
        ) || 0,

      experience,

      gender: formData.gender || 'Male',

      isMVP: false,

      joinDate:
        formData.joiningDate,

      birthday:
        formData.birthday,

      performance:
        'Good',

      rating: 4,
    };

    setEmployees((prev) => [
      ...prev,
      newEmployee,
    ]);

    alert(
      `Employee created successfully!

Credentials sent to:
${formData.email}`
    );
  }

  setIsAdding(false);

  resetEmployeeForm();
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

  return (
    <div
  className="
    flex
    h-screen
    w-full
    overflow-hidden
    font-sans
    relative
    p-5
    md:p-6

    bg-[#081a4a]

    text-slate-100
  "
>
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

      <ManagerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        onTaskManagerClick={() => navigate('/manager/task-manager')}
      />

      <main
  className={`
    flex-1
    flex
    flex-col
    relative
    z-10
    overflow-hidden
    px-3
    pb-6
    pt-3
    transition-all
    duration-300
    min-w-0

    ${
      sidebarOpen
        ? 'ml-[292px]'
        : 'ml-[140px]'
    }
  `}
>
        <DashboardNavbar
          subtitle="Manage operations and team updates."
          title={
            activeTab === 'Home'
              ? 'Dashboard'
              : activeTab === 'Employee'
              ? 'Employees'
              : activeTab === 'Approvals'
              ? 'Approvals'
              : activeTab === 'Regularisation'
              ? 'Regularisation'
              : activeTab === 'Attendance'
              ? 'Attendance'
              : activeTab === 'AttendanceAnalytics'
              ? 'Analytics'
              : activeTab === 'ProjectEffortReport'
              ? 'Project Report'
              : activeTab === 'TeamDirectory'
              ? 'Team Directory'
              : activeTab === 'TaskManager'
              ? 'Task Manager'
              : 'Leave Calendar'
          }
          roleLabel="Manager"
          rightContent={undefined}
        />

       <div
  className="
    flex-1
    overflow-x-auto
    overflow-y-auto
    hide-scrollbar
    min-w-0
    pr-2
  "
>
          {activeTab === 'Home' && activePage === 'profile' && (
            <ProfilePage
              hrDetails={hrDetails}
              profileImage={profileImage}
              handleProfileUpload={handleProfileUpload}
              setActivePage={setActivePage}
            />
          )}
          {activeTab === 'Home' && activePage === 'dashboard' && (
            <DashboardModule
              setActivePage={setActivePage}
              hrDetails={hrDetails}
              profileImage={profileImage || ''}
              employees={employees}
              attendanceStatus={attendanceStatus}
              leaveData={leaveData}
              announcements={announcements}
              showProfileModal={showProfileModal}
              setShowProfileModal={setShowProfileModal}
              handleProfileUpload={(e) => {
                if (e.target.files?.[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setProfileImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              announcementForm={announcementForm}
              setAnnouncementForm={setAnnouncementForm}
              requests={requests}
              setRequests={setRequests}
              wfhRequests={wfhRequests}
              setWfhRequests={setWfhRequests}
              jobs={jobs}
              trainings={trainings}
              generatedPayslips={generatedPayslips}
              policies={policies}
              setIsAnnouncementModalOpen={setIsAnnouncementModalOpen}
              isAnnouncementModalOpen={isAnnouncementModalOpen}
              handleAddAnnouncement={handleAddAnnouncement}
              getTimeAgo={(timestamp: number) => {
                const now = Date.now();
                const diff = now - timestamp;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                if (minutes < 60) return `${minutes}m ago`;
                if (hours < 24) return `${hours}h ago`;
                return `${days}d ago`;
              }}
            />
          )}
          {activeTab === 'Approvals' && (
            <ApprovalsModule
              leaveData={leaveData}
              setLeaveData={setLeaveData}
              wfhRequests={wfhRequests}
              setWfhRequests={setWfhRequests}
            />
          )}
          {activeTab === 'Regularisation' && (
            <RegularisationRequestsModule
              regularisationRequests={regularisationRequests}
              setRegularisationRequests={setRegularisationRequests}
            />
          )}
          {activeTab === 'Attendance' && <AttendanceModule employees={employees} attendanceStatus={attendanceStatus} setAttendanceStatus={setAttendanceStatus} />}
          {activeTab === 'AttendanceAnalytics' && <AttendanceAnalyticsModule />}
          {activeTab === 'ProjectEffortReport' && (
  <ProjectEffortReportModule
    employees={employees}
  />
)}
          {activeTab === 'TeamDirectory' && <TeamDirectoryModule employees={employees} />}
          {activeTab === 'TeamLeaveCalendar' && (
  <TeamLeaveCalendarModule
    leaveData={leaveData}
    employees={employees}
    attendanceStatus={attendanceStatus}
  />
)}
          {activeTab === 'TaskManager' && <TaskManagerModule />}
          {activeTab === 'Employee' && (
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
        </div>
      </main>
    </div>
  );
};

export default DarkHRDashboard;