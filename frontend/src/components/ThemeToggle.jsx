import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = ({ floating = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleBtn = (
    <div
      onClick={toggleTheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleTheme()}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle dark and light theme"
      className="relative flex items-center bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700/80 p-1 rounded-full backdrop-blur-md shadow-inner cursor-pointer select-none transition-all duration-300 hover:border-slate-400 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
    >
      {/* Animated Sliding Background Thumb */}
      <div
        className={`absolute top-1 bottom-1 w-[38px] bg-white dark:bg-slate-900 rounded-full shadow-md border border-slate-200/90 dark:border-slate-700/90 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark ? "translate-x-[36px]" : "translate-x-0"
        }`}
      />

      {/* Sun / Light Segment */}
      <div
        className={`relative z-10 flex items-center justify-center w-[38px] h-7 rounded-full text-xs font-semibold transition-colors duration-300 ${
          !isDark ? "text-amber-600 font-bold" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 hover:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>

      {/* Moon / Dark Segment */}
      <div
        className={`relative z-10 flex items-center justify-center w-[38px] h-7 rounded-full text-xs font-semibold transition-colors duration-300 ${
          isDark ? "text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        }`}
      >
        <svg
          className="w-4 h-4 transition-transform duration-300 -rotate-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </div>
  );

  if (floating) {
    return (
      <div className="fixed top-5 right-5 z-50 animate-fade-in">
        {toggleBtn}
      </div>
    );
  }

  return toggleBtn;
};

export default ThemeToggle;
