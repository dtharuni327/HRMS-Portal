// =========================
// REPORTS MODULE UPDATED
// Premium Pastel Dashboard UI
// =========================

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
  BarChart3,
  Files,
  TrendingUp
} from 'lucide-react';

import { SparkCard } from '../hrShared';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ReportsModuleProps {
  reports: string[];
  isAddingReport: boolean;
  setIsAddingReport: Dispatch<SetStateAction<boolean>>;
  reportForm: { name: string };
  setReportForm: Dispatch<
    SetStateAction<{ name: string }>
  >;
  handleAddReport: (e: FormEvent) => void;

  performanceData: {
    dept: string;
    rating: number;
  }[];
}

const ReportsModule: FC<ReportsModuleProps> = ({
  reports,
  isAddingReport,
  setIsAddingReport,
  reportForm,
  setReportForm,
  handleAddReport,
  performanceData,
}) => {

  const averagePerformance =
    performanceData.length > 0
      ? Math.round(
          performanceData.reduce(
            (sum, item) =>
              sum + item.rating,
            0
          ) / performanceData.length
        )
      : 0;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

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
                {performanceData.length}
              </h3>

            </div>

            <div className="p-3 rounded-2xl bg-violet-100">

              <BarChart3
                size={24}
                className="text-violet-600"
              />

            </div>

          </div>

        </SparkCard>

        {/* AVG PERFORMANCE */}
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
                Avg Performance
              </p>

              <h3 className="text-3xl font-black text-emerald-600 mt-2">
                {averagePerformance}%
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
              required
              placeholder="Enter PDF filename"
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
              value={reportForm.name}
              onChange={e =>
                setReportForm({
                  name: e.target.value
                })
              }
            />

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

      {/* CHART + FILES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ANALYTICS */}
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

          <h4 className="font-black mb-6 text-violet-700 text-sm uppercase tracking-widest">
            Performance Analytics
          </h4>

          <div className="h-56">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={performanceData}
                barSize={28}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="dept"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: '#64748B',
                    fontSize: 12
                  }}
                />

                <YAxis hide />

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px'
                  }}
                />

                <Bar
                  dataKey="rating"
                  fill="#8B5CF6"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </SparkCard>

        {/* FILES */}
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
              key={file}
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
                  {file}
                </span>

              </div>

              <Download
                size={18}
                className="
                  text-slate-500
                  cursor-pointer
                  hover:text-violet-600
                  transition-colors
                "
              />

            </div>

          ))}

        </SparkCard>

      </div>

    </div>

  );

};

export default ReportsModule;