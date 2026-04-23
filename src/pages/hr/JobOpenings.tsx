import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import './JobOpenings.css';

interface Job {
  id: number;
  title: string;
  department: string;
  openings: number;
}

const JobOpenings: React.FC = () => {

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [openings, setOpenings] = useState(1);

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();

    const newJob: Job = {
      id: Date.now(),
      title,
      department,
      openings
    };

    setJobs([...jobs, newJob]);

    setIsModalOpen(false);
    setTitle('');
    setDepartment('');
    setOpenings(1);
  };

  return (
    <div className="job-container">

      <div className="header">
        <h1>Job Openings</h1>

        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={16}/> Add Job
        </button>
      </div>

      <div className="job-table">
        <div className="table-header">
          <span>Title</span>
          <span>Department</span>
          <span>Openings</span>
        </div>

        {jobs.map(job => (
          <div key={job.id} className="table-row">
            <span>{job.title}</span>
            <span>{job.department}</span>
            <span>{job.openings}</span>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">

            <h2>Add Job</h2>

            <form onSubmit={handleAddJob}>
              <input
                placeholder="Job Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
              />

              <input
                placeholder="Department"
                value={department}
                onChange={(e)=>setDepartment(e.target.value)}
                required
              />

              <input
                type="number"
                value={openings}
                onChange={(e)=>setOpenings(Number(e.target.value))}
              />

              <button type="submit">Add</button>
              <button type="button" onClick={()=>setIsModalOpen(false)}>Cancel</button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default JobOpenings;