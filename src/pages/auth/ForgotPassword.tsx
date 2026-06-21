
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const fullEmail = email.includes("@") ? email : `${email}@gmail.com`;

    try {
      setLoading(true);

      // Frontend-only: check local mock JSON for email existence
      const res = await fetch("/mock/users.json");
      if (!res.ok) throw new Error("Failed to load user data");

      const json = await res.json();
      const users: Array<{ email?: string }> = json.users || [];

      const found = users.find(
        (u) => (u.email || "").toLowerCase() === fullEmail.toLowerCase()
      );

      // small delay for UX
      await new Promise((r) => setTimeout(r, 600));

      if (found) {
        setSuccess(`Reset link sent to ${fullEmail}`);
      } else {
        setError("No account found for this email address.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to process request. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/bg3.mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex min-h-screen items-center justify-center px-4"
      >
        <div className="relative w-full max-w-[420px] rounded-2xl border border-sky-400/10 bg-gradient-to-br from-white/5 to-black/30 p-6 shadow-lg backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-md p-1 text-slate-300 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <h2 className="text-lg font-semibold">Forgot your password?</h2>
          </div>

          <p className="mb-4 text-sm text-slate-300">
            Enter your email and we'll send instructions to reset your
            password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg border px-4 py-2.5 bg-white/5">
              <Mail className="text-sky-400" size={16} />

              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace("@gmail.com", ""))}
                placeholder="Enter your Gmail"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />

              <span className="text-xs text-slate-400">@gmail.com</span>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {success && (
              <p className="flex items-center gap-2 text-xs text-emerald-400">
                <Check size={14} /> {success}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-xs text-slate-300 hover:underline"
              >
                Back to login
              </button>

              <button
                type="submit"
                disabled={loading}
                className="ml-auto rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}