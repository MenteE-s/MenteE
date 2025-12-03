import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authAPI } from "../../utils/api";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!authAPI.isAuthenticated()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
