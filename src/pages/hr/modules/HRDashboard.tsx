import React, { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import DashboardNavbar from '../../../components/DashboardNavbar';
import HRSidebar from '../../../components/hr/HRSidebar';
import { Search } from 'lucide-react';
import DashboardModule from './dashboard';
import ProfilePage from './ProfilePage';
import EmployeesModule from './Employees';
import AttendanceModule from './Attendance';
import LeaveModule from './Approvals';
import TaskManager from './TaskManager';
import PayrollModule from './Payroll';
import RecruitmentModule from './Recruitment';
import DocumentsModule from './Documents';
import ReportsModule from './Reports';
import ProjectEffortReportModule from '../../manager/modules/ProjectEffortReport';
import OrganisationModule from './Organisation';
import PoliciesModule from './Policies';

import { type Announcement, type Employee, type HRDetails, type Job, type LeaveData, type Policy, type RequestItem, type Training, type OnboardingEntry, type HRDocument, type AttendanceStatus, type Payslip, type WorkMode } from './hrShared.tsx';

type EmployeeFormState = {
  name: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  gender: string;
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
};

const initialAnnouncements: (Announcement & { timestamp: number })[] = [
  { id: 1, title: 'Annual Hackathon 2026 Starting Soon', tag: 'Event', time: '2h ago', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 2, title: 'New Health Insurance Policy Updated', tag: 'Update', time: '5h ago', timestamp: Date.now() - 5 * 60 * 60 * 1000 }
];

const enrichEmployeeRecord = (employee: Employee, index: number): Employee => {
  const normalizedDept = employee.dept ?? employee.department ?? 'Technology';
  const normalizedIfsc = employee.ifsc ?? employee.ifscCode ?? 'HDFC0001234';
  const normalizedWorkMode = employee.workMode ?? (index % 3 === 0 ? 'WFH' : index % 3 === 1 ? 'Office' : 'Hybrid');
  const normalizedSalary = typeof employee.salary === 'number' ? employee.salary : 50000 + (index * 2500);
  const normalizedExperience = typeof employee.experience === 'number' ? employee.experience : (index % 6) + 1;

  return {
    ...employee,
    id: employee.id ?? index + 1,
    employeeId: employee.employeeId ?? `EMP-${String(employee.id ?? index + 1).padStart(3, '0')}`,
    name: employee.name || `Employee ${index + 1}`,
    dept: normalizedDept,
    department: normalizedDept,
    username: employee.username ?? `emp${employee.id ?? index + 1}`,
    password: employee.password ?? 'Welcome@123',
    gender: employee.gender ?? (index % 2 === 0 ? 'Female' : 'Male'),
    bankName: employee.bankName ?? 'HDFC Bank',
    accountNumber: employee.accountNumber ?? `****${String(index + 1).padStart(4, '0')}`,
    ifsc: normalizedIfsc,
    ifscCode: normalizedIfsc,
    branch: employee.branch ?? ['Mumbai', 'Bangalore', 'Pune', 'Delhi', 'Hyderabad'][index % 5],
    emergencyContactName: employee.emergencyContactName ?? `Emergency Contact ${index + 1}`,
    emergencyContactPhone: employee.emergencyContactPhone ?? `+91-9${(700000000 + index).toString().slice(0, 9)}`,
    bloodGroup: employee.bloodGroup ?? ['O+', 'A+', 'B+', 'AB+'][index % 4],
    maritalStatus: employee.maritalStatus ?? (index % 2 === 0 ? 'Single' : 'Married'),
    nationality: employee.nationality ?? 'Indian',
    passportNumber: employee.passportNumber ?? `P${String(index + 1).padStart(7, '0')}`,
    uan: employee.uan ?? `100${String(index + 1).padStart(6, '0')}`,
    pfNumber: employee.pfNumber ?? `PF${String(index + 1).padStart(6, '0')}`,
    esiNumber: employee.esiNumber ?? `ESI${String(index + 1).padStart(6, '0')}`,
    taxState: employee.taxState ?? ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Telangana'][index % 5],
    workMode: normalizedWorkMode,
    status: employee.status ?? 'Active',
    employmentType: employee.employmentType ?? 'Full Time',
    designation: employee.designation ?? employee.role ?? 'Employee',
    role: employee.role ?? 'Employee',
    location: employee.location ?? ['Mumbai', 'Bangalore', 'Pune', 'Delhi'][index % 4],
    reportingManager: employee.reportingManager ?? 'HR Manager',
    salary: normalizedSalary,
    experience: normalizedExperience,
    isMVP: employee.isMVP ?? false,
    joinDate: employee.joinDate ?? '2024-01-01',
    birthday: employee.birthday ?? '1990-01-01',
  };
};

const DarkHRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  // State definitions
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Employees' | 'Tasks' | 'Attendance' | 'Leave' | 'Payroll' | 'Recruitment' | 'Documents' | 'Reports' | 'ProjectEffortReport' | 'Organization'>('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
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
  const [formData, setFormData] = useState<EmployeeFormState>({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    gender: '',
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

  const [employees, setEmployees] = useState<Employee[]>(() => ([
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
  ] as Employee[]).map((employee, index) => enrichEmployeeRecord(employee, index)));

  useEffect(() => {
    setEmployees((prev) => prev.map((employee, index) => enrichEmployeeRecord(employee, index)));
  }, []);

  const [requests, setRequests] = useState<RequestItem[]>([
    { id: 2, name: 'Kavya Iyer', type: 'Leave', reason: 'Medical', date: 'May 04' }
  ]);

  const [wfhRequests, setWfhRequests] = useState<RequestItem[]>([
    { id: 1, name: 'Vikram Seth', type: 'WFH', reason: 'Home Repairs', date: 'May 02' },
    { id: 3, name: 'Rahul Sharma', type: 'WFH', reason: 'Family Event', date: 'May 06' },
    
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
    { id: 2, employee: 'Rahul Sharma', type: 'Sick', days: 1, startDate: '2026-05-05', endDate: '2026-05-05', reason: 'Fever recovery', status: 'Pending' },
    { id: 3, employee: 'Ankita Rao', type: 'Casual', days: 2, startDate: '2026-05-15', endDate: '2026-05-16', reason: 'Family event', status: 'Pending' },
    { id: 4, employee: 'Sameer Patel', type: 'Annual', days: 5, startDate: '2026-06-01', endDate: '2026-06-05', reason: 'Vacation', status: 'Pending' },
    
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
      gender: '',
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
      gender: employee.gender ?? '',
      aadhaarNumber: employee.aadhaarNumber ?? '',
      panNumber: employee.panNumber ?? '',
      address: employee.address ?? '',
      bankName: employee.bankName ?? '',
      accountNumber: employee.accountNumber ?? '',
      ifsc: employee.ifscCode ?? employee.ifsc ?? '',
      branch: employee.branch ?? '',
      emergencyContactName: employee.emergencyContactName ?? '',
      emergencyContactPhone: employee.emergencyContactPhone ?? '',
      bloodGroup: employee.bloodGroup ?? '',
      maritalStatus: employee.maritalStatus ?? '',
      nationality: employee.nationality ?? '',
      passportNumber: employee.passportNumber ?? '',
      uan: employee.uan ?? '',
      pfNumber: employee.pfNumber ?? '',
      esiNumber: employee.esiNumber ?? '',
      taxState: employee.taxState ?? '',
      workMode: employee.workMode ?? '',
      role: employee.role,
      designation: employee.designation ?? '',
      dept: employee.department ?? employee.dept ?? '',
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
        gender: formData.gender,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        address: formData.address,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        ifscCode: formData.ifsc,
        branch: formData.branch,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        uan: formData.uan,
        pfNumber: formData.pfNumber,
        esiNumber: formData.esiNumber,
        taxState: formData.taxState,
        workMode: formData.workMode,
        role: formData.role,
        designation: formData.designation,
        dept: formData.dept,
        department: formData.dept,
        location: formData.location,
        reportingManager: formData.reportingManager,
        status: emp.status ?? 'Active',
        employmentType: emp.employmentType ?? 'Full Time',
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
        gender: formData.gender,
        aadhaarNumber: formData.aadhaarNumber,
        panNumber: formData.panNumber,
        address: formData.address,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifsc,
        ifscCode: formData.ifsc,
        branch: formData.branch,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        uan: formData.uan,
        pfNumber: formData.pfNumber,
        esiNumber: formData.esiNumber,
        taxState: formData.taxState,
        workMode: formData.workMode,
        role: formData.role,
        designation: formData.designation,
        dept: formData.dept,
        department: formData.dept,
        location: formData.location,
        reportingManager: formData.reportingManager,
        status: 'Active',
        employmentType: 'Full Time',
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

  const performanceData = [
    { dept: 'Tech', rating: 4.5 }, { dept: 'Design', rating: 4.2 }, { dept: 'HR', rating: 4.8 }, { dept: 'Admin', rating: 4.0 }
  ];

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

      <HRSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <main className={`flex-1 flex flex-col relative z-10 px-3 pb-6 pt-3 transition-all duration-300 ${sidebarOpen ? 'ml-[292px]' : 'ml-[140px]'}`}>
        <DashboardNavbar
          title={
            activeTab === 'Dashboard'
              ? 'HR Dashboard'
              : activeTab === 'Tasks'
              ? 'Task Manager'
              : activeTab === 'Leave'
              ? 'Approvals'
              : activeTab === 'ProjectEffortReport'
              ? 'Project Effort Report'
              : activeTab === 'Documents'
              ? 'Documents'
              : activeTab
          }
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

        <div ref={contentRef} className="flex-1 overflow-x-visible overflow-visible">
          {activeTab === 'Dashboard' && activePage === 'dashboard' && (
  <DashboardModule
    setActivePage={setActivePage}
    setActiveTab={setActiveTab}
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
          {activeTab === 'Payroll' && <PayrollModule employees={employees} />}
          {activeTab === 'Recruitment' && <RecruitmentModule jobs={jobs} setJobs={setJobs} />}
          {activeTab === 'Tasks' && <TaskManager />}
          {activeTab === 'ProjectEffortReport' && <ProjectEffortReportModule employees={employees} />}
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

export default DarkHRDashboard;