import React, { useState, useEffect } from "react";
// --- FIX: Import BrowserRouter as Router ---
import { useLocation, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Menu, X } from "lucide-react";

// --- FIX: Rename main component ---
function NavbarComponent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // --- FIX: Make sure to remove token as well ---
    setIsLoggedIn(false);
    setMobileMenuOpen(false); // Close menu on logout
    navigate("/");
  };

  // Update login state when localStorage changes OR when route changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, [location.pathname]);

  // --- NEW: Helper for active link styling ---
  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-primary-600 font-semibold"
      : "text-slate-700 hover:text-primary-600";
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* --- NEW: Sleeker Logo --- */}
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">M</span>
          </div>
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            cvAI
          </div>
        </Link>

        {/* --- UPDATED: Desktop Menu --- */}
        <div className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            // --- NEW: Logged-in navigation ---
            <>
              <Link
                to="/dashboard"
                className={`font-medium transition-colors ${getLinkClass(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className={`font-medium transition-colors ${getLinkClass(
                  "/profile"
                )}`}
              >
                My Profile
              </Link>
            </>
          ) : (
            // --- Homepage navigation ---
            <>
              <Link
                to="/#features"
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                Features
              </Link>
              <Link
                to="/#how-it-works"
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                How it Works
              </Link>
              <Link
                to="/#pricing"
                className="text-slate-700 hover:text-primary-600 font-medium transition-colors"
              >
                Pricing
              </Link>
            </>
          )}
        </div>

        {/* --- UPDATED: Auth Buttons / Logout --- */}
        <div className="hidden md:flex gap-3 items-center">
          {isLoggedIn ? (
            // --- NEW: Styled Logout Button ---
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            // --- Original Auth Buttons ---
            !isAuthPage && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        {!isAuthPage && (
          <button
            className="md:hidden p-1 text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
      </div>

      {/* --- UPDATED: Mobile Menu --- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-2">
          {isLoggedIn ? (
            // --- Logged-in mobile menu ---
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 py-2 text-slate-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 py-2 text-slate-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left py-2 text-danger hover:text-danger font-medium"
              >
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            // --- Homepage mobile menu ---
            <>
              <Link
                to="/#features"
                className="block py-2 text-slate-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/#how-it-works"
                className="block py-2 text-slate-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                How it Works
              </Link>
              <Link
                to="/#pricing"
                className="block py-2 text-slate-700 hover:text-primary-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="border-t pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center px-4 py-2 bg-gradient-primary text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// --- FIX: Wrap default export in Router for preview compatibility ---
export default function Navbar() {
  return <NavbarComponent />;
}
