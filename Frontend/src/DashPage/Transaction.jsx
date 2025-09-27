import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Transaction.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaBell,
  FaUser,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Transaction() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [fullName, setFullName] = useState("User");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deletedTransaction, setDeletedTransaction] = useState(null);
const [showUndo, setShowUndo] = useState(false); // State to show/hide the Undo button

const [typeFilter, setTypeFilter] = useState("");

  const [editForm, setEditForm] = useState({
    id: "",
    amount: "",
    category: "",
    date: "",
    note: "",
    paymentType: "",
    transactionType: "",
  });
  
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      let email = "";
      try {
        const decoded = jwtDecode(token);
        email = decoded.sub;
      } catch (error) {
        console.error("Invalid token format");
        navigate("/login");
        return;
      }

      // Fetch full name
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

      // Fetch transactions
      fetch(`http://localhost:2544/user/transactionsfull/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setExpenses(data);
        })
        .catch((err) => {
          console.error("Error fetching transactions:", err);
        });
    }
  }, [navigate]);

  const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [isExportModalOpen, setIsExportModalOpen] = useState(false);

const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDelete = async (id) => {
    try {
      const transactionToDelete = expenses.find((expense) => expense.id === id);
  
      // Attempt to delete the transaction from the server
      const res = await fetch(`http://localhost:2544/user/deleteTransaction/${id}`, {
        method: "DELETE",
      });
      const text = await res.text();
  
      if (text.startsWith("200::")) {
        setExpenses((prev) => prev.filter((e) => e.id !== id)); // Remove from state
        setDeletedTransaction(transactionToDelete); // Store deleted transaction temporarily
        setShowUndo(true); // Show the Undo button
        toast.success("Transaction deleted successfully!");
      } else {
        toast.error("Error deleting transaction.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleUndo = () => {
    if (deletedTransaction) {
      setExpenses((prev) => [...prev, deletedTransaction]); // Add the deleted transaction back
      setShowUndo(false); // Hide the Undo button
      setDeletedTransaction(null); // Reset the deleted transaction state
      toast.info("Transaction restored!");
    }
  };
  
  

  const exportToExcel = () => {
    const filteredByDate = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const matchesDate =
        (!fromDate || new Date(fromDate) <= expenseDate) &&
        (!toDate || expenseDate <= new Date(toDate));
  
      const matchesCategory =
        !categoryFilter || expense.category.toLowerCase().includes(categoryFilter.toLowerCase());
  
      const matchesType = !typeFilter || expense.transactionType === typeFilter;
  
      return matchesDate && matchesCategory && matchesType;
    });
  
    if (filteredByDate.length === 0) {
      toast.info("No transactions found in the selected filters.");
      return;
    }
  
    const data = filteredByDate.map((expense) => ({
      Date: new Date(expense.date).toLocaleDateString("en-IN"),
      Category: expense.category,
      Amount: parseFloat(expense.amount).toFixed(2),
      Type: expense.transactionType,
      PaymentType: expense.paymentType,
      Note: expense.note || "N/A",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
  
    saveAs(fileData, `Transactions_${fromDate || "start"}_to_${toDate || "end"}.xlsx`);
  
    // Reset date filters and close modal
    setFromDate("");
    setToDate("");
    setCategoryFilter("");
    setTypeFilter("");
    setIsExportModalOpen(false);
  };
  

  const filteredExpenses = expenses.filter((expense) => {
    const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const lowerSearch = searchTerm.toLowerCase();
    return (
      expense.category.toLowerCase().includes(lowerSearch) ||
      expense.transactionType.toLowerCase().includes(lowerSearch) ||
      formattedDate.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="dashboard1">
      {/* Sidebar */}
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
            <div className="icons">
              <FaHome />
            </div>
            <span>Home</span>
          </Link>
          <Link to="/transaction" className="nav-item">
            <div className="icons">
              <FaMoneyBillWave />
            </div>
            <span>Expenses</span>
          </Link>
          <Link to="/setbudget" className="nav-item">
            <div className="icons">
              <FaChartLine />
            </div>
            <span>Set Budget</span>
          </Link>
          <Link to="#" className="nav-item">
            <div className="icons">
              <FaCog />
            </div>
            <span>AI Insights</span>
          </Link>
          <Link to="#" className="nav-item">
            <div className="icons">
              <FaCog />
            </div>
            <span>Settings</span>
          </Link>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <div className="icons">
            <FaSignOutAlt />
          </div>
          <span>Logout</span>
        </button>
      </aside>
    

      {/* Main Content */}
      <main className="content">
      <header className="headers">
      <h1>Expenses</h1>
      <div className="headers-right">
        <FaBell className="icon" />
        <div className="profile">
          <FaUser className="icon" />
          <span>{fullName}</span>
        </div>
      </div>
    </header>

  {/* Main content wrapper */}
  <div className="dashboard__wrapper">
    {/* Search Bar Section */}
    <div className="export-section">
            <button className="export-btn" onClick={() => setIsExportModalOpen(true)}>
              📁 Export to Excel
            </button>
          </div>

           {/* Export Modal */}
           {isExportModalOpen && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Export Transactions</h3>
      <form>
        <label>
          From:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>

        {/* Category Filter */}
        <label>
  Category:
  <select
    value={editForm.category}
    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
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
</label>

        {/* Transaction Type Filter */}
        <label>
          Transaction Type:
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
        </label>

        <button type="button" className="export-btn" onClick={exportToExcel}>
          Download
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => setIsExportModalOpen(false)}
        >
          Cancel
        </button>
      </form>
    </div>
  </div>
)}


    
    <div className="dashboard__search">
      <input
        type="text"
        placeholder="🔍 Search by Category or Date or Type (e.g. Apr)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
    


    {/* Dashboard Expenses Section */}
    <section className="dashboard__expenses">
      <div className="dashboard__expenses-header">
        <h2 className="dashboard__title">Spending Record</h2>
      </div>

      <div className="dashboard__table-container">
        <table>
          <thead>
            <tr>
              <th className="table__header-cell">Date</th>
              <th className="table__header-cell">Category</th>
              <th className="table__header-cell">Payment Mode</th>
              <th className="table__header-cell">Notes</th>
              <th className="table__header-cell">Type</th>
              <th className="table__header-cell--right">Amount</th>
              <th className="table__header-cell--right">Delete</th>
              <th className="table__header-cell--right">Edit</th>
            </tr>
          </thead>
          <tbody className="table__body">
            {filteredExpenses.map((expense, index) => {
              const formattedDate = new Date(expense.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <tr key={index} className="table__row">
                  <td className="table__cell">{formattedDate}</td>
                  <td className="table__cell table__cell--category">{expense.category}</td>
                  <td className="table__cell">{expense.paymentType}</td>
                  <td className="table__cell">
                    {expense.note && expense.note.trim() !== '' ? expense.note : ' - -'}
                  </td>
                  <td className="table__cell">{expense.transactionType}</td>
                  <td className="table__cell table__cell--amount">
                    ₹{parseFloat(expense.amount).toFixed(2)}
                  </td>
                  <td className="table__cell table__cell--action">
                  <FaTrash
  style={{ cursor: "pointer", color: "#ff4d4f", textAlign: "left" }}
  onClick={() => setConfirmDeleteId(expense.id)}
/>


                   
                  </td>
                  <td className="table__cell table__cell--action">
                  <FaEdit
  style={{ cursor: "pointer", color: "#007bff", textAlign: "left" }}
  onClick={() => {
    setEditingTransaction(expense);
    setEditForm({
      id: expense.id,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      note: expense.note,
      paymentType: expense.paymentType,
      transactionType: expense.transactionType,
    });
  }}
/>

                    </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>

    {/* Placeholder for the Third Section */}
    
  </div>



  {/* Toast Notifications */}
  <ToastContainer position="top-right" autoClose={3000} />
  {confirmDeleteId !== null && (
  <div className="confirmation-backdrop">
    <div className="confirmation-modal">
      <h3>Are you sure you want to delete this transaction?</h3>
      <div className="confirmation-actions">
        <button
          className="confirm-btn"
          onClick={() => {
            handleDelete(confirmDeleteId);
            setConfirmDeleteId(null);
          }}
        >
          Delete
        </button>
        <button
          className="cancel-btn"
          onClick={() => setConfirmDeleteId(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

  


  {editingTransaction && (
  <div className="modal-backdrop">
    <div className="modal">
      <h3>Edit Transaction</h3>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const token = localStorage.getItem("token");
          const email = jwtDecode(token).sub;
          const updatedData = {
            ...editForm,
            user: { email }
          };

          try {
            const response = await fetch("http://localhost:2544/user/updateTransaction", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedData),
            });

            const result = await response.text();
            if (result.startsWith("200::")) {
              toast.success("Transaction updated!");
              setExpenses((prev) =>
                prev.map((exp) => (exp.id === editForm.id ? { ...editForm } : exp))
              );
              setEditingTransaction(null);
            } else {
              toast.error("Update failed");
            }
          } catch (err) {
            console.error("Update error:", err);
            toast.error("Error updating transaction");
          }
        }}
      >
        <label>
        Date:
        <input
          type="date"
          value={editForm.date}
          onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
        />
        </label>
        <label>
      Category:
        <input
          type="text"
          placeholder="Category"
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
        />
         </label>
         <label>
      Payment Type:
        <input
          type="text"
          placeholder="Payment Type"
          value={editForm.paymentType}
          onChange={(e) => setEditForm({ ...editForm, paymentType: e.target.value })}
        />
        </label>
        <label>
      Note:
        <input
          type="text"
          placeholder="Note"
          value={editForm.note}
          onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
        />
        </label>
        <label>
        Transaction Type:
        <select
          value={editForm.transactionType}
          onChange={(e) => setEditForm({ ...editForm, transactionType: e.target.value })}
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>
        </label>
        <label>
      Amount:
        <input
          type="number"
          placeholder="Amount"
          value={editForm.amount}
          onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
        />
        </label>
        <div className="modal-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditingTransaction(null)}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

</main>


      {/* Floating Action Button */}
      <button
        className="floating-button"
        onClick={() => navigate("/expense")}
        title="Add Expense"
      >
        +
      </button>
    </div>
  );
}

export default Transaction;
