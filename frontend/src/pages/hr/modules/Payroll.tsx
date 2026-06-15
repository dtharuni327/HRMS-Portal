import { useState } from 'react';
import { SparkCard, type Employee } from '../hrShared';

interface PayrollGeneratorProps {
  employees?: Employee[];
}

const PayrollGenerator = ({ employees = [] }: PayrollGeneratorProps) => {

  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [isNameMenuOpen, setIsNameMenuOpen] = useState(false);
  const [isIdMenuOpen, setIsIdMenuOpen] = useState(false);
  const [payPeriod, setPayPeriod] = useState('2026-05');
  const [paidDays, setPaidDays] = useState('');
  const [lopDays, setLopDays] = useState('0');
  const [payDate, setPayDate] = useState('2026-05-01');

  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);

  const [incomeTax, setIncomeTax] = useState(0);
  const [pf, setPf] = useState(0);
  const [healthInsurance, setHealthInsurance] = useState(0);

  const [generatedPayslips, setGeneratedPayslips] = useState<any[]>([]);

  const employeeOptions = employees.map((employee) => ({
    employeeName: employee.name,
    employeeId: `EMP-${String(employee.id).padStart(3, '0')}`,
  }));

  const grossEarnings =
    Number(basicSalary) +
    Number(hra);

  const totalDeductions =
    Number(incomeTax) +
    Number(pf) +
    Number(healthInsurance);

  const netPay =
    grossEarnings - totalDeductions;

  const formatMonthLabel = (value: string) =>
    value
      ? new Date(`${value}-01`).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : 'Select month';

  const generatePayslip = () => {

    if (
      !employeeName ||
      !employeeId ||
      !paidDays
    ) {
      alert('Please fill all required fields');
      return;
    }

    const newPayslip = {
      id: Date.now(),

      employeeName,
      employeeId,
      payPeriod: formatMonthLabel(payPeriod),
      paidDays,
      lopDays,
      payDate,

      basicSalary,
      hra,

      incomeTax,
      pf,
      healthInsurance,

      grossEarnings,
      totalDeductions,
      netPay,
    };

    setGeneratedPayslips([
      newPayslip,
      ...generatedPayslips,
    ]);

    localStorage.setItem(
      'employeePayslips',
      JSON.stringify([
        newPayslip,
        ...generatedPayslips,
      ])
    );

    alert('Payslip Generated Successfully');

    // RESET
    setEmployeeName('');
    setEmployeeId('');
    setPayPeriod('2026-05');
    setPaidDays('');
    setLopDays('0');
    setPayDate('2026-05-01');

    setBasicSalary(0);
    setHra(0);

    setIncomeTax(0);
    setPf(0);
    setHealthInsurance(0);
  };

  return (

    <SparkCard
      className="
        p-6
        sm:p-8
        xl:p-10
        max-w-7xl
        mx-auto
        bg-gradient-to-br from-[#EEF2FF] via-[#FDF4FF] to-[#ECFEFF]
        backdrop-blur-xl
        border
        border-slate-200/80
        rounded-[32px]
        shadow-[0_14px_45px_rgba(15,23,42,0.12)]
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

        <div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
            Employee Pay Summary
          </h2>

          <p className="text-slate-500 font-medium mt-2 text-sm md:text-base">
            Generate and manage payroll details with a cleaner, more balanced layout.
          </p>

        </div>

        <div
          className="
            px-4
            py-2
            rounded-2xl
            bg-gradient-to-r
            from-[#F5F3FF]
            to-[#EFF6FF]
            border
            border-slate-200
            text-slate-700
            text-xs
            font-black
            uppercase
            tracking-wider
            shadow-sm
          "
        >
          Generated Payslips: {generatedPayslips.length}
        </div>

      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        <div className="relative">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Employee Name</label>
          <button
            type="button"
            onClick={() => setIsNameMenuOpen((prev) => !prev)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-white/90
              border
              border-slate-200
              text-slate-800
              shadow-sm
              text-left
              flex
              items-center
              justify-between
              focus:border-slate-400
              focus:ring-4
              focus:ring-slate-100
              transition-all
            "
          >
            <span className={employeeName ? 'text-slate-800' : 'text-slate-400'}>
              {employeeName || 'Select employee name'}
            </span>
            <span className="text-slate-400">▾</span>
          </button>

          {isNameMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
              {employeeOptions.map((item) => (
                <button
                  key={item.employeeId}
                  type="button"
                  onClick={() => {
                    setEmployeeName(item.employeeName);
                    setEmployeeId(item.employeeId);
                    setIsNameMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {item.employeeName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Employee ID</label>
          <button
            type="button"
            onClick={() => setIsIdMenuOpen((prev) => !prev)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-white/90
              border
              border-slate-200
              text-slate-800
              shadow-sm
              text-left
              flex
              items-center
              justify-between
              focus:border-slate-400
              focus:ring-4
              focus:ring-slate-100
              transition-all
            "
          >
            <span className={employeeId ? 'text-slate-800' : 'text-slate-400'}>
              {employeeId || 'Select employee ID'}
            </span>
            <span className="text-slate-400">▾</span>
          </button>

          {isIdMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
              {employeeOptions.map((item) => (
                <button
                  key={item.employeeId}
                  type="button"
                  onClick={() => {
                    setEmployeeId(item.employeeId);
                    setEmployeeName(item.employeeName);
                    setIsIdMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50"
                >
                  {item.employeeId}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pay Month</label>
          <input
            type="month"
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-white/90
              border
              border-slate-200
              text-slate-800
              shadow-sm
              outline-none
            "
          />
          <p className="mt-1 text-xs text-slate-400">Select the payroll month</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Paid Days</label>
          <input
            type="number"
            placeholder="Enter working days paid"
            value={paidDays}
            onChange={(e) => setPaidDays(e.target.value)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-[#FAFAFA]
              border
              border-slate-200
              text-slate-800
              outline-none
            "
          />
          <p className="mt-1 text-xs text-slate-400">Number of days paid for this month</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">LOP Days</label>
          <input
            type="number"
            placeholder="Enter unpaid days"
            value={lopDays}
            onChange={(e) => setLopDays(e.target.value)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-[#FAFAFA]
              border
              border-slate-200
              text-slate-800
              outline-none
            "
          />
          <p className="mt-1 text-xs text-slate-400">Loss of pay days if any</p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pay Date</label>
          <input
            type="date"
            value={payDate}
            onChange={(e) => setPayDate(e.target.value)}
            className="
              h-14
              w-full
              px-4
              rounded-2xl
              bg-white/90
              border
              border-slate-200
              text-slate-800
              shadow-sm
              outline-none
            "
          />
          <p className="mt-1 text-xs text-slate-400">Date on which salary will be paid</p>
        </div>

      </div>

      {/* EARNINGS */}
      <div className="mt-10">

        <h3 className="text-xl font-black text-slate-800 mb-4">
          Income Details
        </h3>

        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="text"
              value="Basic Salary"
              readOnly
              className="
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-[#E0F2FE]
                to-[#F0F9FF]
                border
                border-sky-100
                text-slate-800
                font-semibold
              "
            />

            <input
              type="number"
              value={basicSalary}
              onChange={(e) =>
                setBasicSalary(Number(e.target.value))
              }
              className="
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-800
                outline-none
              "
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="text"
              value="House Rent Allowance"
              readOnly
              className="
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-[#F5F3FF]
                to-[#FAF5FF]
                border
                border-violet-100
                text-slate-800
                font-semibold
              "
            />

            <input
              type="number"
              value={hra}
              onChange={(e) =>
                setHra(Number(e.target.value))
              }
              className="
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-800
                outline-none
              "
            />

          </div>

        </div>

      </div>

      {/* DEDUCTIONS */}
      <div className="mt-10">

        <h3 className="text-xl font-black text-slate-800 mb-4">
          Deductions
        </h3>

        <div className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="text"
              value="Income Tax"
              readOnly
              className="
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-[#FFE4E6]
                to-[#FFF1F2]
                border
                border-rose-100
                text-slate-800
                font-semibold
              "
            />

            <input
              type="number"
              value={incomeTax}
              onChange={(e) =>
                setIncomeTax(Number(e.target.value))
              }
              className="
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-800
                outline-none
              "
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="text"
              value="Provident Fund"
              readOnly
              className="
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-[#DCFCE7]
                to-[#F0FDF4]
                border
                border-emerald-100
                text-slate-800
                font-semibold
              "
            />

            <input
              type="number"
              value={pf}
              onChange={(e) =>
                setPf(Number(e.target.value))
              }
              className="
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-800
                outline-none
              "
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="text"
              value="Health Insurance"
              readOnly
              className="
                p-4
                rounded-2xl
                bg-gradient-to-r
                from-[#FEF3C7]
                to-[#FFFBEB]
                border
                border-amber-100
                text-slate-800
                font-semibold
              "
            />

            <input
              type="number"
              value={healthInsurance}
              onChange={(e) =>
                setHealthInsurance(Number(e.target.value))
              }
              className="
                p-4
                rounded-2xl
                bg-white
                border
                border-slate-200
                text-slate-800
                outline-none
              "
            />

          </div>

        </div>

      </div>

      {/* TOTALS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">

        {/* GROSS */}
        <div
          className="
            p-6
            md:p-7
            min-h-[132px]
            rounded-[28px]
            bg-gradient-to-br
            from-[#E0F2FE]
            to-[#F0F9FF]
            border
            border-sky-100
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >

          <p className="text-slate-600 text-sm font-semibold">
            Gross Earnings
          </p>

          <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 leading-tight">
            ₹{grossEarnings}
          </h3>

        </div>

        {/* DEDUCTIONS */}
        <div
          className="
            p-6
            md:p-7
            min-h-[132px]
            rounded-[28px]
            bg-gradient-to-br
            from-[#FFE4E6]
            to-[#FFF1F2]
            border
            border-rose-100
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >

          <p className="text-slate-600 text-sm font-semibold">
            Total Deductions
          </p>

          <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 leading-tight">
            ₹{totalDeductions}
          </h3>

        </div>

        {/* NET PAY */}
        <div
          className="
            p-6
            md:p-7
            min-h-[132px]
            rounded-[28px]
            bg-gradient-to-br
            from-[#DCFCE7]
            to-[#F0FDF4]
            border
            border-emerald-100
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >

          <p className="text-slate-600 text-sm font-semibold">
            Net Pay
          </p>

          <h3 className="text-3xl md:text-4xl font-black text-slate-800 mt-3 leading-tight">
            ₹{netPay}
          </h3>

        </div>

      </div>

      {/* BUTTON */}
      <button
        onClick={generatePayslip}
        className="
          w-full
          mt-8
          py-4
          rounded-2xl
          bg-gradient-to-r
          from-slate-800
          to-black
          hover:from-black
          hover:to-slate-900
          text-white
          font-black
          uppercase
          tracking-widest
          transition-all
          shadow-lg
        "
      >
        Generate Payslip
      </button>

      {/* PAYSLIP REQUESTS */}
      <div className="mt-10">

        <div className="flex justify-between items-center mb-5 flex-wrap gap-4">

          <div>

            <h3 className="text-2xl font-black text-slate-800">
              Payslip Requests
            </h3>

            <p className="text-sm text-slate-500 font-medium mt-1">
              Pending employee payroll requests
            </p>

          </div>

          <div
            className="
              px-4
              py-2
              rounded-2xl
              bg-gradient-to-r
              from-[#EFF6FF]
              to-[#F5F3FF]
              border
              border-slate-200
              text-slate-700
              text-xs
              font-black
              uppercase
              tracking-wider
            "
          >
            Total Requests: 2
          </div>

        </div>

        <div className="space-y-4">

          {/* REQUEST 1 */}
          <div
            className="
              p-5
              rounded-3xl
              bg-gradient-to-br
              from-[#EFF6FF]
              to-[#F8FAFC]
              border
              border-sky-100
              transition-all
              hover:scale-[1.01]
              hover:shadow-md
            "
          >

            <div className="flex justify-between items-center flex-wrap gap-4">

              <div>

                <h4 className="text-slate-800 font-black text-lg">
                  Rahul Sharma
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Requested payslip for April 2026
                </p>

              </div>

              <button
                className="
                  px-5
                  py-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-slate-800
                  to-black
                  hover:from-black
                  hover:to-slate-900
                  text-white
                  text-xs
                  font-black
                  uppercase
                  transition-all
                "
              >
                Generate
              </button>

            </div>

          </div>

          {/* REQUEST 2 */}
          <div
            className="
              p-5
              rounded-3xl
              bg-gradient-to-br
              from-[#FAF5FF]
              to-[#FDF4FF]
              border
              border-violet-100
              transition-all
              hover:scale-[1.01]
              hover:shadow-md
            "
          >

            <div className="flex justify-between items-center flex-wrap gap-4">

              <div>

                <h4 className="text-slate-800 font-black text-lg">
                  Priya Verma
                </h4>

                <p className="text-sm text-slate-500 mt-1">
                  Requested payslip for May 2026
                </p>

              </div>

              <button
                className="
                  px-5
                  py-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-slate-800
                  to-black
                  hover:from-black
                  hover:to-slate-900
                  text-white
                  text-xs
                  font-black
                  uppercase
                  transition-all
                "
              >
                Generate
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* GENERATED PAYSLIPS */}
      <div className="mt-10">

        <h3 className="text-2xl font-black text-slate-800 mb-5">
          Generated Payslips
        </h3>

        <div className="space-y-4">

          {generatedPayslips.map((item, index) => (

            <div
              key={item.id}
              className={`
                p-5
                rounded-3xl
                border
                transition-all
                hover:shadow-md
                ${
                  index % 2 === 0
                    ? 'bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] border-sky-100'
                    : 'bg-gradient-to-br from-[#FAF5FF] to-[#FDF4FF] border-violet-100'
                }
              `}
            >

              <div className="flex justify-between items-center flex-wrap gap-4">

                <div>

                  <h3 className="text-lg font-black text-slate-800">
                    {item.employeeName}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Employee ID: {item.employeeId}
                  </p>

                  <p className="text-sm text-slate-500">
                    {item.payPeriod}
                  </p>

                </div>

                <div className="text-right">

                  <h3 className="text-3xl font-black text-slate-800">
                    ₹{item.netPay}
                  </h3>

                  <p className="text-xs text-slate-500 uppercase mt-1">
                    Net Pay
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </SparkCard>

  );
};

export default PayrollGenerator;