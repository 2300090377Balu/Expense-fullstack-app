import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaUser,
  FaTrash, // 🔥 NEW ICON
} from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [fullExpenses, setFullExpenses] = useState([]);
  const [budget, setBudget] = useState(2000);
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let email = "";
    try {
      const decoded = jwtDecode(token);
      email = decoded.sub;
    } catch (error) {
      console.error("Invalid token format");
      navigate("/login");
      return;
    }

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
      .catch((err) => {
        console.error("Error fetching full name:", err);
      });

    fetch(`http://localhost:2544/user/transactions/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
      });

    fetch(`http://localhost:2544/user/transactionsfull/${email}`)
      .then((res) => res.json())
      .then((data) => {
        setFullExpenses(data);
      })
      .catch((err) => {
        console.error("Error fetching full transaction data:", err);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 
 

  const totalIncome = fullExpenses
    .filter((exp) => exp.transactionType.toLowerCase() === "income")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const totalSpent = fullExpenses
    .filter((exp) => exp.transactionType.toLowerCase() === "expense")
    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  const moneySaved = totalIncome - totalSpent;

  return (
    <div className="dashboard">
      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}>
        <button className="toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
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
          <Link to="/insightspage" className="nav-item">
            <div className="icons"><FaCog /></div>
            <span>AI Insights</span>
          </Link>
          <a href="#" className="nav-item">
            <div className="icons"><FaCog /></div>
            <span>Settings</span>
          </a>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <div className="icons"><FaSignOutAlt /></div>
          <span>Logout</span>
        </button>
      </aside>

      <main className="content">
        <header className="header">
          <h1>Budget Flow</h1>
          <div className="header-right">
            <FaBell className="icon" />
            <div className="profile">
              <FaUser className="icon" />
              <span>{fullName}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="quick-actions">
            <Link to="/expense" className="action blue">+ New Expense</Link>
            <Link className="action purple">⬆ Upload Receipt</Link>
            <Link className="action green">📄 Generate Report</Link>
            <Link to="/setbudget" className="action orange">Set Budget</Link>
          </section>

          <div className="grid">
          <section className="financial-overview">
      <h2 className="text-large-semi-bold">Financial Overview</h2>
      <div className="overview-cards">
        <div className="overview-card spending">
          <h4>Total Spending <p className="pk">₹ {totalSpent.toFixed(2)}</p></h4>
        </div>
        <div className="overview-card savings">
          <h4>Money Saved <p className="pk">₹ {moneySaved.toFixed(2)}</p></h4>
        </div>
        <div className="overview-card income">
          <h4>Income <p className="pk">₹ {totalIncome.toFixed(2)}</p></h4>
        </div>
      </div>
    </section>
           

            <section className="recent-expenses">
              <h2 className="name">Recent Expenses</h2>
              <div className="box">
                <table>
                  <thead>
                    <tr>
                      <th className="col">Date</th>
                      <th className="col">Category</th>
                      <th className="col">Payment Mode</th>
                      <th className="col">Notes</th>
                      <th className="col">Type</th>
                      <th className="th-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="innerbox">
                    {expenses.map((expense, index) => {
                      const formattedDate = new Date(expense.date).toLocaleDateString();
                      return (
                        <tr key={index} className="O">
                          <td className="c">{formattedDate}</td>
                          <td className="E">{expense.category}</td>
                          <td className="PayM">{expense.paymentType}</td>
                          <td className="PayM">
  {expense.note && expense.note.trim() !== '' ? expense.note : '- -'}
</td>
                          <td className="PayM">{expense.transactionType}</td>
                          <td className="A">
                            ₹{parseFloat(expense.amount).toFixed(2)}
                            
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="card-container">
            <div className="card">
              <h2 className="card-title">Spending by Category</h2>
              <div className="chart-container">
                <p className="chart-placeholder">Pie chart visualization will go here</p>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">Monthly Trends</h2>
              <div className="chart-container">
                <p className="chart-placeholder">Bar chart visualization will go here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
