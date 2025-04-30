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
import Header from "./components/Header";
import "./index.css";
import useIsMobile from "./hooks/useIsMobile";
import MobileHeader from "./components/MobileHeader";
import MobileDashboard from "./pages/MobileDashboard";

function App() {
  const location = useLocation();
  const { role, currentUser, logout } = useAuth();
  // Hide header on login and signup pages
  const showNav = location.pathname !== "/login" && location.pathname !== "/signup";
  const handleLogout = ()=>{
    logout();
  };
  const isMobile = useIsMobile();

  return (
    <div>
      {(
        !isMobile ?
        <Header
          showNav={showNav}
          role={role}
          location={location}
          handleLogout={handleLogout}/>
        :
        <MobileHeader/>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <UserRoute>
              {
                isMobile ?
                <MobileDashboard/>
                :
                <Dashboard />
              }
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
