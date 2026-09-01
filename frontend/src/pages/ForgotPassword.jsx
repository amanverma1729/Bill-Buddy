import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApiUrl } from "../config/api";
import ThemeToggle from "../components/ThemeToggle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setDevResetUrl("");

    try {
      let { data } = await axios.post(getApiUrl("/api/auth/forgot-password"), {
        email: email.trim(),
      });
      setIsSubmitted(true);
      if (data.devResetUrl) {
        setDevResetUrl(data.devResetUrl);
      }
      toast.success(data.message || "Reset request submitted successfully.");
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        toast.error("Unable to connect to server. Please check backend status.");
      } else {
        setIsSubmitted(true);
        toast.info("If an account exists with this email, a password reset link has been sent.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevResetClick = () => {
    if (devResetUrl) {
      const urlObj = new URL(devResetUrl);
      navigate(urlObj.pathname + urlObj.search);
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide shadow-sm">
            <span>🔑</span> Account Recovery
          </div>

          <div className="flex justify-center pt-1">
            <img
              src="/logo.png"
              alt="Bill-Buddy Logo"
              className="h-20 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forgot Password
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSubmitted ? (
          <div className="mt-6 p-6 bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              ✓
            </div>
            <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Check Your Email</h3>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
              If an account exists with <strong>{email}</strong>, a password reset link has been sent. The link expires in 15 minutes.
            </p>

            {devResetUrl && (
              <div className="mt-4 p-4 bg-indigo-50/90 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 rounded-xl text-left space-y-2.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                  <span>⚡ Development Mode Shortcut</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  Click below to open your reset link directly on screen:
                </p>
                <button
                  onClick={handleDevResetClick}
                  className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-lg shadow-md transition-all text-center block"
                >
                  👉 Open Reset Password Page Now
                </button>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                ← Return to Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

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
                  <span>Sending reset link...</span>
                </>
              ) : (
                <span>Send Reset Link →</span>
              )}
            </button>

            <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 pt-1">
              Remembered your password?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
