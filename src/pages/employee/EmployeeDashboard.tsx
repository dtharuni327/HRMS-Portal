import React from 'react';
import { 
  UserCircle, 
  Clock, 
  Plane, 
  CreditCard, 
  BookOpen, 
  Bell,
  LogOut,
  LucideIcon 
} from 'lucide-react';
import './EmployeeDashboard.css';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => (
  <div className="menu-item">
    <div className="icon-wrapper"><Icon size={22} /></div>
    <span className="menu-text">{label}</span>
  </div>
);

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="app-container employee-theme">
      <header className="header">
        <div className="logo">MyWorkspace</div>
        <div className="header-right">
          <Bell size={20} className="header-icon" />
          <div className="profile">
            <div className="avatar">em</div>
            <span>employee </span>
          </div>
          <LogOut size={20} className="logout-btn" />
        </div>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavItem icon={UserCircle} label="My Profile" />
          <NavItem icon={Clock} label="Attendance" />
          <NavItem icon={Plane} label="Leave Request" />
          <NavItem icon={CreditCard} label="Payslips" />
          <NavItem icon={BookOpen} label="Learning" />
        </aside>

        <main className="main">
          <div className="hero-section">
            <h1>Hi, Shrushti!</h1>
            <p>Welcome back. You have 2 pending tasks and your next holiday is in 10 days.</p>
          </div>

          <div className="employee-grid">
            <div className="action-card main-action">
              <div className="card-icon"><Clock size={32} /></div>
              <h3>Mark Attendance</h3>
              <p>Current Status: Not Clocked In</p>
              <button className="primary-btn">Clock In Now</button>
            </div>

            <div className="action-card">
              <div className="card-icon"><Plane size={32} /></div>
              <h3>Request Leave</h3>
              <p>Available Balance: 12 Days</p>
              <button className="secondary-btn">Apply Now</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;