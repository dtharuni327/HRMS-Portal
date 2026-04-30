import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Smartphone,
  UserCog,
} from "lucide-react";
import { motion } from "framer-motion";

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const SettingsPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [message, setMessage] = useState("");

  const handlePasswordUpdate = () => {
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    setMessage("Password update request submitted successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="w-full space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <h2 className="text-[30px] font-semibold tracking-tight">Settings</h2>
        <p className="mt-2 text-[14px] text-white/80">
          Manage account security, sign-in password, and notification preferences.
        </p>
      </motion.div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 ${cardHover}`}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <LockKeyhole className="h-5 w-5 text-[#4b3f72]" />
            </div>
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                Update Sign-in Password
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Change the password used to sign in to your employee account.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-12 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-12 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-[12px] text-[#64748b]">
                Password must be at least 8 characters.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 pr-12 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b]"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`rounded-2xl px-4 py-3 text-[14px] ${
                  message.includes("successfully")
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handlePasswordUpdate}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#4b3f72] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
            >
              <Save className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </motion.div>

        <div className="space-y-6 xl:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <ShieldCheck className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1e293b]">
                  Security Status
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Current account protection summary.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      Password Enabled
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      Sign-in password is active
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-3">
                  <UserCog className="h-5 w-5 text-[#4b3f72]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      Employee Account
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      EMP-2048 · Ramakrishna
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-[13px] text-[#64748b]">Last Password Update</p>
                <p className="mt-1 text-[15px] font-semibold text-[#1e293b]">
                  15 Mar 2026
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm ${cardHover}`}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-[#f3f0ff] p-3">
                <Bell className="h-5 w-5 text-[#4b3f72]" />
              </div>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1e293b]">
                  Notifications
                </h3>
                <p className="text-[14px] text-[#64748b]">
                  Manage alert preferences.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#4b3f72]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      Email Notifications
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      Receive leave, payroll, and task updates.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="h-5 w-5 accent-[#4b3f72]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-[#4b3f72]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      SMS Notifications
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      Receive important alerts on phone.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={smsNotifications}
                  onChange={(e) => setSmsNotifications(e.target.checked)}
                  className="h-5 w-5 accent-[#4b3f72]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-[#faf8ff] p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#4b3f72]" />
                  <div>
                    <p className="text-[14px] font-semibold text-[#1e293b]">
                      Login Alerts
                    </p>
                    <p className="text-[12px] text-[#64748b]">
                      Alert when account is accessed.
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={loginAlerts}
                  onChange={(e) => setLoginAlerts(e.target.checked)}
                  className="h-5 w-5 accent-[#4b3f72]"
                />
              </label>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;