import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import illustration from "../../images/image2.png";
import usersData from "../../data/users.json";

type User = {
  id: number;
  username: string;
  email: string; 
  password: string;
  role: string;
  name: string;
  dashboard: string;
};

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // Only tracking email now
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = (usersData.users as User[]).find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() && 
        u.password === password.trim()
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("user", JSON.stringify(user));
    navigate(user.dashboard);
  };

  return (
    <div className="full-page-bg">
      <div className="main-login-card">
        <div className="visual-section">
          <img src={illustration} alt="Illustration" className="login-image" />
        </div>

        <div className="content-section">
          <h1 className="brand-title">Company Name</h1>
          <p className="login-desc">Please enter your details to log in</p>

          <form onSubmit={handleLogin}>
            {/* Email Field replaces Username */}
            <div className="field-block">
              <label>EMAIL ADDRESS</label>
              <div className="uniform-input">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field-block">
              <label>PASSWORD</label>
              <div className="uniform-input password-row">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="show-hide-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            <div className="forgot-password-box">
  {/* Changed <a> to <span> and used navigate() */}
  <span 
    onClick={() => navigate("/forgot-password")} 
    className="yellow-link" 
    style={{ cursor: 'pointer' }}
  >
    Forgot Password?
  </span>
</div>

            <button type="submit" className="blue-submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;