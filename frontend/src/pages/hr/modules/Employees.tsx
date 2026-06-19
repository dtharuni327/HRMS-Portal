import {
  type Dispatch,
  type SetStateAction,
  type FormEvent,
  type FC,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Search,
  Plus,
  X,
  Star,
  Download,
  Eye,
  PencilLine,
  UserX,
  RotateCcw,
  CalendarDays,
} from 'lucide-react';

import {
  SparkCard,
  type Employee,
  type WorkMode,
} from '../hrShared';

interface EmployeeFormData {
  name: string;

  username: string;

  password: string;

  email: string;

  phone: string;

  gender: string;

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

  workMode: WorkMode;
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

const formatDisplayDate = (value: string) => {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const addEmployeeFieldClass =
  'w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 outline-none placeholder:text-slate-500 caret-slate-900 focus:border-violet-400 focus:ring-2 focus:ring-violet-300 transition-all';

const addEmployeeSelectClass =
  'w-full rounded-2xl border border-slate-300 bg-white p-4 text-slate-900 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-300 transition-all';

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
  const birthdayInputRef = useRef<HTMLInputElement | null>(null);
  const joiningDateInputRef = useRef<HTMLInputElement | null>(null);

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

  const displayEmployee =
    isEditingProfile && editingData
      ? editingData
      : selectedEmployee;

  type ProfileField = {
    label: string;
    key: keyof Employee;
    fallbackKey?: keyof Employee;
    type?: string;
    value?: (emp: Employee) => string;
  };

  const profileFields: ProfileField[] = [
    { label: 'Employee ID', key: 'employeeId', value: (emp: Employee) => emp.employeeId || `EMP-${emp.id}` },
    { label: 'Email', key: 'email', type: 'email' },
    { label: 'Phone', key: 'phone', type: 'tel' },
    { label: 'Aadhaar Number', key: 'aadhaarNumber' },
    { label: 'PAN Number', key: 'panNumber' },
    { label: 'Address', key: 'address' },
    { label: 'Department', key: 'department', fallbackKey: 'dept' },
    { label: 'Role', key: 'role' },
    { label: 'Designation', key: 'designation' },
    { label: 'Reporting Manager', key: 'reportingManager' },
    { label: 'Location', key: 'location' },
    { label: 'Birthday', key: 'birthday', type: 'date' },
    { label: 'Joining Date', key: 'joinDate', value: (emp: Employee) => emp.joinDate || '-' },
  ] as const;

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

      <div className="flex justify-end">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-violet-100 px-3 py-1 font-semibold text-violet-700">
            Total Employees: {employees.length}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
            Showing: {filteredEmployees.length}
          </span>
        </div>
      </div>

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

          <div className="flex flex-col items-end gap-3">
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
            className="employee-form-grid grid grid-cols-2 gap-4"
            onSubmit={(e) => {

              handleSaveEmployee(e);

              alert(
  'Employee added successfully. Username, Password and Login Credentials have been generated and sent to the employee personal email.'
);
            }}
          >

            <input
              required
              placeholder="Full Name"
                className={addEmployeeFieldClass}
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
              type="email"
              placeholder="Personal Email Address"
              className={addEmployeeFieldClass}
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
  type="tel"
  placeholder="Phone Number"
  maxLength={10}
  value={formData.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData({
        ...formData,
        phone: value,
      });
    }
  }}
  className={addEmployeeFieldClass}
/>

            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gender: e.target.value,
                })
              }
              className={addEmployeeSelectClass}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
  required
  placeholder="Aadhaar Number"
  maxLength={14}
  value={formData.aadhaarNumber}
  onChange={(e) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 12);

    const formatted = value
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .trim();

    setFormData({
      ...formData,
      aadhaarNumber: formatted,
    });
  }}
  className={addEmployeeFieldClass}
/>

<input
  required
  placeholder="PAN Number (ABCDE1234F)"
  maxLength={10}
  value={formData.panNumber}
  onChange={(e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    setFormData({
      ...formData,
      panNumber: value,
    });
  }}
  className={addEmployeeFieldClass}
