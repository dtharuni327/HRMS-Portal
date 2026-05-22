import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  TrendingUp,
  CheckCircle2,
  Briefcase,
  UserCheck,
  ClipboardCheck,
  BellRing,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react';

// Assets
import image10 from '../../images/image10.png';
import hrImage from '../../images/image3.png';
import image14 from '../../images/image14.png';

const TeamOverview = () => {

  const [currentTime, setCurrentTime] = useState(new Date());

  const managerDetails = {
    name: "Shrushti",
    role: "Engineering Manager",
    avatar: "SD",
    email: "shrushti.desu@company.com",
    phone: "+91 98765 43210",
    experience: "6 Years",
    dept: "Technology",
    teamSize: "24 Members",
    projects: "8 Active Projects",
    gender: "female"
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (

    <div
      className="
      w-full
      min-h-screen
      overflow-x-hidden
      rounded-[2.5rem]
      p-6
      flex
      flex-col
      gap-6
      bg-gradient-to-br
      from-[#081028]
      via-[#0F172A]
      to-[#111827]
      font-sans
      "
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >

      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* HERO SECTION */}

      <div className="relative mt-10">

        <div
          className="
          relative
          min-h-[290px]
          rounded-[3rem]
          overflow-visible
          border
          border-white/10
          shadow-2xl
          p-10
          flex
          flex-col
          justify-between
          "
          style={{
            backgroundImage: `url(${image10})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >

          {/* OVERLAY */}

          <div className="absolute inset-0 bg-black/45 rounded-[3rem]" />

          {/* TOP CONTENT */}

          <div className="relative z-10 flex items-center gap-5">

            <div className="
            w-16 h-16
            rounded-2xl
            bg-cyan-500
            flex
            items-center
            justify-center
            text-black
            text-xl
            font-black
            shadow-lg
            ">
              {managerDetails.avatar}
            </div>

            <div>

              <h1 className="
              text-4xl
              font-black
              text-white
              tracking-tight
              ">
                Welcome Back, {managerDetails.name}
              </h1>

              <p className="
              mt-2
              text-cyan-300
              uppercase
              tracking-[0.25em]
              text-xs
              ">
                {managerDetails.role}
              </p>

            </div>

          </div>

          {/* LOWER INFO */}

          <div className="
          relative
          z-10
          flex
          justify-between
          items-end
          mt-10
          ">

            {/* LEFT INFO */}

            <div className="flex gap-16">

              <div className="space-y-5">

                <div>

                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Department
                  </p>

                  <p className="text-white text-sm">
                    {managerDetails.dept}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Experience
                  </p>

                  <p className="text-white text-sm">
                    {managerDetails.experience}
                  </p>

                </div>

              </div>

              <div className="space-y-5">

                <div>

                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Team Size
                  </p>

                  <p className="text-white text-sm">
                    {managerDetails.teamSize}
                  </p>

                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                    Projects
                  </p>

                  <p className="text-white text-sm">
                    {managerDetails.projects}
                  </p>

                </div>

              </div>

            </div>

            {/* TIMER */}

            <div className="
            absolute
            left-1/2
            -translate-x-1/2
            bottom-4
            ">

              <div className="
              bg-black/40
              backdrop-blur-xl
              border
              border-white/10
              px-8
              py-4
              rounded-3xl
              shadow-2xl
              flex
              flex-col
              items-center
              ">

                <h2 className="
                text-3xl
                font-bold
                text-white
                tracking-wider
                ">
                  {formattedTime}
                </h2>

                <p className="
                mt-2
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-white/40
                ">
                  {formattedDate}
                </p>

              </div>

            </div>

            {/* BUTTON */}

            <div className="w-[240px] flex justify-end">

              <button className="
              bg-cyan-500
              hover:bg-cyan-400
              transition-all
              text-black
              px-8
              py-4
              rounded-2xl
              text-xs
              font-black
              uppercase
              tracking-[0.2em]
              shadow-lg
              ">
                Team Insights
              </button>

            </div>

          </div>

          {/* PROFILE IMAGE */}

          <div className="
          absolute
          right-0
          bottom-0
          z-20
          pointer-events-none
          ">

            <img
              src={managerDetails.gender === "female" ? hrImage : image14}
              alt="Manager"
              className="h-[360px] object-contain"
              style={{
                filter: 'drop-shadow(-20px -10px 40px rgba(0,0,0,0.5))'
              }}
            />

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      xl:grid-cols-4
      gap-5
      ">

        {[
          {
            title: "Team Members",
            value: "24",
            sub: "3 new joiners",
            icon: <Users size={22} />,
            color: "from-cyan-500 to-blue-500",
          },
          {
            title: "Attendance",
            value: "92%",
            sub: "Today's presence",
            icon: <UserCheck size={22} />,
            color: "from-emerald-500 to-green-500",
          },
          {
            title: "Pending Approvals",
            value: "08",
            sub: "Awaiting review",
            icon: <ClipboardCheck size={22} />,
            color: "from-orange-400 to-amber-500",
          },
          {
            title: "Productivity",
            value: "96%",
            sub: "Sprint efficiency",
            icon: <TrendingUp size={22} />,
            color: "from-pink-500 to-purple-500",
          },
        ].map((card, i) => (

          <div
            key={i}
            className="
            bg-white/5
            backdrop-blur-xl
            border
            border-white/10
            rounded-[2rem]
            p-6
            shadow-xl
            hover:scale-[1.02]
            transition-all
            "
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-white/50">
                  {card.title}
                </p>

                <h2 className="
                text-4xl
                font-black
                text-white
                mt-3
                ">
                  {card.value}
                </h2>

                <p className="text-xs text-cyan-300 mt-2">
                  {card.sub}
                </p>

              </div>

              <div className={`
              w-14
              h-14
              rounded-2xl
              bg-gradient-to-br
              ${card.color}
              flex
              items-center
              justify-center
              shadow-lg
              `}>
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* LOWER GRID */}

      <div className="
      grid
      grid-cols-1
      xl:grid-cols-3
      gap-6
      ">

        {/* TEAM UPDATES */}

        <div className="
        xl:col-span-2
        bg-white/5
        backdrop-blur-xl
        border
        border-white/10
        rounded-[2rem]
        p-6
        ">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="
              text-2xl
              font-bold
              text-white
              ">
                Team Updates
              </h2>

              <p className="text-sm text-white/40 mt-1">
                Recent activities from your team
              </p>

            </div>

            <button className="
            bg-cyan-500
            text-black
            px-5
            py-2
            rounded-xl
            font-semibold
            text-sm
            ">
              View All
            </button>

          </div>

          <div className="space-y-4">

            {[
              "UI Team completed dashboard redesign",
              "Ramakrishna submitted sprint report",
              "Backend deployment completed successfully",
              "Leave requests pending manager review"
            ].map((item, i) => (

              <div
                key={i}
                className="
                flex
                items-center
                justify-between
                bg-black/20
                border
                border-white/5
                rounded-2xl
                p-5
                "
              >

                <div className="flex items-center gap-4">

                  <div className="
                  w-12
                  h-12
                  rounded-xl
                  bg-cyan-500/20
                  flex
                  items-center
                  justify-center
                  ">

                    <Activity
                      size={20}
                      className="text-cyan-300"
                    />

                  </div>

                  <div>

                    <h3 className="text-white font-medium">
                      {item}
                    </h3>

                    <p className="text-sm text-white/40">
                      5 mins ago
                    </p>

                  </div>

                </div>

                <ArrowUpRight
                  size={18}
                  className="text-white/30"
                />

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="
        flex
        flex-col
        gap-6
        ">

          {/* QUICK ACTIONS */}

          <div className="
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          rounded-[2rem]
          p-6
          ">

            <h2 className="
            text-2xl
            font-bold
            text-white
            ">
              Quick Actions
            </h2>

            <p className="text-sm text-white/40 mt-1 mb-6">
              Manager shortcuts
            </p>

            <div className="flex flex-col gap-4">

              {[
                {
                  icon: <Briefcase size={18} />,
                  title: "Assign Tasks"
                },
                {
                  icon: <CheckCircle2 size={18} />,
                  title: "Approve Requests"
                },
                {
                  icon: <BellRing size={18} />,
                  title: "Send Announcement"
                },
                {
                  icon: <CalendarDays size={18} />,
                  title: "Schedule Meeting"
                }
              ].map((action, i) => (

                <button
                  key={i}
                  className="
                  flex
                  items-center
                  gap-4
                  bg-black/20
                  hover:bg-cyan-500
                  hover:text-black
                  transition-all
                  border
                  border-white/5
                  rounded-2xl
                  p-4
                  text-left
                  "
                >

                  <div className="
                  w-10
                  h-10
                  rounded-xl
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  ">
                    {action.icon}
                  </div>

                  <span className="font-medium">
                    {action.title}
                  </span>

                </button>

              ))}

            </div>

          </div>

          {/* PROJECT STATUS */}

          <div className="
          bg-white/5
          backdrop-blur-xl
          border
          border-white/10
          rounded-[2rem]
          p-6
          ">

            <h2 className="
            text-2xl
            font-bold
            text-white
            ">
              Active Projects
            </h2>

            <p className="text-sm text-white/40 mt-1 mb-6">
              Current sprint progress
            </p>

            <div className="space-y-5">

              {[
                {
                  name: "HRMS Portal",
                  progress: "85%"
                },
                {
                  name: "Analytics Dashboard",
                  progress: "72%"
                },
                {
                  name: "Employee Mobile App",
                  progress: "64%"
                }
              ].map((project, i) => (

                <div key={i}>

                  <div className="
                  flex
                  justify-between
                  mb-2
                  ">

                    <span className="text-white text-sm">
                      {project.name}
                    </span>

                    <span className="text-cyan-300 text-sm">
                      {project.progress}
                    </span>

                  </div>

                  <div className="
                  h-3
                  rounded-full
                  bg-black/30
                  overflow-hidden
                  ">

                    <div
                      className="
                      h-full
                      rounded-full
                      bg-gradient-to-r
                      from-cyan-400
                      to-blue-500
                      "
                      style={{
                        width: project.progress
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
};

export default TeamOverview;