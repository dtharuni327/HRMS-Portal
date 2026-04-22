import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      setMessage("Please enter a valid Gmail address");
      return;
    }

    setTimeout(() => {
      setMessage("Password reset link sent to your email");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-xl border border-cyan-300/20 bg-slate-900/80 p-6 shadow-lg backdrop-blur-xl">
        <h2 className="mb-3 text-center text-xl font-semibold text-white">
          Forgot Password
        </h2>

        <p className="mb-4 text-center text-sm text-gray-400">
          Enter your email to reset password
        </p>

        {message && (
          <p className="mb-3 text-center text-sm text-green-400">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 w-full rounded-md border border-white/20 bg-black/30 px-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />

          <button
            type="submit"
            className="h-10 w-full rounded-md bg-sky-500 text-sm text-white hover:bg-sky-400"
          >
            Send Reset Link
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full text-xs text-yellow-400 hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;