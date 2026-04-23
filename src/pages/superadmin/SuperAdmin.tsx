import React from 'react';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  LucideIcon
} from 'lucide-react';
import './SuperAdmin.css';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label }) => (
  <div className="menu-item">
    <div className="icon-wrapper">
      <Icon size={22} />
    </div>
    <span className="menu-text">{label}</span>
  </div>
);

const SuperAdmin: React.FC = () => {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">Super Admin Panel</div>
        <div className="header-right">
          <div className="profile">
            <div className="avatar">SA</div>
            <span>Super Admin </span>
          </div>
        </div>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavItem icon={LayoutDashboard} label="Dashboard" />
          <NavItem icon={Users} label="Manage Admins" />
          <NavItem icon={Settings} label="System Settings" />
          <NavItem icon={BarChart3} label="Reports" />
          <NavItem icon={Shield} label="Security" />
          <NavItem icon={Database} label="Database" />
        </aside>

        <main className="main">
          <div className="welcome-card">
            <h2>Welcome Super Admin</h2>
            <p>You have full control over the system. Manage your users and system health here.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdmin;