import React from "react";

const SettingsPage: React.FC = () => {
  return (
    <div className="w-full px-4 py-6 sm:px-5 lg:px-7">
      <div className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white">
        <h2 className="text-[30px] font-semibold tracking-tight">Settings</h2>
        <p className="mt-2 text-[14px] text-white/80">
          Manage dashboard preferences and account settings.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;