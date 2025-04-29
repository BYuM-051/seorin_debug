import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
  const { role } = useAuth();

  if (role === "admin") {
    // If admin tries to access user routes, redirect to admin dashboard
    return <Navigate to="/admin/dashboard" />;
  }
  return children;
}
