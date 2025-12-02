import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Login submitted:", formData);
    alert("Login functionality would be implemented in a real application");
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
            <p className="text-slate-600">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="#" className="text-primary-500 hover:text-primary-600">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="w-full bg-linear-to-r from-primary-600 to-accent-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-slate-500">or</span>
            </div>
          </div>

          <button className="w-full flex items-center justify-center py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                fill="#4285F4"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary-500 hover:text-primary-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
