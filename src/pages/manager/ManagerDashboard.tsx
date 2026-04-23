import React from 'react';
import { 
  Users, 
  CheckSquare, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Bell,
  ChevronRight,
  LucideIcon 
} from 'lucide-react';
import './ManagerDashboard.css';

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

const ManagerDashboard: React.FC = () => {
  return (
    <div className="app-container manager-theme">
      <header className="header">
        <div className="logo">Manager Dashboard</div>
        <div className="header-right">
          <Bell size={20} className="icon-btn" />
          <div className="profile">
            <div className="avatar">M</div>
            <span>Team Lead</span>
          </div>
        </div>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavItem icon={Users} label="My Team" />
          <NavItem icon={CheckSquare} label="Approvals" />
          <NavItem icon={TrendingUp} label="Performance" />
          <NavItem icon={Calendar} label="Shift Planner" />
          <NavItem icon={MessageCircle} label="Feedback" />
        </aside>

        <main className="main">
          <div className="welcome-card">
            <h2>Team Overview</h2>
            <p>Track your team's performance and manage pending requests.</p>
          </div>

          <div className="manager-stats">
            <div className="stat-box">
              <h4>Pending Approvals</h4>
              <p className="count">12</p>
              <button className="view-btn">View All <ChevronRight size={14}/></button>
            </div>
            <div className="stat-box">
              <h4>Active Projects</h4>
              <p className="count">4</p>
              <button className="view-btn">Track <ChevronRight size={14}/></button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;