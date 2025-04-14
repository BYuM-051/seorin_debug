import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const { currentUser, role } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (role !== "user") {
    // If admin tries to access user routes, redirect to admin dashboard
    return <Navigate to="/admin/dashboard" />;
  }
  return children;
}
