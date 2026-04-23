import React from "react";

const ProfilePage: React.FC = () => {
  return (
    <div className="w-full px-4 py-6 sm:px-5 lg:px-7">
      <div className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white">
        <h2 className="text-[30px] font-semibold tracking-tight">Profile</h2>
        <p className="mt-2 text-[14px] text-white/80">
          View and manage employee profile details.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;