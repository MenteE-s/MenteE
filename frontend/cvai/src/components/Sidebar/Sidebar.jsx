import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { API_BASE } from "../../config";
import {
  LayoutDashboard,
  FileText,
  Edit,
  BarChart3,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Crown,
  Briefcase,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [showCancelPlanModal, setShowCancelPlanModal] = useState(false);
  const [userPlan, setUserPlan] = useState(null);

  // Get user plan from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserPlan(userData.plan || "free");
    }
  }, []);

  // Handle plan cancellation
  const handleCancelPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/update-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to cancel plan");
      }

      // Update user data in localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        userData.plan = "free";
        localStorage.setItem("user", JSON.stringify(userData));
        setUserPlan("free");
      }

      // Close modal and show success message
      setShowCancelPlanModal(false);
      toast.success("Plan cancelled successfully");
    } catch (err) {
      console.error("Error cancelling plan:", err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const menuItems = [
    // Primary navigation
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    // Profile management
    {
      name: "My Profile",
      path: "/profile",
      icon: <FileText size={20} />,
    },
    // Analytics and insights
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={20} />,
    },
    // Job-related features
    {
      name: "Jobs",
      path: "/jobs",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Interviews",
      path: "/interviews",
      icon: <Calendar size={20} />,
    },
    // Account management
    {
      name: "Account Settings",
      path: "/account-settings",
      icon: <Settings size={20} />,
    },
    // Organizations
    {
      name: "Organizations",
      path: "/organizations",
      icon: <Briefcase size={20} />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const isActiveLink = (path) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    return location.pathname.startsWith(path) && path !== "/dashboard";
  };

  return (
    <>
      {/* Plan cancellation modal */}
      {showCancelPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Cancel Pro Plan
              </h3>
              <button
                onClick={() => setShowCancelPlanModal(false)}
                className="p-2 text-slate-500 rounded-full hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">
                    Are you sure you want to cancel your Pro plan?
                  </h4>
                  <p className="text-sm text-slate-600">
                    You will lose access to all Pro features and will be
                    downgraded to the Free plan at the end of your current
                    billing period.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowCancelPlanModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelPlan}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:shadow transition-colors font-medium"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle Button */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 ${
                !isOpen && "justify-center"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">M</span>
              </div>
              {isOpen && (
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  cvAI
                </div>
              )}
            </Link>
            <button
              onClick={onToggle}
              className="p-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center ${
                      isOpen ? "space-x-3" : "justify-center"
                    } p-3 rounded-lg transition-colors ${
                      isActiveLink(item.path)
                        ? "bg-primary-50 text-primary-600"
                        : "text-slate-700 hover:bg-slate-100 hover:text-primary-600"
                    }`}
                  >
                    {item.icon}
                    {isOpen && (
                      <span className="flex items-center">
                        {item.name}
                        {item.isPro && (
                          <Crown className="h-3 w-3 ml-2 text-primary-500" />
                        )}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Plan management and Logout */}
          <div className="p-4 border-t border-slate-200 space-y-2">
            {/* Plan management */}
            {userPlan === "pro" && (
              <button
                onClick={() => setShowCancelPlanModal(true)}
                className={`flex items-center ${
                  isOpen ? "space-x-3" : "justify-center"
                } w-full p-3 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors`}
              >
                <AlertTriangle size={20} />
                {isOpen && <span>Cancel Plan</span>}
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex items-center ${
                isOpen ? "space-x-3" : "justify-center"
              } w-full p-3 rounded-lg text-danger hover:bg-danger hover:text-white transition-colors`}
            >
              <LogOut size={20} />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
