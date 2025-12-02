import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/#features" },
    { name: "Chat", path: "/chat" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const authItems = [
    { name: "Login", path: "/login" },
    { name: "Sign Up", path: "/signup", isCTA: true },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path.replace("/#", "")))
      return true;
    return false;
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-decoration-none transition-transform duration-200 hover:scale-105"
        >
          <div className="w-10 h-10 bg-linear-to-r from-[#1d9bf0] to-[#27b96f] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md animate-pulse-glow">
            AI
          </div>
          <div className="font-bold text-xl text-slate-900">AIppt</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <Link
              key={item.name}
              className={`text-slate-900 hover:text-slate-900 text-sm font-medium py-2 px-0 transition-all duration-200 relative ${
                isActiveLink(item.path)
                  ? "text-primary-500 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-linear-to-r after:from-primary-400 after:to-accent-400 after:rounded-sm"
                  : ""
              }`}
              to={item.path}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-3 items-center">
          {authItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={
                item.isCTA
                  ? "bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 shadow-md"
                  : "text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-slate-100"
              }
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <div className="flex flex-col gap-1 w-5 h-4">
            <span
              className={`w-full h-0.5 bg-slate-900 transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`w-full h-0.5 bg-slate-900 transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`w-full h-0.5 bg-slate-900 transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-slate-100 animate-slide-down">
          <div className="px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                className={`text-slate-900 hover:text-slate-900 text-base font-medium py-2 transition-all duration-200 ${
                  isActiveLink(item.path) ? "text-primary-400" : ""
                }`}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
              {authItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={
                    item.isCTA
                      ? "bg-linear-to-r from-[#1d9bf0] to-[#27b96f] text-white py-3 px-6 rounded-xl font-semibold text-center transition-all duration-200 hover:shadow-lg"
                      : "text-slate-600 hover:text-slate-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:bg-slate-100 text-center"
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
