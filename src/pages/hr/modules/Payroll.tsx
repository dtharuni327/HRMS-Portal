// =========================
// PAYROLL GENERATOR UPDATED
// Premium Pastel Dashboard UI
// =========================

import React, { useState } from 'react';
import { SparkCard } from '../hrShared';

const PayrollGenerator = () => {

  // =========================
  // STATES
  // =========================

  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [payPeriod, setPayPeriod] = useState('May 2026');
  const [paidDays, setPaidDays] = useState('');
  const [lopDays, setLopDays] = useState('0');
  const [payDate, setPayDate] = useState('May 01 2026');

  const [basicSalary, setBasicSalary] = useState(0);
  const [hra, setHra] = useState(0);

  const [incomeTax, setIncomeTax] = useState(0);
  const [pf, setPf] = useState(0);
  const [healthInsurance, setHealthInsurance] = useState(0);

  const [generatedPayslips, setGeneratedPayslips] = useState<any[]>([]);

  // =========================
  // CALCULATIONS
  // =========================

  const grossEarnings =
    Number(basicSalary) +
    Number(hra);

  const totalDeductions =
    Number(incomeTax) +
    Number(pf) +
    Number(healthInsurance);

  const netPay =
    grossEarnings - totalDeductions;

  // =========================
  // GENERATE PAYSLIP
  // =========================

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
      payPeriod,
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
    setPaidDays('');
    setLopDays('0');

    setBasicSalary(0);
    setHra(0);

    setIncomeTax(0);
    setPf(0);
    setHealthInsurance(0);
  };

  return (

    <SparkCard
      className="
        p-8
        max-w-5xl
        mx-auto
        bg-gradient-to-br from-[#EEF2FF] via-[#FDF4FF] to-[#ECFEFF]
        backdrop-blur-xl
        border
        border-slate-200
        rounded-[32px]
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

        <div>

          <h2 className="text-3xl font-black text-slate-800">
            Employee Pay Summary
          </h2>

          <p className="text-slate-500 font-medium mt-1">
            Generate and manage payroll details
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-100
            transition-all
          "
        />

        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
            focus:border-slate-400
            focus:ring-4
            focus:ring-slate-100
            transition-all
          "
        />

        <input
          type="text"
          value={payPeriod}
          onChange={(e) => setPayPeriod(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
          "
        />

        <input
          type="number"
          placeholder="Paid Days"
          value={paidDays}
          onChange={(e) => setPaidDays(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
          "
        />

        <input
          type="number"
          placeholder="Loss Of Pay Days"
          value={lopDays}
          onChange={(e) => setLopDays(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
          "
        />

        <input
          type="text"
          value={payDate}
          onChange={(e) => setPayDate(e.target.value)}
          className="
            p-4
            rounded-2xl
            bg-[#FAFAFA]
            border
            border-slate-200
            text-slate-800
            outline-none
          "
        />

      </div>

      {/* EARNINGS */}
      <div className="mt-10">

        <h3 className="text-xl font-black text-slate-800 mb-4">
          Income Details
        </h3>

        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">

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

          <div className="grid grid-cols-2 gap-4">

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

          <div className="grid grid-cols-2 gap-4">

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

          <div className="grid grid-cols-2 gap-4">

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

          <div className="grid grid-cols-2 gap-4">

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

          <h3 className="text-3xl font-black text-slate-800 mt-2">
            ₹{grossEarnings}
          </h3>

        </div>

        {/* DEDUCTIONS */}
        <div
          className="
            p-6
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

          <h3 className="text-3xl font-black text-slate-800 mt-2">
            ₹{totalDeductions}
          </h3>

        </div>

        {/* NET PAY */}
        <div
          className="
            p-6
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

          <h3 className="text-3xl font-black text-slate-800 mt-2">
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