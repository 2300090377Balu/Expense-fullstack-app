import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Auto-redirect if already logged in & token is valid
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && expiresAt) {
      const now = new Date().getTime();
      if (now < parseInt(expiresAt)) {
        navigate("/dashboard");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expiresAt");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:2544/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.text();
      const [status, token] = result.split("::");

      if (status === "200") {
        const expiresAt = new Date().getTime() + 5 * 60 * 60 * 1000; // 5-hour expiration
        localStorage.setItem("token", token);
        localStorage.setItem("expiresAt", expiresAt);
        navigate("/dashboard");
      } else {
        setError("Invalid Credentials");
      }
    } catch (error) {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <nav className="navbar">
            <h1><Link to="/">Budget Flow</Link></h1>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </nav>
        </div>
      </header>

     <section className="login-section">
  <div className="login-container">
    <h2>Welcome Back</h2>
    {error && <p className="error-message">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label><i className="fas fa-envelope"></i>Email</label>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
      </div>
      <div className="form-group">
        <label><i className="fas fa-lock"></i>Password</label>
        <input 
          type="password" 
          placeholder="Enter your password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
      </div>
      <button type="submit" className="login-button" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
    <div className="form-footer">
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
      <p><Link to="/forget">Forgot your password?</Link></p>
    </div>
  </div>
</section>

      <footer>
        <div className="social-media">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
        </div>

        <div className="container">
          <p>&copy; 2024 AI Finance Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Login;
