import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegFileAlt } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import {
  FaBars,
  FaBell,
  FaUser,
  FaHome,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import "./ExpensePage.css";

const ExpensePage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fullName, setFullName] = useState("User");
  const [formData, setFormData] = useState({
    date: "",
    transactionType: "Expense",
    category: "Transport",
    payment: "",
    notes: "",
    amount: "",
    currency: "₹",
  });
  const [showToast, setShowToast] = useState(false);
  const [email, setEmail] = useState("");

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
          })
          .catch(() => {});

        fetch(`http://localhost:2544/user/transactions/${userEmail}`)
          .then((res) => res.json())
          .catch(() => {});
      } catch {
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      transactionType: formData.transactionType,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date).toISOString(),
      paymentType: formData.payment,
      note: formData.notes,
      currency: formData.currency,
      user: { email },
    };

    try {
      const res = await fetch("http://localhost:2544/user/addTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (res.status === 200 && text.startsWith("200::")) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setFormData({
          date: "",
          transactionType: "Expense",
          category: "Transport",
          payment: "",
          notes: "",
          amount: "",
          currency: "₹",
        });
      } else {
        alert("❌ Failed to add expense: " + text);
      }
    } catch {
      alert("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="expense-page">
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <button
          className="toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <FaBars />
        </button>
        <nav className="nav-menu">
          <Link to="/dashboard" className="nav-item">
            <div className="icons"><FaHome /></div>
            <span>Home</span>
          </Link>
          <Link to="/transaction" className="nav-item">
            <div className="icons"><FaMoneyBillWave /></div>
            <span>Expenses</span>
          </Link>
          <Link to="/setbudget" className="nav-item">
            <div className="icons"><FaChartLine /></div>
            <span>Set Budget</span>
          </Link>
          <Link to="#" className="nav-item">
            <div className="icons"><FaCog /></div>
            <span>AI Insights</span>
          </Link>
          <Link to="#" className="nav-item">
            <div className="icons"><FaCog /></div>
            <span>Settings</span>
          </Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <div className="icons"><FaSignOutAlt /></div>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main content area that holds header and form */}
      <main className="content">
        <header className="expense-page_header">
          <h1>Budget Flow</h1>
          <div className="header-right">
            <FaBell className="icon" />
            <div className="profile">
              <FaUser className="icon" />
              <span>{fullName}</span>
            </div>
          </div>
        </header>

        {/* This wrapper helps center the form card */}
        <div className="form-wrapper">
          {showToast && <div className="toast">✅ Expense Added Successfully!</div>}

          <div className="expense-form-card">
            <form className="expense-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleChange}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Transport">🚗 Transport</option>
                    <option value="Groceries">🛒 Groceries</option>
                    <option value="Entertainment">🎮 Entertainment</option>
                    <option value="Utilities">💡 Utilities</option>
                    <option value="Food">🍔 Food</option>
                    <option value="Shopping">🛍 Shopping</option>
                    <option value="Health">💊 Health</option>
                    <option value="Travel">✈️ Travel</option>
                    <option value="Salary">💼 Salary</option>
                    <option value="Freelance">🧑‍💻 Freelance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Payment Mode</label>
                  <input
                    list="payments"
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
                    placeholder="e.g. UPI, Card"
                  />
                  <datalist id="payments">
                    <option value="UPI" />
                    <option value="Credit Card" />
                    <option value="Cash" />
                    <option value="Debit Card" />
                    <option value="Bank Transfer" />
                  </datalist>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                   <label>Notes</label>
                   <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Optional notes"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="₹">₹ INR</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                  </select>
                </div>
              </div>

              <div className="form-submit">
                <button type="submit">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <button
        className="floating-button"
        onClick={() => navigate("/transaction")}
        title="transaction"
      >
        <FaRegFileAlt style={{ cursor: "pointer", fontSize: 24 }} />
      </button>
    </div>
  );
};

export default ExpensePage;