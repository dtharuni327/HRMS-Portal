import {
  type Dispatch,
  type SetStateAction,
  type FC,
  useState
} from 'react';

import {
  Plus,
  Briefcase,
  Users,
  TrendingUp
} from 'lucide-react';

import {
  SparkCard,
  type Job
} from '../hrShared';

interface RecruitmentModuleProps {
  jobs: Job[];
  setJobs: Dispatch<SetStateAction<Job[]>>;
}

const RecruitmentModule: FC<RecruitmentModuleProps> = ({
  jobs,
  setJobs
}) => {

  // =========================
  // FORM STATES
  // =========================

  const [showJobForm, setShowJobForm] = useState(false);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('');
  const [jobStatus, setJobStatus] = useState('Open');

  // =========================
  // ADD JOB
  // =========================

  const handleAddJob = () => {

    if (!jobTitle || !jobDept) {
      alert('Please fill all fields');
      return;
    }

    const newJob: Job = {
      id: jobs.length + 1,
      title: jobTitle,
      dept: jobDept,
      applicants: 0,
      status: jobStatus
    };

    setJobs(prev => [...prev, newJob]);

    // RESET
    setJobTitle('');
    setJobDept('');
    setJobStatus('Open');

    setShowJobForm(false);

  };

  return (

    <div className="space-y-6 animate-in slide-in-from-bottom-4">

      {/* TOP SECTION */}
<div className="w-full flex justify-end items-center">

  <button
    onClick={() => setShowJobForm(true)}
    className="
      bg-[#F3E8FF]
      hover:bg-[#E9D5FF]
      text-violet-700
      px-6
      py-3
      rounded-2xl
      font-black
      uppercase
      tracking-widest
      text-[10px]
      transition-all
      flex
      items-center
      gap-2
      shadow-md
      border
      border-violet-200
    "
  >

    <Plus size={16} />

    New Job Posting

  </button>

</div>

      {/* JOB FORM */}
      {showJobForm && (

        <SparkCard
          className="
            p-8
            bg-white/90
            border
            border-slate-200
            rounded-3xl
            shadow-xl
          "
        >

          <h3 className="text-2xl font-black text-violet-700 mb-6">
            Create New Job Posting
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* JOB TITLE */}
            <input
              type="text"
              placeholder="Job Title"
              value={jobTitle}
              onChange={(e) =>
                setJobTitle(e.target.value)
              }
              className="
                p-4
                rounded-2xl
                bg-[#F8FAFC]
                border
                border-slate-200
                text-slate-800
                outline-none
                focus:border-violet-300
              "
            />

            {/* DEPARTMENT */}
            <input
              type="text"
              placeholder="Department"
              value={jobDept}
              onChange={(e) =>
                setJobDept(e.target.value)
              }
              className="
                p-4
                rounded-2xl
                bg-[#F8FAFC]
                border
                border-slate-200
                text-slate-800
                outline-none
                focus:border-violet-300
              "
            />

            {/* STATUS */}
            <select
              value={jobStatus}
              onChange={(e) =>
                setJobStatus(e.target.value)
              }
              className="
                p-4
                rounded-2xl
                bg-[#F8FAFC]
                border
                border-slate-200
                text-slate-800
                outline-none
                focus:border-violet-300
              "
            >

              <option value="Open">Open</option>
              <option value="Urgent">Urgent</option>
              <option value="Closed">Closed</option>

            </select>

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-6">

            <button
              onClick={handleAddJob}
              className="
                px-6
                py-3
                rounded-2xl
                bg-[#EDE9FE]
                hover:bg-[#DDD6FE]
                text-violet-700
                font-black
                uppercase
                text-xs
                border
                border-violet-200
              "
            >
              Add Job
            </button>

            <button
              onClick={() => setShowJobForm(false)}
              className="
                px-6
                py-3
                rounded-2xl
                bg-[#FFF1F2]
                hover:bg-[#FFE4E6]
                text-rose-700
                font-black
                uppercase
                text-xs
                border
                border-rose-200
              "
            >
              Cancel
            </button>

          </div>

        </SparkCard>

      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* OPEN JOBS */}
        <SparkCard
          className="
            p-6
            bg-[#EEF4FF]
            border
            border-blue-100
            rounded-3xl
            shadow-sm
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm font-semibold text-slate-600">
                Open Jobs
              </p>

              <h3 className="text-3xl font-black text-blue-600 mt-2">
                {
                  jobs.filter(
                    j => j.status === 'Open'
                  ).length
                }
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-blue-100">
              <Briefcase
                size={24}
                className="text-blue-600"
              />
            </div>

          </div>

        </SparkCard>

        {/* TOTAL APPLICANTS */}
        <SparkCard
          className="
            p-6
            bg-[#F8F5FF]
            border
            border-violet-100
            rounded-3xl
            shadow-sm
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm font-semibold text-slate-600">
                Total Applicants
              </p>

              <h3 className="text-3xl font-black text-violet-600 mt-2">
                {
                  jobs.reduce(
                    (sum, job) =>
                      sum + job.applicants,
                    0
                  )
                }
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-violet-100">
              <Users
                size={24}
                className="text-violet-600"
              />
            </div>

          </div>

        </SparkCard>

        {/* ACTIVE PIPELINES */}
        <SparkCard
          className="
            p-6
            bg-[#EEFDF3]
            border
            border-emerald-100
            rounded-3xl
            shadow-sm
          "
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-sm font-semibold text-slate-600">
                Active Pipelines
              </p>

              <h3 className="text-3xl font-black text-emerald-600 mt-2">
                {jobs.length}
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-emerald-100">
              <TrendingUp
                size={24}
                className="text-emerald-600"
              />
            </div>

          </div>

        </SparkCard>

      </div>

      {/* JOB CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {jobs.map((job, index) => (

          <SparkCard
            key={job.id}
            className={`
              p-8
              rounded-3xl
              border
              shadow-sm
              transition-all
              hover:scale-[1.02]
              ${
                index % 2 === 0
                  ? 'bg-[#EEF4FF] border-blue-100'
                  : 'bg-[#F8F5FF] border-violet-100'
              }
            `}
          >

            {/* TOP */}
            <div className="flex justify-between items-start mb-6">

              <div>

                <h3 className="font-black text-slate-800 text-xl">
                  {job.title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {job.dept} Department
                </p>

              </div>

              {/* STATUS */}
              <span
                className={`
                  px-3
                  py-1
                  text-[10px]
                  font-black
                  uppercase
                  rounded-full
                  ${
                    job.status === 'Open'
                      ? 'bg-emerald-100 text-emerald-700'
                      : job.status === 'Urgent'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }
                `}
              >
                {job.status}
              </span>

            </div>

            {/* APPLICANTS */}
            <div className="space-y-3">

              <div className="flex justify-between text-sm">

                <span className="text-slate-600 font-medium">
                  Applicants
                </span>

                <span className="text-slate-800 font-black">
                  {job.applicants}
                </span>

              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-slate-100">

                <div
                  className={`
                    h-3
                    rounded-full
                    transition-all
                    ${
                      index % 2 === 0
                        ? 'bg-blue-500'
                        : 'bg-violet-500'
                    }
                  `}
                  style={{
                    width: `${Math.min(
                      (job.applicants / 10) * 100,
                      100
                    )}%`
                  }}
                />

              </div>

              <p className="text-xs text-slate-500">
                Hiring progress tracking
              </p>

            </div>

          </SparkCard>

        ))}

      </div>

    </div>

  );

};

export default RecruitmentModule;