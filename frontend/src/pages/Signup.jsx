import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiUrl } from "../config/api";
import ThemeToggle from "../components/ThemeToggle";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let resp = await axios.post(
        getApiUrl("/user/saveUser"),
        formData
      );
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        toast.error("Unable to connect to server. Please check backend status.");
      } else {
        toast.error(error.response?.data?.message || "Failed to create account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
      {/* Floating Theme Toggle Switch */}
      <ThemeToggle floating />

      {/* Ambient background blur blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl dark:shadow-indigo-950/50 border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
            <span>🚀</span> Join Bill-Buddy Today
          </div>

          <div className="flex justify-center pt-1">
            <img
              src="/logo.png"
              alt="Bill-Buddy Logo"
              className="h-20 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Start splitting roommate expenses transparently
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
                  👤
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
                  ✉️
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                  placeholder="••••••••"
                  required
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
                  title="Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                Must be 8+ chars with uppercase, lowercase, number & special char.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account →</span>
            )}
          </button>

          {/* Sign In Redirect */}
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
            >
              Sign in instead
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
