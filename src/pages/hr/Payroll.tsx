import React, { useState, useMemo } from 'react';
import { 
  Search, DollarSign, Download, CheckCircle, 
  Clock, AlertCircle, Plus, Trash2, X, Save 
} from 'lucide-react';
import './Payroll.css';

interface PayrollEntry {
  id: number;
  name: string;
  role: string;
  salary: number;
  status: 'Paid' | 'Pending' | 'Processing';
  date: string;
}

const Payroll: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([
    { id: 1, name: "Ananya Rao", role: "Frontend Developer", salary: 85000, status: "Paid", date: "01 Apr 2026" },
    { id: 2, name: "Rahul Sharma", role: "Backend Engineer", salary: 92000, status: "Pending", date: "--" },
    { id: 3, name: "Priya Varma", role: "UI/UX Designer", salary: 78000, status: "Paid", date: "01 Apr 2026" },
    { id: 4, name: "Siddharth Malhotra", role: "Product Manager", salary: 110000, status: "Processing", date: "--" },
  ]);

  const [newEntry, setNewEntry] = useState({ name: '', role: '', salary: '' });

  // --- DYNAMIC CALCULATIONS ---
  const stats = useMemo(() => {
    const total = payrollData.reduce((acc, curr) => acc + curr.salary, 0);
    const paid = payrollData
      .filter(e => e.status === 'Paid')
      .reduce((acc, curr) => acc + curr.salary, 0);
    return { total, paid, pending: total - paid };
  }, [payrollData]);

  // --- HANDLERS ---
  const handleStatusChange = (id: number, newStatus: PayrollEntry['status']) => {
    const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setPayrollData(prev => prev.map(emp => 
      emp.id === id ? { ...emp, status: newStatus, date: newStatus === 'Paid' ? today : '--' } : emp
    ));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: PayrollEntry = {
      id: Date.now(),
      name: newEntry.name,
      role: newEntry.role,
      salary: Number(newEntry.salary),
      status: 'Pending',
      date: '--'
    };
    setPayrollData([...payrollData, entry]);
    setIsModalOpen(false);
    setNewEntry({ name: '', role: '', salary: '' });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this payroll record?")) {
      setPayrollData(payrollData.filter(item => item.id !== id));
    }
  };

  const filteredPayroll = payrollData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="payroll-container animate-fade-in">
      <div className="section-header">
        <div>
          <h1 className="text-3xl font-black text-[#4b3f72]">Payroll Management</h1>
          <p className="text-slate-400 font-bold">Manual override and real-time distribution tracking.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Record
          </button>
          <button className="primary-btn pay-all-btn">
            <DollarSign size={18} /> Run Payroll
          </button>
        </div>
      </div>

      <div className="payroll-stats">
        <div className="mini-stat-card">
          <span className="stat-label">Total Outflow</span>
          <h3 className="text-2xl font-black text-[#4b3f72]">₹{stats.total.toLocaleString()}</h3>
        </div>
        <div className="mini-stat-card border-l-[#10b981]">
          <span className="stat-label">Processed</span>
          <h3 className="text-2xl font-black text-green-500">₹{stats.paid.toLocaleString()}</h3>
        </div>
        <div className="mini-stat-card border-l-[#f59e0b]">
          <span className="stat-label">Pending</span>
          <h3 className="text-2xl font-black text-orange-500">₹{stats.pending.toLocaleString()}</h3>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search employee..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="data-card">
        <div className="simple-table">
          <div className="table-header payroll-grid">
            <span>Employee</span>
            <span>Monthly Salary</span>
            <span>Status</span>
            <span>Payment Date</span>
            <span className="text-right">Actions</span>
          </div>

          {filteredPayroll.map((emp) => (
            <div key={emp.id} className="table-row payroll-grid">
              <div className="emp-info">
                <span className="font-bold text-slate-700">{emp.name}</span>
                <span className="text-slate-400 text-[11px] font-bold uppercase">{emp.role}</span>
              </div>
              <span className="font-bold text-slate-600">₹{emp.salary.toLocaleString()}</span>
              <div>
                <select 
                  value={emp.status} 
                  onChange={(e) => handleStatusChange(emp.id, e.target.value as any)}
                  className={`status-dropdown ${emp.status.toLowerCase()}`}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
              <span className="text-slate-500 font-medium text-sm">{emp.date}</span>
              <div className="flex justify-end gap-2">
                <button className="icon-btn-outline"><Download size={16} /></button>
                <button className="icon-btn-outline delete-btn" onClick={() => handleDelete(emp.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <div className="modal-header">
              <h2 className="font-black text-[#4b3f72]">ADD PAYROLL RECORD</h2>
              <X onClick={() => setIsModalOpen(false)} className="cursor-pointer" />
            </div>
            <form onSubmit={handleAdd} className="space-y-4 mt-6">
              <input required placeholder="Employee Name" value={newEntry.name} onChange={e => setNewEntry({...newEntry, name: e.target.value})} className="modal-input" />
              <input required placeholder="Designation" value={newEntry.role} onChange={e => setNewEntry({...newEntry, role: e.target.value})} className="modal-input" />
              <input required type="number" placeholder="Salary Amount" value={newEntry.salary} onChange={e => setNewEntry({...newEntry, salary: e.target.value})} className="modal-input" />
              <button type="submit" className="primary-btn w-full py-4 font-black"><Save size={18}/> SAVE RECORD</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;