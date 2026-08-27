import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "../context/ThemeContext";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col justify-between bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
