import {
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type FC,
} from 'react';

import {
  Search,
  Plus,
  X,
  Star,
  Trash2,
  Download,
} from 'lucide-react';

import {
  SparkCard,
  type Employee,
} from '../hrShared';

interface EmployeeFormData {
  name: string;
  role: string;
  dept: string;
  salary: string;
  experience: string;
}

interface EmployeesModuleProps {
  employees: Employee[];
  setEmployees: Dispatch<SetStateAction<Employee[]>>;
  staffSearch: string;
  setStaffSearch: Dispatch<SetStateAction<string>>;
  isAdding: boolean;
  setIsAdding: Dispatch<SetStateAction<boolean>>;
  formData: EmployeeFormData;
  setFormData: Dispatch<SetStateAction<EmployeeFormData>>;
  handleSaveEmployee: (e: FormEvent) => void;
  startEditEmployee: (employee: Employee) => void;
}

const EmployeesModule: FC<EmployeesModuleProps> = ({
  employees,
  setEmployees,
  staffSearch,
  setStaffSearch,
  isAdding,
  setIsAdding,
  formData,
  setFormData,
  handleSaveEmployee,
  startEditEmployee,
}) => {
  const exportEmployeesCsv = () => {
    const headers = ['ID', 'Name', 'Role', 'Department', 'Salary', 'Experience', 'Join Date', 'MVP'];
    const rows = employees
      .filter((emp) =>
        emp.name.toLowerCase().includes(staffSearch.toLowerCase())
      )
      .map((emp) => [
        emp.id,
        emp.name,
        emp.role,
        emp.dept,
        emp.salary,
        emp.experience,
        emp.joinDate ?? '',
        emp.isMVP ? 'Yes' : 'No',
      ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => String(cell).replace(/"/g, '""'))
          .map((cell) => `"${cell}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">

    {/* TOP BAR */}
    <div className="flex justify-between items-center gap-4 flex-wrap">

      {/* SEARCH */}
      <div className="relative flex-1 max-w-md">

        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          size={18}
        />

        <input
          value={staffSearch}
          onChange={(e) => setStaffSearch(e.target.value)}
          placeholder="Search employees..."
          className="
            w-full
            pl-12
            pr-6
            py-4
            bg-white
            border
            border-slate-200
            rounded-3xl
            outline-none
            focus:border-violet-300
            text-slate-900
            placeholder:text-slate-400
            transition-all
            shadow-sm
          "
        />

      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        <button
          onClick={exportEmployeesCsv}
          className="
            bg-[#E0F2FE]
            hover:bg-[#BAE6FD]
            text-sky-700
            px-5
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
            border-sky-200
            hover:scale-105
          "
        >
          <Download size={18} />
          Export CSV
        </button>

        <button
          onClick={() => setIsAdding(!isAdding)}
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
            hover:scale-105
          "
        >
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

    </div>

    {/* FORM */}
    {isAdding && (
      <SparkCard
        className="
          p-8
          animate-in
          zoom-in-95
          bg-white/90
          backdrop-blur-xl
          border
          border-slate-200
          rounded-3xl
          shadow-xl
        "
      >

        <form
          onSubmit={handleSaveEmployee}
          className="grid grid-cols-2 gap-4"
        >

          <input
            required
            placeholder="Full Name"
            className="
              p-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              outline-none
              focus:border-violet-300
              text-slate-900
              placeholder:text-slate-400
              transition-all
              shadow-sm
            "
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          <input
            required
            placeholder="Role"
            className="
              p-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              outline-none
              focus:border-violet-300
              text-slate-900
              placeholder:text-slate-400
              transition-all
              shadow-sm
            "
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value,
              })
            }
          />

          <input
            required
            placeholder="Department"
            className="
              p-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              outline-none
              focus:border-violet-300
              text-slate-900
              placeholder:text-slate-400
              transition-all
              shadow-sm
            "
            value={formData.dept}
            onChange={(e) =>
              setFormData({
                ...formData,
                dept: e.target.value,
              })
            }
          />

          <input
            required
            type="number"
            min={0}
            placeholder="Experience (years)"
            className="
              p-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              outline-none
              focus:border-violet-300
              text-slate-900
              placeholder:text-slate-400
              transition-all
              shadow-sm
            "
            value={formData.experience}
            onChange={(e) =>
              setFormData({
                ...formData,
                experience: e.target.value,
              })
            }
          />

          <input
            required
            type="number"
            placeholder="Salary"
            className="
              p-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              outline-none
              focus:border-violet-300
              text-slate-900
              placeholder:text-slate-400
              transition-all
              shadow-sm
            "
            value={formData.salary}
            onChange={(e) =>
              setFormData({
                ...formData,
                salary: e.target.value,
              })
            }
          />

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="
              col-span-2
              bg-[#DDD6FE]
              hover:bg-[#C4B5FD]
              text-violet-700
              py-3
              rounded-2xl
              font-black
              uppercase
              text-xs
              transition-all
              shadow-md
              border
              border-violet-200
              hover:scale-[1.02]
            "
          >
            Add Employee
          </button>

        </form>

      </SparkCard>
    )}

    {/* TABLE CARD */}
    <SparkCard
      className="
        overflow-hidden
        bg-white/90
        backdrop-blur-xl
        border
        border-slate-200
        rounded-3xl
        shadow-xl
      "
    >

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          {/* TABLE HEADER */}
          <thead
            className="
              bg-[#EDE9FE]
              text-violet-700
              text-[10px]
              uppercase
              font-black
              tracking-widest
            "
          >

            <tr>
              <th className="px-8 py-5">Employee Name</th>
              <th className="px-8 py-5">Role</th>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5">Salary</th>
              <th className="px-8 py-5">Experience</th>
              <th className="px-8 py-5">Join Date</th>
              <th className="px-8 py-5">MVP</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Actions</th>
            </tr>

          </thead>

          {/* TABLE BODY */}
          <tbody>

            {employees
              .filter((emp) =>
                emp.name
                  .toLowerCase()
                  .includes(staffSearch.toLowerCase())
              )
              .map((emp, index) => (

                <tr
                  key={emp.id}
                  className={`
                    transition-all
                    hover:bg-white/70
                    border-b
                    border-white/40
                    ${
                      index % 2 === 0
                        ? 'bg-[#EEF4FF]'
                        : 'bg-[#F8F5FF]'
                    }
                  `}
                >

                  {/* NAME */}
                  <td className="px-8 py-5">

                    <div>

                      <p className="font-bold text-slate-900">
                        {emp.name}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        ID: #{emp.id}
                      </p>

                    </div>

                  </td>

                  {/* ROLE */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {emp.role}
                  </td>

                  {/* DEPARTMENT */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {emp.dept}
                  </td>

                  {/* SALARY */}
                  <td className="px-8 py-5 text-emerald-600 font-bold">
                    ₹{emp.salary.toLocaleString()}
                  </td>

                  {/* EXPERIENCE */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {emp.experience} yr{emp.experience === 1 ? '' : 's'}
                  </td>

                  {/* JOIN DATE */}
                  <td className="px-8 py-5 text-slate-700 font-medium">
                    {emp.joinDate}
                  </td>

                  {/* MVP */}
                  <td className="px-8 py-5">

                    <button
                      onClick={() => {
                        // Toggle MVP flag but preserve original order
                        setEmployees(prev =>
                          prev.map(employee =>
                            employee.id === emp.id
                              ? { ...employee, isMVP: !employee.isMVP }
                              : employee
                          )
                        );
                      }}
                    >

                      <Star
                        size={18}
                        className={
                          emp.isMVP
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-400'
                        }
                      />

                    </button>

                  </td>

                  {/* STATUS */}
                  <td className="px-8 py-5">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-[10px]
                        font-black
                        uppercase
                        ${
                          emp.isMVP
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-slate-200 text-slate-700'
                        }
                      `}
                    >
                      {emp.isMVP ? 'MVP' : 'Active'}
                    </span>

                  </td>

                  {/* ACTIONS */}
                  <td className="px-8 py-5">

                    <div className="flex gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() => startEditEmployee(emp)}
                        className="
                          flex
                          items-center
                          gap-1
                          px-3
                          py-2
                          bg-blue-100
                          text-blue-700
                          rounded-lg
                          transition-all
                          font-bold
                          text-[10px]
                          uppercase
                          hover:scale-105
                        "
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                       onClick={() =>
  setEmployees(prev =>
    prev.filter(
      (e) => e.id !== emp.id
    )
  )
}
                        className="
                          flex
                          items-center
                          gap-1
                          px-3
                          py-2
                          bg-red-100
                          text-red-600
                          rounded-lg
                          transition-all
                          font-bold
                          text-[10px]
                          uppercase
                          hover:scale-105
                        "
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </SparkCard>

  </div>
);
}

export default EmployeesModule;