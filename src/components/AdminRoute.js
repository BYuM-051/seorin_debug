import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { currentUser, role } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
}