/>

            <input
              required
              placeholder="Address"
              className={addEmployeeFieldClass}
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
                <input placeholder="Bank Name" className={addEmployeeFieldClass} value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
                <input placeholder="Account Number" className={addEmployeeFieldClass} value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
                <input placeholder="IFSC Code" className={addEmployeeFieldClass} value={formData.ifsc} onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })} />
                <input placeholder="Branch" className={addEmployeeFieldClass} value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} />
                <input placeholder="Emergency Contact Name" className={addEmployeeFieldClass} value={formData.emergencyContactName} onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })} />
                <input placeholder="Emergency Contact Phone" className={addEmployeeFieldClass} value={formData.emergencyContactPhone} onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })} />
                <select
  value={formData.bloodGroup}
  onChange={(e) =>
    setFormData({
      ...formData,
      bloodGroup: e.target.value,
    })
  }
  className={addEmployeeSelectClass}
>
  <option value="">Select Blood Group</option>
  <option value="A+">A+</option>
  <option value="A-">A-</option>
  <option value="B+">B+</option>
  <option value="B-">B-</option>
  <option value="AB+">AB+</option>
  <option value="AB-">AB-</option>
  <option value="O+">O+</option>
  <option value="O-">O-</option>
</select><select
  value={formData.maritalStatus}
  onChange={(e) =>
    setFormData({
      ...formData,
      maritalStatus: e.target.value,
    })
  }
  className={addEmployeeSelectClass}
>
  <option value="">Select Marital Status</option>
  <option value="Single">Single</option>
  <option value="Married">Married</option>
  <option value="Divorced">Divorced</option>
  <option value="Widowed">Widowed</option>
</select><input placeholder="Nationality" className={addEmployeeFieldClass} value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                <input placeholder="Passport Number" className={addEmployeeFieldClass} value={formData.passportNumber} onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })} />
                <input placeholder="UAN" className={addEmployeeFieldClass} value={formData.uan} onChange={(e) => setFormData({ ...formData, uan: e.target.value })} />
                <input placeholder="PF Number" className={addEmployeeFieldClass} value={formData.pfNumber} onChange={(e) => setFormData({ ...formData, pfNumber: e.target.value })} />
                <input placeholder="ESI Number" className={addEmployeeFieldClass} value={formData.esiNumber} onChange={(e) => setFormData({ ...formData, esiNumber: e.target.value })} />
                <input placeholder="Tax State" className={addEmployeeFieldClass} value={formData.taxState} onChange={(e) => setFormData({ ...formData, taxState: e.target.value })} />
              </div>
            </div>

            {/* DEPARTMENT */}
<select
  required
  className={addEmployeeSelectClass}
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
  className={addEmployeeSelectClass}
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
  className={addEmployeeFieldClass}
  value={formData.designation}
  onChange={(e) =>
    setFormData({
      ...formData,
      designation: e.target.value,
    })
  }
