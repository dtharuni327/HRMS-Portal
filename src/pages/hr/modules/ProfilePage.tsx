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
    <div className="min-h-screen bg-transparent p-8">

      {/* BACK BUTTON */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() =>
            setActivePage('dashboard')
          }
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-200
            bg-white
            px-4
            py-2
            text-sm
            font-semibold
            text-slate-800
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* MAIN CARD */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[3rem]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          ring-1
          ring-slate-200/40
        "
      >

        {/* TOP COVER */}
        <div
          className="
            h-[240px]
            w-full
            bg-gradient-to-r
            from-cyan-400
            via-blue-500
            to-violet-500
          "
        />

        {/* CONTENT */}
        <div className="relative px-10 pb-10">

          {/* PROFILE SECTION */}
          <div
            className="
              -mt-24
              flex
              flex-col
              gap-8
              lg:flex-row
            "
          >

            {/* PROFILE IMAGE */}
            <div className="relative shrink-0">

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Profile"
                  className="
                    h-44
                    w-44
                    rounded-[2rem]
                    border-[6px]
                    border-white
                    object-cover
                    shadow-2xl
                  "
                />

              ) : (

                <div
                  className="
                    flex
                    h-44
                    w-44
                    items-center
                    justify-center
                    rounded-[2rem]
                    border-[6px]
                    border-white
                    bg-[#0f3d91]
                    text-6xl
                    font-black
                    text-white
                    shadow-2xl
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
                  bottom-0
                  right-0
                  flex
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-cyan-500
                  text-white
                  shadow-lg
                  transition
                  hover:bg-cyan-400
                "
              >
                <span className="text-2xl font-black">
                  +
                </span>
              </label>

            </div>

            {/* DETAILS */}
            <div className="flex-1 pt-24">

              <div
                className="
                  flex
                  flex-col
                  gap-6
                  lg:flex-row
                  lg:items-center
                  lg:justify-between
                "
              >

                <div>

                  <h1
                    className="
                      text-5xl
                      font-black
                      text-slate-900
                    "
                  >
                    {hrDetails.name}
                  </h1>

                  <p
                    className="
                      mt-3
                      text-lg
                      font-bold
                      uppercase
                      tracking-[0.25em]
                      text-cyan-600
                    "
                  >
                    {hrDetails.role}
                  </p>

                </div>

                {/* EMPLOYEE ID */}
                <div
                  className="
                    rounded-3xl
                    bg-[#f3f7ff]
                    px-8
                    py-5
                    shadow-sm
                  "
                >

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-slate-500
                    "
                  >
                    Employee ID
                  </p>

                  <p
                    className="
                      mt-2
                      text-2xl
                      font-black
                      text-slate-900
                    "
                  >
                    HR-2026-001
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* INFORMATION GRID */}
          <div
            className="
              mt-12
              grid
              grid-cols-1
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {/* EMAIL */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Email
              </p>

              <p className="mt-3 break-all text-lg font-bold text-slate-900">
                {hrDetails.email}
              </p>
            </div>

            {/* PHONE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Phone
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {hrDetails.phone}
              </p>
            </div>

            {/* DEPARTMENT */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Department
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {hrDetails.dept}
              </p>
            </div>

            {/* EXPERIENCE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Experience
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {hrDetails.experience}
              </p>
            </div>

            {/* GENDER */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Gender
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Female
              </p>
            </div>

            {/* AGE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Age
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                24 Years
              </p>
            </div>

            {/* MARITAL STATUS */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Marital Status
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Single
              </p>
            </div>

            {/* JOINING DATE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Joining Date
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                15 March 2022
              </p>
            </div>

            {/* OFFICE LOCATION */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Office Location
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Hyderabad, India
              </p>
            </div>

            {/* REPORTING MANAGER */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Reporting Manager
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Rajesh Kumar
              </p>
            </div>

            {/* EMPLOYEE TYPE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Employee Type
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Full Time
              </p>
            </div>

            {/* WORK MODE */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Work Mode
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                Work From Office
              </p>
            </div>

            {/* BIRTHDAY */}
            <div className="rounded-[2rem] bg-[#f8fafc] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Birthday
              </p>

              <p className="mt-3 text-lg font-bold text-slate-900">
                11 November 2000
              </p>
            </div>

          </div>

          {/* ABOUT SECTION */}
          <div
            className="
              mt-10
              rounded-[2rem]
              bg-[#f8fafc]
              p-8
            "
          >

            <h2
              className="
                text-2xl
                font-black
                text-slate-900
              "
            >
              About Employee
            </h2>

            <p
              className="
                mt-4
                text-[16px]
                leading-8
                text-slate-600
              "
            >
              Experienced HR professional responsible
              for recruitment, employee engagement,
              onboarding, attendance management,
              workforce planning, and employee
              relationship management.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;