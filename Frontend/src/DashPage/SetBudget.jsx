import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  FaHome, FaMoneyBillWave, FaChartLine, FaCog, FaSignOutAlt, FaBars,
  FaBell, FaUser, FaTrash, FaRegFileAlt, FaPlus
} from "react-icons/fa";
import { MdInsights } from "react-icons/md";
import "./SetBudget.css";

const SetBudget = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullName, setFullName] = useState("User");
  const [email, setEmail] = useState("");
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({
    category: "Groceries",
    limit: "",
  });
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.sub;
        setEmail(userEmail);
        fetchBudgets(userEmail);

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
      } catch {
        navigate("/login");
      }
    }
  }, [navigate]);

  const fetchBudgets = (userEmail) => {
    fetch(`http://localhost:2544/budgets/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const budgetsWithCalculations = data.map((budget) => {
            const spent = Math.random() * budget.budgetAmount * 1.5;
            return {
              ...budget,
              spent,
              remaining: budget.budgetAmount - spent,
              limit: budget.budgetAmount, // normalize for frontend usage
            };
          });
          setBudgets(budgetsWithCalculations);
        } else {
          console.error("Invalid budget data format");
        }
      })
      .catch((err) => {
        console.error("Error fetching budgets:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.limit || isNaN(parseFloat(formData.limit))) {
      alert("Please enter a valid budget amount");
      return;
    }

    const payload = {
      userEmail: email,
      category: formData.category,
      budgetAmount: parseFloat(formData.limit),
      spentAmount: 0,
      resetDate: new Date().toISOString().split("T")[0], // today
    };

    fetch("http://localhost:2544/budgets/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const newBudget = {
          ...data,
          spent: 0,
          remaining: data.budgetAmount,
          limit: data.budgetAmount,
        };
        setBudgets((prev) => [...prev, newBudget]);
        setFormData({ category: "Groceries", limit: "" });
        setShowToast(true);
        setShowModal(false);
        setTimeout(() => setShowToast(false), 3000);
      })
      .catch((err) => {
        console.error("Error adding budget:", err);
        alert("Failed to add budget. Please try again.");
      });
  };

  const deleteBudget = (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    fetch(`http://localhost:2544/budgets/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setBudgets((prev) => prev.filter((b) => b.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting budget:", err);
        alert("Failed to delete budget. Please try again.");
      });
  };

  const totalPlanned = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = totalPlanned - totalSpent;

  return (
    <div className="dashboard">
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {isSidebarOpen ? <h2 className="app-logo">ExpenseBuddy</h2> : <div className="app-icon">EB</div>}
          <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </button>
        </div>

        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item"><FaHome className="nav-icon" /><span className="nav-text">Dashboard</span></Link>
          <Link to="/transaction" className="nav-item"><FaMoneyBillWave className="nav-icon" /><span className="nav-text">Transactions</span></Link>
          <Link to="/setbudget" className="nav-item active"><FaChartLine className="nav-icon" /><span className="nav-text">Budget</span></Link>
          <Link to="/insights" className="nav-item"><MdInsights className="nav-icon" /><span className="nav-text">Insights</span></Link>
          <Link to="/settings" className="nav-item"><FaCog className="nav-icon" /><span className="nav-text">Settings</span></Link>
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
            <h1 className="page-title">Budget Management</h1>
            <p className="welcome-message">Welcome back, {fullName}</p>
          </div>
          <div className="header-right">
            <div className="notification-bell">
              <FaBell className="icon" />
              <span className="notification-badge">3</span>
            </div>
            <div className="user-profile">
              <div className="avatar"><FaUser className="icon" /></div>
              <div className="profile-info">
                <span className="profile-name">{fullName}</span>
                <span className="profile-role">User</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {showToast && <div className="toast-notification">✅ Budget added successfully!</div>}

          <div className="summary-cards">
            <div className="summary-card">
              <h4>Planned Budget</h4>
              <h2>₹ {totalPlanned.toFixed(2)}</h2>
              <p>Total budget for all categories</p>
            </div>
            <div className="summary-card">
              <h4>Spent</h4>
              <h2>₹ {totalSpent.toFixed(2)}</h2>
              <p>Total spent across categories</p>
            </div>
            <div className="summary-card">
              <h4>Estimated Savings</h4>
              <h2 className={totalRemaining >= 0 ? "positive" : "negative"}>
                ₹ {Math.abs(totalRemaining).toFixed(2)}
              </h2>
              <p>{totalRemaining >= 0 ? "Remaining" : "Overspent"}</p>
            </div>
          </div>

          <div className="budget-table-container">
    3        <div className="table-header">
              <h3>Your Budgets</h3>
              <button className="add-budget-btn" onClick={() => setShowModal(true)}>
                <FaPlus /> Add Budget
              </button>
            </div>

            {budgets.length === 0 ? (
              <div className="no-data">
                <p>No budgets set yet. Create your first budget to get started.</p>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                  <FaPlus /> Add Budget
                </button>
              </div>
            ) : (
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Planned (₹)</th>
                    <th>Spent (₹)</th>
                    <th>Remaining (₹)</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {budgets.map((budget) => (
                    <tr key={budget.id}>
                      <td>
                        <div className="category-cell">
                          <span className="category-icon">{getCategoryIcon(budget.category)}</span>
                          {budget.category}
                        </div>
                      </td>
                      <td>₹ {budget.limit.toFixed(2)}</td>
                      <td>₹ {budget.spent.toFixed(2)}</td>
                      <td className={budget.remaining >= 0 ? "positive" : "negative"}>
                        ₹ {Math.abs(budget.remaining).toFixed(2)}
                      </td>
                      <td>
                        <button className="delete-btn" onClick={() => deleteBudget(budget.id)} title="Delete Budget">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Budget</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Groceries">🛒 Groceries</option>
                  <option value="Transport">🚗 Transport</option>
                  <option value="Entertainment">🎮 Entertainment</option>
                  <option value="Utilities">💡 Utilities</option>
                  <option value="Food">🍔 Food</option>
                  <option value="Shopping">🛍 Shopping</option>
                  <option value="Health">💊 Health</option>
                  <option value="Travel">✈ Travel</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Limit (₹)</label>
                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">Set Budget</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button className="floating-button" onClick={() => navigate("/transaction")} title="View Transactions">
        <FaRegFileAlt />
      </button>
    </div>
  );
};

function getCategoryIcon(category) {
  const icons = {
    Groceries: "🛒",
    Transport: "🚗",
    Entertainment: "🎮",
    Utilities: "💡",
    Food: "🍔",
    Shopping: "🛍",
    Health: "💊",
    Travel: "✈"
  };
  return icons[category] || "💰";
}

export default SetBudget;
