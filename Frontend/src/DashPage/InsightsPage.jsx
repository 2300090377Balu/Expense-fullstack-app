import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaUser,
  FaRegFileAlt,
  FaLightbulb,
  FaChartPie,
  FaChartBar,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import "./InsightsPage.css";

const InsightsPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthlySummary, setMonthlySummary] = useState({});
  const [categorySummary, setCategorySummary] = useState({});
  const [predictions, setPredictions] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.sub;
        setEmail(userEmail);

        fetch("http://localhost:2544/user/getfullname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csrid: token }),
        })
          .then((res) => res.text())
          .then((data) => {
            if (data.startsWith("200::")) {
              setFullName(data.split("200::")[1]);
            }
          });

        fetchInsightsData(userEmail);
      } catch {
        navigate("/login");
      }
    }
  }, [navigate]);

  const fetchInsightsData = (email) => {
    fetch(`http://localhost:2544/insights/monthly-summary/${email}`)
      .then((res) => res.json())
      .then((data) => setMonthlySummary(data))
      .catch((err) => console.error("Error fetching monthly summary:", err));

    fetch(`http://localhost:2544/insights/category-wise-summary/${email}`)
      .then((res) => res.json())
      .then((data) => setCategorySummary(data))
      .catch((err) => console.error("Error fetching category summary:", err));

    fetch(`http://localhost:2544/insights/prediction/${email}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data))
      .catch((err) => console.error("Error fetching predictions:", err));

    fetch(`http://localhost:2544/insights/smart-suggestions/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching suggestions:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  return (
    <div className="dashboard">
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div className="sidebar-header">
          <button
            className="toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars />
          </button>
        </div>

        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item">
            <FaHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link to="/transaction" className="nav-item">
            <FaMoneyBillWave className="nav-icon" />
            <span className="nav-text">Transactions</span>
          </Link>
          <Link to="/setbudget" className="nav-item">
            <FaChartLine className="nav-icon" />
            <span className="nav-text">Budget</span>
          </Link>
          <Link to="/insights" className="nav-item active">
            <MdInsights className="nav-icon" />
            <span className="nav-text">Insights</span>
          </Link>
          <Link to="/settings" className="nav-item">
            <FaCog className="nav-icon" />
            <span className="nav-text">Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="header">
          <div className="header-left">
            <h1 className="page-title">Financial Insights</h1>
            <p className="welcome-message">Welcome back, {fullName}</p>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <FaBell className="icon" />
              <span className="notification-badge">3</span>
            </div>
            <div className="user-profile">
              <div className="avatar">
                <FaUser className="icon" />
              </div>
              <div className="profile-info">
                <span className="profile-name">{fullName}</span>
                <span className="profile-role">User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner">Loading insights...</div>
          ) : (
            <>
              <div className="insights-summary-cards">
                <div className="summary-card">
                  <div className="card-icon">
                    <FaMoneyCheckAlt />
                  </div>
                  <div className="card-content">
                    <h3>Total Income</h3>
                    <p>{formatCurrency(monthlySummary.income)}</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div className="card-content">
                    <h3>Total Expenses</h3>
                    <p>{formatCurrency(monthlySummary.expense)}</p>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon">
                    <FaChartLine />
                  </div>
                  <div className="card-content">
                    <h3>Savings</h3>
                    <p>{formatCurrency(monthlySummary.savings)}</p>
                  </div>
                </div>
              </div>

              <div className="insights-charts">
                <div className="chart-container">
                  <h3>
                    <FaChartPie /> Category-wise Spending
                  </h3>
                  <div className="chart-placeholder">
                    {Object.keys(categorySummary).length > 0 ? (
                      <ul className="category-list">
                        {Object.entries(categorySummary).map(
                          ([category, amount]) => (
                            <li key={category}>
                              <span className="category-name">{category}</span>
                              <span className="category-amount">
                                {formatCurrency(amount)}
                              </span>
                              <div className="progress-bar">
                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${
                                      (amount / monthlySummary.expense) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>No category data available</p>
                    )}
                  </div>
                </div>

                <div className="chart-container">
                  <h3>
                    <FaChartBar /> Next Month Prediction
                  </h3>
                  <div className="chart-placeholder">
                    {predictions.predictedExpense ? (
                      <div className="prediction-card">
                        <div className="prediction-item">
                          <span>Predicted Expense:</span>
                          <span className="prediction-value">
                            {formatCurrency(predictions.predictedExpense)}
                          </span>
                        </div>
                        <div className="prediction-item">
                          <span>Confidence:</span>
                          <span className="prediction-value">
                            {predictions.confidence}%
                          </span>
                        </div>
                        <div className="prediction-item">
                          <span>Suggested Budget:</span>
                          <span className="prediction-value">
                            {formatCurrency(predictions.suggestedBudget)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p>No prediction data available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="smart-suggestions">
                <h3>
                  <FaLightbulb /> Smart Suggestions
                </h3>
                {suggestions.length > 0 ? (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No suggestions available at this time</p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <button
        className="floating-button"
        onClick={() => navigate("/transaction")}
        title="View Transactions"
      >
        <FaRegFileAlt />
      </button>
    </div>
  );
};

export default InsightsPage;
