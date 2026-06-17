import React, { type ChangeEvent } from 'react';

interface ProfilePageProps {
  hrDetails: {
    name: string;
    role: string;
    email: string;
    phone: string;
    dept: string;
    experience: string;
    avatar: string;
    employeeId?: string;
    location?: string;
    joinDate?: string;
    reportingTo?: string;
    salary?: number;
    designation?: string;
    address?: string;
    panNumber?: string;
    aadhaarNumber?: string;
    gender?: string;
  };
  profileImage: string | null;
  handleProfileUpload: (
    e: ChangeEvent<HTMLInputElement>
  ) => void;
  setActivePage: React.Dispatch<
    React.SetStateAction<
      'dashboard' | 'profile'
    >
  >;
}

const ProfilePage: React.FC<
  ProfilePageProps
> = ({
  hrDetails,
  profileImage,
  handleProfileUpload,
  setActivePage
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">

      {/* SIMPLE MODAL CARD */}
      <div
        className="
          w-full
          max-w-2xl
          rounded-[2rem]
          bg-white
          p-8
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
      >
        
        {/* HEADER WITH IMAGE AND TITLE */}
        <div className="mb-8 flex items-start gap-6">
          
          {/* PROFILE IMAGE */}
          <div className="relative shrink-0">

            {profileImage ? (

              <img
                src={profileImage}
                alt="Profile"
                className="
                  h-32
                  w-32
                  rounded-2xl
                  border-4
                  border-slate-200
                  object-cover
                  shadow-md
                "
              />

            ) : (

              <div
                className="
                  flex
                  h-32
                  w-32
                  items-center
                  justify-center
                  rounded-2xl
                  border-4
                  border-slate-200
                  bg-slate-200
                  text-4xl
                  font-black
                  text-slate-400
                  shadow-md
                "
              >
                {hrDetails.avatar}
              </div>

            )}

            <input
              id="hrProfileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileUpload}
            />

            <label
              htmlFor="hrProfileUpload"
              className="
                absolute
                -bottom-2
                -right-2
                flex
                h-10
                w-10
                cursor-pointer
                items-center
                justify-center
                rounded-full
                bg-cyan-500
                text-white
                shadow-lg
                transition
                hover:bg-cyan-600
              "
            >
              <span className="text-xl font-black">
                +
              </span>
            </label>

          </div>

          {/* HEADER TEXT */}
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900">
              {hrDetails.name}
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Employee Profile Details
            </p>
          </div>

        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-2 gap-6 gap-y-8">

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* EMPLOYEE ID */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Employee ID
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.employeeId || 'EMP-2026-001'}
              </p>
            </div>

            {/* PHONE */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Phone
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.phone}
              </p>
            </div>

            {/* PAN NUMBER */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                PAN Number
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.panNumber || 'ABCDE1234F'}
              </p>
            </div>

            {/* DEPARTMENT */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Department
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.dept}
              </p>
            </div>

            {/* DESIGNATION */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Designation
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.designation || hrDetails.role}
              </p>
            </div>

            {/* LOCATION */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Location
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.location || 'Mumbai'}
              </p>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* EMAIL */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email
              </p>
              <p className="mt-2 break-all text-base font-bold text-slate-900">
                {hrDetails.email}
              </p>
            </div>

            {/* GENDER */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Gender
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.gender || 'Not specified'}
              </p>
            </div>

            {/* AADHAAR NUMBER */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Aadhaar Number
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.aadhaarNumber || '1234 5678 9012'}
              </p>
            </div>

            {/* ADDRESS */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Address
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.address || 'Mumbai, Maharashtra'}
              </p>
            </div>

            {/* ROLE */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Role
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.role}
              </p>
            </div>

            {/* REPORTING MANAGER */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Reporting Manager
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.reportingTo || 'Manager Name'}
              </p>
            </div>

            {/* JOINING DATE */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Joining Date
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {hrDetails.joinDate || '2022-01-15'}
              </p>
            </div>

          </div>

        </div>

        {/* BACK BUTTON */}
        <div className="mt-8 flex justify-start">
          <button
            type="button"
            onClick={() =>
              setActivePage('dashboard')
            }
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-slate-900
              px-6
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;