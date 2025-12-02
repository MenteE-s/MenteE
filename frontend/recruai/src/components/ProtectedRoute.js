// src/components/ProtectedRoute.js
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mentee-production-e517.up.railway.app';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

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

        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log(`${API_BASE_URL}/api/${API_VERSION}/auth/me status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Auth check successful:', data);
          setIsAuthenticated(true);
        } else {
          console.log('Auth check failed, removing token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log(`${API_BASE_URL}/api/${API_VERSION}/auth/me network error:`, error);
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
