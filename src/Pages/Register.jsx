// src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../config/firebase.config";

const Register = () => {
  const [img, setImg] = useState(null);
  const [error, setError] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!displayName || !email || !password || !passwordConfirm) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    if (img) {
      const fileType = img.type.split("/")[1];
      if (!["jpeg", "jpg", "png"].includes(fileType)) {
        setError("Only JPEG, JPG, and PNG images are allowed.");
        return false;
      }

      if (img.size > 2 * 1024 * 1024) {
        setError("Image size should not exceed 2MB.");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      let photoURL = "";
      if (img) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        await uploadTask;

        photoURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      await updateProfile(user, { displayName, photoURL });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName,
        email,
        photoURL,
      });

      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-700">
          Create Your Account
        </h1>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="passwordConfirm"
              required
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-cyan-400 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-600 hover:underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
