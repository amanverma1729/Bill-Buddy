import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import ThemeToggle from "../components/ThemeToggle";

const Login = () => {
  const [formData, setFormData] = useState({
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
      let data;
      try {
        const res = await axios.post(
          `${API_BASE_URL}/user/loginUser`,
          { email: formData.email, password: formData.password },
          { withCredentials: true }
        );
        data = res.data;
      } catch (postErr) {
        if (postErr.response?.status === 404 || postErr.response?.status === 405) {
          const res = await axios.get(
            `${API_BASE_URL}/user/loginUser/${encodeURIComponent(formData.email)}/${encodeURIComponent(formData.password)}`,
            { withCredentials: true }
          );
          data = res.data;
        } else {
          throw postErr;
        }
      }

      if (data && (data.message === "Login Success" || data.message?.includes("Login Success"))) {
        toast.success("Welcome back to Bill-Buddy!");
        sessionStorage.setItem("accesstoken", Date.now());
        sessionStorage.setItem("useremail", formData.email);
        navigate("/userdashboard");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        toast.error("Unable to connect to server. Please check backend status.");
      } else if (error.response?.data === "Invalid Credentials" || error.response?.status === 401) {
        toast.error("Invalid email or password. Please make sure you have signed up first.");
      } else {
        toast.error("An error occurred during login. Please try again.");
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
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md space-y-8 bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl dark:shadow-indigo-950/50 border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide shadow-sm">
            <span>✨</span> Effortless Bill Splitting
          </div>

          <div className="flex justify-center pt-1">
            <img
              src="/logo.png"
              alt="Bill-Buddy Logo"
              className="h-20 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Sign in to manage your shared roommate expenses
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-4">
            {/* Email Field */}
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
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm focus:outline-none"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500/40 border-slate-300 rounded cursor-pointer transition-colors"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
              >
                Remember me
              </label>
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
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In →</span>
            )}
          </button>

          {/* Sign Up Redirect */}
          <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 pt-2">
            Don't have an account?{" "}
            <Link
              to="/"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
