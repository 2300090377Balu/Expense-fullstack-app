import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL when the page loads
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (tokenFromURL) {
      setToken(tokenFromURL);
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:2544/user/reset-password", null, {
        params: { token, newPassword },
      });

      if (response.data) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <nav className="navbar">
            <h1>AI Finance Tracker</h1>
           
          </nav>
        </div>
      </header>

      <section className="reset-password-section">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>

          {message && <p className="message">{message}</p>}

          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit">Reset Password</button>
          </form>
        </div>
      </section>

      <footer>
        <div className="container">
          <p>&copy; 2024 AI Finance Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ResetPassword;
