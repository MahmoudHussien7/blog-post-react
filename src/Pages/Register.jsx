import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Logo from "./../assets/Images/Logo.png";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // Save registration data in localStorage
    localStorage.setItem("registeredUser", JSON.stringify({ email, password }));
    alert("Registration successful! Please login.");
    // Redirect or navigate to login page
    // Example: history.push('/login');
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center text-gray-700">
            Register
          </h1>

          <form className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-cyan-400 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Register
            </button>
          </form>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/Login" className="text-cyan-600 hover:underline">
                Login
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
