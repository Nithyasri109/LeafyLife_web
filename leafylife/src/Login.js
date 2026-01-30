import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/api/login", {
        email,
        password
      });

      alert("Login successful ✅");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userEmail", email);
      onLogin();
    } catch (err) {
      alert("Invalid email or password ❌");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/signup", {
        name,
        email,
        password
      });

      alert("Signup successful ✅ Please login");
      setIsSignup(false);
      setName("");
      setPassword("");
    } catch (err) {
      alert("User already exists ❌");
    }
  };

  const handleForgotPassword = () => {
    const resetEmail = prompt("Enter your registered email");
    if (resetEmail) {
      alert(`Password reset link sent to ${resetEmail}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="logo">🌱 LeafyLife</h2>
        <p className="subtitle">
          {isSignup
            ? "Create your account"
            : "Never forget to water your plants again"}
        </p>

        {!isSignup ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn">Login</button>

            <div className="links">
              <span onClick={handleForgotPassword}>Forgot Password?</span>
              <span onClick={() => setIsSignup(true)}>Sign Up</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="btn">Sign Up</button>

            <p className="back" onClick={() => setIsSignup(false)}>
              ← Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
