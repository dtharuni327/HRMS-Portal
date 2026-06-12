import {
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type FC,
  useMemo,
  useState,
} from 'react';

import {
  Search,
  Plus,
  X,
  Star,
  Download,
  Eye,
} from 'lucide-react';

import {
  SparkCard,
  type Employee,
} from '../managerShared';

interface EmployeeFormData {
  name: string;

  username: string;

  password: string;

  email: string;

  phone: string;

  aadhaarNumber: string;

  panNumber: string;

  address: string;

  bankName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  passportNumber: string;
  uan: string;
  pfNumber: string;
  esiNumber: string;
  taxState: string;

  role: string;

  designation: string;

  dept: string;

  location: string;

  reportingManager: string;

  salary: string;

  experience: string;

  joiningDate: string;

  birthday: string;

  gender: string;

  workMode: 'WFH' | 'Office' | 'Hybrid' | '';
}

interface EmployeesModuleProps {
  employees: Employee[];
  setEmployees: Dispatch<
    SetStateAction<Employee[]>
  >;

  staffSearch: string;

  setStaffSearch: Dispatch<
    SetStateAction<string>
  >;

  isAdding: boolean;

  setIsAdding: Dispatch<
    SetStateAction<boolean>
  >;

  formData: EmployeeFormData;

  setFormData: Dispatch<
    SetStateAction<EmployeeFormData>
  >;

  handleSaveEmployee: (
    e: FormEvent
  ) => void;

  startEditEmployee: (
    employee: Employee
  ) => void;
}

const hrRoles = [
  'HR Executive',
  'HR Manager',
  'Recruiter',
  'Talent Acquisition Specialist',
  'Payroll Specialist',
  'Learning & Development Manager',
  'HR Business Partner',
  'HR Coordinator',
  'Compensation & Benefits Analyst',
];

const departmentRoles: Record<string, string[]> = {
  Administration: [
    'Office Admin',
    'Receptionist',
    'Office Coordinator',
    'Executive Assistant',
    'Front Desk Staff',
    'Facilities/Admin Executive',
    'Document & Records Staff',
  ],
  Technology: [
    'Associate Software Engineer',
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer',
    'UI/UX Designer',
    'QA Engineer / Tester',
    'DevOps Engineer',
    'System Administrator',
    'Network Engineer',
    'Database Administrator (DBA)',
    'Cybersecurity Analyst',
    'Cloud Engineer',
    'Technical Lead',
    'Engineering Manager',
    'IT Support Executive',
    'Help Desk Technician',
    'Data Engineer',
    'AI/ML Engineer',
  ],
  Operations: [
    'Operations Executive',
    'Operations Manager',
    'Project Coordinator',
    'Project Manager',
    'Delivery Manager',
    'Business Operations Associate',
    'Process Coordinator',
    'Client Success Executive',
    'Resource Manager',
    'Vendor Coordinator',
    'Service Delivery Executive',
    'Workflow Coordinator',
  ],
  'Human Resources': hrRoles,
  Management: [
    'Director',
    'General Manager',
    'Delivery Head',
    'Project Manager',
    'Operations Manager',
    'Business Manager',
  ],
  Finance: [
    'Accountant',
    'Senior Accountant',
    'Finance Executive',
    'Finance Manager',
    'Accounts Executive',
    'Accounts Manager',
    'Payroll Executive',
    'Payroll Manager',
    'Billing Executive',
    'Tax Consultant',
    'Auditor',
    'Financial Analyst',
    'Budget Analyst',
  ],
  'Sales & Marketing': [
    'Sales Executive',
    'Senior Sales Executive',
    'Business Development Executive (BDE)',
    'Business Development Manager (BDM)',
    'Sales Manager',
    'Account Manager',
    'Client Relationship Manager',
    'IT Sales Executive',
    'Digital Marketing Executive',
    'SEO Specialist',
    'Social Media Manager',
    'Content Writer',
    'Content Marketing Executive',
    'Graphic Designer',
    'Marketing Analyst',
  ],
};

