import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callApi } from "../Apis"; // Import the updated API function
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // For navigation after successful signup

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      // API Call
      const requestBody = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };

      const response = await callApi("POST", "http://localhost:2544/user/signup", requestBody);

      if (response.status === "success") {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMessage(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error! Please try again.");
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

      <section className="register-section">
        <div className="register-container">
          <h2>Create Your Account</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email"><i className="fas fa-envelope"></i>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username"><i className="fas fa-user"></i>Username</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password"><i className="fas fa-lock"></i>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword"><i className="fas fa-lock"></i>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="register-button">Register</button>

          </form>

          <div className="form-footer">
            <p>Already have an account? <Link to="/login">Log in here</Link></p>
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

export default Register;
