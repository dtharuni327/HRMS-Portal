import React from 'react';
import { 
  FileText, CreditCard, PieChart, TrendingUp, 
  CheckCircle, LucideIcon, Wallet 
} from 'lucide-react';
import './FinanceDashboard.css';

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

const FinanceDashboard: React.FC = () => {
  return (
    <div className="app-container finance-theme">
      <header className="header">
        <div className="logo-text">Finance Portal</div>
        <div className="header-right">
          <div className="profile">
            <div className="avatar">FD</div>
            <div className="user-info">
                <span className="user-name">Finance Dept</span>
                <span className="user-role">Accountant</span>
            </div>
          </div>
        </div>
      </header>

      <div className="body-container">
        <aside className="sidebar">
          <NavItem icon={PieChart} label="Budget Overview" />
          <NavItem icon={FileText} label="Payroll Processing" />
          <NavItem icon={CreditCard} label="Expenses" />
          <NavItem icon={TrendingUp} label="Tax Reports" />
        </aside>

        <main className="main">
          <div className="welcome-banner">
            <h1>Financial Summary</h1>
            <p>Monitor company cash flow and payroll cycles.</p>
          </div>

          <div className="action-grid">
            <div className="stat-card finance-card">
              <div className="stat-header">
                <Wallet color="#0891b2" />
                <span className="stat-label">Total Monthly Payroll</span>
              </div>
              <h2 className="stat-value">4,52,000</h2>
              <p className="stat-sub">Next run in 5 days</p>
            </div>

            <div className="stat-card finance-card">
              <div className="stat-header">
                <CheckCircle color="#0891b2" />
                <span className="stat-label">Approved Expenses</span>
              </div>
              <h2 className="stat-value">24</h2>
              <p className="stat-sub">12 Pending review</p>
            </div>
          </div>

          <div className="content-grid-secondary">
            <div className="data-card">
              <h3>Recent Transactions</h3>
              <div className="simple-table">
                <div className="table-header finance-table">
                    <span>Category</span>
                    <span>Amount</span>
                    <span>Status</span>
                </div>
                <div className="table-row">
                    <span>Office Supplies</span>
                    <span>120000</span>
                    <span className="status-tag paid">Paid</span>
                </div>
                <div className="table-row">
                    <span>Cloud Servers</span>
                    <span>35000</span>
                    <span className="status-tag pending">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FinanceDashboard;