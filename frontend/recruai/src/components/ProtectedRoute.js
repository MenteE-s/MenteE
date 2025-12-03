// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        const userData = await authAPI.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
