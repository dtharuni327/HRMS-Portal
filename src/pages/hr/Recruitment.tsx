import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, X, Trash2 } from 'lucide-react';
import './Recruitment.css';

interface Candidate {
  id: number;
  name: string;
  role: string;
  stage: string;
  date: string;
}

const Recruitment: React.FC = () => {

  // ✅ LOAD FROM LOCALSTORAGE
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem("candidates");
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Ananya Rao", role: "Frontend Developer", stage: "Interview", date: "22 Apr 2026" },
      { id: 2, name: "Rahul Sharma", role: "Backend Engineer", stage: "Technical Round", date: "21 Apr 2026" },
      { id: 3, name: "Priya Varma", role: "UI/UX Designer", stage: "Applied", date: "20 Apr 2026" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStage, setNewStage] = useState('Applied');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ SAVE TO LOCALSTORAGE (IMPORTANT)
  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  // ✅ ADD CANDIDATE
  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: Candidate = {
      id: Date.now(),
      name: newName,
      role: newRole,
      stage: newStage,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    setCandidates([...candidates, newEntry]);

    setIsModalOpen(false);
    setNewName('');
    setNewRole('');
    setNewStage('Applied');
  };

  // ✅ DELETE
  const handleDelete = (id: number) => {
    setCandidates(candidates.filter(c => c.id !== id));
  };

  // ✅ CHANGE STAGE
  const handleStageChange = (id: number, newStage: string) => {
    setCandidates(prev =>
      prev.map(c =>
        c.id === id ? { ...c, stage: newStage } : c
      )
    );
  };

  // ✅ SEARCH
  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recruitment-container">

      {/* HEADER */}
      <div className="section-header">
        <div>
          <h1>Recruitment Management</h1>
          <p>Track candidates and manage job applications.</p>
        </div>

        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {/* SEARCH */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="data-card">
        <h3>Active Applications</h3>

        <div className="simple-table">
          <div className="table-header recruit-grid">
            <span>Name</span>
            <span>Role</span>
            <span>Stage</span>
            <span>Action</span>
          </div>

          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="table-row recruit-grid">

              <div>
                <div>{candidate.name}</div>
                <div className="text-date-sub">{candidate.date}</div>
              </div>

              <span>{candidate.role}</span>

              {/* ✅ STAGE DROPDOWN */}
              <select
                className={`status-tag stage-${candidate.stage.toLowerCase().replace(/\s+/g, '-')}`}
                value={candidate.stage}
                onChange={(e) =>
                  handleStageChange(candidate.id, e.target.value)
                }
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Technical Round">Technical Round</option>
              </select>

              <div className="action-icons">
                <Trash2 onClick={() => handleDelete(candidate.id)} />
                <MoreHorizontal />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">

            <div className="modal-header">
              <h2>Add Candidate</h2>
              <X onClick={() => setIsModalOpen(false)} />
            </div>

            <form onSubmit={handleAddCandidate}>

              <div className="form-group">
                <label>Name</label>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stage</label>
                <select
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Technical Round</option>
                </select>
              </div>

              <button type="submit" className="save-btn">
                Add Candidate
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recruitment;