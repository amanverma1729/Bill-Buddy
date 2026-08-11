import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
    // Handle form submission here
    console.log(formData);

    try {
      let resp = await axios.post(
        "http://localhost:8182/user/saveUser",
        formData
      );
      console.log(resp);

      toast.success("Signup Successfull");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              placeholder="Enter your password"
              required
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"

            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          >
            Sign Up
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-600">
            Already created an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
