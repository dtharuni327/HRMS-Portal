import React, { useState, useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import DashboardNavbar from '../../../components/DashboardNavbar';
import ManagerSidebar from '../../../components/manager/ManagerSidebar';
import DashboardModule from './dashboard.tsx';
import ProfilePage from './ProfilePage';
import ApprovalsModule from './Approvals';
import AttendanceModule from './Attendance';
import EmployeesModule from './Employee';
import AttendanceAnalyticsModule from './AttendanceAnalytics';
import ProjectEffortReportModule from './ProjectEffortReport';
import RegularisationRequestsModule from './RegularisationRequests';
import TeamDirectoryModule from './TeamDirectory';
import TeamLeaveCalendarModule from './TeamLeaveCalendar';
import TaskManagerModule from './TaskManager';
import ClientUpdatesModule from './ClientUpdates';

import { type Announcement, type Employee, type HRDetails, type Job, type LeaveData, type Policy, type RequestItem, type Training, type AttendanceStatus, type Payslip, type WorkMode } from './managerShared';

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
  workMode: WorkMode;
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
  const [activeTab, setActiveTab] = useState<'Home' | 'Approvals' | 'Regularisation' | 'Attendance' | 'AttendanceAnalytics' | 'ProjectEffortReport' | 'TeamDirectory' | 'TeamLeaveCalendar' | 'Employee' | 'TaskManager' | 'ClientUpdates'>('Home');
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
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [employeeData] = useState({
    name: 'Rajesh Kumar',
    department: 'Operations',
    dept: 'Operations',
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
    dept: employeeData.department || employeeData.dept || 'Operations',
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
    "id": 1,
    "employeeId": "EMP001",
    "name": "Shrushti Desu",
    "username": "shrushti.desu",
    "password": "Temp@123",
    "email": "shrushti.desu@company.com",
    "phone": "+91-9876543210",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234F",
    "address": "Mumbai, Maharashtra",
    "bankName": "State Bank of India",
    "accountNumber": "123456789012",
    "ifscCode": "SBIN0001234",
    "branch": "Mumbai Main Branch",
    "emergencyContactName": "Ramesh Desu",
    "emergencyContactPhone": "+91-9876500000",
    "bloodGroup": "O+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P1234567",
    "uan": "100200300400",
    "pfNumber": "PF100200300",
    "esiNumber": "ESI100200300",
    "taxState": "Maharashtra",
    "department": "Technology",
    "role": "Software Engineer",
    "designation": "Software Engineer",
    "workMode": "Hybrid",
    "location": "Mumbai",
    "reportingManager": "Rahul Sharma",
    "birthday": "1994-01-15",
    "experience": 4,
    "salary": 85000,
    "joinDate": "2022-01-15",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 2,
    "employeeId": "EMP002",
    "name": "Ananya Rao",
    "username": "ananya.rao",
    "password": "Temp@123",
    "email": "ananya.rao@company.com",
    "phone": "+91-9876543211",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234G",
    "address": "Bangalore, Karnataka",
    "bankName": "HDFC Bank",
    "accountNumber": "987654321012",
    "ifscCode": "HDFC0000123",
    "branch": "MG Road Branch",
    "emergencyContactName": "K. Rao",
    "emergencyContactPhone": "+91-9876500001",
    "bloodGroup": "A+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P2345678",
    "uan": "100200300401",
    "pfNumber": "PF100200301",
    "esiNumber": "ESI100200301",
    "taxState": "Karnataka",
    "department": "Technology",
    "role": "UI/UX Designer",
    "designation": "UI/UX Designer",
    "workMode": "Hybrid",
    "location": "Bangalore",
    "reportingManager": "Rahul Sharma",
    "birthday": "1995-06-01",
    "experience": 3,
    "salary": 72000,
    "joinDate": "2022-06-20",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 3,
    "employeeId": "EMP003",
    "name": "Rahul Sharma",
    "username": "rahul.sharma",
    "password": "Temp@123",
    "email": "rahul.sharma@company.com",
    "phone": "+91-9876543212",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234H",
    "address": "Pune, Maharashtra",
    "bankName": "ICICI Bank",
    "accountNumber": "112233445566",
    "ifscCode": "ICIC0000456",
    "branch": "Hinjewadi Branch",
    "emergencyContactName": "Suresh Sharma",
    "emergencyContactPhone": "+91-9876500002",
    "bloodGroup": "B+",
    "maritalStatus": "Married",
    "nationality": "Indian",
    "passportNumber": "P3456789",
    "uan": "100200300402",
    "pfNumber": "PF100200302",
    "esiNumber": "ESI100200302",
    "taxState": "Maharashtra",
    "department": "Technology",
    "role": "Technical Lead",
    "designation": "Technical Lead",
    "workMode": "Hybrid",
    "location": "Pune",
    "reportingManager": "Siddharth Jain",
    "birthday": "1991-03-10",
    "experience": 6,
    "salary": 95000,
    "joinDate": "2021-03-10",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 4,
    "employeeId": "EMP004",
    "name": "Priya Singh",
    "username": "priya.singh",
    "password": "Temp@123",
    "email": "priya.singh@company.com",
    "phone": "+91-9876543213",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234I",
    "address": "Delhi, Delhi",
    "bankName": "Axis Bank",
    "accountNumber": "556677889900",
    "ifscCode": "UTIB0000789",
    "branch": "Connaught Place Branch",
    "emergencyContactName": "A.K. Singh",
    "emergencyContactPhone": "+91-9876500003",
    "bloodGroup": "O-",
    "maritalStatus": "Married",
    "nationality": "Indian",
    "passportNumber": "P4567890",
    "uan": "100200300403",
    "pfNumber": "PF100200303",
    "esiNumber": "ESI100200303",
    "taxState": "Delhi",
    "department": "Human Resources",
    "role": "HR Manager",
    "designation": "HR Manager",
    "workMode": "Onsite",
    "location": "Delhi",
    "reportingManager": "Siddharth Jain",
    "birthday": "1990-11-05",
    "experience": 7,
    "salary": 65000,
    "joinDate": "2020-11-05",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 5,
    "employeeId": "EMP005",
    "name": "Vikram Seth",
    "username": "vikram.seth",
    "password": "Temp@123",
    "email": "vikram.seth@company.com",
    "phone": "+91-9876543214",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234J",
    "address": "Hyderabad, Telangana",
    "bankName": "Kotak Mahindra Bank",
    "accountNumber": "443322110099",
    "ifscCode": "KKBK0000234",
    "branch": "Gachibowli Branch",
    "emergencyContactName": "Manish Seth",
    "emergencyContactPhone": "+91-9876500004",
    "bloodGroup": "AB+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P5678901",
    "uan": "100200300404",
    "pfNumber": "PF100200304",
    "esiNumber": "ESI100200304",
    "taxState": "Telangana",
    "department": "Technology",
    "role": "Data Engineer",
    "designation": "Data Engineer",
    "workMode": "Remote",
    "location": "Hyderabad",
    "reportingManager": "Rahul Sharma",
    "birthday": "1993-04-12",
    "experience": 2,
    "salary": 78000,
    "joinDate": "2022-04-12",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 6,
    "employeeId": "EMP006",
    "name": "Kavya Iyer",
    "username": "kavya.iyer",
    "password": "Temp@123",
    "email": "kavya.iyer@company.com",
    "phone": "+91-9876543215",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234K",
    "address": "Chennai, Tamil Nadu",
    "bankName": "State Bank of India",
    "accountNumber": "223344556677",
    "ifscCode": "SBIN0000567",
    "branch": "Adyar Branch",
    "emergencyContactName": "R. Iyer",
    "emergencyContactPhone": "+91-9876500005",
    "bloodGroup": "O+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P6789012",
    "uan": "100200300405",
    "pfNumber": "PF100200305",
    "esiNumber": "ESI100200305",
    "taxState": "Tamil Nadu",
    "department": "Technology",
    "role": "Frontend Developer",
    "designation": "Frontend Developer",
    "workMode": "Hybrid",
    "location": "Chennai",
    "reportingManager": "Shrushti Desu",
    "birthday": "1998-02-18",
    "experience": 1,
    "salary": 80000,
    "joinDate": "2023-02-18",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 7,
    "employeeId": "EMP007",
    "name": "Arjun Mehta",
    "username": "arjun.mehta",
    "password": "Temp@123",
    "email": "arjun.mehta@company.com",
    "phone": "+91-9876543216",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234L",
    "address": "Ahmedabad, Gujarat",
    "bankName": "Bank of Baroda",
    "accountNumber": "778899001122",
    "ifscCode": "BARB0AHMEDM",
    "branch": "Ashram Road Branch",
    "emergencyContactName": "Gautam Mehta",
    "emergencyContactPhone": "+91-9876500006",
    "bloodGroup": "B-",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P7890123",
    "uan": "100200300406",
    "pfNumber": "PF100200306",
    "esiNumber": "ESI100200306",
    "taxState": "Gujarat",
    "department": "Technology",
    "role": "Backend Developer",
    "designation": "Backend Developer",
    "workMode": "Hybrid",
    "location": "Ahmedabad",
    "reportingManager": "Shrushti Desu",
    "birthday": "1996-08-10",
    "experience": 3,
    "salary": 87000,
    "joinDate": "2022-08-10",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 8,
    "employeeId": "EMP008",
    "name": "Sneha Patel",
    "username": "sneha.patel",
    "password": "Temp@123",
    "email": "sneha.patel@company.com",
    "phone": "+91-9876543217",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234M",
    "address": "Surat, Gujarat",
    "bankName": "HDFC Bank",
    "accountNumber": "334455667788",
    "ifscCode": "HDFC0000444",
    "branch": "Ring Road Branch",
    "emergencyContactName": "Nitin Patel",
    "emergencyContactPhone": "+91-9876500007",
    "bloodGroup": "A-",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P8901234",
    "uan": "100200300407",
    "pfNumber": "PF100200307",
    "esiNumber": "ESI100200307",
    "taxState": "Gujarat",
    "department": "Technology",
    "role": "UI/UX Designer",
    "designation": "UI/UX Designer",
    "workMode": "Remote",
    "location": "Surat",
    "reportingManager": "Ananya Rao",
    "birthday": "1997-09-25",
    "experience": 2,
    "salary": 70000,
    "joinDate": "2021-09-25",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 9,
    "employeeId": "EMP009",
    "name": "Rohit Kumar",
    "username": "rohit.kumar",
    "password": "Temp@123",
    "email": "rohit.kumar@company.com",
    "phone": "+91-9876543218",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234N",
    "address": "Jaipur, Rajasthan",
    "bankName": "ICICI Bank",
    "accountNumber": "990011223344",
    "ifscCode": "ICIC0000999",
    "branch": "C-Scheme Branch",
    "emergencyContactName": "Rajesh Kumar",
    "emergencyContactPhone": "+91-9876500008",
    "bloodGroup": "O+",
    "maritalStatus": "Married",
    "nationality": "Indian",
    "passportNumber": "P9012345",
    "uan": "100200300408",
    "pfNumber": "PF100200308",
    "esiNumber": "ESI100200308",
    "taxState": "Rajasthan",
    "department": "Technology",
    "role": "QA Engineer / Tester",
    "designation": "QA Engineer",
    "workMode": "Hybrid",
    "location": "Jaipur",
    "reportingManager": "Rahul Sharma",
    "birthday": "1992-12-30",
    "experience": 5,
    "salary": 68000,
    "joinDate": "2020-12-30",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 10,
    "employeeId": "EMP010",
    "name": "Meera Nair",
    "username": "meera.nair",
    "password": "Temp@123",
    "email": "meera.nair@company.com",
    "phone": "+91-9876543219",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234O",
    "address": "Cochin, Kerala",
    "bankName": "Federal Bank",
    "accountNumber": "554433221100",
    "ifscCode": "FDRL0001432",
    "branch": "Ernakulam Branch",
    "emergencyContactName": "K.P. Nair",
    "emergencyContactPhone": "+91-9876500009",
    "bloodGroup": "AB-",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P0123456",
    "uan": "100200300409",
    "pfNumber": "PF100200309",
    "esiNumber": "ESI100200309",
    "taxState": "Kerala",
    "department": "Human Resources",
    "role": "HR Executive",
    "designation": "HR Executive",
    "workMode": "Onsite",
    "location": "Cochin",
    "reportingManager": "Priya Singh",
    "birthday": "1999-01-05",
    "experience": 0,
    "salary": 60000,
    "joinDate": "2023-01-05",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 11,
    "employeeId": "EMP011",
    "name": "Siddharth Jain",
    "username": "siddharth.jain",
    "password": "Temp@123",
    "email": "siddharth.jain@company.com",
    "phone": "+91-9876543220",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234P",
    "address": "Noida, Uttar Pradesh",
    "bankName": "HDFC Bank",
    "accountNumber": "667788990011",
    "ifscCode": "HDFC0000888",
    "branch": "Sector 62 Branch",
    "emergencyContactName": "V.K. Jain",
    "emergencyContactPhone": "+91-9876500010",
    "bloodGroup": "A+",
    "maritalStatus": "Married",
    "nationality": "Indian",
    "passportNumber": "P1122334",
    "uan": "100200300410",
    "pfNumber": "PF100200310",
    "esiNumber": "ESI100200310",
    "taxState": "Uttar Pradesh",
    "department": "Management",
    "role": "Director",
    "designation": "Director",
    "workMode": "Onsite",
    "location": "Noida",
    "reportingManager": "Board of Directors",
    "birthday": "1989-07-14",
    "experience": 4,
    "salary": 98000,
    "joinDate": "2021-07-14",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 12,
    "employeeId": "EMP012",
    "name": "Pooja Reddy",
    "username": "pooja.reddy",
    "password": "Temp@123",
    "email": "pooja.reddy@company.com",
    "phone": "+91-9876543221",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234Q",
    "address": "Visakhapatnam, Andhra Pradesh",
    "bankName": "State Bank of India",
    "accountNumber": "445566778899",
    "ifscCode": "SBIN0004567",
    "branch": "Vizag Beach Road Branch",
    "emergencyContactName": "M. Reddy",
    "emergencyContactPhone": "+91-9876500011",
    "bloodGroup": "O+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P2233445",
    "uan": "100200300411",
    "pfNumber": "PF100200311",
    "esiNumber": "ESI100200311",
    "taxState": "Andhra Pradesh",
    "department": "Human Resources",
    "role": "Recruiter",
    "designation": "Recruiter",
    "workMode": "Hybrid",
    "location": "Visakhapatnam",
    "reportingManager": "Priya Singh",
    "birthday": "19'98-03-22",
    "experience": 1,
    "salary": 62000,
    "joinDate": "2022-03-22",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 13,
    "employeeId": "EMP013",
    "name": "Karthik Reddy",
    "username": "karthik.reddy",
    "password": "Temp@123",
    "email": "karthik.reddy@company.com",
    "phone": "+91-9876543222",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234R",
    "address": "Secunderabad, Telangana",
    "bankName": "Axis Bank",
    "accountNumber": "889900112233",
    "ifscCode": "UTIB0001222",
    "branch": "Secunderabad Main",
    "emergencyContactName": "G. Reddy",
    "emergencyContactPhone": "+91-9876500012",
    "bloodGroup": "B+",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P3344556",
    "uan": "100200300412",
    "pfNumber": "PF100200312",
    "esiNumber": "ESI100200312",
    "taxState": "Telangana",
    "department": "Technology",
    "role": "Full Stack Developer",
    "designation": "Full Stack Developer",
    "workMode": "Hybrid",
    "location": "Secunderabad",
    "reportingManager": "Shrushti Desu",
    "birthday": "1993-05-19",
    "experience": 5,
    "salary": 92000,
    "joinDate": "2021-05-19",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 14,
    "employeeId": "EMP014",
    "name": "Aisha Khan",
    "username": "aisha.khan",
    "password": "Temp@123",
    "email": "aisha.khan@company.com",
    "phone": "+91-9876543223",
    "gender": "Female",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234S",
    "address": "Lucknow, Uttar Pradesh",
    "bankName": "Punjab National Bank",
    "accountNumber": "112244668800",
    "ifscCode": "PUNB0000711",
    "branch": "Hazratganj Branch",
    "emergencyContactName": "Kamal Khan",
    "emergencyContactPhone": "+91-9876500013",
    "bloodGroup": "A-",
    "maritalStatus": "Single",
    "nationality": "Indian",
    "passportNumber": "P4455667",
    "uan": "100200300413",
    "pfNumber": "PF100200313",
    "esiNumber": "ESI100200313",
    "taxState": "Uttar Pradesh",
    "department": "Operations",
    "role": "Business Operations Associate",
    "designation": "Business Operations Associate",
    "workMode": "Onsite",
    "location": "Lucknow",
    "reportingManager": "Siddharth Jain",
    "birthday": "1996-11-11",
    "experience": 2,
    "salary": 75000,
    "joinDate": "2022-11-11",
    "status": "Active",
    "employmentType": "Full Time"
},
{
    "id": 15,
    "employeeId": "EMP015",
    "name": "Nikhil Verma",
    "username": "nikhil.verma",
    "password": "Temp@123",
    "email": "nikhil.verma@company.com",
    "phone": "+91-9876543224",
    "gender": "Male",
    "aadhaarNumber": "[Aadhaar Redacted]",
    "panNumber": "ABCDE1234T",
    "address": "Indore, Madhya Pradesh",
    "bankName": "State Bank of India",
    "accountNumber": "332211445566",
    "ifscCode": "SBIN0000915",
    "branch": "Vijay Nagar Branch",
    "emergencyContactName": "S. Verma",
    "emergencyContactPhone": "+91-9876500014",
    "bloodGroup": "O-",
    "maritalStatus": "Married",
    "nationality": "Indian",
    "passportNumber": "P5566778",
    "uan": "100200300414",
    "pfNumber": "PF100200314",
    "esiNumber": "ESI100200314",
    "taxState": "Madhya Pradesh",
    "department": "Technology",
    "role": "System Administrator",
    "designation": "System Administrator",
    "workMode": "Onsite",
    "location": "Indore",
    "reportingManager": "Rahul Sharma",
    "birthday": "1990-08-27",
    "experience": 6,
    "salary": 83000,
    "joinDate": "2020-08-27",
    "status": "Active",
    "employmentType": "Full Time"
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
    const path = location.pathname.toLowerCase();
    if (path.startsWith('/manager/task-manager')) {
      setActiveTab('TaskManager');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (contentRef.current) {
      try {
        contentRef.current.scrollTo({ top: 0, left: 0 });
      } catch (error) {
        contentRef.current.scrollTop = 0;
      }
    }

    try {
      window.scrollTo({ top: 0, left: 0 });
    } catch (error) {
      // ignore
    }
  }, [activeTab, activePage]);

  const handleNavigateToTaskManager = () => {
    setActiveTab('TaskManager');
    navigate('/manager/task-manager');
  };

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
      dept: employee.department ?? employee.dept ?? '',
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

              department:
                formData.dept,

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

      department:
        formData.dept,

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
    min-h-screen
    w-full
    overflow-visible
    font-sans
    relative
    p-5
    md:p-6

    bg-[#0f1d36]

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
        onTaskManagerClick={handleNavigateToTaskManager}
      />

      <main
  className={`
    flex-1
    flex
    flex-col
    relative
    z-10
    overflow-visible
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
              : activeTab === 'ClientUpdates'
              ? 'Client Updates'
              : 'Leave Calendar'
          }
          roleLabel="Manager"
          rightContent={undefined}
        />

       <div
  ref={contentRef}
  className="
    flex-1
    overflow-x-auto
    overflow-visible
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
              setActiveTab={setActiveTab}
              hrDetails={hrDetails}
              profileImage={profileImage || ''}
              employees={employees}
              attendanceStatus={attendanceStatus}
              leaveData={leaveData}
              announcements={announcements}
              showProfileModal={showProfileModal}
              setShowProfileModal={setShowProfileModal}
              handleProfileUpload={(e: ChangeEvent<HTMLInputElement>) => {
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
          {activeTab === 'ClientUpdates' && <ClientUpdatesModule />}
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