import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { Code2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import userData from "../../data/users.json";
import { useAuthContext } from "../../context/AuthContext";

export default function DeveloperHubLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext(); // ✅ added

  useEffect(() => {
    if (!shake) return;
    const timer = setTimeout(() => setShake(false), 500);
    return () => clearTimeout(timer);
  }, [shake]);

  const triggerError = (msg: string) => {
    setError(msg);
    setShake(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      triggerError("Gmail is required");
      return;
    }

    if (!password.trim()) {
      triggerError("Password is required");
      return;
    }

    const fullEmail = email.includes("@")
      ? email
      : `${email}@gmail.com`;

    const foundUser = userData.users.find(
      (user) =>
        user.email === fullEmail &&
        user.password === password
    );

    if (!foundUser) {
      triggerError("Invalid Gmail or password");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // ✅ keep your existing storage
      localStorage.setItem("loggedUser", JSON.stringify(foundUser));

      // ✅ connect AuthContext (IMPORTANT)
      const fakeToken = `token-${foundUser.id}-${foundUser.role}`;
      login(fakeToken, foundUser);

      setLoading(false);

      // ✅ redirect
      navigate(foundUser.dashboard);
    }, 1500);
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

      {/* LEFT TEXT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: [0, 1, 1, 0], x: [-40, 0, 0, -40] }}
        transition={{ duration: 3.5, times: [0, 0.2, 0.7, 1] }}
        className="absolute left-10 top-1/2 z-10 hidden max-w-sm -translate-y-1/2 md:block"
      >
        <h1 className="text-4xl font-light leading-tight">
          Company Name
          <br />
          <span className="italic text-sky-400">Access Control</span>
        </h1>

        <p className="mt-3 text-sm text-slate-300">
          Secure your infrastructure and access dashboards.
        </p>
      </motion.div>

      {/* LOGIN */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 60, rotateX: 15 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          x: shake ? [0, -12, 12, -8, 8, -5, 5, 0] : 0,
        }}
        transition={{ duration: shake ? 0.45 : 0.6, delay: shake ? 0 : 2.5 }}
        className="relative z-20 flex min-h-screen items-center justify-center px-4 [perspective:1000px]"
      >
        {/* GLASS CARD */}
        <div className="relative w-full max-w-[360px] rounded-3xl border border-sky-400/20 bg-gradient-to-br from-white/10 via-[#07111f]/80 to-black/40 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8),0_0_40px_rgba(56,189,248,0.2)] backdrop-blur-2xl before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-40 before:content-['']">
          <div className="relative z-10">

            {/* ICON */}
            <div className="mb-5 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/30 bg-sky-400/10">
                <Code2 className="text-sky-400" size={18} />
              </div>
            </div>

            {/* TITLE */}
            <h2 className="text-center text-xl font-bold tracking-tight">
              Company <span className="text-sky-400">Name</span>
            </h2>

            <p className="mb-5 mt-1 text-center text-xs text-slate-400">
              Please enter your details to log in
            </p>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* GMAIL */}
              <div
                className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                  email.trim()
                    ? "border-green-400/80 bg-white/5"
                    : error && !email.trim()
                    ? "border-red-400/80 bg-white/5"
                    : "border-white/10 bg-white/5"
                } focus-within:border-sky-400`}
              >
                <Mail className="text-sky-400" size={16} />

                <input
                  type="text"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value.replace("@gmail.com", ""))
                  }
                  placeholder="Enter your Gmail"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                <span className="text-xs text-slate-400">@gmail.com</span>
              </div>

              {/* PASSWORD */}
              <div
                className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                  password.trim()
                    ? "border-green-400/80 bg-white/5"
                    : error && !password.trim()
                    ? "border-red-400/80 bg-white/5"
                    : "border-white/10 bg-white/5"
                } focus-within:border-sky-400`}
              >
                <Lock className="text-sky-400" size={16} />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="off"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="text-slate-400 hover:text-sky-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-center text-xs text-red-400">{error}</p>
              )}

              {/* FORGOT */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-yellow-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-black transition hover:bg-sky-400 disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>

            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}