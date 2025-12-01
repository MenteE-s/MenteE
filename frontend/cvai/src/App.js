import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Login from "./components/login/Login";
import DashboardPage from "./components/dashboard/Dashboard";
import ProfileComplete from "./components/profile/profilecomplete";
import ShareableProfile from "./components/profile/ShareableProfile";
import Signup from "./components/signup/Signup";
import HomePage from "./components/Homepage/Homepage";
import ToasterProvider from "./components/ToasterProvider";
// --- Added import for CVEditorPage ---
import CVEditorPage from "./components/Editor/cvEditor";
// --- Added import for AuthLayout ---
import AuthLayout from "./components/Layout/AuthLayout";
// --- Added import for Analytics ---
import Analytics from "./components/Analytics/Analytics";
// --- Added import for Organizations ---
import Organizations from "./components/Organizations/Organizations";
// --- Added import for AccountSettings ---
import AccountSettings from "./components/AccountSettings/AccountSettings";
// --- Added import for Jobs ---
import Jobs from "./components/Jobs/Jobs";
// --- Added import for ProPlanGuard ---
import ProPlanGuard from "./components/ProPlanGuard/ProPlanGuard";
// --- Added import for Pricing ---
import Pricing from "./components/Pricing/Pricing";
// --- Added import for Interviews ---
import Interviews from "./components/Interviews/Interviews";
// --- Added import for Animated404 ---
import Animated404 from "./components/four0four/Animated404";
// Import token expiration utilities
import { isTokenExpired, setupTokenExpirationCheck } from "./utils/auth";
import { API_BASE } from "./config";

function App() {
  // Protected Route Component with Token Validation
  const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      const validateToken = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        console.log(
          "🔐 ProtectedRoute - Checking token:",
          token ? "Present" : "Missing"
        );

        if (!token || !user) {
          console.log("❌ No token or user found in localStorage");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Check if token is expired before making API call
        if (isTokenExpired(token)) {
          console.log("⚠️ Token expired - Clearing localStorage");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        try {
          console.log(
            "🔄 Validating token with /api/cvai/profile (namespaced)..."
          );
          console.log(
            "📤 Sending Authorization header:",
            `Bearer ${token.substring(0, 20)}...`
          );

          // Verify token is still valid by calling a protected endpoint
          // API_BASE already includes /api/cvai; remove extra /api to avoid 404
          const response = await fetch(`${API_BASE}/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          console.log(
            `📨 Response status: ${response.status} (${response.statusText})`
          );

          if (response.ok) {
            console.log("✅ Token valid - Access granted");
            setIsAuthenticated(true);
          } else if (response.status === 401) {
            console.log("⚠️ Token invalid (401) - Clearing localStorage");
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          } else if (response.status === 422) {
            console.error(
              "❌ 422 Error - Malformed request. Check token format!"
            );
            const errorData = await response.json();
            console.error("Error details:", errorData);
            setIsAuthenticated(false);
          } else {
            console.log(`⚠️ Unexpected status: ${response.status}`);
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("🔴 Token validation error:", error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      validateToken();
    }, []);

    // Set up token expiration check
    useEffect(() => {
      const cleanup = setupTokenExpirationCheck(navigate);
      return cleanup;
    }, [navigate]);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
  };
  return (
    <>
      <ToasterProvider />
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route
            path="/"
            element={
              <div className="App flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <HomePage />
                </main>
                <Footer />
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          {/* --- Public route for shared profiles --- */}
          <Route path="/share/:profileId" element={<ShareableProfile />} />

          {/* --- Protected Routes with Sidebar --- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfileComplete />} />
            {/* --- Added Route for CV Editor --- */}
            <Route path="editor" element={<CVEditorPage />} />
            {/* --- Added route for editing with profileId ---*/}
            <Route path="editor/:profileId" element={<CVEditorPage />} />
            {/* --- Added Route for Analytics --- */}
            <Route
              path="analytics"
              element={
                <ProPlanGuard feature="Analytics Dashboard">
                  <Analytics />
                </ProPlanGuard>
              }
            />
            {/* --- Added Route for Organizations --- */}
            <Route
              path="organizations"
              element={
                <ProPlanGuard feature="Organization Directory">
                  <Organizations />
                </ProPlanGuard>
              }
            />
            {/* --- Added Route for Account Settings --- */}
            <Route path="account-settings" element={<AccountSettings />} />
            {/* --- Added Route for Pricing --- */}
            <Route path="pricing" element={<Pricing />} />
            {/* --- Added Route for Interviews --- */}
            <Route path="interviews" element={<Interviews />} />
            {/* --- Added Route for Jobs --- */}
            <Route
              path="jobs"
              element={
                <ProPlanGuard feature="Job Opportunities">
                  <Jobs />
                </ProPlanGuard>
              }
            />
          </Route>

          {/* Wildcard route to catch all undefined paths */}
          <Route path="*" element={<Animated404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
