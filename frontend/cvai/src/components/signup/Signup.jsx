import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE } from "../../config";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!name || !email || !password) {
      toast.error("All fields are required");
      setIsLoading(false);
      return;
    }

    try {
      const loadingToast = toast.loading("Creating your account...");

      // Call Flask backend register endpoint
      const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // After successful registration, auto-login
      const loginResponse = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        localStorage.setItem("token", loginData.access_token);
        localStorage.setItem("user", JSON.stringify(loginData.user));

        toast.dismiss(loadingToast);
        toast.success("Account created successfully!");

        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        toast.dismiss(loadingToast);
        toast.error("Registration successful but auto-login failed");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Registration Error:", err.message);
      toast.error(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-accent-50 flex items-center justify-center p-6 pt-20">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex">
          {/* Left Side - Branding */}
          <div className="w-1/2 bg-gradient-to-br from-primary-600 to-accent-700 p-12 flex flex-col justify-center items-center text-white">
            <Link to="/" className="mb-8">
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-bold">MenteE</div>
                <span className="text-primary-200">/</span>
                <div className="text-3xl font-bold">cvAI</div>
              </div>
            </Link>
            <h1 className="text-4xl font-bold mb-4 text-center">Get Started</h1>
            <p className="text-lg text-primary-100 text-center">
              Create your account and start your journey with cvAI
            </p>
          </div>

          {/* Right Side - Form */}
          <div className="w-1/2 p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign Up</h2>
            <p className="text-slate-600 mb-8">
              Fill in your details to create your account
            </p>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-primary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-600">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In link */}
            <Link
              to="/login"
              className="w-full block text-center px-6 py-3 bg-slate-200 text-slate-900 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Sign In
            </Link>

            <p className="text-center text-xs text-slate-500 mt-6">
              By creating an account, you agree to our{" "}
              <Link to="#" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="#" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
