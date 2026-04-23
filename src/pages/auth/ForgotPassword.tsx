import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import illustration from "../../images/image2.png";
import usersData from "../../data/users.json"; // 1. Import your user data

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);

      // 2. Check if the email exists in your local JSON database
      const userExists = usersData.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (userExists) {
        // If email is found
        setMessage("Success! A reset link has been sent to your email.");
      } else {
        // If email is NOT found
        setMessage("Error: This email address is not registered in our system.");
      }
    }, 1500);
  };

  return (
    <div className="full-page-bg">
      <div className="main-login-card">
        <div className="visual-section">
          <img src={illustration} alt="Illustration" className="login-image" />
        </div>

        <div className="content-section">
          <h1 className="brand-title">Reset Password</h1>
          <p className="login-desc">Enter your email to receive a reset link</p>

          <form onSubmit={handleResetRequest}>
            <div className="field-block">
              <label>EMAIL ADDRESS</label>
              <div className="uniform-input">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  style={{ color: "#000000" }} // Ensuring black text
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <p className={`status-msg ${message.includes("Success") ? "success" : "error"}`}>
                {message}
              </p>
            )}

            <button type="submit" className="blue-submit-btn" disabled={isLoading}>
              {isLoading ? "Checking..." : "Send Reset Link"}
            </button>

            <div className="auth-footer">
              <span onClick={() => navigate("/")} className="yellow-link">
                Back to Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;