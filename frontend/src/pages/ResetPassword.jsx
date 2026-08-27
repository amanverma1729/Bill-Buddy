import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/api";
import ThemeToggle from "../components/ThemeToggle";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  // Password validation rules
  const rules = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[\W_]/.test(newPassword),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing password reset token.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet all security requirements.");
      return;
    }

    if (!isMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      let { data } = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        token: token.trim(),
        newPassword: newPassword,
      });

      if (data.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        toast.error("Unable to connect to backend server. Please verify server status.");
      } else {
        toast.error(error.response?.data?.message || "Failed to reset password.");
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold tracking-wide shadow-sm">
            <span>🔒</span> Secure Password Reset
          </div>

          <div className="flex justify-center pt-1">
            <img
              src="/logo.png"
              alt="Bill-Buddy Logo"
              className="h-20 w-auto object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Set New Password
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Enter your new password to secure your account
          </p>
        </div>

        {!token ? (
          <div className="p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="text-amber-600 dark:text-amber-400 font-bold text-lg">⚠️ Missing Reset Token</div>
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium">
              No reset token was provided in the URL link. Please request a new password reset link.
            </p>
            <div>
              <Link
                to="/forgot-password"
                className="inline-flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                Request New Link →
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto text-2xl font-bold shadow-inner">
              ✓
            </div>
            <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-200">Password Updated!</h3>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-medium">
              Your password has been reset successfully. Redirecting to sign in...
            </p>
            <div>
              <Link
                to="/login"
                className="inline-flex justify-center py-2.5 px-6 rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-base">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 text-slate-900 dark:text-white sm:text-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {confirmPassword && !isMatch && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Password Validation Checklist */}
            <div className="bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">Password Requirements:</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                <span className={rules.length ? "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {rules.length ? "✓" : "○"} 8+ characters
                </span>
                <span className={rules.uppercase ? "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {rules.uppercase ? "✓" : "○"} 1 Uppercase
                </span>
                <span className={rules.lowercase ? "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {rules.lowercase ? "✓" : "○"} 1 Lowercase
                </span>
                <span className={rules.number ? "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {rules.number ? "✓" : "○"} 1 Number
                </span>
                <span className={rules.special ? "text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1" : "text-slate-400 dark:text-slate-500 font-medium"}>
                  {rules.special ? "✓" : "○"} 1 Special char
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !isMatch}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Resetting Password...</span>
                </>
              ) : (
                <span>Update Password →</span>
              )}
            </button>

            <p className="text-center text-sm font-medium text-slate-600 dark:text-slate-400 pt-1">
              <Link
                to="/login"
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
              >
                ← Back to Sign in
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
