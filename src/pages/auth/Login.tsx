import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../../features/auth/authService";
import { useAuthContext } from "../../context/AuthContext";

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.toLowerCase().endsWith("@gmail.com")) {
      setError("Please enter a valid Gmail address");
      return;
    }

    try {
      const res = await loginService({ username, password });

      if (!res?.user) {
        setError("Invalid response from server");
        return;
      }

      const role = res.user.role?.toLowerCase();

      const roleRoutes: Record<string, string> = {
        admin: "/admin",
        superadmin: "/superadmin",
        hr: "/hr",
        manager: "/manager",
        employee: "/employee",
        client: "/client",
      };

      const targetRoute = roleRoutes[role];

      if (!targetRoute) {
        setError("No route found for this role");
        return;
      }

      const token =
        res.token || res.accessToken || res.jwt || "demo-auth-token";

      login(token, {
        id: String(res.user.id ?? ""),
        email: res.user.email ?? username,
        role: res.user.role ?? "",
        name: res.user.name ?? "User",
      });

      navigate(targetRoute);
    } catch (err: any) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/vedios/bg3.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div
          className="w-full max-w-[320px] rounded-xl border border-cyan-300/20
          bg-slate-900/15 px-4 py-4 shadow-lg backdrop-blur-xl
          transition-all duration-300 ease-in-out
          hover:bg-slate-900/25
          hover:border-cyan-300/40
          hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
        >
          <h2 className="mb-2 text-center text-xl font-semibold text-white">
            Company Name
          </h2>

          <p className="mb-3 text-center text-sm text-gray-400">
            Enter your details
          </p>

          {error && (
            <p className="mb-2 rounded-md border border-red-400/20 bg-red-500/10 px-2 py-1 text-center text-xs text-red-300">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="mb-1 block text-sm text-gray-300">Email</label>
              <input
                type="email"
                placeholder="Enter your Gmail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-9 w-full rounded-md border border-white/20 bg-black/20 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-md border border-white/20 bg-black/20 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
              />
            </div>

            <Link
              to="/forgot-password"
              className="block text-xs text-yellow-400 hover:underline"
            >
              Forgot Password?
            </Link>

            <button
              type="submit"
              className="h-9 w-full rounded-md bg-sky-500 text-sm font-medium text-white transition-colors hover:bg-sky-400"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;