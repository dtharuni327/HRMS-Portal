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
  file?: File | string; 
}
export interface LeaveData {
  id: number;
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
  hoverable?: boolean;
  overflowVisible?: boolean;
  style?: React.CSSProperties;
}

export const SparkCard: React.FC<SparkCardProps> = ({
  children,
  className = '',
  hoverable = true,
  overflowVisible = false,
  style
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
  label: string;
  value: string | number;
  color: string;
  icon?: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color,
  icon
}) => (
  <div
    className={`rounded-2xl border border-white/80 bg-gradient-to-br ${color} p-5 shadow-[0_18px_35px_rgba(15,23,42,0.14)] transition-transform duration-200 hover:-translate-y-0.5`}
  >
    {icon && <div className="mb-3 flex items-center justify-start">{icon}</div>}
    <p className="text-sm font-semibold opacity-90">{label}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);