// Signup.js
import React, { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const role = keyword.trim().toLowerCase() === "admin" ? "admin" : "user";
      await set(ref(db, "users/" + user.uid), { role });
      navigate("/login");
    } catch (err) {
      setError("Failed to sign up: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="signup-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="signup-field">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="signup-field">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={password}
           onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="signup-field">
          <label>
            Keyword (enter <strong>admin</strong>
             for admin account, leave blank for normal user)
          </label>
          <input type="text" placeholder="Enter keyword if admin" value={keyword}
           onChange={(e) => setKeyword(e.target.value)} />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
        <p>Already have an account? <a href="/login">Log In</a></p>
      </form>
    </div>
  );
}