const EmployeesModule: FC<
  EmployeesModuleProps
> = ({
  employees,
  setEmployees,
  staffSearch,
  setStaffSearch,
  isAdding,
  setIsAdding,
  formData,
  setFormData,
  handleSaveEmployee,
}) => {

  const [
    selectedEmployee,
    setSelectedEmployee,
  ] = useState<Employee | null>(
    null
  );

  const [
    showProfile,
    setShowProfile,
  ] = useState(false);

  const [
    isEditingProfile,
    setIsEditingProfile,
  ] = useState(false);

  const [
    editingData,
    setEditingData,
  ] = useState<Employee | null>(null);

  // local filters
  const [filterDept, setFilterDept] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // track deactivated employees locally (IDs)
  const [deactivatedIds, setDeactivatedIds] = useState<number[]>([]);

  const departments = useMemo(
    () => Object.keys(departmentRoles),
    []
  );

  const roleOptions = useMemo(() => {
    if (filterDept) {
      return departmentRoles[filterDept] ?? [];
    }
    return Array.from(new Set(Object.values(departmentRoles).flat())).sort();
  }, [filterDept]);

  const filteredEmployees = useMemo(
    () =>
      employees.filter((emp) => {
        const q = staffSearch.trim().toLowerCase();
        if (
          q &&
          !emp.name.toLowerCase().includes(q) &&
          !(emp.email || '').toLowerCase().includes(q)
        )
          return false;
        if (filterDept && emp.dept !== filterDept) return false;
        if (filterRole && emp.role !== filterRole) return false;
        if (filterStatus) {
          if (filterStatus === 'active' && deactivatedIds.includes(emp.id)) return false;
          if (filterStatus === 'inactive' && !deactivatedIds.includes(emp.id)) return false;
        }
        return true;
      }),
    [employees, staffSearch, filterDept, filterRole, filterStatus, deactivatedIds]
  );

  const exportEmployeesCsv = () => {

    const headers = [
      'ID',
      'Name',
      'Role',
      'Department',
      'Salary',
      'Experience',
      'Join Date',
      'MVP',
    ];

    const rows = filteredEmployees.map((emp) => [
        emp.id,
        emp.name,
        emp.role,
        emp.dept,
        emp.salary,
        emp.experience,
        emp.joinDate ?? '',
        emp.isMVP ? 'Yes' : 'No',
      ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((cell) =>
            String(cell).replace(
              /"/g,
              '""'
            )
          )
          .map(
            (cell) => `"${cell}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'employees_export.csv'
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 w-full min-w-0 px-6 py-6">

      {/* TOP BAR */}
      <SparkCard className="bg-white border-slate-200 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between w-full">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-violet-300 text-slate-900"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filterDept}
              onChange={(e) => {
                setFilterDept(e.target.value);
                setFilterRole('');
              }}
              className="min-w-[170px] px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="min-w-[170px] px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl"
            >
              <option value="">All Roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="min-w-[140px] px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={() => {
                setStaffSearch('');
                setFilterDept('');
                setFilterRole('');
                setFilterStatus('');
              }}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={exportEmployeesCsv}
              className="bg-sky-100 hover:bg-sky-200 text-sky-700 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
            >
              <Download size={18} />
              Export CSV
            </button>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-violet-100 hover:bg-violet-200 text-violet-700 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
            >
              {isAdding ? <X size={20} /> : <Plus size={20} />}
              {isAdding ? 'Cancel' : 'Add Employee'}
            </button>
          </div>
        </div>
      </SparkCard>

      {/* FORM */}
      {isAdding && (

        <SparkCard
          className="
            p-8
            bg-white
            border
            border-slate-200
            rounded-3xl
          "
        >

          <form
            onSubmit={(e) => {

              handleSaveEmployee(e);

              alert(
                'Employee created successfully. Credentials sent to employee email.'
              );
            }}
            className="grid grid-cols-2 gap-4"
          >

            <input
              required
              placeholder="Full Name"
              className="
  p-4
  bg-white
  border
  border-slate-300
  rounded-2xl
  outline-none
  text-slate-900
  placeholder:text-slate-500
  focus:ring-2
  focus:ring-violet-300
  focus:border-violet-400
  transition-all
"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name:
                    e.target.value,
                })
              }
            />

            <input
              required
              placeholder="Username"
              className="
  p-4
  bg-white
  border
  border-slate-300
  rounded-2xl
  outline-none
  text-slate-900
  placeholder:text-slate-500
  focus:ring-2
  focus:ring-violet-300
  focus:border-violet-400
"
              value={
                formData.username
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username:
                    e.target.value,
                })
              }
            />

            <input
              required
              type="password"
              placeholder="Password"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={
                formData.password
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password:
                    e.target.value,
                })
              }
            />

            <input
              required
              type="email"
              placeholder="Email Address"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              required
              placeholder="Phone Number"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone:
                    e.target.value,
                })
              }
            />

            <select
              required
              className="p-4 bg-white border border-slate-300 rounded-2xl outline-none text-slate-900 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition-all"
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value,
                })
              }
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              required
              placeholder="Aadhaar Number"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={
                formData.aadhaarNumber
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  aadhaarNumber:
                    e.target.value,
                })
              }
            />

            <input
              required
              placeholder="PAN Number"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={
                formData.panNumber
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  panNumber:
                    e.target.value,
                })
              }
            />

            <input
              required
              placeholder="Address"
              className="p-4 bg-white border border-slate-200 rounded-2xl outline-none"
              value={
                formData.address
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address:
                    e.target.value,
                })
              }
            />

            <div className="col-span-2 rounded-3xl border border-violet-100 bg-violet-50/80 p-4">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.35em] text-violet-700">Bank & Compliance Details</p>
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Bank Name" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                <input placeholder="Account Number" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                <input placeholder="IFSC Code" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.ifsc} onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })} />
                <input placeholder="Branch" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                <input placeholder="Emergency Contact Name" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.emergencyContactName} onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} />
                <input placeholder="Emergency Contact Phone" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.emergencyContactPhone} onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })} />
                <input placeholder="Blood Group" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} />
                <input placeholder="Marital Status" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.maritalStatus} onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })} />
                <input placeholder="Nationality" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                <input placeholder="Passport Number" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.passportNumber} onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })} />
                <input placeholder="UAN" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.uan} onChange={(e) => setFormData({ ...formData, uan: e.target.value })} />
                <input placeholder="PF Number" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.pfNumber} onChange={(e) => setFormData({ ...formData, pfNumber: e.target.value })} />
                <input placeholder="ESI Number" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.esiNumber} onChange={(e) => setFormData({ ...formData, esiNumber: e.target.value })} />
                <input placeholder="Tax State" className="p-4 bg-white border border-slate-200 rounded-2xl outline-none" value={formData.taxState} onChange={(e) => setFormData({ ...formData, taxState: e.target.value })} />
              </div>
            </div>

            {/* DEPARTMENT */}
<select
  required
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.dept}
  onChange={(e) =>
    setFormData({
      ...formData,
      dept: e.target.value,
      role: '',
    })
  }
>

  <option
    value=""
    style={{
      color: '#0f172a',
      backgroundColor: '#ffffff',
    }}
  >
    Select Department
  </option>

  {Object.keys(
    departmentRoles
  ).map((dept) => (

    <option
      key={dept}
      value={dept}
      style={{
        color: '#0f172a',
        backgroundColor: '#ffffff',
      }}
    >
      {dept}
    </option>

  ))}

</select>
{/* ROLE */}
<select
  required
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.role}
  onChange={(e) =>
    setFormData({
      ...formData,
      role: e.target.value,
    })
  }
>

  <option
    value=""
    style={{
      color: '#0f172a',
      backgroundColor: '#ffffff',
    }}
  >
    Select Role
  </option>

  {departmentRoles[formData.dept]?.map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ))}

</select>

{/* DESIGNATION */}
<input
  required
  placeholder="Designation"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.designation}
  onChange={(e) =>
    setFormData({
      ...formData,
      designation: e.target.value,
    })
  }
/>

{/* WORK MODE */}
<select
  required
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.workMode}
  onChange={(e) =>
    setFormData({
      ...formData,
      workMode: e.target.value as 'WFH' | 'Office' | 'Hybrid' | '',
    })
  }
>
  <option value="">Select Work Mode</option>
  <option value="WFH">WFH</option>
  <option value="Office">Office</option>
  <option value="Hybrid">Hybrid</option>
</select>

{/* LOCATION */}
<input
  required
  placeholder="Location"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.location}
  onChange={(e) =>
    setFormData({
      ...formData,
      location: e.target.value,
    })
  }
/>

{/* REPORTING MANAGER */}
<input
  required
  placeholder="Reporting Manager"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.reportingManager}
  onChange={(e) =>
    setFormData({
      ...formData,
      reportingManager:
        e.target.value,
    })
  }
/>

{/* BIRTHDAY */}
<input
  required
  type="date"
  placeholder="Birthday"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.birthday}
  onChange={(e) =>
    setFormData({
      ...formData,
      birthday: e.target.value,
    })
  }
/>

{/* EXPERIENCE */}
<input
  required
  type="number"
  placeholder="Experience"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.experience}
  onChange={(e) =>
    setFormData({
      ...formData,
      experience: e.target.value,
    })
  }
/>

{/* SALARY */}
<input
  required
  type="number"
  placeholder="Salary"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    placeholder:text-slate-500
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.salary}
  onChange={(e) =>
    setFormData({
      ...formData,
      salary: e.target.value,
    })
  }
/>

{/* JOINING DATE */}
<input
  required
  type="date"
  className="
    p-4
    bg-white
    border
    border-slate-300
    rounded-2xl
    outline-none
    text-slate-900
    focus:ring-2
    focus:ring-violet-300
    focus:border-violet-400
    transition-all
  "
  value={formData.joiningDate}
  onChange={(e) =>
    setFormData({
      ...formData,
      joiningDate:
        e.target.value,
    })
  }
/>

{/* SUBMIT */}
<button
  type="submit"
  className="
    col-span-2
    bg-violet-100
    hover:bg-violet-200
    text-violet-700
    py-4
    rounded-2xl
    font-black
    uppercase
    transition-all
  "
>
  Add Employee
</button>

          </form>

        </SparkCard>

      )}

      {/* TABLE */}
      <SparkCard
        className="
          overflow-hidden
          bg-white
          border
          border-slate-200
          rounded-3xl
          w-full
          min-w-0
        "
      >

        <div className="overflow-x-auto min-w-0">

          <table className="w-full">

            <thead
              className="
                bg-violet-100
                text-violet-700
                uppercase
                text-xs
              "
            >

              <tr>

                <th className="px-8 py-5">
                  Employee Name
                </th>

                <th className="px-8 py-5">
                  Role
                </th>

                <th className="px-8 py-5">
                  Department
                </th>

                <th className="px-8 py-5">
                  Salary
                </th>

                <th className="px-8 py-5">
                  Experience
                </th>

                <th className="px-8 py-5">
                  MVP
                </th>

                <th className="px-8 py-5">
                  Status
                </th>

                <th className="px-8 py-5">
                  Actions
                </th>

              </tr>

            </thead>

           <tbody>

  {filteredEmployees.map((emp, index) => (

      <tr
        key={emp.id}
        className={`
          border-b
          border-slate-200
          ${
            index % 2 === 0
              ? 'bg-[#EEF4FF]'
              : 'bg-[#F8F5FF]'
          }
        `}
      >

        {/* NAME */}
        <td className="px-8 py-6">

          <div>

            <p className="font-bold text-slate-900 text-lg">
              {emp.name}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              ID: #{emp.id}
            </p>

          </div>

        </td>

        {/* ROLE */}
        <td className="px-8 py-6 text-slate-800 font-medium">
          {emp.role}
        </td>

        {/* DEPARTMENT */}
        <td className="px-8 py-6 text-slate-800 font-medium">
          {emp.dept}
        </td>

        {/* SALARY */}
        <td className="px-8 py-6 text-emerald-600 font-bold">
          ₹{emp.salary.toLocaleString()}
        </td>

        {/* EXPERIENCE */}
        <td className="px-8 py-6 text-slate-700">
          {emp.experience} yrs
        </td>

        {/* MVP */}
        <td className="px-8 py-6">

          <button
            onClick={() => {

              setEmployees(
                (prev) =>
                  prev.map(
                    (employee) =>
                      employee.id ===
                      emp.id
                        ? {
                            ...employee,
                            isMVP:
                              !employee.isMVP,
                          }
                        : employee
                  )
              );
            }}
          >

            <Star
              size={20}
              className={
                emp.isMVP
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-slate-400'
              }
            />

          </button>

        </td>

        {/* STATUS */}
        <td className="px-8 py-6">

          <span
            className={`
              px-3
              py-1
              rounded-full
              text-xs
              font-black
              uppercase
              ${deactivatedIds.includes(emp.id) ? 'bg-red-100 text-red-700' : emp.isMVP ? 'bg-violet-100 text-violet-700' : 'bg-slate-200 text-slate-700'}
            `}
          >
            {deactivatedIds.includes(emp.id) ? 'INACTIVE' : emp.isMVP ? 'MVP' : 'ACTIVE'}
          </span>

        </td>

        {/* ACTIONS */}
        <td className="px-8 py-6">

          <div className="flex gap-2">

            {/* VIEW */}
            <button
              onClick={() => {
                setSelectedEmployee(emp);
                setShowProfile(true);
              }}
              className="
                px-4
                py-2
                bg-emerald-100
                hover:bg-emerald-200
                text-emerald-700
                rounded-xl
                text-xs
                font-bold
                flex
                items-center
                gap-1
              "
            >

              <Eye size={14} />

              View

            </button>

            {/* EDIT */}
            <button
              onClick={() => {
                setSelectedEmployee(emp);
                setEditingData(emp);
                setIsEditingProfile(true);
                setShowProfile(true);
              }}
              className="
                px-4
                py-2
                bg-blue-100
                hover:bg-blue-200
                text-blue-700
                rounded-xl
                text-xs
                font-bold
              "
            >
              Edit
            </button>

            {/* DEACTIVATE / ACTIVATE */}
            {deactivatedIds.includes(emp.id) ? (
              <button
                onClick={() => {
                  if (!confirm(`Activate ${emp.name}?`)) return;
                  setDeactivatedIds((prev) => prev.filter((id) => id !== emp.id));
                }}
                className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl"
              >
                Activate
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!confirm(`Deactivate ${emp.name}?`)) return;
                  setDeactivatedIds((prev) => [...prev, emp.id]);
                }}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl"
              >
                Deactivate
              </button>
            )}

          </div>

        </td>

      </tr>

    ))}

</tbody>

          </table>

        </div>

      </SparkCard>

      {/* PROFILE MODAL */}
      {showProfile &&
        selectedEmployee && (

          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/50
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-[1200px]
                max-h-[85vh]
                overflow-y-auto
                rounded-3xl
                bg-white
                p-4
                sm:p-6
              "
            >

              <div className="flex justify-between items-start mb-8">

                <div>

                  <h2 className="text-3xl font-black text-slate-900">
                    {isEditingProfile && editingData
                      ? editingData.name
                      : selectedEmployee.name
                    }
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Employee Profile Details
                  </p>

                </div>

                <button
                  onClick={() => {
                    setShowProfile(false);
                    setIsEditingProfile(false);
                    setEditingData(null);
                  }}
                  className="
                    p-3
                    rounded-2xl
                    bg-slate-100
                    hover:bg-slate-200
                  "
                >

                  <X size={20} />

                </button>

              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">

                {/* Employee ID */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Employee ID
                  </p>
                  <h4 className="font-bold text-slate-900 mt-2">
                    {selectedEmployee.employeeId ||
                      `EMP-${selectedEmployee.id}`}
                  </h4>
                </div>

                {/* Email */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Email
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      type="email"
                      value={editingData.email || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          email: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.email}
                    </h4>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Phone
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      type="tel"
                      value={editingData.phone || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          phone: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.phone}
                    </h4>
                  )}
                </div>

                {/* Aadhaar Number */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Aadhaar Number
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.aadhaarNumber || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          aadhaarNumber: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.aadhaarNumber}
                    </h4>
                  )}
                </div>

                {/* PAN Number */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    PAN Number
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.panNumber || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          panNumber: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.panNumber}
                    </h4>
                  )}
                </div>

                {/* Address */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Address
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.address || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          address: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.address}
                    </h4>
                  )}
                </div>

                {/* Department */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Department
                  </p>
                  <h4 className="font-bold text-slate-900 mt-2">
                    {selectedEmployee.dept}
                  </h4>
                </div>

                {/* Gender */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Gender
                  </p>
                  {isEditingProfile && editingData ? (
                    <select
                      value={editingData.gender || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          gender: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.gender || '-'}
                    </h4>
                  )}
                </div>

                {/* Role */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Role
                  </p>
                  <h4 className="font-bold text-slate-900 mt-2">
                    {selectedEmployee.role}
                  </h4>
                </div>

                {/* Designation */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Designation
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.designation || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          designation: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.designation}
                    </h4>
                  )}
                </div>

                {/* Reporting Manager */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Reporting Manager
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.reportingManager || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          reportingManager: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.reportingManager}
                    </h4>
                  )}
                </div>

                {/* Location */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Location
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      value={editingData.location || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          location: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.location}
                    </h4>
                  )}
                </div>

                {/* Birthday */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Birthday
                  </p>
                  {isEditingProfile && editingData ? (
                    <input
                      type="date"
                      value={editingData.birthday || ''}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          birthday: e.target.value,
                        })
                      }
                      className="
                        w-full
                        mt-2
                        px-4
                        py-2
                        border
                        border-slate-300
                        rounded-xl
                        text-slate-900
                        focus:ring-2
                        focus:ring-blue-300
                        focus:border-blue-400
                      "
                    />
                  ) : (
                    <h4 className="font-bold text-slate-900 mt-2">
                      {selectedEmployee.birthday || '-'}
                    </h4>
                  )}
                </div>

                {/* Joining Date */}
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    Joining Date
                  </p>
                  <h4 className="font-bold text-slate-900 mt-2">
                    {selectedEmployee.joinDate}
                  </h4>
                </div>

              </div>

              {/* FOOTER BUTTONS */}
              <div className="mt-10 flex gap-3 justify-end">
                {isEditingProfile ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditingData(null);
                      }}
                      className="
                        px-6
                        py-2.5
                        bg-slate-200
                        hover:bg-slate-300
                        text-slate-900
                        rounded-xl
                        text-sm
                        font-bold
                      "
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (editingData) {
                          setEmployees((prev) =>
                            prev.map((emp) =>
                              emp.id === editingData.id
                                ? editingData
                                : emp
                            )
                          );
                          setSelectedEmployee(editingData);
                          setIsEditingProfile(false);
                          setEditingData(null);
                          alert('Employee details updated successfully!');
                        }
                      }}
                      className="
                        px-6
                        py-2.5
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        rounded-xl
                        text-sm
                        font-bold
                      "
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingProfile(true);
                      setEditingData(selectedEmployee);
                    }}
                    className="
                      px-6
                      py-2.5
                      bg-blue-100
                      hover:bg-blue-200
                      text-blue-700
                      rounded-xl
                      text-sm
                      font-bold
                    "
                  >
                    Edit Profile
                  </button>
                )}
              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default EmployeesModule;