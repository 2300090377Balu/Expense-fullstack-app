import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Forget.css";

function Forget() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:2544/user/forgot-password", { email });
      setMessage(response.data);
    } catch (error) {
      setMessage("Error: Unable to process request.");
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <nav className="navbar">
            <h1><Link to="/">Expense Buddy</Link></h1>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="forgot-password-section">
        <div className="forgot-password-container">
          <h2>Forgot Password</h2>
          <p>Enter your email address below, and we’ll send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><i className="fas fa-envelope"></i> Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit"className="resend-button">Send Reset Link</button>
          </form>

          {message && <div className="confirmation-message">{message}</div>}

          <div className="form-footer">
            <p>Remember your password? <Link to="/login">Log in here</Link></p>
          </div>
        </div>
      </section>

      <footer>
        <div className="social-media">
          <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
          <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
          <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
        </div>
        <div className="container">
          <p>&copy; 2024 AI Finance Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Forget;
