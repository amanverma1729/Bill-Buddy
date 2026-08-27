import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 px-4 text-center border-t border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Bill-Buddy Logo" className="h-5 w-auto object-contain opacity-80" />
          <span className="font-bold text-slate-700 dark:text-slate-300">Bill-Buddy</span>
          <span>• Scan • Track • Stay Ahead</span>
        </div>
        <div>
          Created with <span className="text-rose-500">❤️</span> by <span className="font-bold text-slate-800 dark:text-slate-200">Aman Verma</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
