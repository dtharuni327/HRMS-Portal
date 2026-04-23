import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Briefcase,
  FileText,
  Heart,
  TrendingUp,
  Clock,
  BarChart3,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import './HRDashboard.css';
import Recruitment from './Recruitment';
import JobOpenings from './JobOpenings';
import Payroll from './Payroll';
import EmployeeManagement from './EmployeeManagement'; 

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick
}) => (
  <div className={`menu-item ${isActive ? 'active' : ''}`} onClick={onClick}>
    <div className="icon-wrapper">
      <Icon size={22} />
    </div>
    <span className="menu-text">{label}</span>
  </div>
);

interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  status: string;
}

const HRDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "CFT0171", name: "Shrushti Desu", role: "Associate Software Engineer", dept: "IT", email: "shrushtidesu@gmail.com", status: "Active" },
    { id: "CFT0172", name: "Ananya Rao", role: "Frontend Developer", dept: "Product", email: "ananya@cofomo.com", status: "Active" },
    { id: "CFT0173", name: "Rahul Sharma", role: "Backend Engineer", dept: "Engineering", email: "rahul@cofomo.com", status: "On Leave" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="app-container employee-theme">
      
      <header className="header">
        <div className="logo-text">HR Management Portal</div>

        <div className="header-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <div className="profile">
            <div className="avatar text-xs font-bold">HR</div>
            <div className="user-info">
              <span className="user-name font-bold">HR Manager</span>
              <span className="user-role uppercase text-[10px] tracking-widest opacity-70">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="body-container">

        <aside className="sidebar">
          <NavItem
            icon={TrendingUp}
            label="Dashboard"
            isActive={activeTab === 'Dashboard'}
            onClick={() => setActiveTab('Dashboard')}
          />

          <NavItem
            icon={Users}
            label="Employees"
            isActive={activeTab === 'Employees'}
            onClick={() => setActiveTab('Employees')}
          />

          <NavItem
            icon={UserPlus}
            label="Recruitment"
            isActive={activeTab === 'Recruitment'}
            onClick={() => setActiveTab('Recruitment')}
          />

          <NavItem
            icon={Briefcase}
            label="Job Openings"
            isActive={activeTab === 'Jobs'}
            onClick={() => setActiveTab('Jobs')}
          />

          <NavItem 
            icon={FileText} 
            label="Payroll" 
            isActive={activeTab === 'Payroll'} 
            onClick={() => setActiveTab('Payroll')} 
          />

          <NavItem 
            icon={Clock} 
            label="Attendance" 
            isActive={activeTab === 'Attendance'} 
            onClick={() => setActiveTab('Attendance')} 
          />

          <NavItem 
            icon={BarChart3} 
            label="Reports" 
            isActive={activeTab === 'Reports'} 
            onClick={() => setActiveTab('Reports')} 
          />

          <NavItem 
            icon={ShieldCheck} 
            label="Policies" 
            isActive={activeTab === 'Policies'} 
            onClick={() => setActiveTab('Policies')} 
          />
        </aside>

        <main className="main">

          {activeTab === 'Dashboard' && (
            <div className="animate-fade-in">
              <div className="welcome-banner">
                <h1>Hello, HR Team!</h1>
                <p>Real-time overview of your workforce and operations.</p>
              </div>

              <div className="action-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <Users color="#4b3f72" />
                    <span className="stat-label">Total Staff</span>
                  </div>
                  <h2 className="stat-value">{employees.length}</h2> 
                  <p className="stat-sub">Live headcount</p>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <Clock color="#4b3f72" />
                    <span className="stat-label">Pending Approvals</span>
                  </div>
                  <h2 className="stat-value">08</h2>
                  <p className="stat-sub">Leave requests</p>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <TrendingUp color="#4b3f72" />
                    <span className="stat-label">Open Roles</span>
                  </div>
                  <h2 className="stat-value">12</h2>
                  <p className="stat-sub">Active recruitment</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Employees' && (
            <EmployeeManagement 
              employees={employees} 
              setEmployees={setEmployees} 
            />
          )}

          {activeTab === 'Recruitment' && <Recruitment />}
          {activeTab === 'Jobs' && <JobOpenings />}
          {activeTab === 'Payroll' && <Payroll />}

          {activeTab === 'Attendance' && (
            <div className="p-10 text-center text-slate-400">
              <Clock size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="font-bold text-slate-800">Attendance Logs</h2>
              <p>Daily clock-in/out records will appear here.</p>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="p-10 text-center text-slate-400">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="font-bold text-slate-800">System Reports</h2>
              <p>Generate Payroll and Performance PDFs.</p>
            </div>
          )}

          {activeTab === 'Policies' && (
            <div className="p-10 text-center text-slate-400">
              <ShieldCheck size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="font-bold text-slate-800">Company Policies</h2>
              <p>Official document storage and distribution.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default HRDashboard;