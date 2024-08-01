// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../config/firebase.config";
import { useAuth } from "../Contexts/authContext";

export default function Login() {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setErrorMessage("Both fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
      } catch (error) {
        setErrorMessage(error.message);
        setIsSigningIn(false);
      }
    }
  };

  return (
    <>
      {userLoggedIn && <Navigate to="/" replace={true} />}

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold text-center text-gray-700">
            Welcome Back!
          </h1>
          {errorMessage && (
            <div className="text-red-600 text-center">{errorMessage}</div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
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
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember Me
                </label>
              </div>
              <span className="text-sm text-cyan-600 hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 text-white bg-cyan-400 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
              disabled={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Login"}
            </button>
          </form>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              New Here?{" "}
              <Link to="/register" className="text-cyan-600 hover:underline">
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
