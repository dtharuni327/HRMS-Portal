import { type ReactNode } from 'react';

export type PolicyType = 'text' | 'pdf';

export interface Employee {
  id: number;
  employeeId?: string;
  name: string;
  username?: string;
  password?: string;
  email?: string;
  phone?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  address?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  nationality?: string;
  passportNumber?: string;
  uan?: string;
  pfNumber?: string;
  esiNumber?: string;
  taxState?: string;
  workMode?: 'WFH' | 'Office' | 'Hybrid' | '';
  role: string;
  designation?: string;
  dept: string;
  location?: string;
  reportingManager?: string;
  salary: number;
  experience: number;
  isMVP: boolean;
  joinDate?: string;
  birthday?: string;
  performance?: string;
  rating?: number;
}

export interface RequestItem {
  id: number;
  employeeId?: string;
  name: string;
  type: string;
  reason: string;
  date: string;
  startDate?: string;
  endDate?: string;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface Job {
  id: number;
  title: string;
  dept: string;
  applicants: number;
  status: string;
}

export interface Payslip {
  id: string;
  empId: number | string;
  name: string;
  month: string;
  amount: number;
  date: string;
}

export interface Announcement {
  id: number;
  title: string;
  tag: string;
  time: string;
  timestamp: number;
}

export interface Training {
  id: number;
  title: string;
  instructor: string;
  enrollees: number;
  status: 'Active' | 'Completed' | 'Upcoming';
  completion: number;
}

export interface OnboardingEntry {
  id: number;
  name: string;
  role: string;
  dept: string;
  startDate: string;
  manager: string;
  status: 'Pending' | 'Onboarded' | 'Offboarded';
}

export interface HRDocument {
  id: number;
  employeeId: number;
  type: string;
  uploadedAt: string;
  name?: string;       
  uploadedBy?: string; 
}
export interface LeaveData {
  id: number;
  employeeId?: string;
  employee: string;
  type: string;
  days: number;
  startDate: string;
  endDate?: string;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

export interface Policy {
  id: number;
  title: string;
  content: string;
  type: PolicyType;
  lastUpdated: string;
}

export interface HRDetails {
  name: string;
  role: string;
  email: string;
  phone: string;
  dept: string;
  experience: string;
  avatar: string;
  gender?: string;
}

export type AttendanceStatus = Record<number, string>;

interface SparkCardProps {
  children: ReactNode;
  className?: string;
  overflowVisible?: boolean;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export const SparkCard: React.FC<SparkCardProps> = ({
  children,
  className = '',
  overflowVisible = false,
  style,
  hoverable = true,
}) => (

  <div
    className={`
      ${hoverable ? 'hover-zoom-card' : ''}
      relative
      transform
      transition-transform
      duration-200
      ease-out
      ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'}
      backdrop-blur-2xl
      border
      border-white/10
      rounded-[2.5rem]
      shadow-[0_16px_45px_rgba(0,0,0,0.12)]
      ${className}
    `}
    style={style}
  >

    {children}

  </div>

);

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  color: string;
  style?: React.CSSProperties;
  hoverable?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  color,
  style,
  hoverable = true,
}) => (
  <div
    className={`
      ${hoverable ? 'hover-zoom-card' : ''}
      transform
      transition-transform
      duration-200
      ease-out
      p-8
      rounded-[2.5rem]
      flex
      items-center
      gap-6
    `}
    style={style}
  >
    <div
      className={`
        w-16
        h-16
        rounded-3xl
        flex
        items-center
        justify-center
        bg-white/50
        ${color}
      `}
    >
      {icon}
    </div>

    <div className="text-left">
      <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
        {value}
      </h2>

      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
        {label}
      </p>
    </div>
  </div>
);
