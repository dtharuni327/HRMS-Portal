import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Mail, Trash2, Edit, X, Save } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  status: string;
}

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const savedData = localStorage.getItem('hrms_employees');
    return savedData ? JSON.parse(savedData) : [
      { id: "COM0171", name: "Shrushti Desu", role: "Associate Software Engineer", dept: "IT", email: "shrushtidesu@gmail.com", status: "Active" },
      { id: "COM0172", name: "Ananya Rao", role: "Frontend Developer", dept: "Product", email: "ananya@gmail.com", status: "Active" },
      { id: "COM0173", name: "Rahul Sharma", role: "Backend Engineer", dept: "Engineering", email: "rahul@gmail.com", status: "On Leave" },
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', dept: 'IT', email: '' });

  useEffect(() => {
    localStorage.setItem('hrms_employees', JSON.stringify(employees));
  }, [employees]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setEmployees(employees.map(emp => emp.id === editingId ? { ...emp, ...formData } : emp));
    } else {
      const newIdNumber = employees.length > 0 
        ? Math.max(...employees.map(e => parseInt(e.id.replace('COM', '')))) + 1 
        : 171;
      const newId = `COM${String(newIdNumber).padStart(4, '0')}`;
      
      setEmployees([...employees, { ...formData, id: newId, status: "Active" }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this employee? This action cannot be undone.")) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', role: '', dept: 'IT', email: '' });
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = {
    container: { padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px' },
    title: { color: '#4b3f72', fontWeight: 900, fontSize: '28px', margin: 0 },
    addButton: { backgroundColor: '#4b3f72', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' },
    searchBox: { width: '100%', padding: '18px 24px 18px 50px', borderRadius: '18px', border: 'none', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: '40px', fontWeight: 600, fontSize: '16px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    card: { backgroundColor: '#fff', padding: '28px', borderRadius: '35px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' },
    avatar: { width: '60px', height: '60px', backgroundColor: '#ffcc00', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#4b3f72', fontSize: '20px' },
    modalOverlay: { position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(75, 63, 114, 0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '40px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Employee Directory</h1>
          <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginTop: '5px' }}>Total: {employees.length} Staff</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>
          <UserPlus size={18} /> ADD STAFF
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '20px', top: '20px', color: '#94a3b8' }} size={20} />
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
          style={styles.searchBox}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.grid}>
        {filteredEmployees.map((emp) => (
          <div key={emp.id} style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={styles.avatar}>{emp.name.split(' ').map(n => n[0]).join('')}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditingId(emp.id); setFormData(emp); setIsModalOpen(true); }} style={{ padding: '8px', border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit size={20}/></button>
                <button onClick={() => handleDelete(emp.id)} style={{ padding: '8px', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={20}/></button>
              </div>
            </div>
            
            <h3 style={{ margin: 0, fontWeight: 900, fontSize: '20px', color: '#1e293b' }}>{emp.name}</h3>
            <p style={{ color: '#4b3f72', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', margin: '5px 0 20px 0' }}>{emp.role}</p>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <p style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                <Mail size={14} /> {emp.email}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <span style={{ fontSize: '10px', backgroundColor: '#f1f5f9', padding: '5px 12px', borderRadius: '10px', fontWeight: 900, color: '#94a3b8' }}>ID: {emp.id}</span>
                <span style={{ fontSize: '10px', backgroundColor: emp.status === 'Active' ? '#f0fdf4' : '#fff7ed', color: emp.status === 'Active' ? '#16a34a' : '#ea580c', padding: '5px 12px', borderRadius: '20px', fontWeight: 900 }}>● {emp.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#4b3f72' }}>{editingId ? 'Edit Profile' : 'New Staff'}</h2>
              <X onClick={closeModal} style={{ cursor: 'pointer', color: '#94a3b8' }} />
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
              <input required placeholder="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
              <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
              <button type="submit" style={styles.addButton}><Save size={18}/> SAVE RECORD</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;