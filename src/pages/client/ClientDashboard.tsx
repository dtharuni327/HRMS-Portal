import React from 'react';
import { 
  Layout, BarChart3, MessageSquare, ClipboardList, 
  Layers, Download, LucideIcon 
} from 'lucide-react';
import './ClientDashboard.css';

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

const ClientDashboard: React.FC = () => {
  return (
    <div className="app-container employee-theme"> {/* Using your shared theme */}
      <header className="header">
        <div className="logo-text">Client Hub</div>
        <div className="header-right">
          <div className="profile">
            <div className="avatar">C1</div>
            <div className="user-info">
                <span className="user-name">Global Tech Inc.</span>
                <span className="user-role">Client Partner</span>
            </div>
          </div>
        </div>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavItem icon={Layout} label="Dashboard" />
          <NavItem icon={Layers} label="Project Timeline" />
          <NavItem icon={ClipboardList} label="Invoices" />
          <NavItem icon={MessageSquare} label="Support" />
        </aside>

        <main className="main">
          <div className="welcome-banner">
            <h1>Project Progress</h1>
            <p>Current status of your ongoing development cycles.</p>
          </div>

          <div className="action-grid">
            <div className="stat-card">
              <div className="stat-header">
                <BarChart3 color="#4b3f72" />
                <span className="stat-label">Completion Status</span>
              </div>
              <h2 className="stat-value">75%</h2>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{width: '75%'}}></div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <Download color="#4b3f72" />
                <span className="stat-label">Pending Invoices</span>
              </div>
              <h2 className="stat-value">01</h2>
              <p className="stat-sub">Payment due soon</p>
            </div>
          </div>

          <div className="content-grid-secondary">
             <div className="data-card">
                <h3>Active Milestones</h3>
                <div className="notice-item">
                   <p><strong>Phase 2:</strong> UI/UX Design Finalization - <span style={{color: '#4b3f72'}}>In Progress</span></p>
                </div>
                <div className="notice-item">
                   <p><strong>Phase 1:</strong> Requirement Gathering - <span style={{color: '#10b981'}}>Completed</span></p>
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;