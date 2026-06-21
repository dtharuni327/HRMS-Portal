import {
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type FC
} from 'react';

import {
  Plus,
  X,
  FileBarChart,
  Download,
  Files
} from 'lucide-react';

import { SparkCard } from './hrShared.tsx';

export interface ReportItem {
  id: number;
  name: string;
  url: string;
}

interface ReportsModuleProps {
  reports: ReportItem[];
  isAddingReport: boolean;
  setIsAddingReport: Dispatch<SetStateAction<boolean>>;
  reportForm: { file: File | null };
  setReportForm: Dispatch<SetStateAction<{ file: File | null }>>;
  handleAddReport: (e: FormEvent) => void;
}

const ReportsModule: FC<ReportsModuleProps> = ({
  reports,
  isAddingReport,
  setIsAddingReport,
  reportForm,
  setReportForm,
  handleAddReport,
}) => {
  const handleDownload = (report: ReportItem) => {
    const link = document.createElement('a');
    link.href = report.url;
    link.download = report.name;
    link.click();
  };

  return (

    <div className="space-y-6 animate-in zoom-in-95">

      {/* HEADER */}
      <div className="w-full flex justify-end items-center">


        {/* BUTTON */}
        <button
          onClick={() =>
            setIsAddingReport(!isAddingReport)
          }
          className="
            bg-[#F3E8FF]
            hover:bg-[#E9D5FF]
            text-violet-700
            px-6
            py-3
            rounded-2xl
            font-black
            text-xs
            uppercase
            flex
            items-center
            gap-2
            transition-all
            border
            border-violet-200
            shadow-md
            hover:scale-105
          "
        >

          {isAddingReport ? (
            <X size={16} />
          ) : (
            <Plus size={16} />
          )}

          {isAddingReport
            ? 'Cancel'
            : 'Add Report'}

        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* REPORTS */}
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
                Total Reports
              </p>

              <h3 className="text-3xl font-black text-blue-600 mt-2">
                {reports.length}
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-blue-100">

              <Files
                size={24}
                className="text-blue-600"
              />

            </div>

          </div>

        </SparkCard>

        {/* DEPARTMENTS */}
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
                Departments
              </p>

              <h3 className="text-3xl font-black text-violet-600 mt-2">
                5
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-violet-100">

              <FileBarChart
                size={24}
                className="text-violet-600"
              />

            </div>

          </div>

        </SparkCard>

      </div>

      {/* ADD REPORT FORM */}
      {isAddingReport && (

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
            Upload New Report
          </h3>

          <form
            onSubmit={handleAddReport}
            className="flex flex-col md:flex-row gap-4"
          >

            <input
              type="file"
              accept=".pdf"
              required
              className="
                flex-1
                p-4
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-2xl
                outline-none
                focus:border-violet-300
                text-slate-800
              "
              onChange={(e) =>
                setReportForm({
                  file: e.target.files?.[0] || null
                })
              }
            />

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 md:self-center">
              {reportForm.file ? `Selected: ${reportForm.file.name}` : 'Select a PDF report to upload'}
            </p>

            <button
              type="submit"
              className="
                bg-[#EDE9FE]
                hover:bg-[#DDD6FE]
                text-violet-700
                px-8
                py-4
                rounded-2xl
                font-black
                uppercase
                text-xs
                border
                border-violet-200
                transition-all
              "
            >
              Upload Report
            </button>

          </form>

        </SparkCard>

      )}

      {/* FILES */}
      <div className="grid grid-cols-1 gap-8">

        <SparkCard
          className="
            p-8
            space-y-4
            bg-white/90
            border
            border-slate-200
            rounded-3xl
            shadow-xl
          "
        >

          <h4 className="font-black mb-2 text-violet-700 text-sm uppercase tracking-widest">
            Recent Files
          </h4>

          {reports.map((file, index) => (

            <div
              key={file.id}
              className={`
                flex
                justify-between
                items-center
                p-4
                rounded-2xl
                border
                transition-all
                hover:scale-[1.01]
                ${
                  index % 2 === 0
                    ? 'bg-[#EEF4FF] border-blue-100'
                    : 'bg-[#F8F5FF] border-violet-100'
                }
              `}
            >

              <div className="flex items-center gap-3">

                <FileBarChart
                  size={20}
                  className={
                    index % 2 === 0
                      ? 'text-blue-600'
                      : 'text-violet-600'
                  }
                />

                <span className="text-sm font-semibold text-slate-800">
                  {file.name}
                </span>

              </div>

              <button
                type="button"
                onClick={() => handleDownload(file)}
                className="text-slate-500 hover:text-violet-600 transition-colors"
                aria-label={`Download ${file.name}`}
                title="Download"
              >
                <Download size={18} />
              </button>

            </div>

          ))}

        </SparkCard>

      </div>

    </div>

  );

};

export default ReportsModule;