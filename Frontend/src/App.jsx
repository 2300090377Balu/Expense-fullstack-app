import React from 'react'
import { Link } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="fade-in">
      <header >
      <div className="container">
        
        <nav className="navbar">
        <h1><Link to="/">Budget Flow</Link></h1>
          <ul className="nav-links">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="main-section">
          <div className='container'>
             <h2>Smarter Spending Starts Here</h2>
             <p>Gain control over your expenses and boost your savings with AI-powered financial tracking.</p>
                 <div className="buttons">
                     <Link to="/register" className="btn">Get Started</Link>
                     <Link to="/login" className="btn btn-secondary">Login</Link>
                 </div>
           </div>
        </section>


        <section id="features" className="features">
            <div className="container">
                <h2>Key Features</h2>
                <div className="feature-list">
                    <div className="feature-item">
                        <i className="fas fa-chart-line"></i>
                        <h3>Multi-Account Tracking</h3>
                        <p>View and manage all your bank accounts, credit cards, and wallets in one place.</p>
                    </div>
                    <div className="feature-item">
                        <i className="fas fa-lightbulb"></i>
                        <h3>Smart Categorization</h3>
                        <p>Automatically categorize your transactions using machine learning</p>
                    </div>
                    <div className="feature-item">
                        <i className="fas fa-wallet"></i>
                        <h3>Spending Trends & Reports</h3>
                        <p>Visualize your financial habits with insightful charts and monthly summaries.</p>
                    </div>
                    <div className="feature-item">
                        <i className="fas fa-wallet"></i>
                        <h3>Custom Notifications</h3>
                        <p>Get alerts for unusual spending or low balances to avoid overdrafts.</p>
                    </div>
                </div>
            </div>
        </section>
      </main>

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
  )
}

export default App