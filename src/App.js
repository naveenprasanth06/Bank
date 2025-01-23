import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [transaction, setTransaction] = useState("");
  const [value, setValue] = useState("");
  const [amount, setAmount] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [transactionHistory, setTransactionHistory] = useState([]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    if (!formData.email.includes('@')) {
      alert("Please enter a valid email");
      return;
    }
    setUser({
      username: formData.username,
      email: formData.email,
      balance: 0
    });
    setAmount(0);
    setShowRegister(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      alert("Please fill in both email and password");
      return;
    }
    if (loginData.email !== user?.email) {
      alert("Email not found");
      return;
    }
    setUser({ ...user, email: loginData.email });
    setShowLogin(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setUser(null);
      setAmount(0);
      setTransaction("");
      setValue("");
      setFormData({
        username: '',
        email: '',
        password: ''
      });
    }
  };

  function handleTransaction(e) {
    e.preventDefault();
    if (!user) {
      alert("Please register or login first");
      return;
    }
    if (!transaction) {
      alert("Please select your transaction type");
      return;
    }

    const inputAmount = Number(value);
    if (!value || inputAmount <= 0) {
      alert("Please enter a valid positive amount");
      return;
    }

    let transactionMessage = "";
    if (transaction === "Deposit") {
      setAmount(prevAmount => {
        const newAmount = prevAmount + inputAmount;
        setTransactionHistory([...transactionHistory, { type: "Deposit", amount: inputAmount, balance: newAmount }]);
        transactionMessage = `Deposited Rs.${inputAmount}`;
        return newAmount;
      });
    } else {
      if (inputAmount > amount) {
        alert("Insufficient Balance. Your current balance is Rs." + amount);
        return;
      }
      setAmount(prevAmount => {
        const newAmount = prevAmount - inputAmount;
        setTransactionHistory([...transactionHistory, { type: "Withdraw", amount: inputAmount, balance: newAmount }]);
        transactionMessage = `Withdrew Rs.${inputAmount}`;
        return newAmount;
      });
    }
    alert(transactionMessage);
    setValue("");
  }

  if (!user && !showRegister && !showLogin) {
    return (
      <div className="bank-container">
        <h1 className="bank-title">Bank Application</h1>
        <button 
          className="auth-button"
          onClick={() => setShowRegister(true)}
        >
          Register
        </button>
        <button 
          className="auth-button"
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
      </div>
    );
  }

  if (showRegister) {
    return (
      <div className="bank-container">
        <h1 className="bank-title">Register</h1>
        <form onSubmit={handleRegister} className="form-container">
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              className="form-input"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="bank-container">
        <h1 className="bank-title">Login</h1>
        <form onSubmit={handleLogin} className="form-container">
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-input"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              className="form-input"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="bank-container">
      <h1 className="bank-title">Bank Application</h1>
      <div className="user-info">
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
        <p>Current Balance: Rs.{amount}</p>
      </div>
      
      <form onSubmit={handleTransaction} className="form-container">
        <div className="form-group">
          <label className="form-label">
            Choose Your Transaction:
          </label>
          <select 
            className="form-select"
            value={transaction} 
            onChange={(e) => setTransaction(e.target.value)}
          >
            <option value="">Select Transaction</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdraw">Withdraw</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            Amount:
          </label>
          <input
            type="number"
            className="form-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        
        <button type="submit" className="submit-button">
          Submit Transaction
        </button>
      </form>

      <button 
        onClick={handleDeleteAccount}
        className="delete-button">
        Delete Account
      </button>

      <div className="transaction-history">
        <h3>Transaction History</h3>
        <ul>
          {transactionHistory.map((txn, index) => (
            <li key={index}>
              {txn.type} Rs.{txn.amount} - New Balance: Rs.{txn.balance}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
