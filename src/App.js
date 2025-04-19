import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHistory from "./pages/AdminHistory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import "./index.css";

function App() {
  const location = useLocation();
  const { role, currentUser, logout } = useAuth();
  // Hide header on login and signup pages
  const showHeader = location.pathname !== "/login" && location.pathname !== "/signup";
  const showNav = role === "admin";
  const handleLogout = ()=>{
    logout();
  };
  return (
    <div>
      {showHeader && (
        <header>
          <div className="titleDIV">
            <img className="logoIMG" src="/logoHeader.png" alt="Logo"/>
            <span className="titleSPAN">SCOREBOARD</span>
          </div>
          {showNav && (<div className="navigationBar">
            <nav className="navLeft">
              {role === "admin" && (
                <>
                  <Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active-link": ""}>Admin Dashboard</Link> /{" "}
                  <Link to="/admin/history" className={location.pathname === "/admin/history" ? "active-link": ""}>Admin History</Link>
                </>
              )}
              {role !== "admin" && (
                <>
                  <Link to="/">Dashboard</Link> /{" "}
                  <Link to="/history">History</Link>
                </>
              )}
            </nav>
            <div className="navRight">
              {(role==="admin" && (<a onClick={handleLogout}>logout</a>))}
            </div>
          </div>
          )}
        </header>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/history"
          element={
            <UserRoute>
              <History />
            </UserRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <AdminRoute>
              <AdminHistory />
            </AdminRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