/>
{/* LOCATION */}
<input
  required
  placeholder="Location"
  className={addEmployeeFieldClass}
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
  className={addEmployeeFieldClass}
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
<div className="relative">
    <input
      required
      type="text"
      inputMode="numeric"
      placeholder="Birthday"
      readOnly
      className="
        w-full
        p-4
        pr-12
        bg-white
        border
        border-slate-300
        rounded-2xl
        outline-none
        text-slate-900
        placeholder:text-slate-400
        focus:ring-2
        focus:ring-violet-300
        focus:border-violet-400
        transition-all
      "
      value={formatDisplayDate(formData.birthday)}
      onClick={() => birthdayInputRef.current?.showPicker?.()}
    />
    <button
      type="button"
      onClick={() => birthdayInputRef.current?.showPicker?.()}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-violet-50 p-2 text-violet-700 hover:bg-violet-100"
      aria-label="Open birthday calendar"
    >
      <CalendarDays size={16} />
    </button>
    <input
      ref={birthdayInputRef}
      type="date"
      value={formData.birthday}
      onChange={(e) =>
        setFormData({
          ...formData,
          birthday: e.target.value,
        })
      }
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      aria-hidden="true"
    />
  </div>

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
<div className="relative">
    <input
      required
      type="text"
      inputMode="numeric"
      placeholder="Joining Date"
      readOnly
      className="
        w-full
        p-4
        pr-12
        bg-white
        border
        border-slate-300
        rounded-2xl
        outline-none
        text-slate-900
        placeholder:text-slate-400
        focus:ring-2
        focus:ring-violet-300
        focus:border-violet-400
        transition-all
      "
      value={formatDisplayDate(formData.joiningDate)}
      onClick={() => joiningDateInputRef.current?.showPicker?.()}
    />
    <button
      type="button"
      onClick={() => joiningDateInputRef.current?.showPicker?.()}
      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-violet-50 p-2 text-violet-700 hover:bg-violet-100"
      aria-label="Open joining date calendar"
    >
      <CalendarDays size={16} />
    </button>
    <input
      ref={joiningDateInputRef}
      type="date"
      value={formData.joiningDate}
      onChange={(e) =>
        setFormData({
          ...formData,
          joiningDate: e.target.value,
        })
      }
      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      aria-hidden="true"
    />
  </div>

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
          ₹{(emp.salary ?? 0).toLocaleString()}
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
              type="button"
              onClick={() => {
                setSelectedEmployee(emp);
                setEditingData(null);
                setIsEditingProfile(false);
                setShowProfile(true);
              }}
              aria-label={`View ${emp.name}`}
              title="View"
              className="
                h-9
                w-9
                rounded-xl
                bg-emerald-100
                text-emerald-700
                hover:bg-emerald-200
                flex
                items-center
                justify-center
              "
            >
              <Eye size={16} />
            </button>

            {/* EDIT */}
            <button
              type="button"
              onClick={() => {
                const employeeForEdit = {
                  ...emp,
                  dept: emp.department ?? emp.dept ?? '',
                  department: emp.department ?? emp.dept ?? '',
                };

                setSelectedEmployee(employeeForEdit);
                setEditingData(employeeForEdit);
                setIsEditingProfile(true);
                setShowProfile(true);
              }}
              aria-label={`Edit ${emp.name}`}
              title="Edit"
              className="
                h-9
                w-9
                rounded-xl
                bg-blue-100
                text-blue-700
                hover:bg-blue-200
                flex
                items-center
                justify-center
              "
            >
              <PencilLine size={16} />
            </button>

            {/* DEACTIVATE / ACTIVATE */}
            {deactivatedIds.includes(emp.id) ? (
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`Activate ${emp.name}?`)) return;
                  setDeactivatedIds((prev) => prev.filter((id) => id !== emp.id));
                }}
                aria-label={`Activate ${emp.name}`}
                title="Activate"
                className="h-9 w-9 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center"
              >
                <RotateCcw size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`Deactivate ${emp.name}?`)) return;
                  setDeactivatedIds((prev) => [...prev, emp.id]);
                }}
                aria-label={`Deactivate ${emp.name}`}
                title="Deactivate"
                className="h-9 w-9 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 flex items-center justify-center"
              >
                <UserX size={16} />
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
        displayEmployee && (

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
                    {displayEmployee.name}
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

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 min-w-0">
                {profileFields.map((field) => {
                  const value = field.value
                    ? field.value(displayEmployee)
                    : (field.fallbackKey
                        ? (displayEmployee as Employee & Record<string, unknown>)[field.fallbackKey] ?? (displayEmployee as Employee & Record<string, unknown>)[field.key] ?? '-'
                        : (displayEmployee as Employee & Record<string, unknown>)[field.key] ?? '-');

                  return (
                    <div key={field.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                      <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400">{field.label}</p>
                      {isEditingProfile && editingData ? (
                        <input
                          type={field.type ?? 'text'}
                          value={
                            (field.fallbackKey
                              ? (editingData as Employee & Record<string, unknown>)[field.fallbackKey] ?? (editingData as Employee & Record<string, unknown>)[field.key] ?? ''
                              : (editingData as Employee & Record<string, unknown>)[field.key] ?? '') as string
                          }
                          onChange={(e) => {
                            const nextValue = e.target.value;
                            if (field.key === 'department') {
                              setEditingData({
                                ...editingData,
                                department: nextValue,
                                dept: nextValue,
                              });
                              return;
                            }

                            setEditingData({
                              ...editingData,
                              [field.key]: nextValue,
                            } as Employee);
                          }}
                          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                        />
                      ) : (
                        <p className="mt-2 text-sm font-semibold text-slate-900">{String(value)}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-xl font-black text-slate-900 mb-4">Additional Employee Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    ['Username', displayEmployee.username || '-'],
                    ['Gender', displayEmployee.gender || '-'],
                    ['Bank Name', displayEmployee.bankName || '-'],
                    ['Account Number', displayEmployee.accountNumber || '-'],
                    ['IFSC Code', displayEmployee.ifscCode || displayEmployee.ifsc || '-'],
                    ['Branch', displayEmployee.branch || '-'],
                    ['Emergency Contact', displayEmployee.emergencyContactName || '-'],
                    ['Emergency Contact Phone', displayEmployee.emergencyContactPhone || '-'],
                    ['Blood Group', displayEmployee.bloodGroup || '-'],
                    ['Marital Status', displayEmployee.maritalStatus || '-'],
                    ['Nationality', displayEmployee.nationality || '-'],
                    ['Passport Number', displayEmployee.passportNumber || '-'],
                    ['UAN', displayEmployee.uan || '-'],
                    ['PF Number', displayEmployee.pfNumber || '-'],
                    ['ESI Number', displayEmployee.esiNumber || '-'],
                    ['Tax State', displayEmployee.taxState || '-'],
                    ['Work Mode', displayEmployee.workMode || '-'],
                    ['Status', displayEmployee.status || '-'],
                    ['Employment Type', displayEmployee.employmentType || '-'],
                  ].map(([label, value]) => {
                    const keyMap: Record<string, keyof Employee> = {
                      Username: 'username',
                      Gender: 'gender',
                      'Bank Name': 'bankName',
                      'Account Number': 'accountNumber',
                      'IFSC Code': 'ifscCode',
                      Branch: 'branch',
                      'Emergency Contact': 'emergencyContactName',
                      'Emergency Contact Phone': 'emergencyContactPhone',
                      'Blood Group': 'bloodGroup',
                      'Marital Status': 'maritalStatus',
                      Nationality: 'nationality',
                      'Passport Number': 'passportNumber',
                      UAN: 'uan',
                      'PF Number': 'pfNumber',
                      'ESI Number': 'esiNumber',
                      'Tax State': 'taxState',
                      'Work Mode': 'workMode',
                      Status: 'status',
                      'Employment Type': 'employmentType',
                    };

                    const inputKey = keyMap[label as string];
                    const currentValue = (editingData?.[inputKey] ?? displayEmployee[inputKey] ?? '') as string;

                    return (
                      <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-slate-400">{label}</p>
                        {isEditingProfile && editingData ? (
                          <input
                            value={currentValue}
                            onChange={(e) => {
                              if (!editingData) return;
                              setEditingData({
                                ...editingData,
                                [inputKey]: e.target.value,
                              } as Employee);
                            }}
                            className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
                          />
                        ) : (
                          <p className="mt-2 text-sm font-semibold text-slate-900">{String(value)}</p>
                        )}
                      </div>
                    );
                  })}
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
                      const employeeForEdit = {
                        ...displayEmployee,
                        dept: displayEmployee.department ?? displayEmployee.dept ?? '',
                        department: displayEmployee.department ?? displayEmployee.dept ?? '',
                      };

                      setIsEditingProfile(true);
                      setEditingData(employeeForEdit);
                      setSelectedEmployee(employeeForEdit);
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
